import { ApiProperty } from '@nestjs/swagger';
import { AdminActivityItemDto } from './admin-activity-item.dto';
import { PaginationMetaDto } from './pagination-meta.dto';

export class PaginatedAdminActivityDto {
  @ApiProperty({ type: AdminActivityItemDto, isArray: true })
  items: AdminActivityItemDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}
