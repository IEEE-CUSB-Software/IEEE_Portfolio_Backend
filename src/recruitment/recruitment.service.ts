import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ApplyToVacancyDto } from './dto/apply-to-vacancy.dto';
import { ERROR_MESSAGES } from 'src/constants/swagger-messages';
import { VacanciesRepository } from './vacancies.repository';
import { ApplicationsRepository } from './applications.repository';

@Injectable()
export class RecruitmentService {
  constructor(
    private readonly vacanciesRepository: VacanciesRepository,
    private readonly applicationsRepository: ApplicationsRepository,
  ) {}

  async getOpenVacancies(search?: string) {
    return this.vacanciesRepository.findOpen(search);
  }

  async applyToVacancy(
    userId: string,
    vacancyId: string,
    dto: ApplyToVacancyDto,
  ) {
    const vacancy = await this.vacanciesRepository.findById(vacancyId);
    if (!vacancy) {
      throw new NotFoundException(ERROR_MESSAGES.VACANCY_NOT_FOUND);
    }

    if (!vacancy.is_open) {
      throw new BadRequestException(ERROR_MESSAGES.VACANCY_CLOSED);
    }

    const existingApplication =
      await this.applicationsRepository.findByUserAndVacancy(userId, vacancyId);

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
    return this.applicationsRepository.findByUser(userId);
  }

  async revokeApplication(userId: string, applicationId: string) {
    const application = await this.applicationsRepository.findByIdForUser(
      applicationId,
      userId,
    );

    if (!application) {
      throw new NotFoundException(ERROR_MESSAGES.APPLICATION_NOT_FOUND);
    }

    await this.applicationsRepository.remove(application);
    return { success: true };
  }
}
