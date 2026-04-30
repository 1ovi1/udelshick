import { CandidateResumeEducationItem } from './candidate-resume-education-item.interface';
import { CandidateResumeExperienceItem } from './candidate-resume-experience-item.interface';
import { CandidateSkillItem } from './candidate-skill-item.interface';

export interface CandidateResume {
  id: string;
  candidateProfileId: string;
  profession: string;
  location: string;
  expectedSalary: number | null;
  about: string | null;
  resumePdfUrl: string | null;
  skills: CandidateSkillItem[];
  experiences: CandidateResumeExperienceItem[];
  educations: CandidateResumeEducationItem[];
}
