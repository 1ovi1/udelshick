import { BaseEntity } from '@infrastructure/entities/base/base.entity';
import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';
import { VacancyEntity } from './vacancy.entity';

@Entity('skills')
export class SkillEntity extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => VacancyEntity, (vacancy) => vacancy.skills)
  vacancies?: VacancyEntity[];
}
