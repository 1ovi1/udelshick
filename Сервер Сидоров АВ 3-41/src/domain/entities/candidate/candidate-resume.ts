import { CandidateResumeEducationItem } from './candidate-resume-education-item';
import { CandidateResumeExperienceItem } from './candidate-resume-experience-item';
import { CandidateSkillItem } from './candidate-skill-item';

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
