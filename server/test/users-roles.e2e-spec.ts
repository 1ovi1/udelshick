import { E2eTestContext } from './base/e2e-test-context';
import { AuthFactory } from './factories/auth.factory';
import { expectProblemDetails } from './helpers/problem-details.helper';

describe('Users and roles API (e2e)', () => {
  let context: E2eTestContext;
  let authFactory: AuthFactory;
  let contextReady = false;

  beforeEach(async () => {
    context = await E2eTestContext.create();
    authFactory = new AuthFactory(context);
    contextReady = true;
  });

  afterEach(async () => {
    if (contextReady) {
      await context.close();
      contextReady = false;
    }
  });

  it('allows admin to list users and includes candidate/company', async () => {
    const admin = await authFactory.loginAdmin();
    await authFactory.registerCandidate({
      firstName: 'Pavel',
      lastName: 'Kozlov',
    });
    await authFactory.registerCompany({
      companyName: 'DataWave',
    });

    const response = await context.http
      .get('/admin/users?page=1&limit=20')
      .set(context.authHeader(admin.token));

    expect(response.status).toBe(200);
    expect(response.body.data.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Pavel Kozlov' }),
        expect.objectContaining({ name: 'DataWave' }),
      ]),
    );
  });

  it('returns 403 ProblemDetails for candidate on admin route', async () => {
    const candidate = await authFactory.registerCandidate();

    const response = await context.http
      .get('/admin/users?page=1&limit=10')
      .set(context.authHeader(candidate.token));

    expectProblemDetails(response, 403);
  });

  it('returns 404 ProblemDetails when admin deletes unknown user', async () => {
    const admin = await authFactory.loginAdmin();

    const response = await context.http
      .delete('/admin/users/auth-missing-user-id')
      .set(context.authHeader(admin.token));

    expectProblemDetails(response, 404, 'не найден');
  });

  it('returns 400 ProblemDetails when trying to delete admin account', async () => {
    const admin = await authFactory.loginAdmin();

    const response = await context.http
      .delete(`/admin/users/${admin.authId}`)
      .set(context.authHeader(admin.token));

    expectProblemDetails(response, 400);
  });
});
