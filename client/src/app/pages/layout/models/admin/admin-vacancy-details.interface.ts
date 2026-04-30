import { CandidateSkillItem } from '../candidate/candidate-skill-item.interface';
import { ExperienceLevel } from '../candidate/experience-level.type';
import { VacancyStatus } from './vacancy-status.type';

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
  skills: CandidateSkillItem[];
}
