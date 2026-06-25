import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Workshop } from './workshop.entity';

@Entity('instructors')
export class Instructor {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ type: 'text', nullable: true })
  bio!: string | null;

  @Column({ type: 'varchar', nullable: true })
  image_url!: string | null;

  @Column({ type: 'varchar', nullable: true })
  image_public_id!: string | null;

  @ManyToMany(() => Workshop, (workshop) => workshop.instructors)
  workshops!: Workshop[];

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
