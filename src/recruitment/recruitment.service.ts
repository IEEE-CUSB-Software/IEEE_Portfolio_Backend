import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vacancy } from './entities/vacancy.entity';
import { Application } from './entities/application.entity';
import { ApplyToVacancyDto } from './dto/apply-to-vacancy.dto';
import { ERROR_MESSAGES } from 'src/constants/swagger-messages';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class RecruitmentService {
  constructor(
    @InjectRepository(Vacancy)
    private readonly vacanciesRepository: Repository<Vacancy>,
    @InjectRepository(Application)
    private readonly applicationsRepository: Repository<Application>,
    private readonly storageService: StorageService,
  ) {}

  async getOpenVacancies() {
    return this.vacanciesRepository.find({
      where: { is_open: true },
      order: { created_at: 'DESC' },
    });
  }

  async applyToVacancy(userId: string, vacancyId: string, dto: ApplyToVacancyDto) {
    const vacancy = await this.vacanciesRepository.findOne({ where: { id: vacancyId } });
    if (!vacancy) {
      throw new NotFoundException(ERROR_MESSAGES.VACANCY_NOT_FOUND);
    }

    if (!vacancy.is_open) {
      throw new BadRequestException(ERROR_MESSAGES.VACANCY_CLOSED);
    }

    const existingApplication = await this.applicationsRepository.findOne({
      where: { user_id: userId, vacancy_id: vacancyId },
    });

    if (existingApplication) {
      throw new BadRequestException(ERROR_MESSAGES.ALREADY_APPLIED);
    }

    const application = this.applicationsRepository.create({
      user_id: userId,
      vacancy_id: vacancyId,
      extra_data: dto.extra_data,
    });

    return this.applicationsRepository.save(application);
  }

  async getMyApplications(userId: string) {
    return this.applicationsRepository.find({
      where: { user_id: userId },
      relations: ['vacancy', 'user'],
      order: { created_at: 'DESC' },
    });
  }

  async revokeApplication(userId: string, applicationId: string) {
    const application = await this.applicationsRepository.findOne({
      where: { id: applicationId, user_id: userId },
    });

    if (!application) {
      throw new NotFoundException(ERROR_MESSAGES.APPLICATION_NOT_FOUND);
    }

    await this.applicationsRepository.remove(application);
    return { success: true };
  }
}
