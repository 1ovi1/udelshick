import { ExperienceLevel } from '@domain/entities/enums/experience-level.enum';
import { VacancyStatus } from '@domain/entities/enums/vacancy-status.enum';
import { SoftDeletableEntity } from '@infrastructure/entities/base/soft-deletable.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { CompanyProfileEntity } from './company-entity.profile';
import { SkillEntity } from './skill.entity';
import { ApplicationEntity } from './application.entity';

@Entity('vacancies')
export class VacancyEntity extends SoftDeletableEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  companyProfileId: string;

  @ManyToOne(() => CompanyProfileEntity, (company) => company.vacancies, {
    onDelete: 'CASCADE',
  })
  companyProfile: CompanyProfileEntity;

  @Column()
  position: string;

  @Column()
  location: string;

  @Column({ type: 'integer', nullable: true })
  salary?: number;

  @Column({
    type: 'enum',
    enum: ExperienceLevel,
    enumName: 'experience_level_enum',
  })
  experienceLevel: ExperienceLevel;

  @Column({ type: 'text' })
  requirements: string;

  @Column({
    type: 'enum',
    enum: VacancyStatus,
    enumName: 'vacancy_status_enum',
    default: VacancyStatus.PENDING_REVIEW,
  })
  status: VacancyStatus;

  @Column({ type: 'timestamptz', nullable: true })
  publishedAt?: Date;

  @ManyToMany(() => SkillEntity, (skill) => skill.vacancies)
  @JoinTable({
    name: 'vacancy_skills',
    joinColumn: { name: 'vacancyId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'skillId', referencedColumnName: 'id' },
  })
  skills?: SkillEntity[];

  @OneToMany(() => ApplicationEntity, (application) => application.vacancy)
  applications?: ApplicationEntity[];
}
