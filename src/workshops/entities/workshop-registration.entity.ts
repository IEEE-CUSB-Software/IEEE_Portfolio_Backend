import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { Workshop } from './workshop.entity';

export enum WorkshopRegistrationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
  ATTENDED = 'attended',
}

@Entity('workshop_registrations')
@Unique('UQ_workshop_registration_unique', ['workshop_id', 'user_id'])
export class WorkshopRegistration {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  user_id!: string;

  @ManyToOne(() => User, {
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column('uuid')
  workshop_id!: string;

  @ManyToOne(() => Workshop, (workshop) => workshop.registrations, {
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'workshop_id' })
  workshop!: Workshop;

  @Column({
    type: 'enum',
    enum: WorkshopRegistrationStatus,
    default: WorkshopRegistrationStatus.PENDING,
  })
  status!: WorkshopRegistrationStatus;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
