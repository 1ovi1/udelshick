import { AdminActivityItem } from '@domain/entities/admin/admin-activity-item';
import { AdminVacancyDetails } from '@domain/entities/admin/admin-vacancy-details';
import { AdminDashboardMetrics } from '@domain/entities/admin/admin-dashboard-metrics';
import { AdminVacancyItem } from '@domain/entities/admin/admin-vacancy-item';
import { PaginatedResult } from '@domain/entities/common/paginated-result';
import { PaginationMeta } from '@domain/entities/common/pagination-meta';
import { PaginationQuery } from '@domain/entities/common/pagination-query';
import { AdminActivityStatus } from '@domain/entities/enums/admin-activity-status.enum';
import { Role } from '@domain/entities/enums/role.enum';
import { VacancyStatus } from '@domain/entities/enums/vacancy-status.enum';
import { IAdminRepository } from '@domain/interfaces/repositories/admin-repository.interface';
import { AdminDomainService } from '@domain/services/admin-domain.service';
import { AuthEntity } from '@infrastructure/entities/auth.entity';
import { ApplicationEntity } from '@infrastructure/entities/application.entity';
import { VacancyEntity } from '@infrastructure/entities/vacancy.entity';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { AdminActivityRow } from './models/admin-activity-row';
import { CountResultRow } from './models/count-result-row';

@Injectable()
export class AdminRepository implements IAdminRepository {
  constructor(
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
    @InjectRepository(VacancyEntity)
    private readonly vacancyRepository: Repository<VacancyEntity>,
    @InjectRepository(ApplicationEntity)
    private readonly applicationRepository: Repository<ApplicationEntity>,
    private readonly dataSource: DataSource,
    private readonly adminDomainService: AdminDomainService,
  ) {}

  async getDashboardMetrics(): Promise<AdminDashboardMetrics> {
    const [candidatesCount, companiesCount, vacanciesCount, applicationsCount] =
      await Promise.all([
        this.authRepository.count({ where: { role: Role.CANDIDATE } }),
        this.authRepository.count({ where: { role: Role.COMPANY } }),
        this.vacancyRepository.count(),
        this.applicationRepository.count(),
      ]);

    return {
      candidatesCount,
      companiesCount,
      vacanciesCount,
      applicationsCount,
    };
  }

  async getRecentActivity(
    query: PaginationQuery,
  ): Promise<PaginatedResult<AdminActivityItem>> {
    return this.getUsers(query);
  }

  async getUsers(
    query: PaginationQuery,
  ): Promise<PaginatedResult<AdminActivityItem>> {
    const offset = (query.page - 1) * query.limit;

    const countRows = (await this.dataSource.query(
      `
        SELECT COUNT(*)::text AS count
        FROM (
          SELECT auth.id
          FROM auths auth
          INNER JOIN candidate_profiles cp ON cp."authId" = auth.id
          WHERE auth.deleted_at IS NULL AND cp.deleted_at IS NULL

          UNION ALL

          SELECT auth.id
          FROM auths auth
          INNER JOIN company_profiles company ON company."authId" = auth.id
          WHERE auth.deleted_at IS NULL AND company.deleted_at IS NULL
        ) AS users_union
      `,
    )) as CountResultRow[];

    const total = Number(countRows[0]?.count ?? '0');

    const rows = (await this.dataSource.query(
      `
        SELECT *
        FROM (
          SELECT
            auth.id AS "authId",
            $1::text AS status,
            CONCAT(cp."firstName", ' ', cp."lastName") AS name,
            auth.email AS email,
            auth.created_at AS "createdAt"
          FROM auths auth
          INNER JOIN candidate_profiles cp ON cp."authId" = auth.id
          WHERE auth.deleted_at IS NULL AND cp.deleted_at IS NULL

          UNION ALL

          SELECT
            auth.id AS "authId",
            $2::text AS status,
            company."companyName" AS name,
            auth.email AS email,
            auth.created_at AS "createdAt"
          FROM auths auth
          INNER JOIN company_profiles company ON company."authId" = auth.id
          WHERE auth.deleted_at IS NULL AND company.deleted_at IS NULL
        ) AS users_union
        ORDER BY "createdAt" DESC
        LIMIT $3 OFFSET $4
      `,
      [
        AdminActivityStatus.CANDIDATE,
        AdminActivityStatus.COMPANY,
        query.limit,
        offset,
      ],
    )) as AdminActivityRow[];

    const items: AdminActivityItem[] = rows.map((row: AdminActivityRow) => ({
      authId: row.authId,
      status: row.status,
      name: row.name,
      email: row.email,
      createdAt: new Date(row.createdAt).toISOString(),
    }));

    return {
      items,
      meta: this.buildMeta(query.page, query.limit, total),
    };
  }

