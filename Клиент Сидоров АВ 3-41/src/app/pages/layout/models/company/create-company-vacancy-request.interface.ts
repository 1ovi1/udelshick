import { ExperienceLevel } from './experience-level.type';

export interface CreateCompanyVacancyRequest {
  position: string;
  location: string;
  salary?: number;
  requirements: string;
  experienceLevel: ExperienceLevel;
  skillIds: string[];
}
