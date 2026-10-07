import { ICompanyRepository } from '@domain/interfaces/repositories/company-repository.interface';
import { CreateCompanyVacancyData } from '@domain/interfaces/repositories/company/create-company-vacancy-data.interface';
import { InviteCandidateData } from '@domain/interfaces/repositories/company/invite-candidate-data.interface';
import { UpdateCompanyVacancyData } from '@domain/interfaces/repositories/company/update-company-vacancy-data.interface';
import { CompanySkillItem } from '@domain/entities/company/company-skill-item';
import { CompanyVacancyItem } from '@domain/entities/company/company-vacancy-item';
import { CompanyCandidateItem } from '@domain/entities/company/company-candidate-item';
import { CompanyCandidateResume } from '@domain/entities/company/company-candidate-resume';
import { PaginatedResult } from '@domain/entities/common/paginated-result';
import { PaginationMeta } from '@domain/entities/common/pagination-meta';
import { PaginationQuery } from '@domain/entities/common/pagination-query';
import { VacancyStatus } from '@domain/entities/enums/vacancy-status.enum';
import { ApplicationStatus } from '@domain/entities/enums/application-status.enum';
import { CompanyApplicationItem } from '@domain/entities/company/company-application-item';
import { CompanyDomainService } from '@domain/services/company-domain.service';
import { CompanyProfileEntity } from '@infrastructure/entities/company-entity.profile';
import { VacancyEntity } from '@infrastructure/entities/vacancy.entity';
import { SkillEntity } from '@infrastructure/entities/skill.entity';
import { ApplicationEntity } from '@infrastructure/entities/application.entity';
import { CandidateProfileEntity } from '@infrastructure/entities/candidate-profile.entity';
import { CandidateResumeEntity } from '@infrastructure/entities/candidate-resume.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { In, Repository } from 'typeorm';
import { CompanyRepositoryMapper } from './mappers/company-repository.mapper';

@Injectable()
export class CompanyRepository implements ICompanyRepository {
  constructor(
    @InjectRepository(CompanyProfileEntity)
    private readonly companyProfileRepository: Repository<CompanyProfileEntity>,
    @InjectRepository(VacancyEntity)
    private readonly vacancyRepository: Repository<VacancyEntity>,
    @InjectRepository(SkillEntity)
    private readonly skillRepository: Repository<SkillEntity>,
    @InjectRepository(ApplicationEntity)
    private readonly applicationRepository: Repository<ApplicationEntity>,
    @InjectRepository(CandidateProfileEntity)
    private readonly candidateProfileRepository: Repository<CandidateProfileEntity>,
    @InjectRepository(CandidateResumeEntity)
    private readonly candidateResumeRepository: Repository<CandidateResumeEntity>,
    private readonly companyDomainService: CompanyDomainService,
  ) {}

  async listSkills(): Promise<CompanySkillItem[]> {
    const skills = await this.skillRepository.find({
      order: { name: 'ASC' },
    });

    return skills.map((skill) => ({
      id: skill.id,
      name: skill.name,
    }));
  }

  async createVacancy(
    authId: string,
    data: CreateCompanyVacancyData,
  ): Promise<CompanyVacancyItem> {
    const company = await this.findCompanyByAuthId(authId);
    const skills = await this.getSkillsByIds(data.skillIds);

    const vacancy = this.vacancyRepository.create({
      id: `vacancy-${randomUUID()}`,
      companyProfileId: company.id,
      position: data.position,
      location: data.location,
      salary: data.salary ?? null,
      requirements: data.requirements,
      experienceLevel: data.experienceLevel,
      status: this.companyDomainService.getInitialVacancyStatus(),
      publishedAt: undefined,
      skills,
    });

    const saved = await this.vacancyRepository.save(vacancy);
    const savedWithRelations = await this.findCompanyVacancy(
      company.id,
      saved.id,
    );

    return CompanyRepositoryMapper.toVacancy(savedWithRelations);
  }

  async updateVacancy(
    authId: string,
    vacancyId: string,
    data: UpdateCompanyVacancyData,
  ): Promise<CompanyVacancyItem> {
    const company = await this.findCompanyByAuthId(authId);
    const vacancy = await this.findCompanyVacancy(company.id, vacancyId);

    if (data.position !== undefined) {
      vacancy.position = data.position;
    }

    if (data.location !== undefined) {
      vacancy.location = data.location;
    }

    if (data.salary !== undefined) {
      vacancy.salary = data.salary;
    }

    if (data.requirements !== undefined) {
      vacancy.requirements = data.requirements;
    }

    if (data.experienceLevel !== undefined) {
      vacancy.experienceLevel = data.experienceLevel;
    }

    if (data.skillIds !== undefined) {
      vacancy.skills = await this.getSkillsByIds(data.skillIds);
    }

    const statusAfterUpdate =
      this.companyDomainService.getStatusAfterVacancyUpdate(vacancy.status);
    vacancy.status = statusAfterUpdate.status;

    if (statusAfterUpdate.resetPublishedAt) {
      vacancy.publishedAt = undefined;
    }

    const saved = await this.vacancyRepository.save(vacancy);
    const savedWithRelations = await this.findCompanyVacancy(
      company.id,
      saved.id,
    );

    return CompanyRepositoryMapper.toVacancy(savedWithRelations);
  }

