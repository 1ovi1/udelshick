import { CandidateApplicationTab } from '../../../models/candidate/candidate-application-tab.type';

export interface CandidateApplicationTabView {
  key: CandidateApplicationTab;
  title: string;
}

export const CANDIDATE_APPLICATION_TABS: readonly CandidateApplicationTabView[] = [
  { key: 'all', title: 'Все' },
  { key: 'new', title: 'Отправленные' },
  { key: 'invited', title: 'Приглашение' },
  { key: 'rejected', title: 'Отказ' },
  { key: 'withdrawn', title: 'Удаленные' },
];
