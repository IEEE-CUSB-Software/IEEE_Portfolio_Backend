import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Vacancy } from '../../recruitment/entities/vacancy.entity';
import { Application } from '../../recruitment/entities/application.entity';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { ERROR_MESSAGES } from 'src/constants/swagger-messages';
import { StorageService } from '../../storage/storage.service';
import * as ExcelJS from 'exceljs';

@Injectable()
export class AdminRecruitmentService {
  constructor(
    @InjectRepository(Vacancy)
    private readonly vacanciesRepository: Repository<Vacancy>,
    @InjectRepository(Application)
    private readonly applicationsRepository: Repository<Application>,
    private readonly storageService: StorageService,
  ) {}

  async createVacancy(dto: CreateVacancyDto) {
    const vacancy = this.vacanciesRepository.create(dto);
    return this.vacanciesRepository.save(vacancy);
  }

  async updateVacancy(id: string, dto: UpdateVacancyDto) {
    const vacancy = await this.vacanciesRepository.preload({ id, ...dto });
    if (!vacancy) {
      throw new NotFoundException(ERROR_MESSAGES.VACANCY_NOT_FOUND);
    }
    return this.vacanciesRepository.save(vacancy);
  }

  async getVacancies(search?: string) {
    const qb = this.vacanciesRepository
      .createQueryBuilder('vacancy')
      .orderBy('vacancy.created_at', 'DESC');

    if (search) {
      qb.andWhere(
        '(vacancy.title ILIKE :search OR vacancy.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    return qb.getMany();
  }

  private getApplicationsDateFilter(startDate?: string, endDate?: string) {
    let start: Date | undefined;
    let end: Date | undefined;

    if (startDate) {
      start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
    }
    
    if (endDate) {
      end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
    }

    if (start && end) {
      return Between(start, end);
    } else if (start) {
      return MoreThanOrEqual(start);
    } else if (end) {
      return LessThanOrEqual(end);
    }
    return undefined;
  }

  async getApplications(vacancyId: string, startDate?: string, endDate?: string, page: number = 1, limit: number = 10) {
    const vacancy = await this.vacanciesRepository.findOne({ where: { id: vacancyId } });
    if (!vacancy) {
      throw new NotFoundException(ERROR_MESSAGES.VACANCY_NOT_FOUND);
    }

    const dateFilter = this.getApplicationsDateFilter(startDate, endDate);
    const whereClause: any = { vacancy_id: vacancyId };
    if (dateFilter) {
      whereClause.created_at = dateFilter;
    }

    const [data, total] = await this.applicationsRepository.findAndCount({
      where: whereClause,
      relations: ['user'],
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    for (const app of data) {
      if (app.user?.cv_file_key) {
        (app as any).cv_url = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/${app.id}/cv`;
      }
    }

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateApplicationStatus(id: string, status: 'PENDING' | 'ACCEPTED' | 'REJECTED') {
    const application = await this.applicationsRepository.findOne({ where: { id } });
    if (!application) {
      throw new NotFoundException(ERROR_MESSAGES.APPLICATION_NOT_FOUND);
    }
    application.status = status;
    return this.applicationsRepository.save(application);
  }

  async exportApplicationsToExcel(vacancyId: string, startDate?: string, endDate?: string) {
    const vacancy = await this.vacanciesRepository.findOne({ where: { id: vacancyId } });
    if (!vacancy) {
      throw new NotFoundException(ERROR_MESSAGES.VACANCY_NOT_FOUND);
    }

    const dateFilter = this.getApplicationsDateFilter(startDate, endDate);
    const whereClause: any = { vacancy_id: vacancyId };
    if (dateFilter) {
      whereClause.created_at = dateFilter;
    }

    const applications = await this.applicationsRepository.find({
      where: whereClause,
      relations: ['user'],
      order: { created_at: 'DESC' },
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Applications');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 36 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'User Name', key: 'name', width: 30 },
      { header: 'User Email', key: 'email', width: 30 },
      { header: 'Phone', key: 'phone', width: 20 },
      { header: 'University', key: 'university', width: 25 },
      { header: 'Faculty', key: 'faculty', width: 25 },
      { header: 'Major', key: 'major', width: 25 },
      { header: 'Academic Year', key: 'academic_year', width: 15 },
      { header: 'CV Link (Key)', key: 'cv_file_key', width: 30 },
      { header: 'Extra Data', key: 'extra_data', width: 50 },
      { header: 'Applied At', key: 'created_at', width: 25 },
    ];

    for (const app of applications) {
      let cvLink: any = 'N/A';
      if (app.user?.cv_file_key) {
        const url = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/${app.id}/cv`;
        cvLink = { text: 'View CV', hyperlink: url };
      }

      worksheet.addRow({
        id: app.id,
        status: app.status,
        name: app.user?.name || 'N/A',
        email: app.user?.email || 'N/A',
        phone: app.user?.phone || 'N/A',
        university: app.user?.university || 'N/A',
        faculty: app.user?.faculty || 'N/A',
        major: app.user?.major || 'N/A',
        academic_year: app.user?.academic_year || 'N/A',
        cv_file_key: cvLink,
        extra_data: app.extra_data ? JSON.stringify(app.extra_data) : '',
        created_at: app.created_at.toISOString(),
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();

    return {
      fileBuffer: Buffer.from(buffer as any),
      fileName: `applications-${vacancy.title.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.xlsx`,
    };
  }

  async deleteVacancy(id: string) {
    const vacancy = await this.vacanciesRepository.findOne({ where: { id } });
    if (!vacancy) {
      throw new NotFoundException(ERROR_MESSAGES.VACANCY_NOT_FOUND);
    }
    await this.vacanciesRepository.remove(vacancy);
    return { success: true };
  }

  async getApplicationCv(id: string) {
    const application = await this.applicationsRepository.findOne({ where: { id }, relations: ['user'] });
    if (!application) {
      throw new NotFoundException(ERROR_MESSAGES.APPLICATION_NOT_FOUND);
    }
    if (!application.user?.cv_file_key) {
      throw new NotFoundException('CV file not found for this user');
    }
    return this.storageService.getFile(application.user.cv_file_key);
  }
}
