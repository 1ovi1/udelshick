import { ApiProperty } from '@nestjs/swagger';
import { AdminVacancyItemDto } from './admin-vacancy-item.dto';
import { PaginationMetaDto } from './pagination-meta.dto';

export class PaginatedAdminVacancyDto {
  @ApiProperty({ type: AdminVacancyItemDto, isArray: true })
  items: AdminVacancyItemDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}
