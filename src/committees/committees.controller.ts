import {
  Controller,
  Get,
  Param,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CommitteesService } from './committees.service';
import {
  ApiInternalServerError,
  ApiNotFoundErrorResponse,
} from 'src/decorators/swagger-error-responses.decorator';
import { ERROR_MESSAGES } from 'src/constants/swagger-messages';
import {
  get_all_committees_swagger,
  get_committee_by_id_swagger,
} from './committees.swagger';
import { OptionalJwtGuard } from 'src/auth/guards/optional-jwt.guard';

@ApiTags('committees')
@Controller('committees')
export class CommitteesController {
  constructor(private readonly committeesService: CommitteesService) {}

  @Get()
  @UseGuards(OptionalJwtGuard)
  @ApiOperation(get_all_committees_swagger.operation)
  @ApiQuery({
    name: 'category_id',
    required: false,
    description: 'Filter by category ID',
    type: String,
  })
  @ApiOkResponse(get_all_committees_swagger.responses.success)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  findAll(@Query('category_id') categoryId?: string) {
    return this.committeesService.findAll(categoryId);
  }

  @Get(':id')
  @UseGuards(OptionalJwtGuard)
  @ApiOperation(get_committee_by_id_swagger.operation)
  @ApiOkResponse(get_committee_by_id_swagger.responses.success)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.COMMITTEE_NOT_FOUND)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.committeesService.findOne(id);
  }
}
