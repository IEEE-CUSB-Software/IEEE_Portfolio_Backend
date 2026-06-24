import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { WorkshopsService } from './workshops.service';
import {
  ApiInternalServerError,
  ApiNotFoundErrorResponse,
} from 'src/decorators/swagger-error-responses.decorator';
import { ERROR_MESSAGES } from 'src/constants/swagger-messages';
import { User } from 'src/users/entities/user.entity';
import { OptionalJwtGuard } from 'src/auth/guards/optional-jwt.guard';
import {
  get_all_workshops_swagger,
  get_workshop_by_id_swagger,
} from './workshops.swagger';

@ApiTags('workshops')
@Controller('workshops')
export class WorkshopsController {
  constructor(private readonly workshopsService: WorkshopsService) {}

  @Get()
  @UseGuards(OptionalJwtGuard)
  @ApiOperation(get_all_workshops_swagger.operation)
  @ApiOkResponse(get_all_workshops_swagger.responses.success)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Req() req: Request & { user?: User },
  ) {
    return this.workshopsService.findAll(
      parseInt(page),
      parseInt(limit),
      req.user,
    );
  }

  @Get(':id')
  @UseGuards(OptionalJwtGuard)
  @ApiOperation(get_workshop_by_id_swagger.operation)
  @ApiOkResponse(get_workshop_by_id_swagger.responses.success)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.WORKSHOP_NOT_FOUND)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request & { user?: User },
  ) {
    return this.workshopsService.findOne(id, req.user);
  }
}
