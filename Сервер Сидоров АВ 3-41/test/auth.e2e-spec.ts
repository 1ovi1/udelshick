import { Role } from '../src/domain/entities/enums/role.enum';
import { E2eTestContext } from './base/e2e-test-context';
import { expectProblemDetails } from './helpers/problem-details.helper';
import { uniqueEmail } from './helpers/test-ids.helper';

describe('Auth API (e2e)', () => {
  let context: E2eTestContext;
  let contextReady = false;

  beforeEach(async () => {
    context = await E2eTestContext.create();
    contextReady = true;
  });

  afterEach(async () => {
    if (contextReady) {
      await context.close();
      contextReady = false;
    }
  });

  it('registers candidate and returns profile name in /auth/me', async () => {
    const response = await context.http.post('/auth/register').send({
      email: uniqueEmail('auth-register'),
      password: 'Password123',
      role: Role.CANDIDATE,
      firstName: 'Dmitry',
      lastName: 'Sidorov',
      phone: '+375 29 333 33 33',
    });

    expect(response.status).toBe(201);
    expect(response.body.data.access_token).toBeDefined();

    const meResponse = await context.http
      .get('/auth/me')
      .set(context.authHeader(response.body.data.access_token));

    expect(meResponse.status).toBe(200);
    expect(meResponse.body.data).toEqual(
      expect.objectContaining({
        role: Role.CANDIDATE,
        name: 'Dmitry Sidorov',
      }),
    );
  });

  it('returns 409 ProblemDetails when registering duplicate email', async () => {
    const email = uniqueEmail('auth-duplicate');

    const first = await context.http.post('/auth/register').send({
      email,
      password: 'Password123',
      role: Role.CANDIDATE,
      firstName: 'Ivan',
      lastName: 'Petrov',
      phone: '+375 29 444 44 44',
    });

    expect(first.status).toBe(201);

    const second = await context.http.post('/auth/register').send({
      email,
      password: 'Password123',
      role: Role.CANDIDATE,
      firstName: 'Ivan',
      lastName: 'Petrov',
      phone: '+375 29 444 44 44',
    });

    expectProblemDetails(second, 409, 'существует');
  });

  it('returns 400 ProblemDetails for invalid registration payload', async () => {
    const response = await context.http.post('/auth/register').send({
      email: uniqueEmail('auth-invalid'),
      password: 'short',
      role: Role.CANDIDATE,
    });

    expectProblemDetails(response, 400);
    expect(Array.isArray(response.body.errors)).toBe(true);
  });

  it('returns 401 ProblemDetails for invalid login credentials', async () => {
    const email = uniqueEmail('auth-login');

    const registration = await context.http.post('/auth/register').send({
      email,
      password: 'Password123',
      role: Role.CANDIDATE,
      firstName: 'Anna',
      lastName: 'Ivanova',
      phone: '+375 29 555 55 55',
    });

    expect(registration.status).toBe(201);

    const login = await context.http.post('/auth/login').send({
      email,
      password: 'WrongPassword123',
    });

    expectProblemDetails(login, 401, 'Invalid credentials');
  });

  it('returns 401 ProblemDetails for /auth/me without token', async () => {
    const response = await context.http.get('/auth/me');

    expectProblemDetails(response, 401);
  });
});
