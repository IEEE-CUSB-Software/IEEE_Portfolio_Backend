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
import { BoardService } from './board.service';
import {
  ApiInternalServerError,
} from 'src/decorators/swagger-error-responses.decorator';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from 'src/constants/swagger-messages';
import { get_all_board_members_swagger } from './board.swagger';
import { OptionalJwtGuard } from 'src/auth/guards/optional-jwt.guard';
import { ResponseMessage } from 'src/decorators/response-message.decorator';

@ApiTags('board')
@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Get()
  @UseGuards(OptionalJwtGuard)
  @ApiOperation(get_all_board_members_swagger.operation)
  @ApiOkResponse(get_all_board_members_swagger.responses.success)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.BOARD_MEMBERS_RETRIEVED)
  findAll() {
    return this.boardService.findAll();
  }
}
