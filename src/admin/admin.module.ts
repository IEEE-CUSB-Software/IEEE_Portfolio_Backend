import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { RolesModule } from 'src/roles/roles.module';
import { AdminUsersController } from './users/admin-users.controller';
import { AdminEventsModule } from './events/admin-events.module';
import { AdminRolesController } from './roles/admin-roles.controller';
import { AdminMiddleware } from 'src/middleware/admin.middleware';

@Module({
  imports: [UsersModule, AdminEventsModule, RolesModule],
  controllers: [
    AdminUsersController,
    AdminRolesController,
  ],
})
export class AdminModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AdminMiddleware)
      .forRoutes(
        { path: 'admin/*', method: RequestMethod.ALL },
      );
  }
}
