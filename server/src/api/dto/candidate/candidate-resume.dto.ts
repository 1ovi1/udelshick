import { ApiProperty } from '@nestjs/swagger';
import { CandidateResumeEducationItemDto } from './candidate-resume-education-item.dto';
import { CandidateResumeExperienceItemDto } from './candidate-resume-experience-item.dto';
import { CandidateSkillItemDto } from './candidate-skill-item.dto';

export class CandidateResumeDto {
  @ApiProperty({ example: 'resume-8ec8b5c8-86fd-4813-9cb3-8f13ea6d85ec' })
  id: string;

  @ApiProperty({
    example: 'candidate-profile-8ec8b5c8-86fd-4813-9cb3-8f13ea6d85ec',
  })
  candidateProfileId: string;

  @ApiProperty({ example: 'Frontend Developer' })
  profession: string;

  @ApiProperty({ example: 'Минск' })
  location: string;

  @ApiProperty({ example: 3200, nullable: true })
  expectedSalary: number | null;

  @ApiProperty({
    example: 'Разрабатываю современные веб-приложения на Angular.',
    nullable: true,
  })
  about: string | null;

  @ApiProperty({
    example: 'https://example.com/files/resume.pdf',
    nullable: true,
  })
  resumePdfUrl: string | null;

  @ApiProperty({ type: CandidateSkillItemDto, isArray: true })
  skills: CandidateSkillItemDto[];

  @ApiProperty({ type: CandidateResumeExperienceItemDto, isArray: true })
  experiences: CandidateResumeExperienceItemDto[];

  @ApiProperty({ type: CandidateResumeEducationItemDto, isArray: true })
  educations: CandidateResumeEducationItemDto[];
}
