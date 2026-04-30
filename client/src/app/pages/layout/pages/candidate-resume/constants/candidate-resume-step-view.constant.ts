import { CandidateResumeStep } from '../../../models/candidate/candidate-resume-step.type';

export interface CandidateResumeStepView {
  key: CandidateResumeStep;
  title: string;
  subtitle: string;
}

export const CANDIDATE_RESUME_STEPS: readonly CandidateResumeStepView[] = [
  {
    key: 'base',
    title: 'О себе',
    subtitle: 'Основная информация',
  },
  {
    key: 'experience',
    title: 'Опыт',
    subtitle: 'Ваш опыт работы',
  },
  {
    key: 'education',
    title: 'Образование',
    subtitle: 'Образование и курсы',
  },
  {
    key: 'skills',
    title: 'Навыки',
    subtitle: 'Soft и hard skills',
  },
  {
    key: 'review',
    title: 'Резюме',
    subtitle: 'Проверка и сохранение',
  },
];
