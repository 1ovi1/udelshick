import { ExperienceLevel } from '../models/candidate/experience-level.type';

const EXPERIENCE_LABELS: Readonly<Record<ExperienceLevel, string>> = {
  no_experience: 'Без опыта',
  junior: 'Junior',
  middle: 'Middle',
  senior: 'Senior',
  lead: 'Lead',
};

export function toCandidateExperienceLevelLabel(level: ExperienceLevel): string {
  return EXPERIENCE_LABELS[level] ?? level;
}
