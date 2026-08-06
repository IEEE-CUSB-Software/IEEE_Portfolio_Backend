import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { InstructorsService } from './instructors.service';
import {
  ApiInternalServerError,
  ApiNotFoundErrorResponse,
} from 'src/decorators/swagger-error-responses.decorator';
import { ERROR_MESSAGES } from 'src/constants/swagger-messages';
import { OptionalJwtGuard } from 'src/auth/guards/optional-jwt.guard';
import {
  get_all_instructors_swagger,
  get_instructor_by_id_swagger,
} from './workshops.swagger';

@ApiTags('workshops/instructors')
@Controller('workshops/instructors')
export class InstructorsController {
  constructor(private readonly instructorsService: InstructorsService) {}

  @Get()
  @UseGuards(OptionalJwtGuard)
  @ApiOperation(get_all_instructors_swagger.operation)
  @ApiOkResponse(get_all_instructors_swagger.responses.success)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  findAll() {
    return this.instructorsService.findAll();
  }

  @Get(':id')
  @UseGuards(OptionalJwtGuard)
  @ApiOperation(get_instructor_by_id_swagger.operation)
  @ApiOkResponse(get_instructor_by_id_swagger.responses.success)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.INSTRUCTOR_NOT_FOUND)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.instructorsService.findOne(id);
  }
}
