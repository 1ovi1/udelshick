import { SuccessResponseDto } from '@api/dto/common/api-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { PaginatedCandidateApplicationsDto } from './paginated-candidate-applications.dto';

export class CandidateApplicationsResponseDto extends SuccessResponseDto<PaginatedCandidateApplicationsDto> {
  @ApiProperty({ type: PaginatedCandidateApplicationsDto })
  declare data?: PaginatedCandidateApplicationsDto;
}
