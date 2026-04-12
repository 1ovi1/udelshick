import { VacancyStatus } from './vacancy-status.type';

export interface AdminVacancyItem {
  id: string;
  position: string;
  companyName: string;
  publishedAt: string | null;
  status: VacancyStatus;
}
