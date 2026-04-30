import { CompanyCandidateResume } from '@domain/entities/company/company-candidate-resume';
import { CompanyVacancyItem } from '@domain/entities/company/company-vacancy-item';
import { CandidateResumeEducationEntity } from '@infrastructure/entities/candidate-resume-education.entity';
import { CandidateResumeEntity } from '@infrastructure/entities/candidate-resume.entity';
import { CandidateResumeExperienceEntity } from '@infrastructure/entities/candidate-resume-experience.entity';
import { VacancyEntity } from '@infrastructure/entities/vacancy.entity';

export class CompanyRepositoryMapper {
  static toVacancy(vacancy: VacancyEntity): CompanyVacancyItem {
    return {
      id: vacancy.id,
      position: vacancy.position,
      companyName: vacancy.companyProfile?.companyName ?? '',
      location: vacancy.location,
      salary: vacancy.salary ?? null,
      requirements: vacancy.requirements,
      experienceLevel: vacancy.experienceLevel,
      status: vacancy.status,
      publishedAt: vacancy.publishedAt
        ? vacancy.publishedAt.toISOString()
        : null,
      createdAt: vacancy.createdAt.toISOString(),
      skills: (vacancy.skills ?? []).map((skill) => ({
        id: skill.id,
        name: skill.name,
      })),
    };
  }

  static toCandidateResume(
    resume: CandidateResumeEntity,
  ): CompanyCandidateResume {
    const candidate = resume.candidateProfile;

    return {
      candidateProfileId: candidate.id,
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      email: candidate.auth.email,
      phone: candidate.phone,
      profession: resume.profession,
      location: resume.location,
      expectedSalary: resume.expectedSalary,
      about: resume.about,
      resumePdfUrl: resume.resumePdfUrl,
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
      skills: (resume.skills ?? []).map((skill) => ({
        id: skill.id,
        name: skill.name,
      })),
    };
  }

  static getFirstExperience(
    items?: CandidateResumeExperienceEntity[],
  ): CandidateResumeExperienceEntity | null {
    const sorted = this.sortExperiences(items);
    return sorted[0] ?? null;
  }

  static getFirstEducation(
    items?: CandidateResumeEducationEntity[],
  ): CandidateResumeEducationEntity | null {
    const sorted = this.sortEducations(items);
    return sorted[0] ?? null;
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
