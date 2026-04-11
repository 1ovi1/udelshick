import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { AuthEntity } from './auth.entity';
import { SoftDeletableEntity } from './base/soft-deletable.entity';

@Entity('candidate_profiles')
export class CandidateProfileEntity extends SoftDeletableEntity {
  @PrimaryColumn()
  id: string;

  @Column({ unique: true })
  authId: string;

  @OneToOne(() => AuthEntity, (auth) => auth.candidateProfile)
  @JoinColumn({ name: 'authId' })
  auth: AuthEntity;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phone: string;
}
