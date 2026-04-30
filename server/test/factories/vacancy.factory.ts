import { ExperienceLevel } from '../../src/domain/entities/enums/experience-level.enum';
import { E2eTestContext } from '../base/e2e-test-context';

export class VacancyFactory {
  constructor(private readonly context: E2eTestContext) {}

  async createPublishedVacancy(params: {
    companyToken: string;
    adminToken: string;
    skillIds: string[];
  }): Promise<string> {
    const createResponse = await this.context.http
      .post('/company/vacancies')
      .set(this.context.authHeader(params.companyToken))
      .send({
        position: 'Frontend Developer',
        location: 'Minsk',
        salary: 3500,
        experienceLevel: ExperienceLevel.MIDDLE,
        requirements: 'Angular, TypeScript, REST APIs and code review',
        skillIds: params.skillIds,
      });

    expect(createResponse.status).toBe(201);

    const vacancyId = createResponse.body.data.id as string;

    const reviewResponse = await this.context.http
      .patch(`/company/vacancies/${vacancyId}/publish`)
      .set(this.context.authHeader(params.companyToken));

    expect(reviewResponse.status).toBe(200);

    const publishResponse = await this.context.http
      .patch(`/admin/vacancies/${vacancyId}/publish`)
      .set(this.context.authHeader(params.adminToken));

    expect(publishResponse.status).toBe(200);

    return vacancyId;
  }
}
