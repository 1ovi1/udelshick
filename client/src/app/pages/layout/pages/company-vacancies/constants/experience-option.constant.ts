import { ExperienceLevel } from '../../../models/company/experience-level.type';

export interface ExperienceOption {
  value: ExperienceLevel;
  label: string;
}

export const COMPANY_EXPERIENCE_OPTIONS: readonly ExperienceOption[] = [
  { value: 'no_experience', label: 'Без опыта' },
  { value: 'junior', label: 'Junior' },
  { value: 'middle', label: 'Middle' },
  { value: 'senior', label: 'Senior' },
  { value: 'lead', label: 'Lead' },
];
