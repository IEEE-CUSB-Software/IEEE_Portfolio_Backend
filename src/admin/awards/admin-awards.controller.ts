import {
  Controller,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestErrorResponse,
  ApiInternalServerError,
  ApiNotFoundErrorResponse,
  ApiUnauthorizedErrorResponse,
} from 'src/decorators/swagger-error-responses.decorator';
import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from 'src/constants/swagger-messages';
import { CreateAwardDto } from '../../awards/dto';
import { Award } from '../../awards/entities/award.entity';
import {
  create_award_swagger,
  delete_award_swagger,
} from '../../awards/awards.swagger';
import { ResponseMessage } from 'src/decorators/response-message.decorator';
import { AdminAwardsService } from './admin-awards.service';

@ApiTags('admin/awards')
@ApiBearerAuth()
@Controller('admin/awards')
export class AdminAwardsController {
  constructor(private readonly adminAwardsService: AdminAwardsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation(create_award_swagger.operation)
  @ApiOkResponse(create_award_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiBadRequestErrorResponse(ERROR_MESSAGES.FAILED_TO_SAVE_IN_DB)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.AWARD_CREATED)
  async create(@Body() createAwardDto: CreateAwardDto): Promise<Award> {
    return this.adminAwardsService.create(createAwardDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation(delete_award_swagger.operation)
  @ApiOkResponse(delete_award_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.AWARD_NOT_FOUND)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.AWARD_DELETED)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.adminAwardsService.remove(id);
  }
}
