/** Build a 12-week cooking heat calendar ending today. */
export function buildActivityCalendar(metaById = {}, weeks = 12) {
  const counts = {};
  Object.values(metaById || {}).forEach((meta) => {
    (meta.cookedAt || []).forEach((iso) => {
      const d = new Date(iso);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      counts[key] = (counts[key] || 0) + 1;
    });
  });

  const today = new Date();
  today.setHours(12, 0, 0, 0);

  const totalDays = weeks * 7;
  const start = new Date(today);
  start.setDate(start.getDate() - (totalDays - 1));

  const days = [];
  for (let i = 0; i < totalDays; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    days.push({
      key,
      date: d,
      count: counts[key] || 0,
      isToday:
        d.getFullYear() === today.getFullYear() &&
        d.getMonth() === today.getMonth() &&
        d.getDate() === today.getDate(),
    });
  }

  const max = Math.max(1, ...days.map((d) => d.count));
  return { days, max };
}

export function activityLevel(count, max) {
  if (count <= 0) return 0;
  const ratio = count / max;
  if (ratio >= 0.75) return 3;
  if (ratio >= 0.4) return 2;
  return 1;
}
