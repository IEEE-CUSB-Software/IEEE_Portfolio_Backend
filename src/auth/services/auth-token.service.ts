import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { StringValue } from 'ms';
import * as crypto from 'crypto';
import { ERROR_MESSAGES } from 'src/constants/swagger-messages';
import { RedisKeyPrefix } from 'src/redis/redis.constants';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class AuthTokenService {
  private readonly REDIS_REFRESH_TOKEN_PREFIX =
    process.env.REDIS_REFRESH_TOKEN_PREFIX ?? RedisKeyPrefix.RefreshToken;
  private readonly REDIS_REFRESH_TOKEN_SET_PREFIX =
    process.env.REDIS_REFRESH_TOKEN_SET_PREFIX ?? 'refresh_token_set';
  private readonly REFRESH_TOKEN_TTL = Number(
    process.env.REDIS_REFRESH_TOKEN_TTL_SECONDS ?? 7 * 24 * 60 * 60,
  );

  constructor(
    private readonly jwt_service: JwtService,
    private readonly redisService: RedisService,
  ) {}

  private getRefreshTokenSetKey(user_id: string): string {
    return `${this.REDIS_REFRESH_TOKEN_SET_PREFIX}:${user_id}`;
  }

  private verifyRefreshToken(refresh_token: string): {
    id: string;
    jti: string;
  } {
    let payload: { id?: string; jti?: string } | null = null;
    try {
      payload = this.jwt_service.verify(refresh_token, {
        secret: process.env.JWT_REFRESH_SECRET ?? 'fallback-refresh-secret',
      });
    } catch {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN);
    }

    if (!payload?.id || !payload?.jti) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN);
    }

    return { id: payload.id, jti: payload.jti };
  }

  async generateTokens(user_id: string) {
    const access_token = this.jwt_service.sign(
      { id: user_id },
      {
        secret: process.env.JWT_TOKEN_SECRET ?? 'fallback-secret',
        expiresIn: (process.env.JWT_TOKEN_EXPIRATION_TIME ??
          '1h') as StringValue,
      },
    );

    const jti = crypto.randomUUID();
    const refresh_payload = { id: user_id, jti };
    const refresh_token = this.jwt_service.sign(refresh_payload, {
      secret: process.env.JWT_REFRESH_SECRET ?? 'fallback-refresh-secret',
      expiresIn: (process.env.JWT_REFRESH_EXPIRATION_TIME ??
        '7d') as StringValue,
    });

    const refreshKey = `${this.REDIS_REFRESH_TOKEN_PREFIX}:${user_id}:${jti}`;
    await this.redisService.setex(
      refreshKey,
      this.REFRESH_TOKEN_TTL,
      refresh_token,
    );
    await this.redisService.sadd(
      this.getRefreshTokenSetKey(user_id),
      refreshKey,
    );

    return {
      access_token,
      refresh_token,
    };
  }

  async revokeAllRefreshTokens(user_id: string): Promise<void> {
    const setKey = this.getRefreshTokenSetKey(user_id);
    const keys = await this.redisService.smembers(setKey);

    await this.redisService.deleteKeys(keys);
    await this.redisService.del(setKey);
  }

  async revokeRefreshToken(
    refresh_token?: string,
  ): Promise<{ success: boolean }> {
    if (!refresh_token) {
      return { success: true };
    }

    const payload = this.verifyRefreshToken(refresh_token);
    const refreshKey = `${this.REDIS_REFRESH_TOKEN_PREFIX}:${payload.id}:${payload.jti}`;

    await this.redisService.del(refreshKey);
    await this.redisService.srem(
      this.getRefreshTokenSetKey(payload.id),
      refreshKey,
    );

    return { success: true };
  }

  async refreshAccessToken(
    refresh_token: string,
  ): Promise<{ access_token: string }> {
    const payload = this.verifyRefreshToken(refresh_token);

    const refreshKey = `${this.REDIS_REFRESH_TOKEN_PREFIX}:${payload.id}:${payload.jti}`;
    const storedToken = await this.redisService.get(refreshKey);
    if (!storedToken || storedToken !== refresh_token) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN);
    }

    const access_token = this.jwt_service.sign(
      { id: payload.id },
      {
        secret: process.env.JWT_TOKEN_SECRET ?? 'fallback-secret',
        expiresIn: (process.env.JWT_TOKEN_EXPIRATION_TIME ??
          '1h') as StringValue,
      },
    );

    return { access_token };
  }
}