  async deleteUser(authId: string): Promise<void> {
    const user = await this.authRepository.findOne({ where: { id: authId } });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    try {
      this.adminDomainService.validateCanDeleteUser(user.role);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Невозможно удалить пользователя';
      throw new BadRequestException(message);
    }

    await this.authRepository.delete({ id: authId });
  }

  async getVacancies(
    query: PaginationQuery,
    status?: VacancyStatus,
  ): Promise<PaginatedResult<AdminVacancyItem>> {
    const offset = (query.page - 1) * query.limit;

    const whereCondition: { status?: VacancyStatus } = {};

    if (status !== undefined) {
      whereCondition.status = status;
    }

    const [vacancies, total] = await this.vacancyRepository.findAndCount({
      where: whereCondition,
      relations: {
        companyProfile: true,
      },
      order: {
        createdAt: 'DESC',
      },
      skip: offset,
      take: query.limit,
    });

    const items: AdminVacancyItem[] = vacancies.map(
      (vacancy: VacancyEntity) => ({
        id: vacancy.id,
        position: vacancy.position,
        companyName: vacancy.companyProfile.companyName,
        publishedAt: vacancy.publishedAt
          ? vacancy.publishedAt.toISOString()
          : null,
        status: vacancy.status,
      }),
    );

    return {
      items,
      meta: this.buildMeta(query.page, query.limit, total),
    };
  }

  async getVacancyDetails(vacancyId: string): Promise<AdminVacancyDetails> {
    const vacancy = await this.vacancyRepository.findOne({
      where: { id: vacancyId },
      relations: {
        companyProfile: true,
        skills: true,
      },
    });

    if (!vacancy) {
      throw new NotFoundException('Вакансия не найдена');
    }

    return {
      id: vacancy.id,
      position: vacancy.position,
      companyName: vacancy.companyProfile.companyName,
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

  async publishVacancy(vacancyId: string): Promise<void> {
    const vacancy = await this.vacancyRepository.findOne({
      where: { id: vacancyId },
    });

    if (!vacancy) {
      throw new NotFoundException('Вакансия не найдена');
    }

    const nextState = this.adminDomainService.getPublishedVacancyState(
      vacancy.publishedAt,
    );
    vacancy.status = nextState.status;
    vacancy.publishedAt = nextState.publishedAt;

    await this.vacancyRepository.save(vacancy);
  }

  async archiveVacancy(vacancyId: string): Promise<void> {
    const vacancy = await this.vacancyRepository.findOne({
      where: { id: vacancyId },
    });

    if (!vacancy) {
      throw new NotFoundException('Вакансия не найдена');
    }

    vacancy.status = this.adminDomainService.getArchivedVacancyStatus();
    await this.vacancyRepository.save(vacancy);
  }

  async deleteArchivedVacancy(vacancyId: string): Promise<void> {
    const vacancy = await this.vacancyRepository.findOne({
      where: { id: vacancyId },
    });

    if (!vacancy) {
      throw new NotFoundException('Вакансия не найдена');
    }

    try {
      this.adminDomainService.validateCanDeleteVacancy(vacancy.status);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Невозможно удалить вакансию';
      throw new BadRequestException(message);
    }

    await this.vacancyRepository.delete({ id: vacancyId });
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
