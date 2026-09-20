import { CATEGORIES, MEALS } from "../data/dummy-data";
import { WEEK_DAYS } from "../store/redux/mealPlan";
import { getCookingStreak } from "./discover";

function cookedEntries(metaById) {
  const rows = [];
  Object.entries(metaById || {}).forEach(([mealId, meta]) => {
    (meta.cookedAt || []).forEach((at) => {
      rows.push({ mealId, at });
    });
  });
  return rows.sort((a, b) => new Date(b.at) - new Date(a.at));
}

function cookedInLastDays(metaById, days) {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return cookedEntries(metaById).filter((r) => new Date(r.at).getTime() >= cutoff);
}

function uniqueCuisinesCooked(metaById) {
  const ids = new Set();
  Object.entries(metaById || {}).forEach(([mealId, meta]) => {
    if (!meta.cookedAt?.length) return;
    const meal = MEALS.find((m) => m.id === mealId);
    meal?.categoryIds?.forEach((c) => ids.add(c));
  });
  return ids;
}

/** Static quest catalog — progress is computed locally from kitchen state. */
export const QUEST_DEFS = [
  {
    id: "first-plate",
    title: "First plate",
    blurb: "Cook any recipe once.",
    icon: "restaurant-outline",
    target: 1,
    progress: ({ cookedTotal }) => Math.min(cookedTotal, 1),
  },
  {
    id: "week-trio",
    title: "Three nights in",
    blurb: "Cook three meals in the last 7 days.",
    icon: "flame-outline",
    target: 3,
    progress: ({ cookedWeek }) => Math.min(cookedWeek, 3),
  },
  {
    id: "speed-demon",
    title: "Under 30 twice",
    blurb: "Finish two recipes that take 30 minutes or less.",
    icon: "flash-outline",
    target: 2,
    progress: ({ quickCooks }) => Math.min(quickCooks, 2),
  },
  {
    id: "green-night",
    title: "Green night",
    blurb: "Cook a vegetarian or vegan meal.",
    icon: "leaf-outline",
    target: 1,
    progress: ({ vegCooks }) => Math.min(vegCooks, 1),
  },
  {
    id: "world-tour",
    title: "World tour",
    blurb: "Cook dishes from 4 different cuisines.",
    icon: "globe-outline",
    target: 4,
    progress: ({ cuisineCount }) => Math.min(cuisineCount, 4),
  },
  {
    id: "streak-3",
    title: "Steady flame",
    blurb: "Hold a 3-day cooking streak.",
    icon: "bonfire-outline",
    target: 3,
    progress: ({ streak }) => Math.min(streak, 3),
  },
  {
    id: "pantry-ten",
    title: "Stocked shelves",
    blurb: "Keep at least 10 items in your pantry.",
    icon: "cube-outline",
    target: 10,
    progress: ({ pantryCount }) => Math.min(pantryCount, 10),
  },
  {
    id: "week-planned",
    title: "Week architect",
    blurb: "Put a meal on every day of the meal plan.",
    icon: "calendar-outline",
    target: 7,
    progress: ({ plannedDays }) => Math.min(plannedDays, 7),
  },
  {
    id: "host-night",
    title: "Host with heart",
    blurb: "Build a dinner party menu.",
    icon: "wine-outline",
    target: 1,
    progress: ({ dinnerMenus }) => Math.min(dinnerMenus, 1),
  },
  {
    id: "taste-maker",
    title: "Taste maker",
    blurb: "Rate 5 recipes you've cooked or tried.",
    icon: "star-outline",
    target: 5,
    progress: ({ ratedCount }) => Math.min(ratedCount, 5),
  },
];

export function evaluateQuests(state) {
  const metaById = state.recipeMeta?.byId || {};
  const pantryCount = state.pantry?.items?.length || 0;
  const dinnerMenus = state.dinnerMenus?.menus?.length || 0;
  const week = state.mealPlan?.week || {};

  const cookedTotal = Object.values(metaById).reduce(
    (sum, m) => sum + (m.cookedAt?.length || 0),
    0,
  );
  const weekCooks = cookedInLastDays(metaById, 7);
  const quickCooks = Object.entries(metaById).reduce((sum, [id, meta]) => {
    const meal = MEALS.find((m) => m.id === id);
    if (!meal || meal.duration > 30) return sum;
    return sum + (meta.cookedAt?.length || 0);
  }, 0);
  const vegCooks = Object.entries(metaById).reduce((sum, [id, meta]) => {
    const meal = MEALS.find((m) => m.id === id);
    if (!meal || !(meal.isVegetarian || meal.isVegan)) return sum;
    return sum + (meta.cookedAt?.length || 0);
  }, 0);
  const cuisineCount = uniqueCuisinesCooked(metaById).size;
  const streak = getCookingStreak(metaById).streak;
  const plannedDays = WEEK_DAYS.filter((d) => (week[d] || []).length > 0).length;
  const ratedCount = Object.values(metaById).filter((m) => m.rating > 0).length;

  const ctx = {
    cookedTotal,
    cookedWeek: weekCooks.length,
    quickCooks,
    vegCooks,
    cuisineCount,
    streak,
    pantryCount,
    plannedDays,
    dinnerMenus,
    ratedCount,
  };

  const claimed = new Set(state.quests?.claimedIds || []);

  return QUEST_DEFS.map((def) => {
    const current = def.progress(ctx);
    const complete = current >= def.target;
    return {
      ...def,
      current,
      complete,
      claimed: claimed.has(def.id),
      ratio: Math.min(1, current / def.target),
    };
  });
}

export function cuisineNamesForCooked(metaById) {
  const names = new Set();
  uniqueCuisinesCooked(metaById).forEach((id) => {
    const cat = CATEGORIES.find((c) => c.id === id);
    if (cat) names.add(cat.title);
  });
  return [...names];
}
