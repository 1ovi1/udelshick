import { DataSource } from 'typeorm';

const TRUNCATE_TABLES = [
  'applications',
  'vacancy_skills',
  'vacancies',
  'candidate_resume_skills',
  'candidate_resume_experiences',
  'candidate_resume_educations',
  'candidate_resumes',
  'skills',
  'candidate_profiles',
  'company_profiles',
];

export async function resetDatabase(dataSource: DataSource): Promise<void> {
  await dataSource.query(
    `TRUNCATE TABLE ${TRUNCATE_TABLES.map((table) => `"${table}"`).join(
      ', ',
    )} RESTART IDENTITY CASCADE`,
  );

  await dataSource.query(`DELETE FROM auths WHERE role <> $1`, ['admin']);
}
