import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor,
  ParseUUIDPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
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
import {
  get_user_by_id_swagger,
  update_user_swagger,
} from './users.swagger';
import { ResponseMessage } from 'src/decorators/response-message.decorator';
import { SkipPhoneNumberCheck } from 'src/decorators/skip-phone-number-check.decorator';
import type { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';

@ApiTags('users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation(get_user_by_id_swagger.operation)
  @ApiOkResponse(get_user_by_id_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.USER_NOT_FOUND)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request & { user: User },
  ) {
    return this.usersService.findOne(id, req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @SkipPhoneNumberCheck()
  @ApiBearerAuth()
  @ApiOperation(update_user_swagger.operation)
  @ApiOkResponse(update_user_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.USER_NOT_FOUND)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.USER_UPDATED)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request & { user: User },
  ) {
    return await this.usersService.update(id, updateUserDto, req.user);
  }
}
