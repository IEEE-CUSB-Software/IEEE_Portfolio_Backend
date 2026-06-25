import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Instructor } from './entities/instructor.entity';
import { ERROR_MESSAGES } from 'src/constants/swagger-messages';

@Injectable()
export class InstructorsService {
  constructor(
    @InjectRepository(Instructor)
    private readonly instructorsRepository: Repository<Instructor>,
  ) {}

  async findAll() {
    return this.instructorsRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string) {
    const instructor = await this.instructorsRepository.findOne({
      where: { id },
      relations: ['workshops'],
    });

    if (!instructor) {
      throw new NotFoundException(ERROR_MESSAGES.INSTRUCTOR_NOT_FOUND);
    }

    return instructor;
  }
}
