import { Role } from '../../src/domain/entities/enums/role.enum';
import { E2eTestContext } from '../base/e2e-test-context';
import { uniqueEmail } from '../helpers/test-ids.helper';

type RegisterResult = {
  token: string;
  authId: string;
  email: string;
};

export class AuthFactory {
  constructor(private readonly context: E2eTestContext) {}

  async registerCandidate(overrides?: {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  }): Promise<RegisterResult> {
    const payload = {
      email: overrides?.email ?? uniqueEmail('candidate'),
      password: overrides?.password ?? 'Password123',
      role: Role.CANDIDATE,
      firstName: overrides?.firstName ?? 'Ivan',
      lastName: overrides?.lastName ?? 'Petrov',
      phone: overrides?.phone ?? '+375 29 111 11 11',
    };

    const response = await this.context.http
      .post('/auth/register')
      .send(payload);

    expect(response.status).toBe(201);

    return {
      token: response.body.data.access_token,
      authId: response.body.data.authId,
      email: payload.email,
    };
  }

  async registerCompany(overrides?: {
    email?: string;
    password?: string;
    companyName?: string;
    contactPerson?: string;
    phone?: string;
    address?: string;
  }): Promise<RegisterResult> {
    const payload = {
      email: overrides?.email ?? uniqueEmail('company'),
      password: overrides?.password ?? 'Password123',
      role: Role.COMPANY,
      companyName: overrides?.companyName ?? 'Acme Corp',
      contactPerson: overrides?.contactPerson ?? 'Alice Smith',
      phone: overrides?.phone ?? '+375 29 222 22 22',
      address: overrides?.address ?? 'Minsk, Pobediteley 1',
    };

    const response = await this.context.http
      .post('/auth/register')
      .send(payload);

    expect(response.status).toBe(201);

    return {
      token: response.body.data.access_token,
      authId: response.body.data.authId,
      email: payload.email,
    };
  }

  async loginAdmin(): Promise<{ token: string; authId: string }> {
    const response = await this.context.http.post('/auth/login').send({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    });

    expect(response.status).toBe(200);

    return {
      token: response.body.data.access_token,
      authId: response.body.data.authId,
    };
  }
}
