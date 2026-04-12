import { CompanySkillItem } from './company-skill-item.interface';
import { ExperienceLevel } from './experience-level.type';
import { VacancyStatus } from './vacancy-status.type';

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
