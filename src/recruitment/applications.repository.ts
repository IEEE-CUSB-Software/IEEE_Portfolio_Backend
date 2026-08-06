import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Application } from './entities/application.entity';
import { ApplicationsQueryDto } from 'src/admin/recruitment/dto/applications-query.dto';
import { paginate, PaginatedResult } from 'src/common/utils/pagination.util';

export interface ApplicationFilters {
  startDate?: string;
  endDate?: string;
  search?: string;
}

@Injectable()
export class ApplicationsRepository {
  constructor(
    @InjectRepository(Application)
    private readonly applicationsRepository: Repository<Application>,
  ) {}

  /**
   * Single source of truth for reading a vacancy's applications — shared by the
   * paginated admin list and the Excel export, so date filtering can't drift
   * between them.
   *
   * The applicant's name/email/university live on the related User, hence the
   * join; only order by real mapped columns of a joined alias, since TypeORM's
   * joined-pagination path resolves order-by paths against entity metadata.
   */
  private buildByVacancyQuery(
    vacancyId: string,
    filters: ApplicationFilters,
  ): SelectQueryBuilder<Application> {
    const qb = this.applicationsRepository
      .createQueryBuilder('application')
      .leftJoinAndSelect('application.user', 'user')
      .where('application.vacancy_id = :vacancyId', { vacancyId })
      .orderBy('application.created_at', 'DESC')
      .addOrderBy('application.id', 'DESC');

    if (filters.startDate) {
      const start = new Date(filters.startDate);
      start.setHours(0, 0, 0, 0);
      qb.andWhere('application.created_at >= :start', { start });
    }

    if (filters.endDate) {
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999);
      qb.andWhere('application.created_at <= :end', { end });
    }

    const search = filters.search?.trim();
    if (search) {
      qb.andWhere(
        '(user.name ILIKE :search OR user.email ILIKE :search OR user.university ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    return qb;
  }

  async findByVacancyPaginated(
    vacancyId: string,
    query: ApplicationsQueryDto,
  ): Promise<PaginatedResult<Application>> {
    return paginate(this.buildByVacancyQuery(vacancyId, query), query);
  }

  async findByVacancy(
    vacancyId: string,
    filters: ApplicationFilters,
  ): Promise<Application[]> {
    return this.buildByVacancyQuery(vacancyId, filters).getMany();
  }

  async findByUser(userId: string): Promise<Application[]> {
    return this.applicationsRepository.find({
      where: { user_id: userId },
      relations: ['vacancy', 'user'],
      order: { created_at: 'DESC' },
    });
  }

  async findById(id: string): Promise<Application | null> {
    return this.applicationsRepository.findOne({ where: { id } });
  }

  async findByIdWithUser(id: string): Promise<Application | null> {
    return this.applicationsRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async findByIdForUser(
    id: string,
    userId: string,
  ): Promise<Application | null> {
    return this.applicationsRepository.findOne({
      where: { id, user_id: userId },
    });
  }

  async findByUserAndVacancy(
    userId: string,
    vacancyId: string,
  ): Promise<Application | null> {
    return this.applicationsRepository.findOne({
      where: { user_id: userId, vacancy_id: vacancyId },
    });
  }

  create(data: Partial<Application>): Application {
    return this.applicationsRepository.create(data);
  }

  async save(application: Application): Promise<Application> {
    return this.applicationsRepository.save(application);
  }

  async remove(application: Application): Promise<Application> {
    return this.applicationsRepository.remove(application);
  }
}
