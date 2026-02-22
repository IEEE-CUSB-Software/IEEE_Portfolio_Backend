import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AdminRolesService } from './admin-roles.service';
import { CreateRoleDto } from 'src/roles/dto/create-role.dto';
import { UpdateRoleDto } from 'src/roles/dto/update-role.dto';
import {
  ApiBadRequestErrorResponse,
  ApiConflictErrorResponse,
  ApiInternalServerError,
  ApiNotFoundErrorResponse,
  ApiUnauthorizedErrorResponse,
  ApiForbiddenErrorResponse,
} from 'src/decorators/swagger-error-responses.decorator';
import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from 'src/constants/swagger-messages';
import {
  admin_create_role_swagger,
  admin_update_role_swagger,
  admin_delete_role_swagger,
} from './admin-roles.swagger';
import { ResponseMessage } from 'src/decorators/response-message.decorator';

@Controller('admin/roles')
@ApiTags('admin/roles')
@ApiBearerAuth()
export class AdminRolesController {
  constructor(private readonly adminRolesService: AdminRolesService) {}

  @Post()
  @ApiOperation(admin_create_role_swagger.operation)
  @ApiCreatedResponse(admin_create_role_swagger.responses.success)
  @ApiBadRequestErrorResponse(ERROR_MESSAGES.ROLE_ALREADY_EXISTS)
  @ApiConflictErrorResponse(ERROR_MESSAGES.ROLE_ALREADY_EXISTS)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.ROLE_CREATED)
  create(
    @Body() createRoleDto: CreateRoleDto,
  ) {
    return this.adminRolesService.create(createRoleDto);
  }

  @Patch(':id')
  @ApiOperation(admin_update_role_swagger.operation)
  @ApiOkResponse(admin_update_role_swagger.responses.success)
  @ApiBadRequestErrorResponse(ERROR_MESSAGES.ROLE_ALREADY_EXISTS)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.ROLE_NOT_FOUND)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.ROLE_UPDATED)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.adminRolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @ApiOperation(admin_delete_role_swagger.operation)
  @ApiOkResponse(admin_delete_role_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.ROLE_NOT_FOUND)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.ROLE_DELETED)
  remove(
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.adminRolesService.remove(id);
  }
}
