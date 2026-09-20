export const PANTRY_STAPLES = [
  "Olive oil",
  "Salt",
  "Black pepper",
  "Garlic",
  "Onion",
  "Butter",
  "Eggs",
  "Milk",
  "Flour",
  "Sugar",
  "Rice",
  "Pasta",
  "Tomato",
  "Lemon",
  "Chicken",
  "Beef",
  "Fish",
  "Potato",
  "Carrot",
  "Cheese",
  "Yogurt",
  "Bread",
  "Herbs",
  "Chili",
  "Ginger",
  "Soy sauce",
  "Coconut milk",
  "Beans",
  "Spinach",
  "Mushroom",
];

export function normalizeIngredient(text) {
  return String(text)
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ")
    .replace(/[^a-z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function pantryMatchesIngredient(pantryItem, ingredientLine) {
  const p = normalizeIngredient(pantryItem);
  const line = normalizeIngredient(ingredientLine);
  if (!p || !line) return false;
  if (line.includes(p)) return true;
  const parts = p.split(" ").filter((w) => w.length > 2);
  return parts.some((part) => line.includes(part));
}

export function scoreRecipeAgainstPantry(meal, pantryItems) {
  if (!pantryItems?.length) {
    return { matched: 0, total: meal.ingredients.length, ratio: 0, hits: [] };
  }
  const hits = [];
  meal.ingredients.forEach((line) => {
    const match = pantryItems.find((item) =>
      pantryMatchesIngredient(item, line),
    );
    if (match) hits.push({ line, item: match });
  });
  const total = meal.ingredients.length || 1;
  return {
    matched: hits.length,
    total: meal.ingredients.length,
    ratio: hits.length / total,
    hits,
  };
}

export function rankMealsByPantry(meals, pantryItems, limit = 20) {
  if (!pantryItems?.length) return [];
  return meals
    .map((meal) => ({ meal, ...scoreRecipeAgainstPantry(meal, pantryItems) }))
    .filter((row) => row.matched > 0)
    .sort((a, b) => b.ratio - a.ratio || b.matched - a.matched)
    .slice(0, limit);
}

function startOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function parseUseBy(dateStr) {
  if (!dateStr) return null;
  const d = new Date(`${dateStr}T12:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Days until use-by (negative = overdue). */
export function daysUntilUseBy(dateStr, from = new Date()) {
  const target = parseUseBy(dateStr);
  if (!target) return null;
  const ms = startOfDay(target) - startOfDay(from);
  return Math.round(ms / (24 * 60 * 60 * 1000));
}

export function useByUrgency(days) {
  if (days == null) return "none";
  if (days < 0) return "overdue";
  if (days === 0) return "today";
  if (days <= 3) return "soon";
  if (days <= 7) return "week";
  return "ok";
}

/**
 * Pantry items with use-by dates, sorted most urgent first.
 * useByMap: { [lowerName]: 'YYYY-MM-DD' }
 */
export function getUseSoonItems(pantryItems = [], useByMap = {}, withinDays = 7) {
  return pantryItems
    .map((name) => {
      const key = String(name).toLowerCase();
      const date = useByMap[key];
      const days = daysUntilUseBy(date);
      return { name, date, days, urgency: useByUrgency(days) };
    })
    .filter((row) => row.days != null && row.days <= withinDays)
    .sort((a, b) => a.days - b.days);
}

/** Recipes that help burn down urgent pantry items. */
export function suggestUseSoonMeals({
  meals,
  urgentItems,
  pantryItems,
  prefs = {},
  limit = 12,
}) {
  if (!urgentItems?.length) return [];
  const urgentNames = urgentItems.map((u) => u.name);

  return meals
    .filter((meal) => {
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
      const used = urgentNames.filter((item) =>
        meal.ingredients.some((line) => pantryMatchesIngredient(item, line)),
      );
      if (!used.length) return null;
      const pantry = scoreRecipeAgainstPantry(meal, pantryItems);
      const score = used.length * 5 + pantry.ratio * 2 + (meal.duration <= 35 ? 1 : 0);
      return { meal, used, score, pantryRatio: pantry.ratio };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || a.meal.duration - b.meal.duration)
    .slice(0, limit);
}

export function shiftDateIso(daysFromToday) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromToday);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
