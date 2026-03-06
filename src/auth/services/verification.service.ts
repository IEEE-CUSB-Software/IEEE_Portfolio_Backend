import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { ERROR_MESSAGES } from 'src/constants/swagger-messages';
import { RedisKeyPrefix } from 'src/redis/redis.constants';
import { RedisService } from 'src/redis/redis.service';
import { UsersRepository } from 'src/users/users.repository';
import { MailService } from 'src/mail/mail.service';
import { AuthOtpPurpose } from '../types/auth-otp-purpose.enum';
import { normalizeEmail } from '../utils/auth-normalization.util';

@Injectable()
export class VerificationService {
  private readonly REDIS_EMAIL_OTP_PREFIX =
    process.env.REDIS_EMAIL_OTP_PREFIX ?? RedisKeyPrefix.EmailVerificationOtp;
  private readonly REDIS_PASSWORD_OTP_PREFIX =
    process.env.REDIS_PASSWORD_OTP_PREFIX ?? RedisKeyPrefix.PasswordResetOtp;
  private readonly OTP_TTL = Number(
    process.env.REDIS_OTP_TTL_SECONDS ?? 10 * 60,
  );

  constructor(
    private readonly user_repository: UsersRepository,
    private readonly redisService: RedisService,
    private readonly mailerService: MailService,
  ) {}

  private generateNumericOtp(length: number = 6): string {
    return crypto
      .randomInt(0, Math.pow(10, length))
      .toString()
      .padStart(length, '0');
  }

  private getOtpPrefix(purpose: AuthOtpPurpose): string {
    return purpose === AuthOtpPurpose.PasswordReset
      ? this.REDIS_PASSWORD_OTP_PREFIX
      : this.REDIS_EMAIL_OTP_PREFIX;
  }

  async generateOtp(
    email: string,
    purpose: AuthOtpPurpose,
  ): Promise<{ success: boolean }> {
    const normalizedEmail = normalizeEmail(email);
    const user =
      await this.user_repository.findByEmailInsensitive(normalizedEmail);
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    if (purpose === AuthOtpPurpose.EmailVerification && user.verified_email) {
      throw new BadRequestException(ERROR_MESSAGES.ACCOUNT_ALREADY_VERIFIED);
    }

    const otp = this.generateNumericOtp(6);
    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10);
    const otpHash = await bcrypt.hash(otp, saltRounds);

    const otpData = JSON.stringify({ otpHash: otpHash, userId: user.id });
    const otp_prefix = this.getOtpPrefix(purpose);

    await this.redisService.setex(
      `${otp_prefix}:${user.id}`,
      this.OTP_TTL,
      otpData,
    );

    if (purpose === AuthOtpPurpose.EmailVerification) {
      await this.mailerService.sendEmailVerificationOtp(normalizedEmail, otp);
    } else if (purpose === AuthOtpPurpose.PasswordReset) {
      await this.mailerService.sendPasswordResetOtp(normalizedEmail, otp);
    }

    return { success: true };
  }

  async verifyOtp(
    email: string,
    otp: string,
    purpose: AuthOtpPurpose,
  ): Promise<{ success: boolean }> {
    const normalizedEmail = normalizeEmail(email);
    const user =
      await this.user_repository.findByEmailInsensitive(normalizedEmail);
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const otp_prefix = this.getOtpPrefix(purpose);
    const otpDataString = await this.redisService.get(
      `${otp_prefix}:${user.id}`,
    );
    if (!otpDataString) {
      throw new BadRequestException(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN);
    }

    const otpRecord = JSON.parse(otpDataString);
    const isOtpValid = await bcrypt.compare(otp, otpRecord.otpHash);
    if (!isOtpValid) {
      throw new BadRequestException(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN);
    }

    await this.redisService.del(`${otp_prefix}:${user.id}`);

    return { success: true };
  }
}
