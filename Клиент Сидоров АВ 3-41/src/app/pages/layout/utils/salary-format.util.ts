export function formatSalaryRub(value: number | null): string {
  if (value === null) {
    return 'Не указана';
  }

  return `${new Intl.NumberFormat('ru-RU').format(value)} ₽`;
}
