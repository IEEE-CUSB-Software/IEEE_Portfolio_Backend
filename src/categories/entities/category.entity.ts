import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { Committee } from '../../committees/entities/committee.entity';
import { Event } from '../../events/entities/event.entity';
import { Workshop } from '../../workshops/entities/workshop.entity';
import { Vacancy } from '../../recruitment/entities/vacancy.entity';

export enum CategoryType {
  COMMITTEE = 'COMMITTEE',
  EVENT = 'EVENT',
  WORKSHOP = 'WORKSHOP',
  RECRUITMENT = 'RECRUITMENT',
}

@Entity('categories')
@Unique(['name', 'type'])
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ type: 'enum', enum: CategoryType, default: CategoryType.COMMITTEE })
  type!: CategoryType;

  @Column({ nullable: true })
  description!: string;

  @OneToMany(() => Committee, (committee) => committee.category)
  committees!: Committee[];

  @OneToMany(() => Event, (event) => event.category)
  events!: Event[];

  @OneToMany(() => Workshop, (workshop) => workshop.category)
  workshops!: Workshop[];

  @OneToMany(() => Vacancy, (vacancy) => vacancy.category)
  vacancies!: Vacancy[];

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
