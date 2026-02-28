import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { ERROR_MESSAGES } from 'src/constants/swagger-messages';

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly jwtStrategy: JwtStrategy,
  ) {}

  async use(req: Request & { user?: any }, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN);
      }

      const token = authHeader.substring(7);
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_TOKEN_SECRET,
      });

      const user = await this.jwtStrategy.validate(payload);      
      req.user = user;
      next();
    } catch (error) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN);
    }
  }
}
