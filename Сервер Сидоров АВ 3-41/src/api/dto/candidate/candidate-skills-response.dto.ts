import { SuccessResponseDto } from '@api/dto/common/api-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { CandidateSkillItemDto } from './candidate-skill-item.dto';

export class CandidateSkillsResponseDto extends SuccessResponseDto<
  CandidateSkillItemDto[]
> {
  @ApiProperty({ type: CandidateSkillItemDto, isArray: true })
  declare data?: CandidateSkillItemDto[];
}
