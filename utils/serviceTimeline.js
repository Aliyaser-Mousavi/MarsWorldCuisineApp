import { COURSE_KEYS, COURSE_LABELS } from "../store/redux/dinnerMenus";

/**
 * Build a reverse service timeline for a dinner party.
 * Assumes plating/serving order: starter → main → side → dessert
 * with buffer between courses. Returns steps counted back from "guests sit".
 *
 * @param {{ courses: object, guests?: number }} menu
 * @param {Array} meals - MEALS catalog
 * @param {{ serveAt?: Date, bufferMin?: number }} options
 */
export function buildServiceTimeline(menu, meals, options = {}) {
  const bufferMin = options.bufferMin ?? 10;
  const serveAt = options.serveAt ? new Date(options.serveAt) : null;

  const courses = COURSE_KEYS.map((key) => {
    const mealId = menu?.courses?.[key];
    const meal = mealId ? meals.find((m) => m.id === mealId) : null;
    if (!meal) return null;
    return {
      key,
      label: COURSE_LABELS[key],
      meal,
      duration: meal.duration || 30,
    };
  }).filter(Boolean);

  if (!courses.length) return { steps: [], totalLeadMin: 0, serveAt };

  // Serve order: starter, side (with main), main, dessert
  const serveOrder = ["starter", "side", "main", "dessert"];
  const ordered = serveOrder
    .map((key) => courses.find((c) => c.key === key))
    .filter(Boolean);

  // When each course should hit the table, relative to T0 = sit-down.
  let offsetFromSit = 0;
  const hitTable = {};
  ordered.forEach((course, index) => {
    hitTable[course.key] = offsetFromSit;
    if (index < ordered.length - 1) {
      // Side often lands with main — shorter gap after side if main follows.
      const gap =
        course.key === "side" && ordered[index + 1]?.key === "main"
          ? 0
          : bufferMin;
      offsetFromSit += gap;
    }
  });

  const steps = courses
    .map((course) => {
      const plateAt = hitTable[course.key] ?? 0;
      const startOffset = plateAt - course.duration; // minutes relative to sit
      return {
        ...course,
        plateAt,
        startOffset,
        startLabel: formatRelative(startOffset),
        plateLabel: formatRelative(plateAt),
      };
    })
    .sort((a, b) => a.startOffset - b.startOffset);

  const earliest = Math.min(...steps.map((s) => s.startOffset));
  const totalLeadMin = Math.abs(Math.min(0, earliest));

  // Absolute clock times if serveAt provided
  if (serveAt && !Number.isNaN(serveAt.getTime())) {
    steps.forEach((step) => {
      step.startTime = addMinutes(serveAt, step.startOffset);
      step.plateTime = addMinutes(serveAt, step.plateAt);
      step.startClock = formatClock(step.startTime);
      step.plateClock = formatClock(step.plateTime);
    });
  }

  return { steps, totalLeadMin, serveAt };
}

function formatRelative(minutesFromSit) {
  if (minutesFromSit === 0) return "when guests sit";
  if (minutesFromSit > 0) return `${minutesFromSit} min after sitting`;
  return `${Math.abs(minutesFromSit)} min before sitting`;
}

function addMinutes(date, mins) {
  return new Date(date.getTime() + mins * 60 * 1000);
}

function formatClock(date) {
  const h = date.getHours();
  const m = date.getMinutes();
  const ampm = h >= 12 ? "PM" : "AM";
  const hr = h % 12 || 12;
  return `${hr}:${String(m).padStart(2, "0")} ${ampm}`;
}

/**
 * Suggest freeze batch size + thaw plan days for a meal.
 */
export function planBatchFreeze({
  baseServings = 2,
  batches = 2,
  thawDays = ["wednesday", "friday"],
}) {
  const totalServings = baseServings * batches;
  const portions = batches;
  return {
    baseServings,
    batches,
    totalServings,
    portions,
    thawDays,
    tip:
      batches >= 3
        ? "Cool completely, label with date, freeze flat in bags."
        : "Freeze in meal-sized containers for easy weeknights.",
  };
}
