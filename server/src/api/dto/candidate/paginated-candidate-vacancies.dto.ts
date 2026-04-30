import { ApiProperty } from '@nestjs/swagger';
import { CandidatePaginationMetaDto } from './candidate-pagination-meta.dto';
import { CandidateVacancyItemDto } from './candidate-vacancy-item.dto';

export class PaginatedCandidateVacanciesDto {
  @ApiProperty({ type: CandidateVacancyItemDto, isArray: true })
  items: CandidateVacancyItemDto[];

  @ApiProperty({ type: CandidatePaginationMetaDto })
  meta: CandidatePaginationMetaDto;
}
