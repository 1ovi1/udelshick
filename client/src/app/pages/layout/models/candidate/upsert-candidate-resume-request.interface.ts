export interface UpsertCandidateResumeExperienceRequest {
  companyName: string;
  position: string;
  period: string;
  description: string;
  orderIndex: number;
}

export interface UpsertCandidateResumeEducationRequest {
  institutionName: string;
  studyPeriod: string;
  degree: string;
  specialization: string;
  orderIndex: number;
}

export interface UpsertCandidateResumeRequest {
  profession: string;
  location: string;
  expectedSalary: number | null;
  about: string | null;
  skillIds: string[];
  experiences: UpsertCandidateResumeExperienceRequest[];
  educations: UpsertCandidateResumeEducationRequest[];
}
