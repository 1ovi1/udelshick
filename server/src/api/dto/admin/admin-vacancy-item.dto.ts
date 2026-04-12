import { VacancyStatus } from '@domain/entities/enums/vacancy-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class AdminVacancyItemDto {
  @ApiProperty({ example: 'vacancy-f5f4a57a-cfa0-4c85-9aa7-66d7f097ebd2' })
  id: string;

  @ApiProperty({ example: 'Frontend разработчик' })
  position: string;

  @ApiProperty({ example: 'Яндекс' })
  companyName: string;

  @ApiProperty({
    example: '2026-04-11T13:30:00.000Z',
    nullable: true,
    description: 'Дата публикации вакансии',
  })
  publishedAt: string | null;

  @ApiProperty({
    enum: VacancyStatus,
    example: VacancyStatus.PUBLISHED,
    description: 'Статус публикации вакансии',
  })
  status: VacancyStatus;
}
