import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { ERROR_MESSAGES } from 'src/constants/swagger-messages';

@Injectable()
export class CvUploadedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    if (!user) {
      return false;
    }

    if (!user.cv_file_key) {
      throw new ForbiddenException(ERROR_MESSAGES.CV_REQUIRED);
    }

    return true;
  }
}
