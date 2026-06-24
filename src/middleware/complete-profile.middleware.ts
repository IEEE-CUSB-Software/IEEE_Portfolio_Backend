import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CompleteProfileMiddleware implements NestMiddleware {
  use(req: Request & { user?: any }, res: Response, next: NextFunction) {
    const user = req.user;
    
    if (!user) {
      throw new ForbiddenException('User is not authenticated');
    }

    const isProfileComplete = 
      !!user.phone && 
      !!user.faculty && 
      !!user.university && 
      !!user.academic_year && 
      !!user.major && 
      !!user.cv_file_key;

    if (!isProfileComplete) {
      throw new ForbiddenException('Please complete your profile including uploading your CV before applying.');
    }

    next();
  }
}
