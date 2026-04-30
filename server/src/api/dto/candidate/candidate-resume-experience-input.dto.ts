import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CandidateResumeExperienceInputDto {
  @ApiProperty({ example: 'ООО ТехСервис' })
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  companyName: string;

  @ApiProperty({ example: 'Frontend Developer' })
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  position: string;

  @ApiProperty({ example: 'Янв 2023 - Мар 2025' })
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  period: string;

  @ApiProperty({ example: 'Разрабатывал интерфейсы на Angular и TypeScript.' })
  @IsString()
  @MinLength(3)
  @MaxLength(3000)
  description: string;

  @ApiPropertyOptional({ example: 0, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  orderIndex?: number;
}
