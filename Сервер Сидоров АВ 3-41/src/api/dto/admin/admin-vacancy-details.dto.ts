import { ExperienceLevel } from '@domain/entities/enums/experience-level.enum';
import { VacancyStatus } from '@domain/entities/enums/vacancy-status.enum';
import { ApiProperty } from '@nestjs/swagger';

class AdminVacancySkillItemDto {
  @ApiProperty({ example: 'skill-1b12d2e4-8ca1-4f2f-a214-49b7f9b6e7ad' })
  id: string;

  @ApiProperty({ example: 'TypeScript' })
  name: string;
}

export class AdminVacancyDetailsDto {
  @ApiProperty({ example: 'vacancy-f5f4a57a-cfa0-4c85-9aa7-66d7f097ebd2' })
  id: string;

  @ApiProperty({ example: 'Frontend разработчик' })
  position: string;

  @ApiProperty({ example: 'Яндекс' })
  companyName: string;

  @ApiProperty({ example: 'Минск' })
  location: string;

  @ApiProperty({ example: 3200, nullable: true })
  salary: number | null;

  @ApiProperty({ example: 'Опыт разработки на Angular и TypeScript.' })
  requirements: string;

  @ApiProperty({ enum: ExperienceLevel, example: ExperienceLevel.MIDDLE })
  experienceLevel: ExperienceLevel;

  @ApiProperty({ enum: VacancyStatus, example: VacancyStatus.PUBLISHED })
  status: VacancyStatus;

  @ApiProperty({
    example: '2026-04-11T13:30:00.000Z',
    nullable: true,
    description: 'Дата публикации вакансии',
  })
  publishedAt: string | null;

  @ApiProperty({
    example: '2026-04-10T10:30:00.000Z',
    description: 'Дата создания вакансии',
  })
  createdAt: string;

  @ApiProperty({ type: AdminVacancySkillItemDto, isArray: true })
  skills: AdminVacancySkillItemDto[];
}
