import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { AuthEntity } from './auth.entity';
import { SoftDeletableEntity } from './base/soft-deletable.entity';
import { ApplicationEntity } from './application.entity';
import { CandidateResumeEntity } from './candidate-resume.entity';

@Entity('candidate_profiles')
export class CandidateProfileEntity extends SoftDeletableEntity {
  @PrimaryColumn()
  id: string;

  @Column({ unique: true })
  authId: string;

  @OneToOne(() => AuthEntity, (auth) => auth.candidateProfile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'authId' })
  auth: AuthEntity;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phone: string;

  @OneToOne(() => CandidateResumeEntity, (resume) => resume.candidateProfile)
  resume?: CandidateResumeEntity;

  @OneToMany(
    () => ApplicationEntity,
    (application) => application.candidateProfile,
  )
  applications?: ApplicationEntity[];
}
