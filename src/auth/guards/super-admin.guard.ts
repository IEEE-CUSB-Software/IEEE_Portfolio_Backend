import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { RoleName } from 'src/roles/entities/role.entity';
import { ERROR_MESSAGES } from 'src/constants/swagger-messages';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    if (!user || !user.role || user.role.name !== RoleName.SUPER_ADMIN) {
      throw new ForbiddenException(ERROR_MESSAGES.FORBIDDEN_ACTION);
    }

    return true;
  }
}
