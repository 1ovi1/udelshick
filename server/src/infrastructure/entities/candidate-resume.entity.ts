import { SoftDeletableEntity } from '@infrastructure/entities/base/soft-deletable.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { CandidateProfileEntity } from './candidate-profile.entity';
import { CandidateResumeExperienceEntity } from './candidate-resume-experience.entity';
import { CandidateResumeEducationEntity } from './candidate-resume-education.entity';
import { SkillEntity } from './skill.entity';

@Entity('candidate_resumes')
export class CandidateResumeEntity extends SoftDeletableEntity {
  @PrimaryColumn()
  id: string;

  @Column({ unique: true })
  candidateProfileId: string;

  @OneToOne(() => CandidateProfileEntity, (candidate) => candidate.resume, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'candidateProfileId' })
  candidateProfile: CandidateProfileEntity;

  @Column()
  profession: string;

  @Column()
  location: string;

  @Column({ type: 'integer', nullable: true })
  expectedSalary: number | null;

  @Column({ type: 'text', nullable: true })
  about: string | null;

  @Column({ type: 'varchar', nullable: true })
  resumePdfUrl: string | null;

  @OneToMany(() => CandidateResumeExperienceEntity, (item) => item.resume)
  experiences?: CandidateResumeExperienceEntity[];

  @OneToMany(() => CandidateResumeEducationEntity, (item) => item.resume)
  educations?: CandidateResumeEducationEntity[];

  @ManyToMany(() => SkillEntity)
  @JoinTable({
    name: 'candidate_resume_skills',
    joinColumn: { name: 'resumeId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'skillId', referencedColumnName: 'id' },
  })
  skills?: SkillEntity[];
}
