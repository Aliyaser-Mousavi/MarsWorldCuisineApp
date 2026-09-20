import { scoreRecipeAgainstPantry } from "./pantry";

const COMPLEXITY_RANK = { simple: 1, challenging: 2, hard: 3 };
const AFFORD_RANK = { affordable: 1, pricey: 2, luxurious: 3 };

function complexityScore(meal) {
  return COMPLEXITY_RANK[String(meal.complexity || "").toLowerCase()] || 2;
}

function affordScore(meal) {
  return AFFORD_RANK[String(meal.affordability || "").toLowerCase()] || 2;
}

function dietTags(meal) {
  const tags = [];
  if (meal.isVegan) tags.push("Vegan");
  else if (meal.isVegetarian) tags.push("Vegetarian");
  if (meal.isGlutenFree) tags.push("GF");
  if (meal.isLactoseFree) tags.push("LF");
  return tags;
}

function pantryPct(meal, pantryItems) {
  if (!pantryItems?.length) return null;
  const { ratio } = scoreRecipeAgainstPantry(meal, pantryItems);
  return Math.round(ratio * 100);
}

/**
 * Compare two meals for a "which tonight?" duel.
 * Returns metrics + a suggested winner with reasons.
 */
export function duelMeals(a, b, { pantryItems = [], prefs = {}, metaById = {} } = {}) {
  if (!a || !b) return null;

  const metrics = [
    {
      id: "duration",
      label: "Time",
      a: `${a.duration} min`,
      b: `${b.duration} min`,
      winner: a.duration === b.duration ? null : a.duration < b.duration ? "a" : "b",
    },
    {
      id: "complexity",
      label: "Complexity",
      a: a.complexity,
      b: b.complexity,
      winner:
        complexityScore(a) === complexityScore(b)
          ? null
          : complexityScore(a) < complexityScore(b)
            ? "a"
            : "b",
    },
    {
      id: "affordability",
      label: "Cost",
      a: a.affordability,
      b: b.affordability,
      winner:
        affordScore(a) === affordScore(b)
          ? null
          : affordScore(a) < affordScore(b)
            ? "a"
            : "b",
    },
    {
      id: "ingredients",
      label: "Ingredients",
      a: String(a.ingredients.length),
      b: String(b.ingredients.length),
      winner:
        a.ingredients.length === b.ingredients.length
          ? null
          : a.ingredients.length < b.ingredients.length
            ? "a"
            : "b",
    },
  ];

  const panA = pantryPct(a, pantryItems);
  const panB = pantryPct(b, pantryItems);
  if (panA != null || panB != null) {
    metrics.push({
      id: "pantry",
      label: "Pantry match",
      a: panA != null ? `${panA}%` : "—",
      b: panB != null ? `${panB}%` : "—",
      winner:
        panA == null || panB == null || panA === panB
          ? null
          : panA > panB
            ? "a"
            : "b",
    });
  }

  const ratingA = metaById[a.id]?.rating || 0;
  const ratingB = metaById[b.id]?.rating || 0;
  if (ratingA || ratingB) {
    metrics.push({
      id: "rating",
      label: "Your rating",
      a: ratingA ? `${ratingA}★` : "—",
      b: ratingB ? `${ratingB}★` : "—",
      winner:
        !ratingA || !ratingB || ratingA === ratingB
          ? ratingA && !ratingB
            ? "a"
            : ratingB && !ratingA
              ? "b"
              : null
          : ratingA > ratingB
            ? "a"
            : "b",
    });
  }

  let scoreA = 0;
  let scoreB = 0;
  metrics.forEach((m) => {
    if (m.winner === "a") scoreA += 1;
    if (m.winner === "b") scoreB += 1;
  });

  // Soft preference nudge
  if (prefs.vegan) {
    if (a.isVegan && !b.isVegan) scoreA += 0.5;
    if (b.isVegan && !a.isVegan) scoreB += 0.5;
  } else if (prefs.vegetarian) {
    if (a.isVegetarian && !b.isVegetarian) scoreA += 0.5;
    if (b.isVegetarian && !a.isVegetarian) scoreB += 0.5;
  }

  const suggested =
    scoreA === scoreB ? null : scoreA > scoreB ? "a" : "b";

  return {
    metrics,
    scoreA,
    scoreB,
    suggested,
    tagsA: dietTags(a),
    tagsB: dietTags(b),
  };
}

export function pickDuelPair(meals, prefs = {}, excludeIds = []) {
  const pool = meals.filter((meal) => {
    if (excludeIds.includes(meal.id)) return false;
    if (prefs.glutenFree && !meal.isGlutenFree) return false;
    if (prefs.vegan && !meal.isVegan) return false;
    if (prefs.vegetarian && !meal.isVegetarian) return false;
    if (prefs.lactoseFree && !meal.isLactoseFree) return false;
    if (prefs.defaultMaxDuration && meal.duration > prefs.defaultMaxDuration) {
      return false;
    }
    return true;
  });
  if (pool.length < 2) return null;
  const i = Math.floor(Math.random() * pool.length);
  let j = Math.floor(Math.random() * pool.length);
  while (j === i) j = Math.floor(Math.random() * pool.length);
  return [pool[i], pool[j]];
}
