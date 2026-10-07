import { SuccessResponseDto } from '@api/dto/common/api-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { PaginatedCandidateVacanciesDto } from './paginated-candidate-vacancies.dto';

export class CandidateVacanciesResponseDto extends SuccessResponseDto<PaginatedCandidateVacanciesDto> {
  @ApiProperty({ type: PaginatedCandidateVacanciesDto })
  declare data?: PaginatedCandidateVacanciesDto;
}
