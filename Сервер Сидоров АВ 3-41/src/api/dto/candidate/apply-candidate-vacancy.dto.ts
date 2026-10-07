import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ApplyCandidateVacancyDto {
  @ApiPropertyOptional({
    example: 'Интересна вакансия, готов пройти техническое интервью.',
    maxLength: 2000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  coverLetter?: string;
}
