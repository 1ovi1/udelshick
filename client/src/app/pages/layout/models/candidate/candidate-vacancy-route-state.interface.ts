import { AdminVacancyItem } from '../admin/admin-vacancy-item.interface';
import { CompanyVacancyItem } from '../company/company-vacancy-item.interface';
import { CandidateVacancyItem } from './candidate-vacancy-item.interface';

export type VacancyPreviewItem = CandidateVacancyItem | CompanyVacancyItem | AdminVacancyItem;

export interface CandidateVacancyRouteState {
  sourceRole?: 'candidate' | 'company' | 'admin';
  vacancyPreview?: VacancyPreviewItem;
}
