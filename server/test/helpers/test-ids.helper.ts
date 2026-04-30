export function uniqueSuffix(): string {
  return `${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
}

export function uniqueEmail(prefix: string): string {
  return `${prefix}-${uniqueSuffix()}@example.com`;
}
