import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class InviteCandidateDto {
  @ApiProperty({
    example: 'vacancy-5d2e7a46-5928-4079-a54c-5a43fc85e0ac',
    description: 'Вакансия компании, на которую приглашается кандидат',
  })
  @IsString()
  vacancyId: string;
}
