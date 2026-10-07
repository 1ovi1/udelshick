import { SuccessResponseDto } from '@api/dto/common/api-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { AdminVacancyDetailsDto } from './admin-vacancy-details.dto';

export class AdminVacancyDetailsResponseDto extends SuccessResponseDto<AdminVacancyDetailsDto> {
  @ApiProperty({ type: AdminVacancyDetailsDto })
  declare data?: AdminVacancyDetailsDto;
}
