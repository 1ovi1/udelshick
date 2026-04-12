import { BaseEntity } from '@infrastructure/entities/base/base.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { CandidateResumeEntity } from './candidate-resume.entity';

@Entity('candidate_resume_experiences')
export class CandidateResumeExperienceEntity extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  resumeId: string;

  @ManyToOne(() => CandidateResumeEntity, (resume) => resume.experiences, {
    onDelete: 'CASCADE',
  })
  resume: CandidateResumeEntity;

  @Column()
  companyName: string;

  @Column()
  position: string;

  @Column()
  period: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'integer', default: 0 })
  orderIndex: number;
}
