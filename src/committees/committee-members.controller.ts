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
import { CommitteeMembersService } from './committee-members.service';
import {
  ApiInternalServerError,
} from 'src/decorators/swagger-error-responses.decorator';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from 'src/constants/swagger-messages';
import { get_committee_members_swagger } from './committee-members.swagger';
import { OptionalJwtGuard } from 'src/auth/guards/optional-jwt.guard';
import { ResponseMessage } from 'src/decorators/response-message.decorator';

@ApiTags('committees')
@Controller('committees/:committeeId/members')
export class CommitteeMembersController {
  constructor(
    private readonly committeeMembersService: CommitteeMembersService,
  ) {}

  @Get()
  @UseGuards(OptionalJwtGuard)
  @ApiOperation(get_committee_members_swagger.operation)
  @ApiOkResponse(get_committee_members_swagger.responses.success)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.COMMITTEE_MEMBERS_RETRIEVED)
  findByCommittee(@Param('committeeId', ParseUUIDPipe) committeeId: string) {
    return this.committeeMembersService.findByCommittee(committeeId);
  }
}
