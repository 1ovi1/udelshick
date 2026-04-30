import { ICandidateRepository } from '@domain/interfaces/repositories/candidate-repository.interface';
import { ApplyCandidateVacancyData } from '@domain/interfaces/repositories/candidate/apply-candidate-vacancy-data.interface';
import { UpsertCandidateResumeData } from '@domain/interfaces/repositories/candidate/upsert-candidate-resume-data.interface';
import { CandidateSkillItem } from '@domain/entities/candidate/candidate-skill-item';
import { CandidateVacancyListItem } from '@domain/entities/candidate/candidate-vacancy-list-item';
import { PaginatedResult } from '@domain/entities/common/paginated-result';
import { PaginationQuery } from '@domain/entities/common/pagination-query';
import { VacancyStatus } from '@domain/entities/enums/vacancy-status.enum';
import { CandidateVacancyDetails } from '@domain/entities/candidate/candidate-vacancy-details';
import { ApplicationStatus } from '@domain/entities/enums/application-status.enum';
import { CandidateResume } from '@domain/entities/candidate/candidate-resume';
import { CandidateApplicationItem } from '@domain/entities/candidate/candidate-application-item';
import { PaginationMeta } from '@domain/entities/common/pagination-meta';
import { CandidateDomainService } from '@domain/services/candidate-domain.service';
import { CandidateProfileEntity } from '@infrastructure/entities/candidate-profile.entity';
import { SkillEntity } from '@infrastructure/entities/skill.entity';
import { VacancyEntity } from '@infrastructure/entities/vacancy.entity';
import { ApplicationEntity } from '@infrastructure/entities/application.entity';
import { CandidateResumeEntity } from '@infrastructure/entities/candidate-resume.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { CandidateResumeExperienceEntity } from '@infrastructure/entities/candidate-resume-experience.entity';
import { CandidateResumeEducationEntity } from '@infrastructure/entities/candidate-resume-education.entity';
import { CandidateRepositoryMapper } from './mappers/candidate-repository.mapper';

interface VacancyRankingRow {
  vacancyId: string;
  matchingSkillsCount: string;
  vacancySkillsCount: string;
}

@Injectable()
export class CandidateRepository implements ICandidateRepository {
  constructor(
    @InjectRepository(CandidateProfileEntity)
    private readonly candidateProfileRepository: Repository<CandidateProfileEntity>,
    @InjectRepository(SkillEntity)
    private readonly skillRepository: Repository<SkillEntity>,
    @InjectRepository(VacancyEntity)
    private readonly vacancyRepository: Repository<VacancyEntity>,
    @InjectRepository(ApplicationEntity)
    private readonly applicationRepository: Repository<ApplicationEntity>,
    @InjectRepository(CandidateResumeEntity)
    private readonly candidateResumeRepository: Repository<CandidateResumeEntity>,
    @InjectRepository(CandidateResumeExperienceEntity)
    private readonly experienceRepository: Repository<CandidateResumeExperienceEntity>,
    @InjectRepository(CandidateResumeEducationEntity)
    private readonly educationRepository: Repository<CandidateResumeEducationEntity>,
    private readonly candidateDomainService: CandidateDomainService,
  ) {}

  async listSkills(): Promise<CandidateSkillItem[]> {
    const skills = await this.skillRepository.find({
      order: { name: 'ASC' },
    });

    return skills.map((skill) => ({
      id: skill.id,
      name: skill.name,
    }));
  }

