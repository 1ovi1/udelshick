import { E2eTestContext } from './base/e2e-test-context';
import { AuthFactory } from './factories/auth.factory';
import { CatalogFactory } from './factories/catalog.factory';
import { expectProblemDetails } from './helpers/problem-details.helper';

describe('Skills API and role access (e2e)', () => {
  let context: E2eTestContext;
  let authFactory: AuthFactory;
  let catalogFactory: CatalogFactory;
  let contextReady = false;

  beforeEach(async () => {
    context = await E2eTestContext.create();
    authFactory = new AuthFactory(context);
    catalogFactory = new CatalogFactory(context.dataSource);
    contextReady = true;
  });

  afterEach(async () => {
    if (contextReady) {
      await context.close();
      contextReady = false;
    }
  });

  it('returns seeded skills for candidate and company', async () => {
    const skill = await catalogFactory.createSkill('Angular');
    const candidate = await authFactory.registerCandidate();
    const company = await authFactory.registerCompany();

    const candidateResponse = await context.http
      .get('/candidate/skills')
      .set(context.authHeader(candidate.token));

    expect(candidateResponse.status).toBe(200);
    expect(candidateResponse.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: skill.id, name: skill.name }),
      ]),
    );

    const companyResponse = await context.http
      .get('/company/skills')
      .set(context.authHeader(company.token));

    expect(companyResponse.status).toBe(200);
    expect(companyResponse.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: skill.id, name: skill.name }),
      ]),
    );
  });

  it('returns 403 ProblemDetails when candidate accesses company route', async () => {
    const candidate = await authFactory.registerCandidate();

    const response = await context.http
      .get('/company/skills')
      .set(context.authHeader(candidate.token));

    expectProblemDetails(response, 403);
  });

  it('returns 401 ProblemDetails when skills endpoint is unauthenticated', async () => {
    const response = await context.http.get('/candidate/skills');

    expectProblemDetails(response, 401);
  });
});
