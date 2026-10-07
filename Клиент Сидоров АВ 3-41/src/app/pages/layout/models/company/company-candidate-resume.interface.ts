import { CompanyResumeEducationItem } from './company-resume-education-item.interface';
import { CompanyResumeExperienceItem } from './company-resume-experience-item.interface';
import { CompanySkillItem } from './company-skill-item.interface';

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
