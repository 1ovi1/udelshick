import { Roles } from '@api/decorators/roles.decorator';
import { AdminDashboardResponseDto } from '@api/dto/admin/admin-dashboard-response.dto';
import { AdminUsersResponseDto } from '@api/dto/admin/admin-users-response.dto';
import { AdminVacanciesQueryDto } from '@api/dto/admin/admin-vacancies-query.dto';
import { AdminVacanciesResponseDto } from '@api/dto/admin/admin-vacancies-response.dto';
import { PaginationQueryDto } from '@api/dto/common/pagination-query.dto';
import { RolesGuard } from '@api/guards/roles.guard';
import { AdminService } from '@application/services/admin.service';
import { ResponseService } from '@application/services/response.service';
import { Role } from '@domain/entities/enums/role.enum';
import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Администрирование')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly responseService: ResponseService,
  ) {}

  @Get('dashboard')
  @ApiOperation({
    summary: 'Статистика для дашборда администратора и последняя активность',
  })
  @ApiResponse({
    status: 200,
    description: 'Данные дашборда успешно получены',
    type: AdminDashboardResponseDto,
  })
  async getDashboard(@Query() query: PaginationQueryDto) {
    const result = await this.adminService.getDashboard(query);
    return this.responseService.success('Данные дашборда получены', result);
  }

  @Get('users')
  @ApiOperation({
    summary: 'Список пользователей и компаний с пагинацией',
  })
  @ApiResponse({
    status: 200,
    description: 'Список пользователей получен',
    type: AdminUsersResponseDto,
  })
  async getUsers(@Query() query: PaginationQueryDto) {
    const result = await this.adminService.getUsers(query);
    return this.responseService.success('Список пользователей получен', result);
  }

  @Delete('users/:authId')
  @ApiOperation({ summary: 'Удаление пользователя или компании по authId' })
  @ApiResponse({ status: 200, description: 'Пользователь удален' })
  async deleteUser(@Param('authId') authId: string) {
    await this.adminService.deleteUser(authId);
    return this.responseService.success('Пользователь удален');
  }

  @Get('vacancies')
  @ApiOperation({ summary: 'Список вакансий с пагинацией для администратора' })
  @ApiResponse({
    status: 200,
    description: 'Список вакансий получен',
    type: AdminVacanciesResponseDto,
  })
  async getVacancies(@Query() query: AdminVacanciesQueryDto) {
    const result = await this.adminService.getVacancies(query, query.status);
    return this.responseService.success('Список вакансий получен', result);
  }

  @Patch('vacancies/:vacancyId/publish')
  @ApiOperation({ summary: 'Одобрить вакансию и опубликовать' })
  @ApiResponse({ status: 200, description: 'Вакансия опубликована' })
  async publishVacancy(@Param('vacancyId') vacancyId: string) {
    await this.adminService.publishVacancy(vacancyId);
    return this.responseService.success('Вакансия опубликована');
  }

  @Patch('vacancies/:vacancyId/archive')
  @ApiOperation({ summary: 'Снять вакансию с публикации (в архив)' })
  @ApiResponse({ status: 200, description: 'Вакансия отправлена в архив' })
  async archiveVacancy(@Param('vacancyId') vacancyId: string) {
    await this.adminService.archiveVacancy(vacancyId);
    return this.responseService.success('Вакансия отправлена в архив');
  }

  @Delete('vacancies/:vacancyId')
  @ApiOperation({ summary: 'Удалить архивную вакансию' })
  @ApiResponse({ status: 200, description: 'Вакансия удалена' })
  async deleteVacancy(@Param('vacancyId') vacancyId: string) {
    await this.adminService.deleteArchivedVacancy(vacancyId);
    return this.responseService.success('Вакансия удалена');
  }
}
