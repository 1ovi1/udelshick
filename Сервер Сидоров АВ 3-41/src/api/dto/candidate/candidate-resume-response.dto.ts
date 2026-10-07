import { SuccessResponseDto } from '@api/dto/common/api-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { CandidateResumeDto } from './candidate-resume.dto';

export class CandidateResumeResponseDto extends SuccessResponseDto<CandidateResumeDto | null> {
  @ApiProperty({ type: CandidateResumeDto, nullable: true })
  declare data?: CandidateResumeDto | null;
}
