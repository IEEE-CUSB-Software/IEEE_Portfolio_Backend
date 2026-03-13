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
import { AdminCommitteesService } from './admin-committees.service';
import { CreateCommitteeDto } from './dto/create-committee.dto';
import { UpdateCommitteeDto } from './dto/update-committee.dto';
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
  admin_create_committee_swagger,
  admin_update_committee_swagger,
  admin_delete_committee_swagger,
} from './admin-committees.swagger';
import { ResponseMessage } from 'src/decorators/response-message.decorator';

@ApiTags('admin/committees')
@Controller('admin/committees')
@ApiBearerAuth()
export class AdminCommitteesController {
  constructor(private readonly adminCommitteesService: AdminCommitteesService) {}

  @Post()
  @ApiOperation(admin_create_committee_swagger.operation)
  @ApiCreatedResponse(admin_create_committee_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiBadRequestErrorResponse(ERROR_MESSAGES.CATEGORY_NOT_FOUND)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.COMMITTEE_CREATED)
  create(@Body() createCommitteeDto: CreateCommitteeDto) {
    return this.adminCommitteesService.create(createCommitteeDto);
  }

  @Patch(':id')
  @ApiOperation(admin_update_committee_swagger.operation)
  @ApiOkResponse(admin_update_committee_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiBadRequestErrorResponse(ERROR_MESSAGES.CATEGORY_NOT_FOUND)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.COMMITTEE_NOT_FOUND)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.COMMITTEE_UPDATED)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCommitteeDto: UpdateCommitteeDto,
  ) {
    return this.adminCommitteesService.update(id, updateCommitteeDto);
  }

  @Delete(':id')
  @ApiOperation(admin_delete_committee_swagger.operation)
  @ApiOkResponse(admin_delete_committee_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.COMMITTEE_NOT_FOUND)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.COMMITTEE_DELETED)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminCommitteesService.remove(id);
  }
}
