import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { ApiInternalServerError } from 'src/decorators/swagger-error-responses.decorator';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from 'src/constants/swagger-messages';
import { AwardsService } from './awards.service';
import { get_all_awards_swagger } from './awards.swagger';
import { ResponseMessage } from 'src/decorators/response-message.decorator';

@ApiTags('Awards')
@Controller('awards')
export class AwardsController {
  constructor(private readonly awardsService: AwardsService) {}

  @Get()
  @ApiOperation(get_all_awards_swagger.operation)
  @ApiOkResponse(get_all_awards_swagger.responses.success)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.AWARDS_RETRIEVED)
  async findAll() {
    return this.awardsService.findAll();
  }
}
