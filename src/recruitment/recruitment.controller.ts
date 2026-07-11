import { Controller, Get, Post, Body, Param, ParseUUIDPipe, Req, UseInterceptors, ClassSerializerInterceptor, Delete, Res, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiBearerAuth, ApiCreatedResponse, ApiQuery } from '@nestjs/swagger';
import {
  ApiForbiddenErrorResponse,
  ApiInternalServerError,
  ApiNotFoundErrorResponse,
  ApiUnauthorizedErrorResponse,
  ApiBadRequestErrorResponse,
} from '../decorators/swagger-error-responses.decorator';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants/swagger-messages';
import { RecruitmentService } from './recruitment.service';
import { ApplyToVacancyDto } from './dto/apply-to-vacancy.dto';
import { get_open_vacancies_swagger, apply_to_vacancy_swagger, get_my_applications_swagger, revoke_application_swagger } from './recruitment.swagger';
import { ResponseMessage } from '../decorators/response-message.decorator';
import type { Request, Response } from 'express';

@ApiTags('recruitment')
@Controller('recruitment')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
export class RecruitmentController {
  constructor(private readonly recruitmentService: RecruitmentService) {}

  @Get('vacancies')
  @ApiOperation(get_open_vacancies_swagger.operation)
  @ApiOkResponse(get_open_vacancies_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by vacancy title or description' })
  @ResponseMessage(SUCCESS_MESSAGES.VACANCIES_RETRIEVED)
  getOpenVacancies(@Query('search') search?: string) {
    return this.recruitmentService.getOpenVacancies(search);
  }

  @Post('vacancies/:id/apply')
  @ApiOperation(apply_to_vacancy_swagger.operation)
  @ApiCreatedResponse(apply_to_vacancy_swagger.responses.success)
  @ApiBadRequestErrorResponse(ERROR_MESSAGES.ALREADY_APPLIED_OR_CLOSED)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.VACANCY_NOT_FOUND)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.APPLICATION_CREATED)
  applyToVacancy(
    @Req() req: Request & { user?: any },
    @Param('id', ParseUUIDPipe) vacancyId: string,
    @Body() dto: ApplyToVacancyDto,
  ) {
    return this.recruitmentService.applyToVacancy(req.user.id, vacancyId, dto);
  }

  @Get('my-applications')
  @ApiOperation(get_my_applications_swagger.operation)
  @ApiOkResponse(get_my_applications_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.APPLICATIONS_RETRIEVED)
  getMyApplications(@Req() req: Request & { user?: any }) {
    return this.recruitmentService.getMyApplications(req.user.id);
  }

  @Delete('applications/:id')
  @ApiOperation(revoke_application_swagger.operation)
  @ApiOkResponse(revoke_application_swagger.responses.success)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.APPLICATION_NOT_FOUND)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.APPLICATION_DELETED)
  revokeApplication(
    @Req() req: Request & { user?: any },
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.recruitmentService.revokeApplication(req.user.id, id);
  }
}
