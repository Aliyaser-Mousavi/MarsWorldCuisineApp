import { MEALS, CATEGORIES } from "../data/dummy-data";

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

function overlapScore(a, b) {
  const shared = a.categoryIds.filter((id) => b.categoryIds.includes(id));
  let score = shared.length * 12;
  if (a.complexity === b.complexity) score += 4;
  if (a.affordability === b.affordability) score += 3;
  const durDiff = Math.abs(a.duration - b.duration);
  if (durDiff <= 10) score += 5;
  else if (durDiff <= 25) score += 2;
  if (a.isVegetarian === b.isVegetarian) score += 2;
  if (a.isVegan && b.isVegan) score += 3;
  return score;
}

/** Recipes similar to a seed meal, excluding itself. */
export function getSimilarMeals(mealId, { prefs, limit = 6 } = {}) {
  const seed = MEALS.find((m) => m.id === mealId);
  if (!seed) return [];

  return MEALS.filter((m) => m.id !== mealId)
    .filter((m) => matchesPrefs(m, prefs))
    .map((meal) => ({ meal, score: overlapScore(seed, meal) }))
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((row) => row.meal);
}

/**
 * Personalized shelves for Discover:
 * - Because you liked (from favorites + high ratings)
 * - Quick wins
 * - New to you (not recent / not cooked)
 * - Category spotlight
 */
export function buildDiscoverShelves({
  prefs,
  favoriteIds = [],
  metaById = {},
  recentIds = [],
}) {
  const likedIds = [
    ...favoriteIds,
    ...Object.entries(metaById || {})
      .filter(([, m]) => (m.rating || 0) >= 4)
      .map(([id]) => id),
  ];
  const uniqueLiked = [...new Set(likedIds)];
  const likedMeals = uniqueLiked
    .map((id) => MEALS.find((m) => m.id === id))
    .filter(Boolean);

  const becauseYouLiked = [];
  const seen = new Set(uniqueLiked);
  for (const seed of likedMeals.slice(0, 6)) {
    for (const similar of getSimilarMeals(seed.id, { prefs, limit: 4 })) {
      if (seen.has(similar.id)) continue;
      seen.add(similar.id);
      becauseYouLiked.push({ meal: similar, because: seed.title });
      if (becauseYouLiked.length >= 8) break;
    }
    if (becauseYouLiked.length >= 8) break;
  }

  const pool = MEALS.filter((m) => matchesPrefs(m, prefs));

  const quickWins = pool
    .filter((m) => m.duration <= 30)
    .sort((a, b) => a.duration - b.duration)
    .slice(0, 8);

  const cookedIds = new Set(
    Object.entries(metaById || {})
      .filter(([, m]) => (m.cookedAt?.length || 0) > 0)
      .map(([id]) => id),
  );
  const recentSet = new Set(recentIds);
  const newToYou = pool
    .filter((m) => !cookedIds.has(m.id) && !recentSet.has(m.id) && !seen.has(m.id))
    .slice(0, 8);

  const categoryCounts = {};
  likedMeals.forEach((meal) => {
    meal.categoryIds.forEach((id) => {
      categoryCounts[id] = (categoryCounts[id] || 0) + 1;
    });
  });
  const topCatId =
    Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    pool[0]?.categoryIds?.[0];
  const spotlightCat = CATEGORIES.find((c) => c.id === topCatId);
  const spotlightMeals = pool
    .filter((m) => m.categoryIds.includes(topCatId) && !seen.has(m.id))
    .slice(0, 8);

  const shelves = [];

  if (becauseYouLiked.length > 0) {
    shelves.push({
      id: "liked",
      title: "Because you liked",
      subtitle: "Neighbors to your favorites and high ratings",
      kind: "because",
      items: becauseYouLiked,
    });
  }

  if (quickWins.length > 0) {
    shelves.push({
      id: "quick",
      title: "On the table fast",
      subtitle: "Thirty minutes or less",
      kind: "meals",
      items: quickWins.map((meal) => ({ meal })),
    });
  }

  if (spotlightCat && spotlightMeals.length > 0) {
    shelves.push({
      id: "spotlight",
      title: `${spotlightCat.title} spotlight`,
      subtitle: likedMeals.length
        ? "Based on what you cook most"
        : "A cuisine worth exploring",
      kind: "meals",
      items: spotlightMeals.map((meal) => ({ meal })),
    });
  }

  if (newToYou.length > 0) {
    shelves.push({
      id: "new",
      title: "New to your kitchen",
      subtitle: "Not cooked or opened recently",
      kind: "meals",
      items: newToYou.map((meal) => ({ meal })),
    });
  }

  return shelves;
}

/** Consecutive calendar days with at least one cooked meal ending today or yesterday. */
export function getCookingStreak(metaById = {}) {
  const days = new Set();
  Object.values(metaById || {}).forEach((meta) => {
    (meta.cookedAt || []).forEach((iso) => {
      const d = new Date(iso);
      days.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
    });
  });

  if (days.size === 0) return { streak: 0, lastCooked: null };

  const keyFor = (date) =>
    `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  let cursor = days.has(keyFor(today))
    ? today
    : days.has(keyFor(yesterday))
      ? yesterday
      : null;

  if (!cursor) return { streak: 0, lastCooked: null };

  let streak = 0;
  while (days.has(keyFor(cursor))) {
    streak += 1;
    cursor = new Date(cursor);
    cursor.setDate(cursor.getDate() - 1);
  }

  const lastIso = Object.values(metaById)
    .flatMap((m) => m.cookedAt || [])
    .sort((a, b) => new Date(b) - new Date(a))[0];

  return { streak, lastCooked: lastIso || null };
}
