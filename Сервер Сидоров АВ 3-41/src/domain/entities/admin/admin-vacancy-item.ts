import { VacancyStatus } from '@domain/entities/enums/vacancy-status.enum';

export interface AdminVacancyItem {
  id: string;
  position: string;
  companyName: string;
  publishedAt: string | null;
  status: VacancyStatus;
}
