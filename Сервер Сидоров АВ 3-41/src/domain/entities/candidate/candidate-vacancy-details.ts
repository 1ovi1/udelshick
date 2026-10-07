import { ExperienceLevel } from '@domain/entities/enums/experience-level.enum';
import { CandidateSkillItem } from './candidate-skill-item';

export interface CandidateVacancyDetails {
  id: string;
  position: string;
  salary: number | null;
  experienceLevel: ExperienceLevel;
  companyName: string;
  location: string;
  requirements: string;
  matchingSkillsPercent: number;
  hasApplied: boolean;
  publishedAt: string | null;
  skills: CandidateSkillItem[];
}
