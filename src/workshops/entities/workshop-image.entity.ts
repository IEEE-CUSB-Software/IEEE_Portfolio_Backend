import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Workshop } from './workshop.entity';

@Entity('workshops_images')
export class WorkshopImage {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  workshop_id!: string;

  @ManyToOne(() => Workshop, (workshop) => workshop.images, {
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'workshop_id' })
  workshop!: Workshop;

  @Column()
  image_url!: string;

  @Column({ type: 'varchar', nullable: true })
  image_public_id!: string | null;

  @Column({ type: 'int', default: 0 })
  sort_order!: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
