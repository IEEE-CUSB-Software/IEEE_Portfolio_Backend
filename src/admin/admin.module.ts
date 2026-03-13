import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AdminUsersModule } from './users/admin-users.module';
import { AdminEventsModule } from './events/admin-events.module';
import { AdminRolesModule } from './roles/admin-roles.module';
import { AdminBoardModule } from './board/admin-board.module';
import { AdminCategoriesModule } from './categories/admin-categories.module';
import { AdminCommitteesModule } from './committees/admin-committees.module';
import { AdminMiddleware } from 'src/middleware/admin.middleware';
import { JwtAuthMiddleware } from 'src/middleware/jwt-auth.middleware';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { StringValue } from 'ms';

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({
      secret: process.env.JWT_TOKEN_SECRET,
      signOptions: { expiresIn: (process.env.JWT_TOKEN_EXPIRATION_TIME || '1h') as StringValue },
    }),
    UsersModule,
    AdminUsersModule,
    AdminEventsModule,
    AdminRolesModule,
    AdminBoardModule,
    AdminCategoriesModule,
    AdminCommitteesModule,
  ],
  providers: [JwtStrategy, JwtAuthMiddleware, AdminMiddleware],
})
export class AdminModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtAuthMiddleware, AdminMiddleware)
      .forRoutes(
        { path: 'admin/*', method: RequestMethod.ALL },
      );
  }
}
