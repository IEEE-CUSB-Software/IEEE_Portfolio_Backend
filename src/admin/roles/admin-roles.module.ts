import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/roles/entities/role.entity';
import { AdminRolesController } from './admin-roles.controller';
import { AdminRolesService } from './admin-roles.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role]),
  ],
  controllers: [AdminRolesController],
  providers: [AdminRolesService],
  exports: [AdminRolesService],
})
export class AdminRolesModule {}
