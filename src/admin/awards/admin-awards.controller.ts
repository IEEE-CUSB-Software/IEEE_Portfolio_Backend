import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminAwardsService } from './admin-awards.service';
import { CreateAwardDto } from './dto/create-award.dto';
import { UpdateAwardDto } from './dto/update-award.dto';
import {
  ApiForbiddenErrorResponse,
  ApiInternalServerError,
  ApiNotFoundErrorResponse,
  ApiUnauthorizedErrorResponse,
} from 'src/decorators/swagger-error-responses.decorator';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from 'src/constants/swagger-messages';
import {
  admin_create_award_swagger,
  admin_update_award_swagger,
  admin_delete_award_swagger,
  admin_upload_award_image_swagger,
  admin_delete_award_image_swagger,
} from './admin-awards.swagger';
import { ResponseMessage } from 'src/decorators/response-message.decorator';

@ApiTags('admin/awards')
@Controller('admin/awards')
@ApiBearerAuth()
export class AdminAwardsController {
  constructor(private readonly adminAwardsService: AdminAwardsService) {}

  @Post()
  @ApiOperation(admin_create_award_swagger.operation)
  @ApiCreatedResponse(admin_create_award_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.AWARD_CREATED)
  create(@Body() createAwardDto: CreateAwardDto) {
    return this.adminAwardsService.create(createAwardDto);
  }

  @Patch(':id')
  @ApiOperation(admin_update_award_swagger.operation)
  @ApiOkResponse(admin_update_award_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.AWARD_NOT_FOUND)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.AWARD_UPDATED)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAwardDto: UpdateAwardDto,
  ) {
    return this.adminAwardsService.update(id, updateAwardDto);
  }

  @Post(':id/image')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody(admin_upload_award_image_swagger.body)
  @ApiOperation(admin_upload_award_image_swagger.operation)
  @ApiCreatedResponse(admin_upload_award_image_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.AWARD_NOT_FOUND)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.IMAGE_UPLOADED)
  uploadImage(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() image: any,
  ) {
    return this.adminAwardsService.uploadImage(id, image);
  }

  @Delete(':id/image')
  @ApiOperation(admin_delete_award_image_swagger.operation)
  @ApiOkResponse(admin_delete_award_image_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.AWARD_NOT_FOUND)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.IMAGE_DELETED)
  removeImage(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminAwardsService.removeImage(id);
  }

  @Delete(':id')
  @ApiOperation(admin_delete_award_swagger.operation)
  @ApiOkResponse(admin_delete_award_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.AWARD_NOT_FOUND)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.AWARD_DELETED)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminAwardsService.remove(id);
  }
}
