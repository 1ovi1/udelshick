import { PaginationQueryDto } from '@api/dto/common/pagination-query.dto';
import { VacancyStatus } from '@domain/entities/enums/vacancy-status.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export class AdminVacanciesQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    enum: VacancyStatus,
    description: 'Фильтр по статусу вакансии',
  })
  @IsOptional()
  @IsEnum(VacancyStatus)
  status?: VacancyStatus;
}
