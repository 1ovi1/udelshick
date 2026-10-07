import { ApplicationStatus } from '@domain/entities/enums/application-status.enum';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CandidateDomainService {
  getActiveApplicationStatuses(): ApplicationStatus[] {
    return [
      ApplicationStatus.NEW,
      ApplicationStatus.VIEWED,
      ApplicationStatus.INVITED,
      ApplicationStatus.REJECTED,
      ApplicationStatus.ACCEPTED,
    ];
  }

  validateCanApply(existingStatus?: ApplicationStatus): void {
    if (existingStatus && existingStatus !== ApplicationStatus.WITHDRAWN) {
      throw new Error('Вы уже откликнулись на эту вакансию');
    }
  }

  getAppliedStatus(): ApplicationStatus {
    return ApplicationStatus.NEW;
  }

  getWithdrawnStatus(): ApplicationStatus {
    return ApplicationStatus.WITHDRAWN;
  }

  countMatchingSkills(
    vacancySkillIds: string[],
    candidateSkillIds: string[],
  ): number {
    if (vacancySkillIds.length === 0 || candidateSkillIds.length === 0) {
      return 0;
    }

    const candidateSkillSet = new Set(candidateSkillIds);
    let count = 0;

    for (const skillId of vacancySkillIds) {
      if (candidateSkillSet.has(skillId)) {
        count += 1;
      }
    }

    return count;
  }

  computeMatchingPercent(
    matchingSkillsCount: number,
    totalVacancySkills: number,
  ): number {
    if (totalVacancySkills === 0) {
      return 0;
    }

    return Math.round((matchingSkillsCount / totalVacancySkills) * 100);
  }

  normalizeOrderIndex(
    orderIndex: number | undefined,
    fallback: number,
  ): number {
    return orderIndex ?? fallback;
  }
}
