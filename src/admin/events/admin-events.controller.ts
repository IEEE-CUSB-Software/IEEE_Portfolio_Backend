import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Get,
  Query,
  Req,
  ParseUUIDPipe,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';
import { AdminEventsService } from './admin-events.service';
import { CreateEventDto } from 'src/admin/events/dto/create-event.dto';
import { UpdateEventDto } from 'src/admin/events/dto/update-event.dto';
import { UpdateRegistrationStatusDto } from 'src/events/dto/update-registration-status.dto';
import { BulkRegisterUsersDto } from 'src/admin/events/dto/bulk-register-users.dto';
import { User } from 'src/users/entities/user.entity';
import {
  ApiBadRequestErrorResponse,
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
  admin_upload_primary_event_image_swagger,
  admin_delete_primary_event_image_swagger,
  admin_upload_event_images_swagger,
  admin_delete_event_image_swagger,
  admin_get_event_registrations_swagger,
  admin_update_registration_status_swagger,
  admin_bulk_register_swagger,
} from './admin-events.swagger';
import { ResponseMessage } from 'src/decorators/response-message.decorator';

@ApiTags('admin/events')
@Controller('admin/events')
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
  ) {
    return this.adminEventsService.update(id, updateEventDto);
  }

  @Post(':id/image')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody(admin_upload_primary_event_image_swagger.body)
  @ApiOperation(admin_upload_primary_event_image_swagger.operation)
  @ApiCreatedResponse(admin_upload_primary_event_image_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.EVENT_NOT_FOUND)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.IMAGE_UPLOADED)
  uploadPrimaryImage(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() image: any,
  ) {
    return this.adminEventsService.uploadPrimaryImage(id, image);
  }

  @Delete(':id/image')
  @ApiOperation(admin_delete_primary_event_image_swagger.operation)
  @ApiOkResponse(admin_delete_primary_event_image_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.EVENT_NOT_FOUND)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.IMAGE_DELETED)
  deletePrimaryImage(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminEventsService.removePrimaryImage(id);
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

  @Post(':id/images')
  @UseInterceptors(FilesInterceptor('images', 10))
  @ApiConsumes('multipart/form-data')
  @ApiBody(admin_upload_event_images_swagger.body)
  @ApiOperation(admin_upload_event_images_swagger.operation)
  @ApiCreatedResponse(admin_upload_event_images_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.EVENT_NOT_FOUND)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.IMAGES_UPLOADED)
  uploadImages(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFiles() images: any[],
  ) {
    return this.adminEventsService.addImages(id, images || []);
  }

  @Delete(':id/images/:imageId')
  @ApiOperation(admin_delete_event_image_swagger.operation)
  @ApiOkResponse(admin_delete_event_image_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.EVENT_NOT_FOUND)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.IMAGE_DELETED)
  deleteImage(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('imageId', ParseUUIDPipe) imageId: string,
  ) {
    return this.adminEventsService.removeImage(id, imageId);
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
