import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { User } from 'src/users/entities/user.entity';
import { RoleName } from 'src/roles/entities/role.entity';

@Injectable()
export class IsAdminMiddleware implements NestMiddleware {
  use(req: Request & { user?: User; is_admin?: boolean }, res: Response, next: NextFunction) {
    // Set is_admin flag if user is authenticated and has admin role
    if (req.user) {
      req.is_admin =
        req.user.role.name === RoleName.SUPER_ADMIN ||
        req.user.role.name === RoleName.ADMIN;
    } else {
      req.is_admin = false;
    }

    next();
  }
}
