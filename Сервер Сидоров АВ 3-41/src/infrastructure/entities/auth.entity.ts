import { SoftDeletableEntity } from '@infrastructure/entities/base/soft-deletable.entity';
import * as bcrypt from 'bcrypt';
import { BeforeInsert, Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { CandidateProfileEntity } from './candidate-profile.entity';
import { CompanyProfileEntity } from './company-entity.profile';
import { Role } from '@domain/entities/enums/role.enum';

@Entity('auths')
export class AuthEntity extends SoftDeletableEntity {
  @PrimaryColumn()
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
  })
  role: Role;

  @OneToOne(() => CandidateProfileEntity, (profile) => profile.auth)
  candidateProfile?: CandidateProfileEntity;

  @OneToOne(() => CompanyProfileEntity, (profile) => profile.auth)
  companyProfile?: CompanyProfileEntity;

  @BeforeInsert()
  async hashPassword() {
    if (this.password && !this.password.startsWith('$2b$')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
