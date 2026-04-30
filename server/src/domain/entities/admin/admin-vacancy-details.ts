import { ExperienceLevel } from '@domain/entities/enums/experience-level.enum';
import { VacancyStatus } from '@domain/entities/enums/vacancy-status.enum';

interface AdminVacancySkillItem {
  id: string;
  name: string;
}

export interface AdminVacancyDetails {
  id: string;
  position: string;
  companyName: string;
  location: string;
  salary: number | null;
  requirements: string;
  experienceLevel: ExperienceLevel;
  status: VacancyStatus;
  publishedAt: string | null;
  createdAt: string;
  skills: AdminVacancySkillItem[];
}
