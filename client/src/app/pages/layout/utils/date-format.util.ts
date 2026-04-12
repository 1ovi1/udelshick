export function formatDateRu(value: string | null | undefined): string {
  if (!value) {
    return '-';
  }

  const date = new Date(value);

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function formatDateTimeRu(value: string): string {
  const date = new Date(value);

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}
