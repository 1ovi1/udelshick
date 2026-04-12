import { PaginationQueryDto } from '@api/dto/common/pagination-query.dto';
import { ApplicationStatus } from '@domain/entities/enums/application-status.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export class CompanyApplicationsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    enum: ApplicationStatus,
    description: 'Фильтр по статусу отклика',
  })
  @IsOptional()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;
}
