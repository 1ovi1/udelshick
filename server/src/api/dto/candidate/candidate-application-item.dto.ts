import { ApplicationStatus } from '@domain/entities/enums/application-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CandidateApplicationItemDto {
  @ApiProperty({ example: 'application-8ec8b5c8-86fd-4813-9cb3-8f13ea6d85ec' })
  applicationId: string;

  @ApiProperty({ example: 'vacancy-8ec8b5c8-86fd-4813-9cb3-8f13ea6d85ec' })
  vacancyId: string;

  @ApiProperty({ example: 'Frontend Developer' })
  vacancyPosition: string;

  @ApiProperty({ example: 'Acme LLC' })
  companyName: string;

  @ApiProperty({ example: '2026-04-14T09:30:00.000Z' })
  appliedAt: string;

  @ApiProperty({ enum: ApplicationStatus, example: ApplicationStatus.NEW })
  status: ApplicationStatus;
}
