import { MEALS } from "../data/dummy-data";

export const MOODS = [
  { id: "all", label: "For you", hint: "Balanced pick" },
  { id: "quick", label: "Quick", hint: "Under 30 min" },
  { id: "fresh", label: "Fresh", hint: "Lighter plates" },
  { id: "comfort", label: "Comfort", hint: "Hearty cooking" },
  { id: "feast", label: "Feast", hint: "Weekend energy" },
];

function daySeed(date = new Date()) {
  const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function matchesPrefs(meal, prefs) {
  if (prefs?.glutenFree && !meal.isGlutenFree) return false;
  if (prefs?.vegan && !meal.isVegan) return false;
  if (prefs?.vegetarian && !meal.isVegetarian) return false;
  if (prefs?.lactoseFree && !meal.isLactoseFree) return false;
  if (prefs?.defaultMaxDuration && meal.duration > prefs.defaultMaxDuration) {
    return false;
  }
  return true;
}

function matchesMood(meal, mood) {
  switch (mood) {
    case "quick":
      return meal.duration <= 30;
    case "fresh":
      return meal.isVegetarian || meal.isVegan || meal.duration <= 35;
    case "comfort":
      return meal.duration >= 40 || meal.complexity === "hard";
    case "feast":
      return meal.duration >= 55 || meal.steps.length >= 8;
    default:
      return true;
  }
}

function scoreMeal(meal, { prefs, metaById, favoriteIds, hour }) {
  let score = 10;
  const meta = metaById?.[meal.id];

  if (favoriteIds?.includes(meal.id)) score += 8;
  if (meta?.rating) score += meta.rating * 3;
  if (meta?.cookedAt?.length) score -= Math.min(meta.cookedAt.length * 2, 8);

  if (hour >= 17 && hour <= 21 && meal.duration <= 40) score += 6;
  if (hour < 11 && meal.duration <= 25) score += 4;
  if (hour >= 11 && hour < 15 && meal.duration <= 45) score += 3;

  if (matchesPrefs(meal, prefs)) score += 5;
  else score -= 20;

  score += (meal.id.charCodeAt(1) || 0) % 5;
  return score;
}

export function getTimeGreeting(date = new Date()) {
  const hour = date.getHours();
  if (hour < 11) return { title: "Good morning", line: "Start light, cook happy." };
  if (hour < 16) return { title: "Good afternoon", line: "Something satisfying for later." };
  if (hour < 21) return { title: "Tonight", line: "One clear idea for dinner." };
  return { title: "Late kitchen", line: "Keep it simple and good." };
}

export function pickTonightMeal({
  mood = "all",
  prefs,
  metaById = {},
  favoriteIds = [],
  excludeIds = [],
  shuffle = 0,
  date = new Date(),
} = {}) {
  const hour = date.getHours();
  const pool = MEALS.filter(
    (meal) =>
      matchesPrefs(meal, prefs) &&
      matchesMood(meal, mood) &&
      !excludeIds.includes(meal.id),
  );

  const candidates = (pool.length ? pool : MEALS.filter((m) => matchesMood(m, mood)))
    .map((meal) => ({
      meal,
      score: scoreMeal(meal, { prefs, metaById, favoriteIds, hour }),
    }))
    .sort((a, b) => b.score - a.score);

  if (!candidates.length) return MEALS[0];

  const top = candidates.slice(0, Math.min(12, candidates.length));
  const index = (daySeed(date) + shuffle) % top.length;
  return top[index].meal;
}

export function getRatedMeals(metaById = {}, limit = 6) {
  return Object.entries(metaById)
    .filter(([, meta]) => meta?.rating >= 4)
    .sort((a, b) => (b[1].rating || 0) - (a[1].rating || 0))
    .map(([id]) => MEALS.find((m) => m.id === id))
    .filter(Boolean)
    .slice(0, limit);
}

export function getWhyPicked(meal, prefs, hour = new Date().getHours()) {
  const reasons = [];
  if (hour >= 17 && meal.duration <= 40) reasons.push("Fits a weeknight pace");
  if (meal.duration <= 30) reasons.push(`${meal.duration} minutes`);
  if (meal.isVegetarian) reasons.push("Vegetarian-friendly");
  if (meal.isVegan) reasons.push("Fully vegan");
  if (prefs?.glutenFree && meal.isGlutenFree) reasons.push("Matches gluten-free");
  if (meal.complexity === "simple") reasons.push("Simple steps");
  if (!reasons.length) reasons.push(`${meal.complexity} · ${meal.affordability}`);
  return reasons.slice(0, 3);
}
