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
import { VacancyEntity } from './vacancy.entity';

@Entity('company_profiles')
export class CompanyProfileEntity extends SoftDeletableEntity {
  @PrimaryColumn()
  id: string;

  @Column({ unique: true })
  authId: string;

  @OneToOne(() => AuthEntity, (auth) => auth.companyProfile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'authId' })
  auth: AuthEntity;

  @Column()
  companyName: string;

  @Column()
  contactPerson: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @OneToMany(() => VacancyEntity, (vacancy) => vacancy.companyProfile)
  vacancies?: VacancyEntity[];
}
