import { DataSource } from 'typeorm';
import { DB_PROVIDER, DATABASE_URL } from '@constants';
import { AuthEntity } from '@infrastructure/entities/auth.entity';
import { CandidateProfileEntity } from '@infrastructure/entities/candidate-profile.entity';
import { CompanyProfileEntity } from '@infrastructure/entities/company-entity.profile';
import { VacancyEntity } from '@infrastructure/entities/vacancy.entity';
import { SkillEntity } from '@infrastructure/entities/skill.entity';
import { ApplicationEntity } from '@infrastructure/entities/application.entity';

export const databaseProviders = [
  {
    provide: DB_PROVIDER,
    useFactory: async (): Promise<DataSource> => {
      const dataSource = new DataSource({
        type: 'postgres',
        url: DATABASE_URL,
        entities: [
          AuthEntity,
          CompanyProfileEntity,
          CandidateProfileEntity,
          VacancyEntity,
          SkillEntity,
          ApplicationEntity,
        ],
        synchronize: process.env.NODE_ENV !== 'production',
        logging: process.env.NODE_ENV === 'development',
        ssl:
          process.env.NODE_ENV === 'production'
            ? { rejectUnauthorized: false }
            : false,
      });

      return dataSource.initialize();
    },
  },
];
