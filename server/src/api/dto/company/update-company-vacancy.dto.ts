import { ExperienceLevel } from '@domain/entities/enums/experience-level.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateCompanyVacancyDto {
  @ApiPropertyOptional({ example: 'Senior Frontend разработчик' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  position?: string;

  @ApiPropertyOptional({ example: 'Санкт-Петербург' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  location?: string;

  @ApiPropertyOptional({ example: 300000, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  salary?: number | null;

  @ApiPropertyOptional({ enum: ExperienceLevel })
  @IsOptional()
  @IsEnum(ExperienceLevel)
  experienceLevel?: ExperienceLevel;

  @ApiPropertyOptional({ example: 'Опыт командной разработки и code review' })
  @IsOptional()
  @IsString()
  @MinLength(10)
  requirements?: string;

  @ApiPropertyOptional({
    type: String,
    isArray: true,
    example: ['skill-angular', 'skill-typescript', 'skill-git'],
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  skillIds?: string[];
}
