import { SuccessResponseDto } from '@api/dto/common/api-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { PaginatedAdminVacancyDto } from './paginated-admin-vacancy.dto';

export class AdminVacanciesResponseDto extends SuccessResponseDto<PaginatedAdminVacancyDto> {
  @ApiProperty({ type: PaginatedAdminVacancyDto })
  declare data?: PaginatedAdminVacancyDto;
}
