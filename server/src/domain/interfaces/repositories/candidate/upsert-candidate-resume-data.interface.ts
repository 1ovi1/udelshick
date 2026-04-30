import { CandidateResumeEducationData } from './candidate-resume-education-data.interface';
import { CandidateResumeExperienceData } from './candidate-resume-experience-data.interface';

export interface UpsertCandidateResumeData {
  profession: string;
  location: string;
  expectedSalary: number | null;
  about: string | null;
  resumePdfUrl: string | null;
  skillIds: string[];
  experiences: CandidateResumeExperienceData[];
  educations: CandidateResumeEducationData[];
}
