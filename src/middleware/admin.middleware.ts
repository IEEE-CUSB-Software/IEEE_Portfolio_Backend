import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { User } from 'src/users/entities/user.entity';
import { RoleName } from 'src/roles/entities/role.entity';
import { ERROR_MESSAGES } from 'src/constants/swagger-messages';

@Injectable()
export class AdminMiddleware implements NestMiddleware {
  use(req: Request & { user: User }, res: Response, next: NextFunction) {
    if (!req.user) {
      throw new ForbiddenException(ERROR_MESSAGES.FORBIDDEN_ACTION);
    }

    const isAdmin =
      req.user.role.name === RoleName.SUPER_ADMIN ||
      req.user.role.name === RoleName.ADMIN;

    if (!isAdmin) {
      throw new ForbiddenException(ERROR_MESSAGES.FORBIDDEN_ACTION);
    }

    next();
  }
}
