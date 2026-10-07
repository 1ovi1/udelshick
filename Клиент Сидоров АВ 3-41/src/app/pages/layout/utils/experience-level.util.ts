import { ExperienceLevel } from '../models/company/experience-level.type';

const EXPERIENCE_LABELS: Readonly<Record<ExperienceLevel, string>> = {
  no_experience: 'Без опыта',
  junior: 'Junior',
  middle: 'Middle',
  senior: 'Senior',
  lead: 'Lead',
};

export function toExperienceLevelLabel(level: ExperienceLevel): string {
  return EXPERIENCE_LABELS[level] ?? level;
}
