import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtGuard extends AuthGuard('jwt') {
  // Override handleRequest to prevent throwing an error when no token is provided
  handleRequest(err: any, user: any) {
    console.log('OptionalJwtGuard: handleRequest called');
    console.log('Error:', err);
    console.log('User:', user);
    // If there's an error or no user, just return null instead of throwing
    if (err || !user) {
      return null;
    }
    return user;
  }
}
