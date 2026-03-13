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
import { AdminBoardService } from './admin-board.service';
import { CreateBoardMemberDto } from './dto/create-board-member.dto';
import { UpdateBoardMemberDto } from './dto/update-board-member.dto';
import {
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
  admin_create_board_member_swagger,
  admin_update_board_member_swagger,
  admin_delete_board_member_swagger,
} from './admin-board.swagger';
import { ResponseMessage } from 'src/decorators/response-message.decorator';

@ApiTags('admin/board')
@Controller('admin/board')
@ApiBearerAuth()
export class AdminBoardController {
  constructor(private readonly adminBoardService: AdminBoardService) {}

  @Post()
  @ApiOperation(admin_create_board_member_swagger.operation)
  @ApiCreatedResponse(admin_create_board_member_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.BOARD_MEMBER_CREATED)
  create(@Body() createBoardMemberDto: CreateBoardMemberDto) {
    return this.adminBoardService.create(createBoardMemberDto);
  }

  @Patch(':id')
  @ApiOperation(admin_update_board_member_swagger.operation)
  @ApiOkResponse(admin_update_board_member_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.BOARD_MEMBER_NOT_FOUND)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.BOARD_MEMBER_UPDATED)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBoardMemberDto: UpdateBoardMemberDto,
  ) {
    return this.adminBoardService.update(id, updateBoardMemberDto);
  }

  @Delete(':id')
  @ApiOperation(admin_delete_board_member_swagger.operation)
  @ApiOkResponse(admin_delete_board_member_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.BOARD_MEMBER_NOT_FOUND)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.BOARD_MEMBER_DELETED)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminBoardService.remove(id);
  }
}
