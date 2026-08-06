import {
  Module,
  MiddlewareConsumer,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecruitmentController } from './recruitment.controller';
import { RecruitmentService } from './recruitment.service';
import { Vacancy } from './entities/vacancy.entity';
import { Application } from './entities/application.entity';
import { CompleteProfileMiddleware } from '../middleware/complete-profile.middleware';
import { JwtAuthMiddleware } from '../middleware/jwt-auth.middleware';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vacancy, Application]),
    ConfigModule,
    JwtModule.register({
      secret: process.env.JWT_TOKEN_SECRET,
    }),
    UsersModule,
    StorageModule,
  ],
  controllers: [RecruitmentController],
  providers: [RecruitmentService, JwtStrategy, JwtAuthMiddleware],
  exports: [RecruitmentService],
})
export class RecruitmentModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtAuthMiddleware)
      .forRoutes(
        { path: 'recruitment/vacancies', method: RequestMethod.GET },
        { path: 'recruitment/vacancies/:id/apply', method: RequestMethod.POST },
        { path: 'recruitment/my-applications', method: RequestMethod.GET },
        { path: 'recruitment/applications/:id', method: RequestMethod.DELETE },
      )
      .apply(CompleteProfileMiddleware)
      .forRoutes({
        path: 'recruitment/vacancies/:id/apply',
        method: RequestMethod.POST,
      });
  }
}