  async publishVacancyForReview(
    authId: string,
    vacancyId: string,
  ): Promise<void> {
    const company = await this.findCompanyByAuthId(authId);
    const vacancy = await this.findCompanyVacancy(company.id, vacancyId);

    vacancy.status = this.companyDomainService.getReviewStatus();
    vacancy.publishedAt = undefined;

    await this.vacancyRepository.save(vacancy);
  }

  async archiveVacancy(authId: string, vacancyId: string): Promise<void> {
    const company = await this.findCompanyByAuthId(authId);
    const vacancy = await this.findCompanyVacancy(company.id, vacancyId);

    vacancy.status = this.companyDomainService.getArchivedStatus();

    await this.vacancyRepository.save(vacancy);
  }

  async deleteVacancy(authId: string, vacancyId: string): Promise<void> {
    const company = await this.findCompanyByAuthId(authId);
    const vacancy = await this.findCompanyVacancy(company.id, vacancyId);

    try {
      this.companyDomainService.validateCanDeleteVacancy(vacancy.status);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Нельзя удалить вакансию';
      throw new BadRequestException(message);
    }

    await this.vacancyRepository.delete({ id: vacancy.id });
  }

  async getCompanyVacancies(
    authId: string,
    query: PaginationQuery,
    status?: VacancyStatus,
  ): Promise<PaginatedResult<CompanyVacancyItem>> {
    const company = await this.findCompanyByAuthId(authId);
    const offset = (query.page - 1) * query.limit;

    const whereCondition: {
      companyProfileId: string;
      status?: VacancyStatus;
    } = {
      companyProfileId: company.id,
    };

    if (status !== undefined) {
      whereCondition.status = status;
    }

    const [vacancies, total] = await this.vacancyRepository.findAndCount({
      where: whereCondition,
      relations: {
        skills: true,
        companyProfile: true,
      },
      order: {
        createdAt: 'DESC',
      },
      skip: offset,
      take: query.limit,
    });

    return {
      items: vacancies.map((item) => CompanyRepositoryMapper.toVacancy(item)),
      meta: this.buildMeta(query.page, query.limit, total),
    };
  }

  async getCompanyVacancy(
    authId: string,
    vacancyId: string,
  ): Promise<CompanyVacancyItem> {
    const company = await this.findCompanyByAuthId(authId);
    const vacancy = await this.findCompanyVacancy(company.id, vacancyId);

    return CompanyRepositoryMapper.toVacancy(vacancy);
  }

  async getCandidatesWithResume(
    query: PaginationQuery,
  ): Promise<PaginatedResult<CompanyCandidateItem>> {
    const offset = (query.page - 1) * query.limit;

    const [resumes, total] = await this.candidateResumeRepository.findAndCount({
      relations: {
        candidateProfile: {
          auth: true,
        },
        experiences: true,
        educations: true,
      },
      order: {
        updatedAt: 'DESC',
      },
      skip: offset,
      take: query.limit,
    });

    const items = resumes.map((resume) => {
      const candidate = resume.candidateProfile;
      const firstExperience = CompanyRepositoryMapper.getFirstExperience(
        resume.experiences,
      );
      const firstEducation = CompanyRepositoryMapper.getFirstEducation(
        resume.educations,
      );

      return {
        candidateProfileId: candidate.id,
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        profession: resume.profession,
        location: resume.location,
        experience: firstExperience
          ? `${firstExperience.position}, ${firstExperience.companyName}`
          : 'Не указан',
        education: firstEducation
          ? `${firstEducation.degree}, ${firstEducation.institutionName}`
          : 'Не указано',
        email: candidate.auth.email,
        phone: candidate.phone,
        resumePdfUrl: resume.resumePdfUrl,
      };
    });

    return {
      items,
      meta: this.buildMeta(query.page, query.limit, total),
    };
  }

  async getCandidateResume(
    candidateProfileId: string,
  ): Promise<CompanyCandidateResume> {
    const resume =
      await this.findResumeByCandidateProfileId(candidateProfileId);

    return CompanyRepositoryMapper.toCandidateResume(resume);
  }

