import { ApiProperty } from '@nestjs/swagger';

export class CandidateResumeEducationItemDto {
  @ApiProperty({ example: 'resume-edu-1' })
  id: string;

  @ApiProperty({ example: 'БГУИР' })
  institutionName: string;

  @ApiProperty({ example: '2019 - 2023' })
  studyPeriod: string;

  @ApiProperty({ example: 'Бакалавр' })
  degree: string;

  @ApiProperty({ example: 'Программная инженерия' })
  specialization: string;

  @ApiProperty({ example: 0 })
  orderIndex: number;
}
