import { Type } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CandidateResumeEducationInputDto } from './candidate-resume-education-input.dto';
import { CandidateResumeExperienceInputDto } from './candidate-resume-experience-input.dto';

export class UpsertCandidateResumeDto {
  @ApiProperty({ example: 'Frontend Developer' })
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  profession: string;

  @ApiProperty({ example: 'Минск' })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  location: string;

  @ApiPropertyOptional({ example: 2500, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  expectedSalary?: number | null;

  @ApiPropertyOptional({
    example: 'Разрабатываю SPA, участвую в code review и проектировании.',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  about?: string | null;

  @ApiPropertyOptional({
    example: 'https://example.com/files/resume.pdf',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  resumePdfUrl?: string | null;

  @ApiProperty({
    type: String,
    isArray: true,
    example: ['skill-angular', 'skill-typescript', 'skill-sql'],
  })
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  skillIds: string[];

  @ApiPropertyOptional({
    type: CandidateResumeExperienceInputDto,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CandidateResumeExperienceInputDto)
  experiences?: CandidateResumeExperienceInputDto[];

  @ApiPropertyOptional({
    type: CandidateResumeEducationInputDto,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CandidateResumeEducationInputDto)
  educations?: CandidateResumeEducationInputDto[];
}
