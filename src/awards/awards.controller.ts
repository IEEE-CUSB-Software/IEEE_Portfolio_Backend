import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
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

@ApiTags('awards')
@Controller('awards')
export class AwardsController {
  constructor(private readonly awardsService: AwardsService) {}

  @Get()
  @UseGuards(OptionalJwtGuard)
  @ApiOperation(get_all_awards_swagger.operation)
  @ApiOkResponse(get_all_awards_swagger.responses.success)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.AWARDS_RETRIEVED)
  findAll() {
    return this.awardsService.findAll();
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
