import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CompleteProfileMiddleware implements NestMiddleware {
  use(req: Request & { user?: any }, res: Response, next: NextFunction) {
    const user = req.user;
    
    if (!user) {
      throw new ForbiddenException('User is not authenticated');
    }

    const requiredFields = [
      { key: 'phone', label: 'Phone Number' },
      { key: 'faculty', label: 'Faculty' },
      { key: 'university', label: 'University' },
      { key: 'academic_year', label: 'Academic Year' },
      { key: 'major', label: 'Major' },
      { key: 'cv_file_key', label: 'CV File' }
    ];

    const missingFields = requiredFields
      .filter(field => !user[field.key])
      .map(field => field.label);

    if (missingFields.length > 0) {
      throw new ForbiddenException({
        statusCode: 403,
        error: 'Forbidden',
        message: `Please complete your profile before applying. Missing fields: ${missingFields.join(', ')}.`,
        missingFields: missingFields,
      });
    }

    next();
  }
}
