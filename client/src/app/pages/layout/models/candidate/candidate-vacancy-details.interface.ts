import { ExperienceLevel } from './experience-level.type';
import { CandidateSkillItem } from './candidate-skill-item.interface';

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
