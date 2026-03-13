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
import { AdminCommitteeMembersService } from './admin-committee-members.service';
import { CreateCommitteeMemberDto } from './dto/create-committee-member.dto';
import { UpdateCommitteeMemberDto } from './dto/update-committee-member.dto';
import {
  ApiBadRequestErrorResponse,
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
  admin_create_committee_member_swagger,
  admin_update_committee_member_swagger,
  admin_delete_committee_member_swagger,
} from './admin-committee-members.swagger';
import { ResponseMessage } from 'src/decorators/response-message.decorator';

@ApiTags('admin/committees/members')
@Controller('admin/committees/members')
@ApiBearerAuth()
export class AdminCommitteeMembersController {
  constructor(
    private readonly adminCommitteeMembersService: AdminCommitteeMembersService,
  ) {}

  @Post()
  @ApiOperation(admin_create_committee_member_swagger.operation)
  @ApiCreatedResponse(admin_create_committee_member_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiBadRequestErrorResponse(ERROR_MESSAGES.COMMITTEE_NOT_FOUND)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.COMMITTEE_MEMBER_CREATED)
  create(@Body() createCommitteeMemberDto: CreateCommitteeMemberDto) {
    return this.adminCommitteeMembersService.create(createCommitteeMemberDto);
  }

  @Patch(':id')
  @ApiOperation(admin_update_committee_member_swagger.operation)
  @ApiOkResponse(admin_update_committee_member_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiBadRequestErrorResponse(ERROR_MESSAGES.COMMITTEE_NOT_FOUND)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.COMMITTEE_MEMBER_NOT_FOUND)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.COMMITTEE_MEMBER_UPDATED)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCommitteeMemberDto: UpdateCommitteeMemberDto,
  ) {
    return this.adminCommitteeMembersService.update(id, updateCommitteeMemberDto);
  }

  @Delete(':id')
  @ApiOperation(admin_delete_committee_member_swagger.operation)
  @ApiOkResponse(admin_delete_committee_member_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.COMMITTEE_MEMBER_NOT_FOUND)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.COMMITTEE_MEMBER_DELETED)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminCommitteeMembersService.remove(id);
  }
}
