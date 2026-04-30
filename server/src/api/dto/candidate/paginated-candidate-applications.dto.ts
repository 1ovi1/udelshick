import { ApiProperty } from '@nestjs/swagger';
import { CandidateApplicationItemDto } from './candidate-application-item.dto';
import { CandidatePaginationMetaDto } from './candidate-pagination-meta.dto';

export class PaginatedCandidateApplicationsDto {
  @ApiProperty({ type: CandidateApplicationItemDto, isArray: true })
  items: CandidateApplicationItemDto[];

  @ApiProperty({ type: CandidatePaginationMetaDto })
  meta: CandidatePaginationMetaDto;
}
