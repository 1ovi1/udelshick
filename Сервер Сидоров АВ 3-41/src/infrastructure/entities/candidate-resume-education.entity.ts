import { BaseEntity } from '@infrastructure/entities/base/base.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { CandidateResumeEntity } from './candidate-resume.entity';

@Entity('candidate_resume_educations')
export class CandidateResumeEducationEntity extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  resumeId: string;

  @ManyToOne(() => CandidateResumeEntity, (resume) => resume.educations, {
    onDelete: 'CASCADE',
  })
  resume: CandidateResumeEntity;

  @Column()
  institutionName: string;

  @Column()
  studyPeriod: string;

  @Column()
  degree: string;

  @Column()
  specialization: string;

  @Column({ type: 'integer', default: 0 })
  orderIndex: number;
}
