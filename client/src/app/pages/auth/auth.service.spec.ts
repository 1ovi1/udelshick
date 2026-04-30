import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Auth } from './auth.service';

describe('Auth service', () => {
  let service: Auth;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [Auth, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(Auth);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('initializes unauthenticated state when session is absent', async () => {
    await service.initialize();

    expect(service.isInitialized()).toBe(true);
    expect(service.isAuthenticated()).toBe(false);
    expect(service.user()).toBeNull();
  });

  it('restores session when stored token is valid', async () => {
    localStorage.setItem(
      'auth_session',
      JSON.stringify({
        token: 'stored-token',
      }),
    );

    const initializePromise = service.initialize();

    const meRequest = httpMock.expectOne('/api/auth/me');
    expect(meRequest.request.headers.get('Authorization')).toBe('Bearer stored-token');
    meRequest.flush({
      message: 'ok',
      data: {
        id: 'auth-1',
        email: 'candidate@example.com',
        role: 'candidate',
        name: 'John Candidate',
      },
      timestamp: new Date().toISOString(),
    });

    await initializePromise;

    expect(service.isInitialized()).toBe(true);
    expect(service.isAuthenticated()).toBe(true);
    expect(service.role()).toBe('candidate');
    expect(service.user()?.name).toBe('John Candidate');
  });

  it('clears invalid session during initialize', async () => {
    localStorage.setItem(
      'auth_session',
      JSON.stringify({
        token: 'broken-token',
      }),
    );

    const initializePromise = service.initialize();

    const meRequest = httpMock.expectOne('/api/auth/me');
    meRequest.flush({}, { status: 401, statusText: 'Unauthorized' });

    await initializePromise;

    expect(service.isInitialized()).toBe(true);
    expect(service.isAuthenticated()).toBe(false);
    expect(localStorage.getItem('auth_session')).toBeNull();
  });

  it('logs in candidate and persists session', () => {
    let emittedRole: string | null = null;

    service.login({ email: 'candidate@example.com', password: 'Password123' }).subscribe((role) => {
      emittedRole = role;
    });

    const loginRequest = httpMock.expectOne('/api/auth/login');
    expect(loginRequest.request.method).toBe('POST');
    loginRequest.flush({
      message: 'ok',
      data: {
        access_token: 'fresh-token',
        message: 'Login successful',
      },
      timestamp: new Date().toISOString(),
    });

    const meRequest = httpMock.expectOne('/api/auth/me');
    expect(meRequest.request.headers.get('Authorization')).toBe('Bearer fresh-token');
    meRequest.flush({
      message: 'ok',
      data: {
        id: 'auth-2',
        email: 'candidate@example.com',
        role: 'candidate',
        name: 'Candidate Name',
      },
      timestamp: new Date().toISOString(),
    });

    expect(emittedRole).toBe('candidate');
    expect(service.isAuthenticated()).toBe(true);
    expect(service.user()?.email).toBe('candidate@example.com');
    expect(localStorage.getItem('auth_session')).toContain('fresh-token');
  });

  it('registers company and starts authenticated session', () => {
    let emittedRole: string | null = null;

    service
      .registerCompany({
        email: 'company@example.com',
        password: 'Password123',
        companyName: 'Acme',
        contactPerson: 'Alice',
        phone: '+375 29 999 99 99',
        address: 'Minsk',
      })
      .subscribe((role) => {
        emittedRole = role;
      });

    const registerRequest = httpMock.expectOne('/api/auth/register');
    expect(registerRequest.request.method).toBe('POST');
    registerRequest.flush({
      message: 'ok',
      data: {
        access_token: 'company-token',
        message: 'Registration successful',
      },
      timestamp: new Date().toISOString(),
    });

    const meRequest = httpMock.expectOne('/api/auth/me');
    meRequest.flush({
      message: 'ok',
      data: {
        id: 'auth-3',
        email: 'company@example.com',
        role: 'company',
        name: 'Acme',
      },
      timestamp: new Date().toISOString(),
    });

    expect(emittedRole).toBe('company');
    expect(service.role()).toBe('company');
    expect(service.user()?.name).toBe('Acme');
  });

  it('logout clears persisted and in-memory session', () => {
    localStorage.setItem(
      'auth_session',
      JSON.stringify({ token: 'x', user: { id: '1', email: 'e', name: 'n' }, role: 'candidate' }),
    );

    service.logout();

    expect(service.token()).toBeNull();
    expect(service.user()).toBeNull();
    expect(service.role()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
    expect(localStorage.getItem('auth_session')).toBeNull();
  });
});
