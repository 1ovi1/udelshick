import { SuccessResponseDto } from '@api/dto/common/api-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { AdminDashboardDto } from './admin-dashboard.dto';

export class AdminDashboardResponseDto extends SuccessResponseDto<AdminDashboardDto> {
  @ApiProperty({ type: AdminDashboardDto })
  declare data?: AdminDashboardDto;
}
