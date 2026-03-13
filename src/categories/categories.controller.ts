import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import {
  ApiInternalServerError,
} from 'src/decorators/swagger-error-responses.decorator';
import { ERROR_MESSAGES } from 'src/constants/swagger-messages';
import { get_all_categories_swagger } from './categories.swagger';
import { OptionalJwtGuard } from 'src/auth/guards/optional-jwt.guard';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @UseGuards(OptionalJwtGuard)
  @ApiOperation(get_all_categories_swagger.operation)
  @ApiOkResponse(get_all_categories_swagger.responses.success)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  findAll() {
    return this.categoriesService.findAll();
  }
}