  async inviteCandidate(
    authId: string,
    data: InviteCandidateData,
  ): Promise<void> {
    const company = await this.findCompanyByAuthId(authId);

    const vacancy = await this.vacancyRepository.findOne({
      where: {
        id: data.vacancyId,
        companyProfileId: company.id,
      },
    });

    if (!vacancy) {
      throw new NotFoundException('Вакансия компании не найдена');
    }

    try {
      this.companyDomainService.validateCanInviteForVacancy(vacancy.status);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Нельзя пригласить кандидата на эту вакансию';
      throw new BadRequestException(message);
    }

    const candidate = await this.candidateProfileRepository.findOne({
      where: { id: data.candidateProfileId },
    });

    if (!candidate) {
      throw new NotFoundException('Кандидат не найден');
    }

    const resume = await this.findResumeByCandidateProfileId(
      data.candidateProfileId,
    );

    const existingApplication = await this.applicationRepository.findOne({
      where: {
        candidateProfileId: data.candidateProfileId,
        vacancyId: data.vacancyId,
      },
    });

    if (existingApplication) {
      existingApplication.status =
        this.companyDomainService.getInvitedApplicationStatus();
      if (!existingApplication.resumePdfUrl) {
        existingApplication.resumePdfUrl = resume.resumePdfUrl;
      }

      await this.applicationRepository.save(existingApplication);
      return;
    }

    const application = this.applicationRepository.create({
      id: `application-${randomUUID()}`,
      candidateProfileId: data.candidateProfileId,
      vacancyId: data.vacancyId,
      status: this.companyDomainService.getInvitedApplicationStatus(),
      resumePdfUrl: resume.resumePdfUrl,
    });

    await this.applicationRepository.save(application);
  }

  async getCompanyApplications(
    authId: string,
    query: PaginationQuery,
    status?: ApplicationStatus,
  ): Promise<PaginatedResult<CompanyApplicationItem>> {
    const company = await this.findCompanyByAuthId(authId);
    const offset = (query.page - 1) * query.limit;

    const whereCondition: {
      vacancy: { companyProfileId: string };
      status?: ApplicationStatus;
    } = {
      vacancy: {
        companyProfileId: company.id,
      },
    };

    if (status !== undefined) {
      whereCondition.status = status;
    }

    const [applications, total] = await this.applicationRepository.findAndCount(
      {
        where: whereCondition,
        relations: {
          candidateProfile: {
            auth: true,
          },
          vacancy: true,
        },
        order: {
          createdAt: 'DESC',
        },
        skip: offset,
        take: query.limit,
      },
    );

    const items: CompanyApplicationItem[] = applications.map((application) => ({
      applicationId: application.id,
      candidateProfileId: application.candidateProfileId,
      firstName: application.candidateProfile.firstName,
      lastName: application.candidateProfile.lastName,
      vacancyId: application.vacancyId,
      vacancyPosition: application.vacancy.position,
      appliedAt: application.createdAt.toISOString(),
      status: application.status,
      resumePdfUrl: application.resumePdfUrl ?? null,
    }));

    return {
      items,
      meta: this.buildMeta(query.page, query.limit, total),
    };
  }

  async setApplicationStatus(
    authId: string,
    applicationId: string,
    status: ApplicationStatus,
  ): Promise<void> {
    const application = await this.findCompanyApplication(
      authId,
      applicationId,
    );

    if (
      this.companyDomainService.shouldAttachResumeForInvitation(
        status,
        application.resumePdfUrl,
      )
    ) {
      const resume = await this.findResumeByCandidateProfileId(
        application.candidateProfileId,
      );
      application.resumePdfUrl = resume.resumePdfUrl;
    }

    application.status = status;

    await this.applicationRepository.save(application);
  }

  async getApplicationResume(
    authId: string,
    applicationId: string,
  ): Promise<CompanyCandidateResume> {
    const application = await this.findCompanyApplication(
      authId,
      applicationId,
    );

    const resume = await this.findResumeByCandidateProfileId(
      application.candidateProfileId,
    );

    return CompanyRepositoryMapper.toCandidateResume(resume);
  }

  private async findCompanyByAuthId(
    authId: string,
  ): Promise<CompanyProfileEntity> {
    const company = await this.companyProfileRepository.findOne({
      where: { authId },
    });

    if (!company) {
      throw new NotFoundException('Профиль компании не найден');
    }

    return company;
  }

  private async findCompanyVacancy(
    companyProfileId: string,
    vacancyId: string,
  ): Promise<VacancyEntity> {
    const vacancy = await this.vacancyRepository.findOne({
      where: {
        id: vacancyId,
        companyProfileId,
      },
      relations: {
        skills: true,
        companyProfile: true,
      },
    });

    if (!vacancy) {
      throw new NotFoundException('Вакансия компании не найдена');
    }

    return vacancy;
  }

  private async getSkillsByIds(skillIds: string[]): Promise<SkillEntity[]> {
    if (skillIds.length === 0) {
      return [];
    }

    const uniqueIds = [...new Set(skillIds)];
    const skills = await this.skillRepository.findBy({
      id: In(uniqueIds),
    });

    if (skills.length !== uniqueIds.length) {
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
        candidateProfile: {
          auth: true,
        },
        experiences: true,
        educations: true,
        skills: true,
      },
    });

    if (!resume) {
      throw new NotFoundException('Резюме кандидата не найдено');
    }

    return resume;
  }

  private async findCompanyApplication(
    authId: string,
    applicationId: string,
  ): Promise<ApplicationEntity> {
    const company = await this.findCompanyByAuthId(authId);

    const application = await this.applicationRepository.findOne({
      where: {
        id: applicationId,
        vacancy: {
          companyProfileId: company.id,
        },
      },
      relations: {
        vacancy: true,
      },
    });

    if (!application) {
      throw new NotFoundException('Отклик не найден');
    }

    return application;
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
