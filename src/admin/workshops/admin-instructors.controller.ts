import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFile,
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
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminInstructorsService } from './admin-instructors.service';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
import {
  ApiCreatedResponse as SwaggerCreatedResponse,
  ApiOkResponse as SwaggerOkResponse,
} from '@nestjs/swagger';
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
  admin_create_instructor_swagger,
  admin_update_instructor_swagger,
  admin_delete_instructor_swagger,
  admin_upload_instructor_image_swagger,
  admin_delete_instructor_image_swagger,
} from './admin-workshops.swagger';

@ApiTags('admin/workshops/instructors')
@Controller('admin/workshops/instructors')
@ApiBearerAuth()
export class AdminInstructorsController {
  constructor(private readonly adminInstructorsService: AdminInstructorsService) {}

  @Post()
  @ApiOperation(admin_create_instructor_swagger.operation)
  @ApiCreatedResponse(admin_create_instructor_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.INSTRUCTOR_CREATED)
  create(@Body() createInstructorDto: CreateInstructorDto) {
    return this.adminInstructorsService.create(createInstructorDto);
  }

  @Patch(':id')
  @ApiOperation(admin_update_instructor_swagger.operation)
  @ApiOkResponse(admin_update_instructor_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.INSTRUCTOR_NOT_FOUND)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.INSTRUCTOR_UPDATED)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateInstructorDto: UpdateInstructorDto,
  ) {
    return this.adminInstructorsService.update(id, updateInstructorDto);
  }

  @Post(':id/image')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody(admin_upload_instructor_image_swagger.body)
  @ApiOperation(admin_upload_instructor_image_swagger.operation)
  @ApiCreatedResponse(admin_upload_instructor_image_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.INSTRUCTOR_NOT_FOUND)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.IMAGE_UPLOADED)
  uploadImage(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() image: any,
  ) {
    return this.adminInstructorsService.uploadImage(id, image);
  }

  @Delete(':id/image')
  @ApiOperation(admin_delete_instructor_image_swagger.operation)
  @ApiOkResponse(admin_delete_instructor_image_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.INSTRUCTOR_NOT_FOUND)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.IMAGE_DELETED)
  removeImage(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminInstructorsService.removeImage(id);
  }

  @Delete(':id')
  @ApiOperation(admin_delete_instructor_swagger.operation)
  @ApiOkResponse(admin_delete_instructor_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.INSTRUCTOR_NOT_FOUND)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.INSTRUCTOR_DELETED)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminInstructorsService.remove(id);
  }
}
