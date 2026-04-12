import { Roles } from '@api/decorators/roles.decorator';
import { CompanyApplicationsQueryDto } from '@api/dto/company/company-applications-query.dto';
import { CompanyCandidatesQueryDto } from '@api/dto/company/company-candidates-query.dto';
import { CompanyVacanciesQueryDto } from '@api/dto/company/company-vacancies-query.dto';
import { CreateCompanyVacancyDto } from '@api/dto/company/create-company-vacancy.dto';
import { InviteCandidateDto } from '@api/dto/company/invite-candidate.dto';
import { UpdateCompanyVacancyDto } from '@api/dto/company/update-company-vacancy.dto';
import { AuthenticatedRequest } from '@api/guards/models/authenticated-request.interface';
import { RolesGuard } from '@api/guards/roles.guard';
import { CompanyService } from '@application/services/company.service';
import { ResponseService } from '@application/services/response.service';
import { Role } from '@domain/entities/enums/role.enum';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Компания')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.COMPANY)
@Controller('company')
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly responseService: ResponseService,
  ) {}

  @Get('skills')
  @ApiOperation({ summary: 'Получить справочник доступных навыков' })
  @ApiResponse({ status: 200, description: 'Справочник навыков получен' })
  async getSkills() {
    const result = await this.companyService.listSkills();
    return this.responseService.success('Справочник навыков получен', result);
  }

  @Post('vacancies')
  @ApiOperation({ summary: 'Создать вакансию компании в статусе архив' })
  @ApiResponse({ status: 201, description: 'Вакансия создана' })
  async createVacancy(
    @Request() req: AuthenticatedRequest,
    @Body() dto: CreateCompanyVacancyDto,
  ) {
    const result = await this.companyService.createVacancy(req.user.id, {
      position: dto.position,
      location: dto.location,
      salary: dto.salary ?? null,
      requirements: dto.requirements,
      experienceLevel: dto.experienceLevel,
      skillIds: dto.skillIds,
    });

    return this.responseService.created(result, 'Вакансия создана');
  }

  @Get('vacancies')
  @ApiOperation({ summary: 'Получить вакансии компании с пагинацией' })
  @ApiResponse({ status: 200, description: 'Вакансии получены' })
  async getVacancies(
    @Request() req: AuthenticatedRequest,
    @Query() query: CompanyVacanciesQueryDto,
  ) {
    const result = await this.companyService.getCompanyVacancies(
      req.user.id,
      query,
      query.status,
    );

    return this.responseService.success('Вакансии получены', result);
  }

  @Patch('vacancies/:vacancyId')
  @ApiOperation({ summary: 'Редактировать вакансию компании' })
  @ApiResponse({ status: 200, description: 'Вакансия обновлена' })
  async updateVacancy(
    @Request() req: AuthenticatedRequest,
    @Param('vacancyId') vacancyId: string,
    @Body() dto: UpdateCompanyVacancyDto,
  ) {
    const result = await this.companyService.updateVacancy(
      req.user.id,
      vacancyId,
      dto,
    );

    return this.responseService.success('Вакансия обновлена', result);
  }

  @Patch('vacancies/:vacancyId/publish')
  @ApiOperation({ summary: 'Отправить вакансию на рассмотрение' })
  @ApiResponse({
    status: 200,
    description: 'Вакансия отправлена на рассмотрение',
  })
  async publishVacancy(
    @Request() req: AuthenticatedRequest,
    @Param('vacancyId') vacancyId: string,
  ) {
    await this.companyService.publishVacancyForReview(req.user.id, vacancyId);

    return this.responseService.success('Вакансия отправлена на рассмотрение');
  }

  @Patch('vacancies/:vacancyId/archive')
  @ApiOperation({ summary: 'Отправить вакансию в архив' })
  @ApiResponse({ status: 200, description: 'Вакансия отправлена в архив' })
  async archiveVacancy(
    @Request() req: AuthenticatedRequest,
    @Param('vacancyId') vacancyId: string,
  ) {
    await this.companyService.archiveVacancy(req.user.id, vacancyId);

    return this.responseService.success('Вакансия отправлена в архив');
  }

  @Get('candidates')
  @ApiOperation({ summary: 'Список кандидатов с заполненным резюме' })
  @ApiResponse({ status: 200, description: 'Список кандидатов получен' })
  async getCandidates(@Query() query: CompanyCandidatesQueryDto) {
    const result = await this.companyService.getCandidatesWithResume(query);
    return this.responseService.success('Список кандидатов получен', result);
  }

  @Get('candidates/:candidateProfileId/resume')
  @ApiOperation({ summary: 'Просмотреть резюме кандидата' })
  @ApiResponse({ status: 200, description: 'Резюме кандидата получено' })
  async getCandidateResume(
    @Param('candidateProfileId') candidateProfileId: string,
  ) {
    const result =
      await this.companyService.getCandidateResume(candidateProfileId);

    return this.responseService.success('Резюме кандидата получено', result);
  }

  @Post('candidates/:candidateProfileId/invite')
  @ApiOperation({ summary: 'Пригласить кандидата на вакансию компании' })
  @ApiResponse({ status: 200, description: 'Кандидат приглашен' })
  async inviteCandidate(
    @Request() req: AuthenticatedRequest,
    @Param('candidateProfileId') candidateProfileId: string,
    @Body() dto: InviteCandidateDto,
  ) {
    await this.companyService.inviteCandidate(req.user.id, {
      candidateProfileId,
      vacancyId: dto.vacancyId,
    });

    return this.responseService.success('Кандидат приглашен');
  }

  @Get('applications')
  @ApiOperation({ summary: 'Получить отклики на вакансии компании' })
  @ApiResponse({ status: 200, description: 'Список откликов получен' })
  async getApplications(
    @Request() req: AuthenticatedRequest,
    @Query() query: CompanyApplicationsQueryDto,
  ) {
    const result = await this.companyService.getCompanyApplications(
      req.user.id,
      query,
      query.status,
    );

    return this.responseService.success('Список откликов получен', result);
  }

  @Get('applications/:applicationId/resume')
  @ApiOperation({ summary: 'Просмотреть резюме по отклику' })
  @ApiResponse({ status: 200, description: 'Резюме по отклику получено' })
  async getApplicationResume(
    @Request() req: AuthenticatedRequest,
    @Param('applicationId') applicationId: string,
  ) {
    const result = await this.companyService.getApplicationResume(
      req.user.id,
      applicationId,
    );

    return this.responseService.success('Резюме по отклику получено', result);
  }

  @Patch('applications/:applicationId/invite')
  @ApiOperation({ summary: 'Изменить статус отклика на приглашение' })
  @ApiResponse({ status: 200, description: 'Кандидат приглашен' })
  async inviteApplication(
    @Request() req: AuthenticatedRequest,
    @Param('applicationId') applicationId: string,
  ) {
    await this.companyService.inviteApplication(req.user.id, applicationId);

    return this.responseService.success('Кандидат приглашен');
  }

  @Patch('applications/:applicationId/reject')
  @ApiOperation({ summary: 'Отклонить отклик кандидата' })
  @ApiResponse({ status: 200, description: 'Отклик отклонен' })
  async rejectApplication(
    @Request() req: AuthenticatedRequest,
    @Param('applicationId') applicationId: string,
  ) {
    await this.companyService.rejectApplication(req.user.id, applicationId);

    return this.responseService.success('Отклик отклонен');
  }
}
