import { CATEGORIES, MEALS } from "../data/dummy-data";

/**
 * Cuisine stamp card from cook history.
 * Each category is a stamp: locked / visited / frequent.
 */
export function buildFlavorPassport(metaById = {}) {
  const counts = {};
  Object.entries(metaById || {}).forEach(([mealId, meta]) => {
    const times = meta.cookedAt?.length || 0;
    if (!times) return;
    const meal = MEALS.find((m) => m.id === mealId);
    if (!meal) return;
    meal.categoryIds.forEach((cid) => {
      counts[cid] = (counts[cid] || 0) + times;
    });
  });

  const stamps = CATEGORIES.map((cat) => {
    const cooked = counts[cat.id] || 0;
    let status = "locked";
    if (cooked >= 3) status = "frequent";
    else if (cooked >= 1) status = "visited";
    return {
      id: cat.id,
      title: cat.title,
      imageUrl: cat.imageUrl || cat.color,
      cooked,
      status,
    };
  }).sort((a, b) => b.cooked - a.cooked || a.title.localeCompare(b.title));

  const visited = stamps.filter((s) => s.status !== "locked").length;
  const frequent = stamps.filter((s) => s.status === "frequent").length;
  const total = stamps.length;
  const nextTarget = stamps.find((s) => s.status === "locked");

  return {
    stamps,
    visited,
    frequent,
    total,
    progress: total ? visited / total : 0,
    nextTarget,
  };
}
