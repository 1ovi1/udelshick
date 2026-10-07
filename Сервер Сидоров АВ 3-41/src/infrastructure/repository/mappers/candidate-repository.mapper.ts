import { CandidateResume } from '@domain/entities/candidate/candidate-resume';
import { CandidateResumeEducationEntity } from '@infrastructure/entities/candidate-resume-education.entity';
import { CandidateResumeEntity } from '@infrastructure/entities/candidate-resume.entity';
import { CandidateResumeExperienceEntity } from '@infrastructure/entities/candidate-resume-experience.entity';

export class CandidateRepositoryMapper {
  static toResume(resume: CandidateResumeEntity): CandidateResume {
    return {
      id: resume.id,
      candidateProfileId: resume.candidateProfileId,
      profession: resume.profession,
      location: resume.location,
      expectedSalary: resume.expectedSalary,
      about: resume.about,
      resumePdfUrl: resume.resumePdfUrl,
      skills: (resume.skills ?? []).map((skill) => ({
        id: skill.id,
        name: skill.name,
      })),
      experiences: this.sortExperiences(resume.experiences).map((item) => ({
        id: item.id,
        companyName: item.companyName,
        position: item.position,
        period: item.period,
        description: item.description,
        orderIndex: item.orderIndex,
      })),
      educations: this.sortEducations(resume.educations).map((item) => ({
        id: item.id,
        institutionName: item.institutionName,
        studyPeriod: item.studyPeriod,
        degree: item.degree,
        specialization: item.specialization,
        orderIndex: item.orderIndex,
      })),
    };
  }

  private static sortExperiences(
    items?: CandidateResumeExperienceEntity[],
  ): CandidateResumeExperienceEntity[] {
    if (!items) {
      return [];
    }

    return [...items].sort((a, b) => a.orderIndex - b.orderIndex);
  }

  private static sortEducations(
    items?: CandidateResumeEducationEntity[],
  ): CandidateResumeEducationEntity[] {
    if (!items) {
      return [];
    }

    return [...items].sort((a, b) => a.orderIndex - b.orderIndex);
  }
}
