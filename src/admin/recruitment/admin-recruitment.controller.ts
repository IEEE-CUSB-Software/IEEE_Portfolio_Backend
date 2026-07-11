import { Controller, Get, Post, Patch, Body, Param, ParseUUIDPipe, Query, DefaultValuePipe, ParseIntPipe, Req, Res, UseInterceptors, ClassSerializerInterceptor, Delete, StreamableFile } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiBearerAuth, ApiCreatedResponse, ApiQuery, ApiProduces } from '@nestjs/swagger';
import {
  ApiForbiddenErrorResponse,
  ApiInternalServerError,
  ApiNotFoundErrorResponse,
  ApiUnauthorizedErrorResponse,
} from '../../decorators/swagger-error-responses.decorator';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../constants/swagger-messages';
import { AdminRecruitmentService } from './admin-recruitment.service';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { ResponseMessage } from '../../decorators/response-message.decorator';
import type { Request, Response } from 'express';
import { 
  admin_create_vacancy_swagger, 
  admin_update_vacancy_swagger, 
  admin_get_vacancies_swagger, 
  admin_get_applications_swagger, 
  admin_update_application_status_swagger, 
  admin_export_applications_swagger,
  admin_delete_vacancy_swagger,
  admin_view_application_cv_swagger
} from './admin-recruitment.swagger';

@ApiTags('admin/recruitment')
@Controller('admin/recruitment')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
export class AdminRecruitmentController {
  constructor(private readonly adminRecruitmentService: AdminRecruitmentService) {}

  @Post('vacancies')
  @ApiOperation(admin_create_vacancy_swagger.operation)
  @ApiCreatedResponse(admin_create_vacancy_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.VACANCY_CREATED)
  createVacancy(@Body() dto: CreateVacancyDto) {
    return this.adminRecruitmentService.createVacancy(dto);
  }

  @Patch('vacancies/:id')
  @ApiOperation(admin_update_vacancy_swagger.operation)
  @ApiOkResponse(admin_update_vacancy_swagger.responses.success)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.VACANCY_NOT_FOUND)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.VACANCY_UPDATED)
  updateVacancy(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateVacancyDto
  ) {
    return this.adminRecruitmentService.updateVacancy(id, dto);
  }

  @Get('vacancies')
  @ApiOperation(admin_get_vacancies_swagger.operation)
  @ApiOkResponse(admin_get_vacancies_swagger.responses.success)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by vacancy title or description' })
  @ResponseMessage(SUCCESS_MESSAGES.VACANCIES_RETRIEVED)
  getVacancies(@Query('search') search?: string) {
    return this.adminRecruitmentService.getVacancies(search);
  }

  @Get('vacancies/:id/applications')
  @ApiOperation(admin_get_applications_swagger.operation)
  @ApiOkResponse(admin_get_applications_swagger.responses.success)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.VACANCY_NOT_FOUND)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ApiQuery({ name: 'startDate', required: false, type: String, example: '2024-01-01' })
  @ApiQuery({ name: 'endDate', required: false, type: String, example: '2024-01-31' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ResponseMessage(SUCCESS_MESSAGES.APPLICATIONS_RETRIEVED)
  getApplications(
    @Param('id', ParseUUIDPipe) vacancyId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
  ) {
    return this.adminRecruitmentService.getApplications(vacancyId, startDate, endDate, page, limit);
  }

  @Patch('applications/:id/status')
  @ApiOperation(admin_update_application_status_swagger.operation)
  @ApiOkResponse(admin_update_application_status_swagger.responses.success)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.APPLICATION_NOT_FOUND)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.APPLICATION_STATUS_UPDATED)
  updateApplicationStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateApplicationStatusDto
  ) {
    return this.adminRecruitmentService.updateApplicationStatus(id, dto.status);
  }

  @Get('vacancies/:id/applications/export/excel')
  @ApiOperation(admin_export_applications_swagger.operation)
  @ApiOkResponse(admin_export_applications_swagger.responses.success)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.VACANCY_NOT_FOUND)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  async exportApplicationsToExcel(
    @Param('id', ParseUUIDPipe) vacancyId: string,
    @Res() res: Response,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const file = await this.adminRecruitmentService.exportApplicationsToExcel(vacancyId, startDate, endDate);
    
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${file.fileName}"`,
    });
    
    res.send(file.fileBuffer);
  }

  @Delete('vacancies/:id')
  @ApiOperation(admin_delete_vacancy_swagger.operation)
  @ApiOkResponse(admin_delete_vacancy_swagger.responses.success)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.VACANCY_NOT_FOUND)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  @ApiInternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR)
  @ResponseMessage(SUCCESS_MESSAGES.VACANCY_DELETED)
  deleteVacancy(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminRecruitmentService.deleteVacancy(id);
  }

  @Get('applications/:id/cv')
  @ApiOperation(admin_view_application_cv_swagger.operation)
  @ApiProduces('application/pdf', 'application/octet-stream')
  @ApiOkResponse(admin_view_application_cv_swagger.responses.success)
  @ApiNotFoundErrorResponse(ERROR_MESSAGES.APPLICATION_NOT_FOUND)
  @ApiUnauthorizedErrorResponse(ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN)
  @ApiForbiddenErrorResponse(ERROR_MESSAGES.FORBIDDEN_ACTION)
  async viewApplicationCv(
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response
  ) {
    const file = await this.adminRecruitmentService.getApplicationCv(id);
    res.set({
      'Content-Type': file.contentType,
      'Content-Disposition': `inline; filename="CV.pdf"`,
    });
    res.send(file.fileBuffer);
  }
}
