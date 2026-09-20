import { normalizeIngredient, scoreRecipeAgainstPantry } from "./pantry";

const STOP = new Set([
  "cup",
  "cups",
  "tbsp",
  "tsp",
  "tablespoon",
  "tablespoons",
  "teaspoon",
  "teaspoons",
  "ounce",
  "ounces",
  "oz",
  "lb",
  "lbs",
  "pound",
  "pounds",
  "g",
  "kg",
  "ml",
  "l",
  "of",
  "and",
  "or",
  "to",
  "the",
  "a",
  "an",
  "fresh",
  "dried",
  "chopped",
  "sliced",
  "diced",
  "minced",
  "large",
  "small",
  "medium",
  "optional",
  "pinch",
  "dash",
  "taste",
  "piece",
  "pieces",
  "clove",
  "cloves",
  "can",
  "package",
  "pack",
]);

/** Pull meaningful ingredient tokens from a cooked meal. */
export function extractLeftoverTokens(meal, limit = 8) {
  if (!meal?.ingredients?.length) return [];
  const scores = new Map();

  meal.ingredients.forEach((line) => {
    const norm = normalizeIngredient(line);
    const words = norm.split(" ").filter((w) => w.length > 2 && !STOP.has(w));
    // Prefer 1–2 word phrases from the end (usually the food name).
    const phrase =
      words.length >= 2
        ? `${words[words.length - 2]} ${words[words.length - 1]}`
        : words[words.length - 1] || "";
    if (!phrase) return;
    scores.set(phrase, (scores.get(phrase) || 0) + 2);
    words.forEach((w) => {
      if (w.length > 3) scores.set(w, (scores.get(w) || 0) + 1);
    });
  });

  return [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([token]) => token)
    .slice(0, limit);
}

function mealSharesToken(meal, token) {
  const t = normalizeIngredient(token);
  if (!t) return false;
  return meal.ingredients.some((line) =>
    normalizeIngredient(line).includes(t),
  );
}

/**
 * Suggest remix meals from recent cooks + pantry.
 * Returns rows: { meal, score, sharedTokens, pantryRatio, fromMeal }
 */
export function suggestLeftoverRemixes({
  meals,
  metaById = {},
  pantryItems = [],
  prefs = {},
  limit = 12,
}) {
  const recentCooks = Object.entries(metaById)
    .filter(([, m]) => m.cookedAt?.length)
    .map(([id, m]) => ({
      meal: meals.find((meal) => meal.id === id),
      lastCooked: m.cookedAt[0],
    }))
    .filter((row) => row.meal)
    .sort((a, b) => new Date(b.lastCooked) - new Date(a.lastCooked))
    .slice(0, 5);

  if (!recentCooks.length) return { sources: [], suggestions: [] };

  const sourceTokens = new Map(); // token -> source meal title
  recentCooks.forEach(({ meal }) => {
    extractLeftoverTokens(meal).forEach((token) => {
      if (!sourceTokens.has(token)) sourceTokens.set(token, meal.title);
    });
  });

  const cookedIds = new Set(recentCooks.map((r) => r.meal.id));
  const tokens = [...sourceTokens.keys()];

  const suggestions = meals
    .filter((meal) => {
      if (cookedIds.has(meal.id)) return false;
      if (prefs.glutenFree && !meal.isGlutenFree) return false;
      if (prefs.vegan && !meal.isVegan) return false;
      if (prefs.vegetarian && !meal.isVegetarian) return false;
      if (prefs.lactoseFree && !meal.isLactoseFree) return false;
      if (prefs.defaultMaxDuration && meal.duration > prefs.defaultMaxDuration) {
        return false;
      }
      return true;
    })
    .map((meal) => {
      const shared = tokens.filter((t) => mealSharesToken(meal, t));
      if (!shared.length) return null;
      const pantry = scoreRecipeAgainstPantry(meal, pantryItems);
      const score =
        shared.length * 3 +
        pantry.ratio * 4 +
        (meal.duration <= 30 ? 1 : 0) +
        (meal.isVegetarian || meal.isVegan ? 0.5 : 0);
      return {
        meal,
        score,
        sharedTokens: shared.slice(0, 4),
        pantryRatio: pantry.ratio,
        fromLabel: sourceTokens.get(shared[0]) || "recent cooks",
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return {
    sources: recentCooks.map((r) => r.meal),
    suggestions,
  };
}
