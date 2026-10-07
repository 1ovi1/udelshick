import { CompanyResumeEducationItem } from './company-resume-education-item';
import { CompanyResumeExperienceItem } from './company-resume-experience-item';
import { CompanySkillItem } from './company-skill-item';

export interface CompanyCandidateResume {
  candidateProfileId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profession: string;
  location: string;
  expectedSalary: number | null;
  about: string | null;
  resumePdfUrl: string | null;
  experiences: CompanyResumeExperienceItem[];
  educations: CompanyResumeEducationItem[];
  skills: CompanySkillItem[];
}