  async getRecommendedVacancies(
    authId: string,
    query: PaginationQuery,
  ): Promise<PaginatedResult<CandidateVacancyListItem>> {
    const candidate = await this.findCandidateByAuthId(authId);
    const candidateSkillIds = await this.getCandidateSkillIds(candidate.id);
    const offset = (query.page - 1) * query.limit;

    const total = await this.vacancyRepository.count({
      where: {
        status: VacancyStatus.PUBLISHED,
      },
    });

    const rankingQuery = this.vacancyRepository
      .createQueryBuilder('vacancy')
      .leftJoin('vacancy.skills', 'skill')
      .where('vacancy.status = :status', {
        status: VacancyStatus.PUBLISHED,
      })
      .select('vacancy.id', 'vacancyId')
      .addSelect(
        candidateSkillIds.length > 0
          ? 'COUNT(CASE WHEN skill.id IN (:...candidateSkillIds) THEN 1 END)'
          : '0',
        'matchingSkillsCount',
      )
      .addSelect('COUNT(skill.id)', 'vacancySkillsCount')
      .groupBy('vacancy.id')
      .orderBy('"matchingSkillsCount"', 'DESC')
      .addOrderBy('vacancy.publishedAt', 'DESC')
      .addOrderBy('vacancy.createdAt', 'DESC')
      .skip(offset)
      .take(query.limit);

    if (candidateSkillIds.length > 0) {
      rankingQuery.setParameter('candidateSkillIds', candidateSkillIds);
    }

    const rankingRows = await rankingQuery.getRawMany<VacancyRankingRow>();
    const vacancyIds = rankingRows.map((row) => row.vacancyId);

    if (vacancyIds.length === 0) {
      return {
        items: [],
        meta: this.buildMeta(query.page, query.limit, total),
      };
    }

    const vacancies = await this.vacancyRepository.find({
      where: {
        id: In(vacancyIds),
      },
      relations: {
        companyProfile: true,
        skills: true,
      },
    });

    const vacancyMap = new Map<string, VacancyEntity>();
    for (const vacancy of vacancies) {
      vacancyMap.set(vacancy.id, vacancy);
    }

    const rankingMap = new Map<string, VacancyRankingRow>();
    for (const row of rankingRows) {
      rankingMap.set(row.vacancyId, row);
    }

    const items: CandidateVacancyListItem[] = [];

    for (const vacancyId of vacancyIds) {
      const vacancy = vacancyMap.get(vacancyId);
      const ranking = rankingMap.get(vacancyId);

      if (!vacancy || !ranking) {
        continue;
      }

      const matchingSkillsCount = Number(ranking.matchingSkillsCount);
      const vacancySkillsCount = Number(ranking.vacancySkillsCount);

      items.push({
        id: vacancy.id,
        position: vacancy.position,
        salary: vacancy.salary ?? null,
        experienceLevel: vacancy.experienceLevel,
        companyName: vacancy.companyProfile.companyName,
        location: vacancy.location,
        matchingSkillsPercent:
          this.candidateDomainService.computeMatchingPercent(
            matchingSkillsCount,
            vacancySkillsCount,
          ),
      });
    }

    return {
      items,
      meta: this.buildMeta(query.page, query.limit, total),
    };
  }

  async getVacancyDetails(
    authId: string,
    vacancyId: string,
  ): Promise<CandidateVacancyDetails> {
    const candidate = await this.findCandidateByAuthId(authId);
    const candidateSkillIds = await this.getCandidateSkillIds(candidate.id);

    const vacancy = await this.vacancyRepository.findOne({
      where: {
        id: vacancyId,
        status: VacancyStatus.PUBLISHED,
      },
      relations: {
        companyProfile: true,
        skills: true,
      },
    });

    if (!vacancy) {
      throw new NotFoundException('Вакансия не найдена');
    }

    const hasApplied = await this.applicationRepository.exist({
      where: {
        candidateProfileId: candidate.id,
        vacancyId: vacancy.id,
        status: In([
          ...this.candidateDomainService.getActiveApplicationStatuses(),
        ]),
      },
    });

    const vacancySkills = vacancy.skills ?? [];
    const matchingSkillsCount = this.candidateDomainService.countMatchingSkills(
      vacancySkills.map((item) => item.id),
      candidateSkillIds,
    );

    return {
      id: vacancy.id,
      position: vacancy.position,
      salary: vacancy.salary ?? null,
      experienceLevel: vacancy.experienceLevel,
      companyName: vacancy.companyProfile.companyName,
      location: vacancy.location,
      requirements: vacancy.requirements,
      matchingSkillsPercent: this.candidateDomainService.computeMatchingPercent(
        matchingSkillsCount,
        vacancySkills.length,
      ),
      hasApplied,
      publishedAt: vacancy.publishedAt
        ? vacancy.publishedAt.toISOString()
        : null,
      skills: vacancySkills.map((skill) => ({
        id: skill.id,
        name: skill.name,
      })),
    };
  }

