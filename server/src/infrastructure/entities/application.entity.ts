import { ApplicationStatus } from '@domain/entities/enums/application-status.enum';
import { SoftDeletableEntity } from '@infrastructure/entities/base/soft-deletable.entity';
import { Column, Entity, Index, ManyToOne, PrimaryColumn } from 'typeorm';
import { CandidateProfileEntity } from './candidate-profile.entity';
import { VacancyEntity } from './vacancy.entity';

@Entity('applications')
@Index(['candidateProfileId', 'vacancyId'], { unique: true })
export class ApplicationEntity extends SoftDeletableEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  candidateProfileId: string;

  @ManyToOne(
    () => CandidateProfileEntity,
    (candidate) => candidate.applications,
    {
      onDelete: 'CASCADE',
    },
  )
  candidateProfile: CandidateProfileEntity;

  @Column()
  vacancyId: string;

  @ManyToOne(() => VacancyEntity, (vacancy) => vacancy.applications, {
    onDelete: 'CASCADE',
  })
  vacancy: VacancyEntity;

  @Column({ type: 'text', nullable: true })
  coverLetter?: string;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    enumName: 'application_status_enum',
    default: ApplicationStatus.NEW,
  })
  status: ApplicationStatus;

  @Column({ nullable: true })
  resumePdfUrl?: string;
}
