import { Roles } from '@api/decorators/roles.decorator';
import { ApplyCandidateVacancyDto } from '@api/dto/candidate/apply-candidate-vacancy.dto';
import { CandidateApplicationsResponseDto } from '@api/dto/candidate/candidate-applications-response.dto';
import { CandidateApplicationsQueryDto } from '@api/dto/candidate/candidate-applications-query.dto';
import { CandidateResumeResponseDto } from '@api/dto/candidate/candidate-resume-response.dto';
import { CandidateSkillsResponseDto } from '@api/dto/candidate/candidate-skills-response.dto';
import { CandidateVacanciesResponseDto } from '@api/dto/candidate/candidate-vacancies-response.dto';
import { CandidateVacancyDetailsResponseDto } from '@api/dto/candidate/candidate-vacancy-details-response.dto';
import { CandidateVacanciesQueryDto } from '@api/dto/candidate/candidate-vacancies-query.dto';
import { UpsertCandidateResumeDto } from '@api/dto/candidate/upsert-candidate-resume.dto';
import { AuthenticatedRequest } from '@api/guards/models/authenticated-request.interface';
import { RolesGuard } from '@api/guards/roles.guard';
import { CandidateService } from '@application/services/candidate.service';
import { ResponseService } from '@application/services/response.service';
import { Role } from '@domain/entities/enums/role.enum';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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

@ApiTags('Кандидат')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.CANDIDATE)
@Controller('candidate')
export class CandidateController {
  constructor(
    private readonly candidateService: CandidateService,
    private readonly responseService: ResponseService,
  ) {}

  @Get('skills')
  @ApiOperation({ summary: 'Получить справочник доступных навыков' })
  @ApiResponse({
    status: 200,
    description: 'Справочник навыков получен',
    type: CandidateSkillsResponseDto,
  })
  async getSkills() {
    const result = await this.candidateService.listSkills();
    return this.responseService.success('Справочник навыков получен', result);
  }

  @Get('vacancies')
  @ApiOperation({
    summary: 'Получить вакансии с рекомендацией по совпадению навыков',
  })
  @ApiResponse({
    status: 200,
    description: 'Вакансии получены',
    type: CandidateVacanciesResponseDto,
  })
  async getVacancies(
    @Request() req: AuthenticatedRequest,
    @Query() query: CandidateVacanciesQueryDto,
  ) {
    const result = await this.candidateService.getRecommendedVacancies(
      req.user.id,
      query,
    );

    return this.responseService.success('Вакансии получены', result);
  }

  @Get('vacancies/:vacancyId')
  @ApiOperation({ summary: 'Получить детальную информацию по вакансии' })
  @ApiResponse({
    status: 200,
    description: 'Детали вакансии получены',
    type: CandidateVacancyDetailsResponseDto,
  })
  async getVacancyDetails(
    @Request() req: AuthenticatedRequest,
    @Param('vacancyId') vacancyId: string,
  ) {
    const result = await this.candidateService.getVacancyDetails(
      req.user.id,
      vacancyId,
    );

    return this.responseService.success('Детали вакансии получены', result);
  }

  @Post('vacancies/:vacancyId/apply')
  @ApiOperation({ summary: 'Откликнуться на вакансию' })
  @ApiResponse({ status: 200, description: 'Отклик отправлен' })
  async applyToVacancy(
    @Request() req: AuthenticatedRequest,
    @Param('vacancyId') vacancyId: string,
    @Body() dto: ApplyCandidateVacancyDto,
  ) {
    await this.candidateService.applyToVacancy(req.user.id, vacancyId, {
      coverLetter: dto.coverLetter,
    });

    return this.responseService.success('Отклик отправлен');
  }

  @Get('resume')
  @ApiOperation({ summary: 'Получить собственное резюме кандидата' })
  @ApiResponse({
    status: 200,
    description: 'Резюме получено',
    type: CandidateResumeResponseDto,
  })
  async getOwnResume(@Request() req: AuthenticatedRequest) {
    const result = await this.candidateService.getOwnResume(req.user.id);
    return this.responseService.success('Резюме получено', result);
  }

  @Put('resume')
  @ApiOperation({ summary: 'Создать или обновить собственное резюме' })
  @ApiResponse({
    status: 200,
    description: 'Резюме сохранено',
    type: CandidateResumeResponseDto,
  })
  async upsertOwnResume(
    @Request() req: AuthenticatedRequest,
    @Body() dto: UpsertCandidateResumeDto,
  ) {
    const result = await this.candidateService.upsertOwnResume(req.user.id, {
      profession: dto.profession,
      location: dto.location,
      expectedSalary: dto.expectedSalary ?? null,
      about: dto.about ?? null,
      resumePdfUrl: dto.resumePdfUrl ?? null,
      skillIds: dto.skillIds,
      experiences: (dto.experiences ?? []).map((item, index) => ({
        companyName: item.companyName,
        position: item.position,
        period: item.period,
        description: item.description,
        orderIndex: item.orderIndex ?? index,
      })),
      educations: (dto.educations ?? []).map((item, index) => ({
        institutionName: item.institutionName,
        studyPeriod: item.studyPeriod,
        degree: item.degree,
        specialization: item.specialization,
        orderIndex: item.orderIndex ?? index,
      })),
    });

    return this.responseService.success('Резюме сохранено', result);
  }

  @Get('applications')
  @ApiOperation({ summary: 'Получить собственные отклики кандидата' })
  @ApiResponse({
    status: 200,
    description: 'Отклики получены',
    type: CandidateApplicationsResponseDto,
  })
  async getOwnApplications(
    @Request() req: AuthenticatedRequest,
    @Query() query: CandidateApplicationsQueryDto,
  ) {
    const result = await this.candidateService.getOwnApplications(
      req.user.id,
      query,
      query.status,
    );

    return this.responseService.success('Отклики получены', result);
  }

  @Delete('applications/:applicationId')
  @ApiOperation({ summary: 'Удалить отклик кандидата (статус withdrawn)' })
  @ApiResponse({ status: 200, description: 'Отклик удален' })
  async deleteOwnApplication(
    @Request() req: AuthenticatedRequest,
    @Param('applicationId') applicationId: string,
  ) {
    await this.candidateService.deleteOwnApplication(
      req.user.id,
      applicationId,
    );

    return this.responseService.success('Отклик удален');
  }
}
