import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAdminVacancyAndApplicationEntities1765000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'experience_level_enum') THEN
          CREATE TYPE "experience_level_enum" AS ENUM ('no_experience', 'junior', 'middle', 'senior', 'lead');
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vacancy_status_enum') THEN
          CREATE TYPE "vacancy_status_enum" AS ENUM ('pending_review', 'published', 'archived');
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'application_status_enum') THEN
          CREATE TYPE "application_status_enum" AS ENUM ('new', 'viewed', 'invited', 'rejected', 'accepted', 'withdrawn');
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "skills" (
        "id" character varying NOT NULL,
        "name" character varying NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_skills_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_skills_name" UNIQUE ("name")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "vacancies" (
        "id" character varying NOT NULL,
        "companyProfileId" character varying NOT NULL,
        "position" character varying NOT NULL,
        "location" character varying NOT NULL,
        "salary" integer,
        "experienceLevel" "experience_level_enum" NOT NULL,
        "requirements" text NOT NULL,
        "status" "vacancy_status_enum" NOT NULL DEFAULT 'pending_review',
        "publishedAt" TIMESTAMPTZ,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_vacancies_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_vacancies_companyProfileId" FOREIGN KEY ("companyProfileId") REFERENCES "company_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "vacancy_skills" (
        "vacancyId" character varying NOT NULL,
        "skillId" character varying NOT NULL,
        CONSTRAINT "PK_vacancy_skills" PRIMARY KEY ("vacancyId", "skillId"),
        CONSTRAINT "FK_vacancy_skills_vacancy" FOREIGN KEY ("vacancyId") REFERENCES "vacancies"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT "FK_vacancy_skills_skill" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "applications" (
        "id" character varying NOT NULL,
        "candidateProfileId" character varying NOT NULL,
        "vacancyId" character varying NOT NULL,
        "coverLetter" text,
        "status" "application_status_enum" NOT NULL DEFAULT 'new',
        "resumePdfUrl" character varying,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_applications_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_applications_candidate_vacancy" UNIQUE ("candidateProfileId", "vacancyId"),
        CONSTRAINT "FK_applications_candidateProfileId" FOREIGN KEY ("candidateProfileId") REFERENCES "candidate_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT "FK_applications_vacancyId" FOREIGN KEY ("vacancyId") REFERENCES "vacancies"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);

    await queryRunner.query(`
      INSERT INTO "skills" ("id", "name")
      VALUES
        ('skill-angular', 'Angular'),
        ('skill-nestjs', 'NestJS'),
        ('skill-typescript', 'TypeScript'),
        ('skill-postgresql', 'PostgreSQL'),
        ('skill-docker', 'Docker'),
        ('skill-rest-api', 'REST API'),
        ('skill-git', 'Git'),
        ('skill-javascript', 'JavaScript')
      ON CONFLICT ("name") DO NOTHING
    `);

    await queryRunner.query(`
      DO $$
      DECLARE
        fk_name text;
      BEGIN
        SELECT c.conname INTO fk_name
        FROM pg_constraint c
        JOIN pg_attribute a
          ON a.attrelid = c.conrelid
         AND a.attnum = ANY(c.conkey)
        WHERE c.conrelid = 'candidate_profiles'::regclass
          AND c.contype = 'f'
          AND a.attname = 'authId'
        LIMIT 1;

        IF fk_name IS NOT NULL THEN
          EXECUTE format('ALTER TABLE "candidate_profiles" DROP CONSTRAINT %I', fk_name);
        END IF;

        ALTER TABLE "candidate_profiles"
          ADD CONSTRAINT "FK_candidate_profiles_authId"
          FOREIGN KEY ("authId") REFERENCES "auths"("id")
          ON DELETE CASCADE ON UPDATE NO ACTION;
      END $$;
    `);

    await queryRunner.query(`
      DO $$
      DECLARE
        fk_name text;
      BEGIN
        SELECT c.conname INTO fk_name
        FROM pg_constraint c
        JOIN pg_attribute a
          ON a.attrelid = c.conrelid
         AND a.attnum = ANY(c.conkey)
        WHERE c.conrelid = 'company_profiles'::regclass
          AND c.contype = 'f'
          AND a.attname = 'authId'
        LIMIT 1;

        IF fk_name IS NOT NULL THEN
          EXECUTE format('ALTER TABLE "company_profiles" DROP CONSTRAINT %I', fk_name);
        END IF;

        ALTER TABLE "company_profiles"
          ADD CONSTRAINT "FK_company_profiles_authId"
          FOREIGN KEY ("authId") REFERENCES "auths"("id")
          ON DELETE CASCADE ON UPDATE NO ACTION;
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      DECLARE
        fk_name text;
      BEGIN
        SELECT c.conname INTO fk_name
        FROM pg_constraint c
        JOIN pg_attribute a
          ON a.attrelid = c.conrelid
         AND a.attnum = ANY(c.conkey)
        WHERE c.conrelid = 'company_profiles'::regclass
          AND c.contype = 'f'
          AND a.attname = 'authId'
        LIMIT 1;

        IF fk_name IS NOT NULL THEN
          EXECUTE format('ALTER TABLE "company_profiles" DROP CONSTRAINT %I', fk_name);
        END IF;

        ALTER TABLE "company_profiles"
          ADD CONSTRAINT "FK_company_profiles_authId_no_cascade"
          FOREIGN KEY ("authId") REFERENCES "auths"("id")
          ON DELETE NO ACTION ON UPDATE NO ACTION;
      END $$;
    `);

    await queryRunner.query(`
      DO $$
      DECLARE
        fk_name text;
      BEGIN
        SELECT c.conname INTO fk_name
        FROM pg_constraint c
        JOIN pg_attribute a
          ON a.attrelid = c.conrelid
         AND a.attnum = ANY(c.conkey)
        WHERE c.conrelid = 'candidate_profiles'::regclass
          AND c.contype = 'f'
          AND a.attname = 'authId'
        LIMIT 1;

        IF fk_name IS NOT NULL THEN
          EXECUTE format('ALTER TABLE "candidate_profiles" DROP CONSTRAINT %I', fk_name);
        END IF;

        ALTER TABLE "candidate_profiles"
          ADD CONSTRAINT "FK_candidate_profiles_authId_no_cascade"
          FOREIGN KEY ("authId") REFERENCES "auths"("id")
          ON DELETE NO ACTION ON UPDATE NO ACTION;
      END $$;
    `);

    await queryRunner.query('DROP TABLE IF EXISTS "applications"');
    await queryRunner.query('DROP TABLE IF EXISTS "vacancy_skills"');
    await queryRunner.query('DROP TABLE IF EXISTS "vacancies"');
    await queryRunner.query('DROP TABLE IF EXISTS "skills"');

    await queryRunner.query('DROP TYPE IF EXISTS "application_status_enum"');
    await queryRunner.query('DROP TYPE IF EXISTS "vacancy_status_enum"');
    await queryRunner.query('DROP TYPE IF EXISTS "experience_level_enum"');
  }
}
