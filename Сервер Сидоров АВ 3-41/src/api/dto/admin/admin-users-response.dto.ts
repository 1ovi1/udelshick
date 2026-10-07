import { SuccessResponseDto } from '@api/dto/common/api-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { PaginatedAdminActivityDto } from './paginated-admin-activity.dto';

export class AdminUsersResponseDto extends SuccessResponseDto<PaginatedAdminActivityDto> {
  @ApiProperty({ type: PaginatedAdminActivityDto })
  declare data?: PaginatedAdminActivityDto;
}
