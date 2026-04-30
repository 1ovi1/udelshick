import { ExperienceLevel } from './experience-level.type';

export interface CandidateVacancyItem {
  id: string;
  position: string;
  salary: number | null;
  experienceLevel: ExperienceLevel;
  companyName: string;
  location: string;
  matchingSkillsPercent: number;
}
