import { ExperienceLevel } from '@domain/entities/enums/experience-level.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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

export class CreateCompanyVacancyDto {
  @ApiProperty({ example: 'Frontend разработчик' })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  position: string;

  @ApiProperty({ example: 'Москва' })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  location: string;

  @ApiPropertyOptional({ example: 250000, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  salary?: number;

  @ApiProperty({
    enum: ExperienceLevel,
    example: ExperienceLevel.MIDDLE,
  })
  @IsEnum(ExperienceLevel)
  experienceLevel: ExperienceLevel;

  @ApiProperty({ example: 'Опыт с Angular 16+, понимание RxJS и REST API' })
  @IsString()
  @MinLength(10)
  requirements: string;

  @ApiProperty({
    type: String,
    isArray: true,
    example: ['skill-angular', 'skill-typescript'],
  })
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  skillIds: string[];
}