  async applyToVacancy(
    authId: string,
    vacancyId: string,
    data: ApplyCandidateVacancyData,
  ): Promise<void> {
    const candidate = await this.findCandidateByAuthId(authId);

    const vacancy = await this.vacancyRepository.findOne({
      where: {
        id: vacancyId,
        status: VacancyStatus.PUBLISHED,
      },
    });

    if (!vacancy) {
      throw new NotFoundException('Вакансия не найдена');
    }

    const resume = await this.candidateResumeRepository.findOne({
      where: { candidateProfileId: candidate.id },
    });

    if (!resume) {
      throw new BadRequestException('Сначала заполните резюме');
    }

    const existingApplication = await this.applicationRepository.findOne({
      where: {
        candidateProfileId: candidate.id,
        vacancyId,
      },
    });

    if (existingApplication) {
      try {
        this.candidateDomainService.validateCanApply(
          existingApplication.status,
        );
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : 'Невозможно откликнуться на вакансию';
        throw new BadRequestException(message);
      }

      existingApplication.status =
        this.candidateDomainService.getAppliedStatus();
      existingApplication.coverLetter = data.coverLetter;
      existingApplication.resumePdfUrl = resume.resumePdfUrl;

      await this.applicationRepository.save(existingApplication);
      return;
    }

    const application = this.applicationRepository.create({
      id: `application-${randomUUID()}`,
      candidateProfileId: candidate.id,
      vacancyId,
      coverLetter: data.coverLetter,
      status: this.candidateDomainService.getAppliedStatus(),
      resumePdfUrl: resume.resumePdfUrl,
    });

    await this.applicationRepository.save(application);
  }

  async getOwnResume(authId: string): Promise<CandidateResume | null> {
    const candidate = await this.findCandidateByAuthId(authId);

    const resume = await this.candidateResumeRepository.findOne({
      where: {
        candidateProfileId: candidate.id,
      },
      relations: {
        skills: true,
        experiences: true,
        educations: true,
      },
    });

    if (!resume) {
      return null;
    }

    return CandidateRepositoryMapper.toResume(resume);
  }

  async upsertOwnResume(
    authId: string,
    data: UpsertCandidateResumeData,
  ): Promise<CandidateResume> {
    const candidate = await this.findCandidateByAuthId(authId);
    const skills = await this.getSkillsByIds(data.skillIds);

    const existingResume = await this.candidateResumeRepository.findOne({
      where: {
        candidateProfileId: candidate.id,
      },
    });

    const resumeId = existingResume?.id ?? `resume-${randomUUID()}`;

    await this.candidateResumeRepository.manager.transaction(
      async (manager) => {
        const resumeRepository = manager.getRepository(CandidateResumeEntity);
        const experienceRepository = manager.getRepository(
          CandidateResumeExperienceEntity,
        );
        const educationRepository = manager.getRepository(
          CandidateResumeEducationEntity,
        );

        const resumeToSave = resumeRepository.create({
          id: resumeId,
          candidateProfileId: candidate.id,
          profession: data.profession,
          location: data.location,
          expectedSalary: data.expectedSalary,
          about: data.about,
          resumePdfUrl: data.resumePdfUrl,
          skills,
        });

        await resumeRepository.save(resumeToSave);

        await experienceRepository.delete({ resumeId });
        await educationRepository.delete({ resumeId });

        if (data.experiences.length > 0) {
          const experiences = data.experiences.map((item, index) =>
            experienceRepository.create({
              id: `resume-exp-${randomUUID()}`,
              resumeId,
              companyName: item.companyName,
              position: item.position,
              period: item.period,
              description: item.description,
              orderIndex: this.candidateDomainService.normalizeOrderIndex(
                item.orderIndex,
                index,
              ),
            }),
          );

          await experienceRepository.save(experiences);
        }

        if (data.educations.length > 0) {
          const educations = data.educations.map((item, index) =>
            educationRepository.create({
              id: `resume-edu-${randomUUID()}`,
              resumeId,
              institutionName: item.institutionName,
              studyPeriod: item.studyPeriod,
              degree: item.degree,
              specialization: item.specialization,
              orderIndex: this.candidateDomainService.normalizeOrderIndex(
                item.orderIndex,
                index,
              ),
            }),
          );

          await educationRepository.save(educations);
        }
      },
    );

    const savedResume = await this.findResumeByCandidateProfileId(candidate.id);
    return CandidateRepositoryMapper.toResume(savedResume);
  }

