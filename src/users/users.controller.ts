import {
  Controller,
  Delete,
  Get,
  Body,
  Patch,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor,
  ParseUUIDPipe,
  UseGuards,
  Req,
  UploadedFile,
  Post,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
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
  upload_user_image_swagger,
  delete_user_image_swagger,
  upload_user_cv_swagger,
  download_user_cv_swagger,
  delete_user_cv_swagger,
} from './users.swagger';
import { ResponseMessage } from 'src/decorators/response-message.decorator';
import { SkipPhoneNumberCheck } from 'src/decorators/skip-phone-number-check.decorator';
import type { Request, Response } from 'express';
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

  @UseGuards(AuthGuard('jwt'))
  @Patch('me/image')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody(upload_user_image_swagger.body)
  @ApiBearerAuth()
  @ApiOperation(upload_user_image_swagger.operation)
  @ApiOkResponse(upload_user_image_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.USER_NOT_FOUND)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.IMAGE_UPLOADED)
  uploadImage(
    @Req() req: Request & { user: User },
    @UploadedFile() image: any,
  ) {
    return this.usersService.uploadImage(req.user.id, image, req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('me/image')
  @ApiBearerAuth()
  @ApiOperation(delete_user_image_swagger.operation)
  @ApiOkResponse(delete_user_image_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.USER_NOT_FOUND)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.IMAGE_DELETED)
  removeImage(
    @Req() req: Request & { user: User },
  ) {
    return this.usersService.removeImage(req.user.id, req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('me/cv/upload')
  @UseInterceptors(FileInterceptor('cv'))
  @ApiConsumes('multipart/form-data')
  @ApiBody(upload_user_cv_swagger.body)
  @ApiBearerAuth()
  @ApiOperation(upload_user_cv_swagger.operation)
  @ApiOkResponse(upload_user_cv_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.USER_NOT_FOUND)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage('CV uploaded successfully')
  @SkipPhoneNumberCheck()
  async uploadCV(
    @Req() req: Request & { user: User },
    @UploadedFile() cv: Express.Multer.File,
  ) {
    return this.usersService.uploadCV(req.user.id, cv, req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me/cv/download')
  @ApiBearerAuth()
  @ApiOperation(download_user_cv_swagger.operation)
  @ApiOkResponse(download_user_cv_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.USER_NOT_FOUND)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @SkipPhoneNumberCheck()
  async downloadCV(
    @Req() req: Request & { user: User },
    @Res() res: Response,
  ) {
    const file = await this.usersService.downloadCV(req.user.id, req.user);

    res.set({
      'Content-Type': file.contentType,
      'Content-Disposition': `attachment; filename="${file.fileName}"`,
    });

    res.send(file.fileBuffer);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('me/cv/')
  @ApiBearerAuth()
  @ApiOperation(delete_user_cv_swagger.operation)
  @ApiOkResponse(delete_user_cv_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.USER_NOT_FOUND)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @SkipPhoneNumberCheck()
  async deleteCV(
    @Req() req: Request & { user: User },
  ) {
    return this.usersService.deleteCV(req.user.id, req.user);
  }
}
