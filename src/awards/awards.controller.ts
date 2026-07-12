import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AwardsService } from './awards.service';
import {
  ApiInternalServerError,
  ApiNotFoundErrorResponse,
} from 'src/decorators/swagger-error-responses.decorator';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from 'src/constants/swagger-messages';
import {
  get_all_awards_swagger,
  get_award_by_id_swagger,
} from './awards.swagger';
import { OptionalJwtGuard } from 'src/auth/guards/optional-jwt.guard';
import { ResponseMessage } from 'src/decorators/response-message.decorator';
import { AwardSource } from './enums/award-source.enum';

@ApiTags('awards')
@Controller('awards')
export class AwardsController {
  constructor(private readonly awardsService: AwardsService) {}

  @Get()
  @UseGuards(OptionalJwtGuard)
  @ApiOperation(get_all_awards_swagger.operation)
  @ApiOkResponse(get_all_awards_swagger.responses.success)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by title or description' })
  @ApiQuery({ name: 'year', required: false, type: Number, description: 'Filter by award year' })
  @ApiQuery({ name: 'source', required: false, enum: AwardSource, description: 'Filter by award source' })
  @ResponseMessage(SUCCESS_MESSAGES.AWARDS_RETRIEVED)
  findAll(
    @Query('search') search?: string,
    @Query('year') year?: string,
    @Query('source') source?: AwardSource,
  ) {
    return this.awardsService.findAll(search, year ? parseInt(year) : undefined, source);
  }

  @Get(':id')
  @UseGuards(OptionalJwtGuard)
  @ApiOperation(get_award_by_id_swagger.operation)
  @ApiOkResponse(get_award_by_id_swagger.responses.success)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.AWARD_NOT_FOUND)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.AWARD_RETRIEVED)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.awardsService.findOne(id);
  }
}
