import { ApiProperty } from '@nestjs/swagger';

export class AdminDashboardMetricsDto {
  @ApiProperty({
    example: 111,
    description: 'Количество пользователей-кандидатов',
  })
  candidatesCount: number;

  @ApiProperty({ example: 24, description: 'Количество компаний' })
  companiesCount: number;

  @ApiProperty({ example: 58, description: 'Количество вакансий' })
  vacanciesCount: number;

  @ApiProperty({ example: 302, description: 'Количество откликов' })
  applicationsCount: number;
}
