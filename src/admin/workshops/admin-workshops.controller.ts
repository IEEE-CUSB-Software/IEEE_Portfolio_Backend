import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';
import { AdminWorkshopsService } from './admin-workshops.service';
import { CreateWorkshopDto } from './dto/create-workshop.dto';
import { UpdateWorkshopDto } from './dto/update-workshop.dto';
import { UpdateWorkshopRegistrationStatusDto } from 'src/workshops/dto/update-workshop-registration-status.dto';
import { BulkRegisterWorkshopUsersDto } from './dto/bulk-register-workshop-users.dto';
import { User } from 'src/users/entities/user.entity';
import {
  ApiBadRequestErrorResponse,
  ApiForbiddenErrorResponse,
  ApiInternalServerError,
  ApiNotFoundErrorResponse,
  ApiUnauthorizedErrorResponse,
} from 'src/decorators/swagger-error-responses.decorator';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from 'src/constants/swagger-messages';
import { ResponseMessage } from 'src/decorators/response-message.decorator';
import {
  admin_create_workshop_swagger,
  admin_update_workshop_swagger,
  admin_delete_workshop_swagger,
  admin_upload_primary_workshop_image_swagger,
  admin_delete_primary_workshop_image_swagger,
  admin_upload_workshop_images_swagger,
  admin_delete_workshop_image_swagger,
  admin_get_workshop_registrations_swagger,
  admin_update_workshop_registration_status_swagger,
  admin_bulk_register_workshop_swagger,
} from './admin-workshops.swagger';

@ApiTags('admin/workshops')
@Controller('admin/workshops')
@ApiBearerAuth()
export class AdminWorkshopsController {
  constructor(private readonly adminWorkshopsService: AdminWorkshopsService) {}

  @Post()
  @ApiOperation(admin_create_workshop_swagger.operation)
  @ApiCreatedResponse(admin_create_workshop_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiBadRequestErrorResponse(ERROR_MESSAGES.WORKSHOP_INVALID_TIME_RANGE)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.WORKSHOP_CREATED)
  create(
    @Body() createWorkshopDto: CreateWorkshopDto,
    @Req() req: Request & { user: User },
  ) {
    return this.adminWorkshopsService.create(createWorkshopDto, req.user);
  }

  @Patch(':id')
  @ApiOperation(admin_update_workshop_swagger.operation)
  @ApiOkResponse(admin_update_workshop_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiBadRequestErrorResponse(ERROR_MESSAGES.WORKSHOP_INVALID_TIME_RANGE)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.WORKSHOP_NOT_FOUND)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.WORKSHOP_UPDATED)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateWorkshopDto: UpdateWorkshopDto,
  ) {
    return this.adminWorkshopsService.update(id, updateWorkshopDto);
  }

  @Delete(':id')
  @ApiOperation(admin_delete_workshop_swagger.operation)
  @ApiOkResponse(admin_delete_workshop_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.WORKSHOP_NOT_FOUND)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.WORKSHOP_DELETED)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminWorkshopsService.remove(id);
  }

  @Post(':id/image')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody(admin_upload_primary_workshop_image_swagger.body)
  @ApiOperation(admin_upload_primary_workshop_image_swagger.operation)
  @ApiCreatedResponse(admin_upload_primary_workshop_image_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.WORKSHOP_NOT_FOUND)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.IMAGE_UPLOADED)
  uploadPrimaryImage(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() image: any,
  ) {
    return this.adminWorkshopsService.uploadPrimaryImage(id, image);
  }

  @Delete(':id/image')
  @ApiOperation(admin_delete_primary_workshop_image_swagger.operation)
  @ApiOkResponse(admin_delete_primary_workshop_image_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.WORKSHOP_NOT_FOUND)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.IMAGE_DELETED)
  deletePrimaryImage(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminWorkshopsService.removePrimaryImage(id);
  }

  @Post(':id/images')
  @UseInterceptors(FilesInterceptor('images', 10))
  @ApiConsumes('multipart/form-data')
  @ApiBody(admin_upload_workshop_images_swagger.body)
  @ApiOperation(admin_upload_workshop_images_swagger.operation)
  @ApiCreatedResponse(admin_upload_workshop_images_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.WORKSHOP_NOT_FOUND)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.IMAGES_UPLOADED)
  uploadImages(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFiles() images: any[],
  ) {
    return this.adminWorkshopsService.addImages(id, images || []);
  }

  @Delete(':id/images/:imageId')
  @ApiOperation(admin_delete_workshop_image_swagger.operation)
  @ApiOkResponse(admin_delete_workshop_image_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.WORKSHOP_NOT_FOUND)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.IMAGE_DELETED)
  deleteImage(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('imageId', ParseUUIDPipe) imageId: string,
  ) {
    return this.adminWorkshopsService.removeImage(id, imageId);
  }

  @Get(':id/registrations')
  @ApiOperation(admin_get_workshop_registrations_swagger.operation)
  @ApiOkResponse(admin_get_workshop_registrations_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.WORKSHOP_NOT_FOUND)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  getWorkshopRegistrations(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.adminWorkshopsService.getWorkshopRegistrations(
      id,
      parseInt(page),
      parseInt(limit),
    );
  }

  @Patch(':id/registrations/:registrationId/status')
  @ApiOperation(admin_update_workshop_registration_status_swagger.operation)
  @ApiOkResponse(admin_update_workshop_registration_status_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiBadRequestErrorResponse(ERROR_MESSAGES.WORKSHOP_FULL)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.WORKSHOP_REGISTRATION_NOT_FOUND)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.WORKSHOP_REGISTRATION_STATUS_UPDATED)
  updateRegistrationStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('registrationId', ParseUUIDPipe) registrationId: string,
    @Body() updateStatusDto: UpdateWorkshopRegistrationStatusDto,
  ) {
    return this.adminWorkshopsService.updateRegistrationStatus(
      id,
      registrationId,
      updateStatusDto.status,
    );
  }

  @Post(':id/bulk-register')
  @ApiOperation(admin_bulk_register_workshop_swagger.operation)
  @ApiCreatedResponse(admin_bulk_register_workshop_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiBadRequestErrorResponse('User(s) not found: <id1, id2>')
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.WORKSHOP_NOT_FOUND)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage('Users registered successfully')
  async bulkRegisterUsers(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() bulkRegisterDto: BulkRegisterWorkshopUsersDto,
  ) {
    return this.adminWorkshopsService.bulkRegisterUsers(
      id,
      bulkRegisterDto.user_ids,
    );
  }
}
