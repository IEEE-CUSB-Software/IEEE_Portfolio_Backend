import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AdminUsersModule } from './users/admin-users.module';
import { AdminEventsModule } from './events/admin-events.module';
import { AdminRolesModule } from './roles/admin-roles.module';
import { AdminMiddleware } from 'src/middleware/admin.middleware';

@Module({
  imports: [AdminUsersModule, AdminEventsModule, AdminRolesModule],
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
