import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CandidateResumeEducationInputDto {
  @ApiProperty({ example: 'БГУИР' })
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  institutionName: string;

  @ApiProperty({ example: '2019 - 2023' })
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  studyPeriod: string;

  @ApiProperty({ example: 'Бакалавр' })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  degree: string;

  @ApiProperty({ example: 'Программная инженерия' })
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  specialization: string;

  @ApiPropertyOptional({ example: 0, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  orderIndex?: number;
}
