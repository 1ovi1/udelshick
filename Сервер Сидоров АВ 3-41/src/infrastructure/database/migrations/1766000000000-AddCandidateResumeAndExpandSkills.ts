import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCandidateResumeAndExpandSkills1766000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "candidate_resumes" (
        "id" character varying NOT NULL,
        "candidateProfileId" character varying NOT NULL,
        "profession" character varying NOT NULL,
        "location" character varying NOT NULL,
        "expectedSalary" integer,
        "about" text,
        "resumePdfUrl" character varying,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_candidate_resumes_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_candidate_resumes_candidateProfileId" UNIQUE ("candidateProfileId"),
        CONSTRAINT "FK_candidate_resumes_candidateProfileId" FOREIGN KEY ("candidateProfileId") REFERENCES "candidate_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "candidate_resume_experiences" (
        "id" character varying NOT NULL,
        "resumeId" character varying NOT NULL,
        "companyName" character varying NOT NULL,
        "position" character varying NOT NULL,
        "period" character varying NOT NULL,
        "description" text NOT NULL,
        "orderIndex" integer NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_candidate_resume_experiences_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_candidate_resume_experiences_resumeId" FOREIGN KEY ("resumeId") REFERENCES "candidate_resumes"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "candidate_resume_educations" (
        "id" character varying NOT NULL,
        "resumeId" character varying NOT NULL,
        "institutionName" character varying NOT NULL,
        "studyPeriod" character varying NOT NULL,
        "degree" character varying NOT NULL,
        "specialization" character varying NOT NULL,
        "orderIndex" integer NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_candidate_resume_educations_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_candidate_resume_educations_resumeId" FOREIGN KEY ("resumeId") REFERENCES "candidate_resumes"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "candidate_resume_skills" (
        "resumeId" character varying NOT NULL,
        "skillId" character varying NOT NULL,
        CONSTRAINT "PK_candidate_resume_skills" PRIMARY KEY ("resumeId", "skillId"),
        CONSTRAINT "FK_candidate_resume_skills_resume" FOREIGN KEY ("resumeId") REFERENCES "candidate_resumes"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT "FK_candidate_resume_skills_skill" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);

    await queryRunner.query(`
      INSERT INTO "skills" ("id", "name")
      VALUES
        ('skill-react', 'React'),
        ('skill-nodejs', 'Node.js'),
        ('skill-mongodb', 'MongoDB'),
        ('skill-kubernetes', 'Kubernetes'),
        ('skill-html', 'HTML'),
        ('skill-css', 'CSS'),
        ('skill-sql', 'SQL')
      ON CONFLICT DO NOTHING
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "skills"
      WHERE "id" IN (
        'skill-react',
        'skill-nodejs',
        'skill-mongodb',
        'skill-kubernetes',
        'skill-html',
        'skill-css',
        'skill-sql'
      )
    `);

    await queryRunner.query('DROP TABLE IF EXISTS "candidate_resume_skills"');
    await queryRunner.query(
      'DROP TABLE IF EXISTS "candidate_resume_educations"',
    );
    await queryRunner.query(
      'DROP TABLE IF EXISTS "candidate_resume_experiences"',
    );
    await queryRunner.query('DROP TABLE IF EXISTS "candidate_resumes"');
  }
}
