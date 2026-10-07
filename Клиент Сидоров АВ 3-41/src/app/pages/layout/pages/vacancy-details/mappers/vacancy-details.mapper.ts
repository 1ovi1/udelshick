import { AdminVacancyDetails } from '../../../models/admin/admin-vacancy-details.interface';
import { CompanyVacancyItem } from '../../../models/company/company-vacancy-item.interface';
import { CandidateSkillItem } from '../../../models/candidate/candidate-skill-item.interface';
import { CandidateVacancyDetails } from '../../../models/candidate/candidate-vacancy-details.interface';
import { toCandidateExperienceLevelLabel } from '../../../utils/candidate-experience-level.util';

export interface VacancyDetailsViewModel {
  id: string;
  position: string;
  companyName: string;
  location: string;
  salary: number | null;
  experienceLevel: string;
  requirements: string | null;
  matchingSkillsPercent: number | null;
  hasApplied: boolean | null;
  publishedAt: string | null;
  skills: CandidateSkillItem[];
  statusLabel: string | null;
}

export class VacancyDetailsMapper {
  static fromCandidate(vacancy: CandidateVacancyDetails): VacancyDetailsViewModel {
    return {
      id: vacancy.id,
      position: vacancy.position,
      companyName: vacancy.companyName,
      location: vacancy.location,
      salary: vacancy.salary,
      experienceLevel: toCandidateExperienceLevelLabel(vacancy.experienceLevel),
      requirements: vacancy.requirements,
      matchingSkillsPercent: vacancy.matchingSkillsPercent,
      hasApplied: vacancy.hasApplied,
      publishedAt: vacancy.publishedAt,
      skills: vacancy.skills,
      statusLabel: null,
    };
  }

  static fromCompany(vacancy: CompanyVacancyItem): VacancyDetailsViewModel {
    return {
      id: vacancy.id,
      position: vacancy.position,
      companyName: vacancy.companyName,
      location: vacancy.location,
      salary: vacancy.salary,
      experienceLevel: toCandidateExperienceLevelLabel(vacancy.experienceLevel),
      requirements: vacancy.requirements,
      matchingSkillsPercent: null,
      hasApplied: null,
      publishedAt: vacancy.publishedAt,
      skills: vacancy.skills,
      statusLabel: this.toVacancyStatusLabel(vacancy.status),
    };
  }

  static fromAdmin(vacancy: AdminVacancyDetails): VacancyDetailsViewModel {
    return {
      id: vacancy.id,
      position: vacancy.position,
      companyName: vacancy.companyName,
      location: vacancy.location,
      salary: vacancy.salary,
      experienceLevel: toCandidateExperienceLevelLabel(vacancy.experienceLevel),
      requirements: vacancy.requirements,
      matchingSkillsPercent: null,
      hasApplied: null,
      publishedAt: vacancy.publishedAt,
      skills: vacancy.skills,
      statusLabel: this.toVacancyStatusLabel(vacancy.status),
    };
  }

  private static toVacancyStatusLabel(status: 'pending_review' | 'published' | 'archived'): string {
    if (status === 'published') {
      return 'Опубликована';
    }

    if (status === 'pending_review') {
      return 'На рассмотрении';
    }

    return 'В архиве';
  }
}
