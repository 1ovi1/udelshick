import { ApiProperty } from '@nestjs/swagger';

export class CandidateSkillItemDto {
  @ApiProperty({ example: 'skill-angular' })
  id: string;

  @ApiProperty({ example: 'Angular' })
  name: string;
}
