import {
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
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
import {
  admin_delete_user_swagger,
} from './admin-users.swagger';

@ApiTags('admin/users')
@Controller('admin/users')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

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
}
