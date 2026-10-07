import { ExperienceLevel } from '@domain/entities/enums/experience-level.enum';

export interface CandidateVacancyListItem {
  id: string;
  position: string;
  salary: number | null;
  experienceLevel: ExperienceLevel;
  companyName: string;
  location: string;
  matchingSkillsPercent: number;
}
