import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Committee } from './committee.entity';

export enum CommitteeMemberRole {
  HEAD = 'head',
  VICE_HEAD = 'vice_head',
  MEMBER = 'member',
}

@Entity('committee_members')
export class CommitteeMember {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  committee_id!: string;

  @ManyToOne(() => Committee, (committee) => committee.members, {
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'committee_id' })
  committee!: Committee;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column({ type: 'enum', enum: CommitteeMemberRole })
  role!: CommitteeMemberRole;

  @Column({ type: 'varchar', nullable: true })
  image_url!: string | null;

  @Column({ type: 'varchar', nullable: true })
  image_public_id!: string | null;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