  async getOwnApplications(
    authId: string,
    query: PaginationQuery,
    status?: ApplicationStatus,
  ): Promise<PaginatedResult<CandidateApplicationItem>> {
    const candidate = await this.findCandidateByAuthId(authId);
    const offset = (query.page - 1) * query.limit;

    const whereCondition: {
      candidateProfileId: string;
      status?: ApplicationStatus;
    } = {
      candidateProfileId: candidate.id,
    };

    if (status !== undefined) {
      whereCondition.status = status;
    }

    const [applications, total] = await this.applicationRepository.findAndCount(
      {
        where: whereCondition,
        relations: {
          vacancy: {
            companyProfile: true,
          },
        },
        order: {
          createdAt: 'DESC',
        },
        skip: offset,
        take: query.limit,
      },
    );

    const items: CandidateApplicationItem[] = applications.map((item) => ({
      applicationId: item.id,
      vacancyId: item.vacancyId,
      vacancyPosition: item.vacancy.position,
      companyName: item.vacancy.companyProfile.companyName,
      appliedAt: item.createdAt.toISOString(),
      status: item.status,
    }));

    return {
      items,
      meta: this.buildMeta(query.page, query.limit, total),
    };
  }

  async deleteOwnApplication(
    authId: string,
    applicationId: string,
  ): Promise<void> {
    const candidate = await this.findCandidateByAuthId(authId);

    const application = await this.applicationRepository.findOne({
      where: {
        id: applicationId,
        candidateProfileId: candidate.id,
      },
    });

    if (!application) {
      throw new NotFoundException('Отклик не найден');
    }

    if (
      application.status === this.candidateDomainService.getWithdrawnStatus()
    ) {
      return;
    }

    application.status = this.candidateDomainService.getWithdrawnStatus();
    await this.applicationRepository.save(application);
  }

  private async findCandidateByAuthId(
    authId: string,
  ): Promise<CandidateProfileEntity> {
    const candidate = await this.candidateProfileRepository.findOne({
      where: { authId },
    });

    if (!candidate) {
      throw new NotFoundException('Профиль кандидата не найден');
    }

    return candidate;
  }

  private async getSkillsByIds(skillIds: string[]): Promise<SkillEntity[]> {
    if (skillIds.length === 0) {
      return [];
    }

    const uniqueSkillIds = [...new Set(skillIds)];
    const skills = await this.skillRepository.findBy({
      id: In(uniqueSkillIds),
    });

    if (skills.length !== uniqueSkillIds.length) {
      throw new BadRequestException('Часть навыков не найдена');
    }

    return skills;
  }

  private async findResumeByCandidateProfileId(
    candidateProfileId: string,
  ): Promise<CandidateResumeEntity> {
    const resume = await this.candidateResumeRepository.findOne({
      where: { candidateProfileId },
      relations: {
        skills: true,
        experiences: true,
        educations: true,
      },
    });

    if (!resume) {
      throw new NotFoundException('Резюме не найдено');
    }

    return resume;
  }

  private async getCandidateSkillIds(
    candidateProfileId: string,
  ): Promise<string[]> {
    const resume = await this.candidateResumeRepository.findOne({
      where: { candidateProfileId },
      relations: {
        skills: true,
      },
    });

    if (!resume) {
      return [];
    }

    return (resume.skills ?? []).map((skill) => skill.id);
  }

  private buildMeta(
    page: number,
    limit: number,
    total: number,
  ): PaginationMeta {
    const totalPages = Math.max(1, Math.ceil(total / limit));

    return {
      page,
      limit,
      total,
      totalPages,
    };
  }
}
