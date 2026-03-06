import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDTO, RegisterDTO } from './dto';
import { GoogleOAuthDto } from './dto/google-oauth.dto';
import { GithubOAuthDto } from './dto/github-oauth.dto';
import { CompleteOAuthProfileDto } from './dto/complete-oauth-profile.dto';
import { ERROR_MESSAGES } from 'src/constants/swagger-messages';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from 'src/users/users.repository';
import { User } from 'src/users/entities/user.entity';
import { RolesService } from 'src/roles/roles.service';
import { RoleName } from 'src/roles/entities/role.entity';
import { VerificationService } from './services/verification.service';
import { AuthOtpPurpose } from './types/auth-otp-purpose.enum';
import {
  normalizeEmail,
  normalizeIdentifier,
  normalizeUsername,
} from './utils/auth-normalization.util';
import { AuthTokenService } from './services/auth-token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly user_repository: UsersRepository,
    private readonly roles_service: RolesService,
    private readonly verification_service: VerificationService,
    private readonly auth_token_service: AuthTokenService,
  ) {}

  async validateUserPassword(id: string, password: string): Promise<User> {
    const user = await this.user_repository.findByIdWithPassword(id);

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    if (user.password) {
      const is_password_valid = await bcrypt.compare(password, user.password);
      if (!is_password_valid)
        throw new UnauthorizedException(ERROR_MESSAGES.WRONG_PASSWORD);
    } else {
      throw new UnauthorizedException(ERROR_MESSAGES.OAUTH_PASSWORD_NOT_SET);
    }

    return user;
  }

  async checkIdentifier(identifier: string) {
    const normalizedIdentifier = normalizeIdentifier(identifier);
    let identifier_type: string = '';
    let user: User | null = null;

    if (normalizedIdentifier.includes('@')) {
      identifier_type = 'email';
      user =
        await this.user_repository.findByEmailInsensitive(normalizedIdentifier);
    } else {
      identifier_type = 'username';
      user =
        await this.user_repository.findByUsernameInsensitive(
          normalizedIdentifier,
        );
    }

    if (!user) {
      throw new NotFoundException(
        identifier_type === 'email'
          ? ERROR_MESSAGES.EMAIL_NOT_FOUND
          : ERROR_MESSAGES.USERNAME_NOT_FOUND,
      );
    }

    return {
      identifier_type: identifier_type,
      user_id: user.id,
    };
  }

  async login(login_dto: LoginDTO) {
    const { identifier, password } = login_dto;
    const { user_id } = await this.checkIdentifier(identifier);
    const user = await this.validateUserPassword(user_id, password);

    if (!user.verified_email) {
      throw new ForbiddenException(ERROR_MESSAGES.EMAIL_NOT_VERIFIED);
    }

    const { access_token, refresh_token } =
      await this.auth_token_service.generateTokens(user_id);

    return {
      user: user,
      access_token: access_token,
      refresh_token: refresh_token,
    };
  }

  async register(register_dto: RegisterDTO): Promise<User> {
    const {
      email: rawEmail,
      username: rawUsername,
      password,
      confirmPassword,
      name,
      phone,
      faculty,
      university,
      academic_year,
    } = register_dto as any;

    const email = normalizeEmail(rawEmail);
    const username = normalizeUsername(rawUsername);

    if (password !== confirmPassword) {
      throw new BadRequestException(
        ERROR_MESSAGES.PASSWORD_CONFIRMATION_MISMATCH,
      );
    }

    const emailExists =
      await this.user_repository.findByEmailInsensitive(email);
    if (emailExists) {
      throw new BadRequestException(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
    }

    const usernameExists =
      await this.user_repository.findByUsernameInsensitive(username);
    if (usernameExists) {
      throw new BadRequestException(ERROR_MESSAGES.USERNAME_ALREADY_TAKEN);
    }

    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10);
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const visitorRole = await this.roles_service.findByName(RoleName.VISITOR);

    const newUser = await this.user_repository.create({
      email,
      username,
      name,
      phone,
      password: passwordHash,
      role_id: visitorRole.id,
      faculty,
      university,
      academic_year,
      verified_email: false,
      // Add other required fields with defaults as needed
    });

    await this.verification_service.generateOtp(
      email,
      AuthOtpPurpose.EmailVerification,
    );

    return newUser;
  }

  async logout(refresh_token?: string) {
    return this.auth_token_service.revokeRefreshToken(refresh_token);
  }

  async refreshAccessToken(refresh_token: string) {
    return this.auth_token_service.refreshAccessToken(refresh_token);
  }

  async sendEmailOtpForUser(user_id: string): Promise<{ success: boolean }> {
    const user = await this.user_repository.findById(user_id);
    return this.verification_service.generateOtp(
      user.email,
      AuthOtpPurpose.EmailVerification,
    );
  }

  async sendEmailOtpByEmail(email: string): Promise<{ success: boolean }> {
    return this.verification_service.generateOtp(
      email,
      AuthOtpPurpose.EmailVerification,
    );
  }

  async verifyEmailOtpForUser(
    user_id: string,
    otp: string,
  ): Promise<{ success: boolean }> {
    const user = await this.user_repository.findById(user_id);
    await this.verification_service.verifyOtp(
      user.email,
      otp,
      AuthOtpPurpose.EmailVerification,
    );
    await this.user_repository.update(user.id, { verified_email: true });
    return { success: true };
  }

  async verifyEmailOtpByEmail(
    email: string,
    otp: string,
  ): Promise<{ success: boolean }> {
    const normalizedEmail = normalizeEmail(email);
    const user =
      await this.user_repository.findByEmailInsensitive(normalizedEmail);
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    await this.verification_service.verifyOtp(
      normalizedEmail,
      otp,
      AuthOtpPurpose.EmailVerification,
    );
    await this.user_repository.update(user.id, { verified_email: true });
    return { success: true };
  }

  async sendPasswordResetOtp(email: string): Promise<{ success: boolean }> {
    return this.verification_service.generateOtp(
      email,
      AuthOtpPurpose.PasswordReset,
    );
  }

  async resetPasswordWithOtp(
    email: string,
    otp: string,
    password: string,
    confirmPassword: string,
  ): Promise<{
    success: boolean;
    access_token: string;
    refresh_token: string;
  }> {
    const normalizedEmail = normalizeEmail(email);

    if (password !== confirmPassword) {
      throw new BadRequestException(
        ERROR_MESSAGES.PASSWORD_CONFIRMATION_MISMATCH,
      );
    }

    const user =
      await this.user_repository.findByEmailInsensitive(normalizedEmail);
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    if (user.password) {
      const isSamePassword = await bcrypt.compare(password, user.password);
      if (isSamePassword) {
        throw new BadRequestException(ERROR_MESSAGES.NEW_PASSWORD_SAME_AS_OLD);
      }
    }

    await this.verification_service.verifyOtp(
      normalizedEmail,
      otp,
      AuthOtpPurpose.PasswordReset,
    );

    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10);
    const passwordHash = await bcrypt.hash(password, saltRounds);

    await this.user_repository.update(user.id, { password: passwordHash });

    await this.auth_token_service.revokeAllRefreshTokens(user.id);

    const { access_token, refresh_token } =
      await this.auth_token_service.generateTokens(user.id);

    return { success: true, access_token, refresh_token };
  }

  async changePassword(
    user_id: string,
    currentPassword: string,
    password: string,
    confirmPassword: string,
  ): Promise<{ success: boolean }> {
    if (password !== confirmPassword) {
      throw new BadRequestException(
        ERROR_MESSAGES.PASSWORD_CONFIRMATION_MISMATCH,
      );
    }

    const user = await this.user_repository.findByIdWithPassword(user_id);
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    if (!user.password) {
      throw new UnauthorizedException(ERROR_MESSAGES.OAUTH_PASSWORD_NOT_SET);
    }

    const is_current_password_valid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!is_current_password_valid) {
      throw new UnauthorizedException(ERROR_MESSAGES.WRONG_PASSWORD);
    }

    const is_same_password = await bcrypt.compare(password, user.password);
    if (is_same_password) {
      throw new BadRequestException(ERROR_MESSAGES.NEW_PASSWORD_SAME_AS_OLD);
    }

    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10);
    const passwordHash = await bcrypt.hash(password, saltRounds);

    await this.user_repository.update(user.id, { password: passwordHash });

    await this.auth_token_service.revokeAllRefreshTokens(user.id);

    return { success: true };
  }

  async validateGoogleOAuth(googleOAuthDto: GoogleOAuthDto) {
    const { google_id, email: rawEmail, name, avatar_url } = googleOAuthDto;
    const email = normalizeEmail(rawEmail);

    // Check if user with this google_id exists
    let user = await this.user_repository.findByEmailInsensitive(email);

    if (user && user.google_id === google_id) {
      // User exists with same google_id, return user with tokens
      const { access_token, refresh_token } =
        await this.auth_token_service.generateTokens(user.id);
      return {
        user,
        access_token,
        refresh_token,
        needsProfileCompletion: false,
      };
    }

    // Check if email exists with different provider
    if (user) {
      throw new BadRequestException(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
    }

    // Create new user with Google OAuth info
    const visitorRole = await this.roles_service.findByName(RoleName.VISITOR);

    const newUser = await this.user_repository.create({
      email,
      name,
      google_id,
      oauth_provider: 'google',
      avatar_url: avatar_url || undefined,
      role_id: visitorRole.id,
      verified_email: true, // Google emails are already verified
      // Set defaults for required fields that will be completed later
      username: `user_${google_id.substring(0, 8)}`, // Generate a temporary username
      faculty: '', // Will be completed in profile completion step
      university: '', // Will be completed in profile completion step
      academic_year: 1, // Default value, will be updated later
    });

    // Generate tokens for new user but mark that profile completion is needed
    const { access_token, refresh_token } =
      await this.auth_token_service.generateTokens(newUser.id);

    return {
      user: newUser,
      access_token,
      refresh_token,
      needsProfileCompletion: true,
    };
  }

  async validateGithubOAuth(githubOAuthDto: GithubOAuthDto) {
    const { github_id, email: rawEmail, name, avatar_url } = githubOAuthDto;

    if (!rawEmail) {
      throw new BadRequestException(
        ERROR_MESSAGES.EMAIL_NOT_PROVIDED_BY_OAUTH_GITHUB,
      );
    }

    const email = normalizeEmail(rawEmail);

    // Check if user with this github_id exists
    let user = await this.user_repository.findByEmailInsensitive(email);

    if (user && user.github_id === github_id) {
      const { access_token, refresh_token } =
        await this.auth_token_service.generateTokens(user.id);
      return {
        user,
        access_token,
        refresh_token,
        needsProfileCompletion: false,
      };
    }

    // Check if email exists with different provider
    if (user) {
      throw new BadRequestException(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
    }

    const visitorRole = await this.roles_service.findByName(RoleName.VISITOR);

    const newUser = await this.user_repository.create({
      email,
      name,
      github_id,
      oauth_provider: 'github',
      avatar_url: avatar_url || undefined,
      role_id: visitorRole.id,
      verified_email: true,
      username: `user_${github_id.substring(0, 8)}`,
      faculty: '',
      university: '',
      academic_year: 1,
    });

    const { access_token, refresh_token } =
      await this.auth_token_service.generateTokens(newUser.id);

    return {
      user: newUser,
      access_token,
      refresh_token,
      needsProfileCompletion: true,
    };
  }

  async completeOAuthProfile(
    userId: string,
    completeProfileDto: CompleteOAuthProfileDto,
  ): Promise<User> {
    const user = await this.user_repository.findById(userId);

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    // Check if username is provided and is unique
    if (completeProfileDto.username) {
      const normalizedUsername = normalizeUsername(completeProfileDto.username);
      const usernameExists =
        await this.user_repository.findByUsernameInsensitive(
          normalizedUsername,
        );
      if (usernameExists && usernameExists.id !== userId) {
        throw new BadRequestException(ERROR_MESSAGES.USERNAME_ALREADY_TAKEN);
      }
    }

    // Update user profile
    const updatedUser = await this.user_repository.update(userId, {
      faculty: completeProfileDto.faculty,
      university: completeProfileDto.university,
      academic_year: completeProfileDto.academic_year,
      phone: completeProfileDto.phone,
      ...(completeProfileDto.username && {
        username: normalizeUsername(completeProfileDto.username),
      }),
      ...(completeProfileDto.major && { major: completeProfileDto.major }),
    });

    return updatedUser;
  }
}
