import { ExperienceLevel } from '@domain/entities/enums/experience-level.enum';

export interface CreateCompanyVacancyData {
  position: string;
  location: string;
  salary: number | null;
  requirements: string;
  experienceLevel: ExperienceLevel;
  skillIds: string[];
}
