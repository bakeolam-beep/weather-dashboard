export function formatDayLabel(dateStr: string): string {
  const parts = dateStr.split('-').map(Number);
  const date = new Date(parts[0], parts[1] - 1, parts[2]);

  const today = new Date();
  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  if (isToday) {
    return 'Today';
  }

  return new Intl.DateTimeFormat(undefined, { weekday: 'long' }).format(date);
}
