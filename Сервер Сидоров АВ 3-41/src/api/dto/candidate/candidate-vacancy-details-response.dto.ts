import { SuccessResponseDto } from '@api/dto/common/api-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { CandidateVacancyDetailsDto } from './candidate-vacancy-details.dto';

export class CandidateVacancyDetailsResponseDto extends SuccessResponseDto<CandidateVacancyDetailsDto> {
  @ApiProperty({ type: CandidateVacancyDetailsDto })
  declare data?: CandidateVacancyDetailsDto;
}
