/**
 * Pull a usable countdown (seconds) from a cooking step string.
 * Handles: "10 minutes", "30 min", "1 hour", "simmer for 15 mins", "rest 5–10 minutes"
 */
export function extractStepTimer(stepText) {
  if (!stepText) return null;
  const text = String(stepText).toLowerCase();

  // Prefer ranges — use the upper bound (safer kitchen wait).
  const rangeMin = text.match(
    /(\d+)\s*[–\-to]+\s*(\d+)\s*(minutes?|mins?|min)\b/,
  );
  if (rangeMin) {
    const secs = parseInt(rangeMin[2], 10) * 60;
    return {
      seconds: secs,
      label: `${rangeMin[2]} min`,
    };
  }

  const rangeHour = text.match(
    /(\d+)\s*[–\-to]+\s*(\d+)\s*(hours?|hrs?|hr)\b/,
  );
  if (rangeHour) {
    const secs = parseInt(rangeHour[2], 10) * 3600;
    return {
      seconds: secs,
      label: `${rangeHour[2]} hr`,
    };
  }

  const hours = text.match(/(\d+(?:\.\d+)?)\s*(hours?|hrs?|hr)\b/);
  if (hours) {
    const n = parseFloat(hours[1]);
    return {
      seconds: Math.round(n * 3600),
      label: n === 1 ? "1 hr" : `${n} hr`,
    };
  }

  const mins = text.match(/(\d+)\s*(minutes?|mins?|min)\b/);
  if (mins) {
    const n = parseInt(mins[1], 10);
    if (n > 0 && n <= 240) {
      return {
        seconds: n * 60,
        label: `${n} min`,
      };
    }
  }

  const seconds = text.match(/(\d+)\s*(seconds?|secs?|sec)\b/);
  if (seconds) {
    const n = parseInt(seconds[1], 10);
    if (n >= 10 && n <= 600) {
      return {
        seconds: n,
        label: `${n} sec`,
      };
    }
  }

  return null;
}

export function formatCountdown(totalSeconds) {
  const s = Math.max(0, totalSeconds);
  const m = Math.floor(s / 60);
  const r = s % 60;
  if (m >= 60) {
    const h = Math.floor(m / 60);
    const mm = m % 60;
    return `${h}:${mm.toString().padStart(2, "0")}:${r.toString().padStart(2, "0")}`;
  }
  return `${m.toString().padStart(2, "0")}:${r.toString().padStart(2, "0")}`;
}
