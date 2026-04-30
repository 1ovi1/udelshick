import { Response } from 'supertest';

export function expectProblemDetails(
  response: Response,
  expectedStatus: number,
  detailIncludes?: string,
): void {
  expect(response.status).toBe(expectedStatus);
  expect(response.body).toEqual(
    expect.objectContaining({
      type: `https://httpstatuses.com/${expectedStatus}`,
      title: expect.any(String),
      status: expectedStatus,
      detail: expect.any(String),
      instance: expect.any(String),
      timestamp: expect.any(String),
    }),
  );

  if (detailIncludes) {
    expect(String(response.body.detail)).toContain(detailIncludes);
  }
}
