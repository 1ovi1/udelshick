import { ApiProperty } from '@nestjs/swagger';

export class CandidateResumeExperienceItemDto {
  @ApiProperty({ example: 'resume-exp-1' })
  id: string;

  @ApiProperty({ example: 'ООО ТехСервис' })
  companyName: string;

  @ApiProperty({ example: 'Frontend Developer' })
  position: string;

  @ApiProperty({ example: 'Янв 2023 - Мар 2025' })
  period: string;

  @ApiProperty({ example: 'Разрабатывал SPA на Angular.' })
  description: string;

  @ApiProperty({ example: 0 })
  orderIndex: number;
}
