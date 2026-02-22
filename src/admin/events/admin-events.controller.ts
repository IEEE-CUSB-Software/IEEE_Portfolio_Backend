import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Get,
  UseGuards,
  Query,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { AdminEventsService } from './admin-events.service';
import { CreateEventDto } from 'src/admin/events/dto/create-event.dto';
import { UpdateEventDto } from 'src/admin/events/dto/update-event.dto';
import { UpdateRegistrationStatusDto } from 'src/events/dto/update-registration-status.dto';
import { BulkRegisterUsersDto } from 'src/admin/events/dto/bulk-register-users.dto';
import { User } from 'src/users/entities/user.entity';
import {
  ApiBadRequestErrorResponse,
  ApiConflictErrorResponse,
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
  admin_create_event_swagger,
  admin_update_event_swagger,
  admin_delete_event_swagger,
  admin_get_event_registrations_swagger,
  admin_update_registration_status_swagger,
  admin_bulk_register_swagger,
} from './admin-events.swagger';
import { ResponseMessage } from 'src/decorators/response-message.decorator';

@ApiTags('admin/events')
@Controller('admin/events')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class AdminEventsController {
  constructor(
    private readonly adminEventsService: AdminEventsService,
  ) {}

  @Post()
  @ApiOperation(admin_create_event_swagger.operation)
  @ApiCreatedResponse(admin_create_event_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiBadRequestErrorResponse(ERROR_MESSAGES.EVENT_INVALID_TIME_RANGE)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.EVENT_CREATED)
  create(
    @Body() createEventDto: CreateEventDto,
    @Req() req: Request & { user: User },
  ) {
    return this.adminEventsService.create(createEventDto, req.user);
  }

  @Patch(':id')
  @ApiOperation(admin_update_event_swagger.operation)
  @ApiOkResponse(admin_update_event_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiBadRequestErrorResponse(ERROR_MESSAGES.EVENT_INVALID_TIME_RANGE)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.EVENT_NOT_FOUND)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.EVENT_UPDATED)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEventDto: UpdateEventDto,
    @Req() req: Request & { user: User },
  ) {
    return this.adminEventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  @ApiOperation(admin_delete_event_swagger.operation)
  @ApiOkResponse(admin_delete_event_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.EVENT_NOT_FOUND)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.EVENT_DELETED)
  remove(
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.adminEventsService.remove(id);
  }

  @Get(':id/registrations')
  @ApiOperation(admin_get_event_registrations_swagger.operation)
  @ApiOkResponse(admin_get_event_registrations_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.EVENT_NOT_FOUND)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  getEventRegistrations(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.adminEventsService.getEventRegistrations(
      id,
      parseInt(page),
      parseInt(limit),
    );
  }

  @Patch(':id/registrations/:registrationId/status')
  @ApiOperation(admin_update_registration_status_swagger.operation)
  @ApiOkResponse(admin_update_registration_status_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiBadRequestErrorResponse(ERROR_MESSAGES.EVENT_FULL)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.EVENT_REGISTRATION_NOT_FOUND)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.EVENT_REGISTRATION_STATUS_UPDATED)
  updateRegistrationStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('registrationId', ParseUUIDPipe) registrationId: string,
    @Body() updateStatusDto: UpdateRegistrationStatusDto,
  ) {
    return this.adminEventsService.updateRegistrationStatus(
      id,
      registrationId,
      updateStatusDto.status,
    );
  }

  @Post(':id/bulk-register')
  @ApiOperation(admin_bulk_register_swagger.operation)
  @ApiCreatedResponse(admin_bulk_register_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiBadRequestErrorResponse('One or more users not found')
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.EVENT_NOT_FOUND)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage('Users registered successfully')
  async bulkRegisterUsers(
    @Param('id', ParseUUIDPipe) eventId: string,
    @Body() bulkRegisterDto: BulkRegisterUsersDto,
  ) {
    return this.adminEventsService.bulkRegisterUsers(
      eventId,
      bulkRegisterDto.user_ids,
    );
  }
}
