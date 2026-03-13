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
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AdminCategoriesService } from './admin-categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
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
  admin_create_category_swagger,
  admin_update_category_swagger,
  admin_delete_category_swagger,
} from './admin-categories.swagger';
import { ResponseMessage } from 'src/decorators/response-message.decorator';

@ApiTags('admin/categories')
@Controller('admin/categories')
@ApiBearerAuth()
export class AdminCategoriesController {
  constructor(private readonly adminCategoriesService: AdminCategoriesService) {}

  @Post()
  @ApiOperation(admin_create_category_swagger.operation)
  @ApiCreatedResponse(admin_create_category_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiConflictErrorResponse(ERROR_MESSAGES.CATEGORY_ALREADY_EXISTS)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.CATEGORY_CREATED)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.adminCategoriesService.create(createCategoryDto);
  }

  @Patch(':id')
  @ApiOperation(admin_update_category_swagger.operation)
  @ApiOkResponse(admin_update_category_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiConflictErrorResponse(ERROR_MESSAGES.CATEGORY_ALREADY_EXISTS)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.CATEGORY_NOT_FOUND)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.CATEGORY_UPDATED)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.adminCategoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation(admin_delete_category_swagger.operation)
  @ApiOkResponse(admin_delete_category_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiConflictErrorResponse(ERROR_MESSAGES.CATEGORY_HAS_COMMITTEES)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.CATEGORY_NOT_FOUND)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.CATEGORY_DELETED)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminCategoriesService.remove(id);
  }
}
