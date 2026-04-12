import { ExperienceLevel } from '@domain/entities/enums/experience-level.enum';
import { VacancyStatus } from '@domain/entities/enums/vacancy-status.enum';
import { CompanySkillItem } from './company-skill-item';

export interface CompanyVacancyItem {
  id: string;
  position: string;
  location: string;
  salary: number | null;
  requirements: string;
  experienceLevel: ExperienceLevel;
  status: VacancyStatus;
  publishedAt: string | null;
  createdAt: string;
  skills: CompanySkillItem[];
}
