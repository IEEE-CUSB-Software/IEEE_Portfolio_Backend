// admin-users.controller.ts

import {
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  UseGuards,
  Get,
  Res,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  Patch,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AdminUsersService } from './admin-users.service';
import {
  ApiForbiddenErrorResponse,
  ApiInternalServerError,
  ApiNotFoundErrorResponse,
  ApiUnauthorizedErrorResponse,
} from 'src/decorators/swagger-error-responses.decorator';
import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from 'src/constants/swagger-messages';
import { ResponseMessage } from 'src/decorators/response-message.decorator';
import type { Response } from 'express';
import {
  admin_delete_user_swagger,
  admin_download_cv_swagger,
  admin_get_all_users_swagger,
  admin_get_user_swagger,
  admin_update_user_role_swagger,
} from './admin-users.swagger';
import { SuperAdminGuard } from 'src/auth/guards/super-admin.guard';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@ApiTags('admin/users')
@Controller('admin/users')
@ApiBearerAuth()
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Get()
  @ApiOperation(admin_get_all_users_swagger.operation)
  @ApiOkResponse(admin_get_all_users_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by name' })
  @ApiQuery({ name: 'email', required: false, type: String, description: 'Filter by email' })
  @ApiQuery({ name: 'username', required: false, type: String, description: 'Filter by username' })
  @ResponseMessage('Users retrieved successfully')
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
    @Query('email') email?: string,
    @Query('username') username?: string,
  ) {
    return this.adminUsersService.findAll(page, limit, search, email, username);
  }

  @Get(':id')
  @ApiOperation(admin_get_user_swagger.operation)
  @ApiOkResponse(admin_get_user_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.USER_NOT_FOUND)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage('User retrieved successfully')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminUsersService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation(admin_delete_user_swagger.operation)
  @ApiOkResponse(admin_delete_user_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.USER_NOT_FOUND)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.ACCOUNT_REMOVED)
  remove(
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.adminUsersService.remove(id);
  }

  @Get(':userId/cv/download')
  @ApiOperation(admin_download_cv_swagger.operation)
  @ApiOkResponse(admin_download_cv_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.USER_NOT_FOUND)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  async downloadUserCV(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Res() res: Response,
  ) {
    const file = await this.adminUsersService.downloadUserCV(userId);

    res.set({
      'Content-Type': file.contentType,
      'Content-Disposition': `attachment; filename="${file.fileName}"`,
      'X-User-Name': file.userName,
      'X-User-Email': file.userEmail,
    });

    res.send(file.fileBuffer);
  }

  @Patch(':id/role')
  @UseGuards(SuperAdminGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation(admin_update_user_role_swagger.operation)
  @ApiBody({ type: UpdateUserRoleDto })
  @ApiOkResponse(admin_update_user_role_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.USER_NOT_FOUND)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage('User role updated successfully')
  updateRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    return this.adminUsersService.updateRole(id, updateUserRoleDto);
  }
}
