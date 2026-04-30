import { describe, beforeEach, afterEach, it } from 'node:test';
import { E2eTestContext } from './base/e2e-test-context';
import { AuthFactory } from './factories/auth.factory';
import { CatalogFactory } from './factories/catalog.factory';
import { VacancyFactory } from './factories/vacancy.factory';
import { expectProblemDetails } from './helpers/problem-details.helper';

type SeededVacancyContext = {
  candidateToken: string;
  companyToken: string;
  vacancyId: string;
};

describe('Applications flow (e2e)', () => {
  let context: E2eTestContext;
  let authFactory: AuthFactory;
  let catalogFactory: CatalogFactory;
  let vacancyFactory: VacancyFactory;
  let contextReady = false;

  beforeEach(async () => {
    context = await E2eTestContext.create();
    authFactory = new AuthFactory(context);
    catalogFactory = new CatalogFactory(context.dataSource);
    vacancyFactory = new VacancyFactory(context);
    contextReady = true;
  });

  afterEach(async () => {
    if (contextReady) {
      await context.close();
      contextReady = false;
    }
  });

  async function preparePublishedVacancy(): Promise<SeededVacancyContext> {
    const admin = await authFactory.loginAdmin();
    const company = await authFactory.registerCompany();
    const candidate = await authFactory.registerCandidate();
    const skill = await catalogFactory.createSkill('TypeScript');

    const vacancyId = await vacancyFactory.createPublishedVacancy({
      companyToken: company.token,
      adminToken: admin.token,
      skillIds: [skill.id],
    });

    return {
      candidateToken: candidate.token,
      companyToken: company.token,
      vacancyId,
    };
  }

  async function upsertResume(
    candidateToken: string,
    skillId: string,
  ): Promise<void> {
    const resumeResponse = await context.http
      .put('/candidate/resume')
      .set(context.authHeader(candidateToken))
      .send({
        profession: 'Frontend Engineer',
        location: 'Minsk',
        expectedSalary: 3200,
        about: 'Angular developer with strong API integration experience',
        skillIds: [skillId],
        experiences: [],
        educations: [],
      });

    expect(resumeResponse.status).toBe(200);
  }

  it('returns 400 when candidate applies without resume', async () => {
    const seeded = await preparePublishedVacancy();

    const response = await context.http
      .post(`/candidate/vacancies/${seeded.vacancyId}/apply`)
      .set(context.authHeader(seeded.candidateToken))
      .send({
        coverLetter: 'I am interested in this role.',
      });

    expectProblemDetails(response, 400, 'резюме');
  });

  it('creates application and returns 400 on duplicate apply', async () => {
    const seeded = await preparePublishedVacancy();
    const candidateSkills = await context.http
      .get('/candidate/skills')
      .set(context.authHeader(seeded.candidateToken));

    expect(candidateSkills.status).toBe(200);
    const firstSkillId = candidateSkills.body.data[0].id as string;

    await upsertResume(seeded.candidateToken, firstSkillId);

    const firstApply = await context.http
      .post(`/candidate/vacancies/${seeded.vacancyId}/apply`)
      .set(context.authHeader(seeded.candidateToken))
      .send({
        coverLetter: 'Ready for interview',
      });

    expect(firstApply.status).toBe(200);

    const secondApply = await context.http
      .post(`/candidate/vacancies/${seeded.vacancyId}/apply`)
      .set(context.authHeader(seeded.candidateToken))
      .send({
        coverLetter: 'Second try',
      });

    expectProblemDetails(secondApply, 400);
  });

  it('returns 404 when deleting missing candidate application', async () => {
    const seeded = await preparePublishedVacancy();

    const response = await context.http
      .delete('/candidate/applications/application-missing-id')
      .set(context.authHeader(seeded.candidateToken));

    expectProblemDetails(response, 404, 'Отклик не найден');
  });

  it('returns 403 when candidate attempts company applications endpoint', async () => {
    const seeded = await preparePublishedVacancy();

    const response = await context.http
      .get('/company/applications?page=1&limit=10')
      .set(context.authHeader(seeded.candidateToken));

    expectProblemDetails(response, 403);
  });

  it('allows company to manage application statuses after candidate apply', async () => {
    const seeded = await preparePublishedVacancy();

    const candidateSkills = await context.http
      .get('/candidate/skills')
      .set(context.authHeader(seeded.candidateToken));
    expect(candidateSkills.status).toBe(200);
    const firstSkillId = candidateSkills.body.data[0].id as string;

    await upsertResume(seeded.candidateToken, firstSkillId);

    const apply = await context.http
      .post(`/candidate/vacancies/${seeded.vacancyId}/apply`)
      .set(context.authHeader(seeded.candidateToken))
      .send({
        coverLetter: 'Please review my application',
      });
    expect(apply.status).toBe(200);

    const applications = await context.http
      .get('/company/applications?page=1&limit=10')
      .set(context.authHeader(seeded.companyToken));

    expect(applications.status).toBe(200);
    expect(applications.body.data.items.length).toBeGreaterThan(0);

    const applicationId = applications.body.data.items[0]
      .applicationId as string;

    const invite = await context.http
      .patch(`/company/applications/${applicationId}/invite`)
      .set(context.authHeader(seeded.companyToken));

    expect(invite.status).toBe(200);

    const reject = await context.http
      .patch(`/company/applications/${applicationId}/reject`)
      .set(context.authHeader(seeded.companyToken));

    expect(reject.status).toBe(200);
  });
});
