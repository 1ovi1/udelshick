import { ExperienceLevel } from '@domain/entities/enums/experience-level.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CandidateVacancyItemDto {
  @ApiProperty({ example: 'vacancy-8ec8b5c8-86fd-4813-9cb3-8f13ea6d85ec' })
  id: string;

  @ApiProperty({ example: 'Frontend Developer' })
  position: string;

  @ApiProperty({ example: 3200, nullable: true })
  salary: number | null;

  @ApiProperty({ enum: ExperienceLevel, example: ExperienceLevel.MIDDLE })
  experienceLevel: ExperienceLevel;

  @ApiProperty({ example: 'Acme LLC' })
  companyName: string;

  @ApiProperty({ example: 'Минск' })
  location: string;

  @ApiProperty({ example: 67, description: 'Процент совпадения навыков' })
  matchingSkillsPercent: number;
}
