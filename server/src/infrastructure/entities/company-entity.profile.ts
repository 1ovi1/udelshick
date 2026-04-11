import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { AuthEntity } from './auth.entity';
import { SoftDeletableEntity } from './base/soft-deletable.entity';

@Entity('company_profiles')
export class CompanyProfileEntity extends SoftDeletableEntity {
  @PrimaryColumn()
  id: string;

  @Column({ unique: true })
  authId: string;

  @OneToOne(() => AuthEntity, (auth) => auth.companyProfile)
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
}
