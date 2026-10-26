import { useMemo } from "react";
import { useSelector } from "react-redux";
import { MEALS, CATEGORIES } from "../data/dummy-data";
import { CATEGORIES_FA, MEALS_FA } from "../data/dummy-data.fa";
import { scaleIngredientLine } from "./servings";
import { toPersianDigits } from "./formatters";

/**
 * Scale a localized ingredient line using the quantity computed from canonical data.
 */
export function scaleLocalizedIngredientLine(
  canonicalLine,
  localizedLine,
  multiplier = 1,
  isRTL = true,
) {
  if (!localizedLine) return scaleIngredientLine(canonicalLine, multiplier);

  const match = String(canonicalLine).match(
    /^(\d+\s*\/\s*\d+|\d+[.,]\d+|\d+)\s*(.*)$/,
  );

  const displayMultiplier = isRTL ? toPersianDigits(multiplier) : multiplier;

  // If canonical line has no quantity (e.g. "Salt to taste", "Fresh Basil Leaves")
  if (!match) {
    const cleanLocalized = localizedLine.replace(/\{qty\}\s*/g, "").trim();
    return multiplier === 1
      ? cleanLocalized
      : `${cleanLocalized}  ·  ×${displayMultiplier}`;
  }

  const raw = match[1].replace(",", ".").replace(/\s/g, "");
  let value;
  if (raw.includes("/")) {
    const parts = raw.split("/").map(Number);
    value = parts[0] / parts[1];
  } else {
    value = Number(raw);
  }

  if (!Number.isFinite(value)) {
    const cleanLocalized = localizedLine.replace(/\{qty\}\s*/g, "").trim();
    return multiplier === 1
      ? cleanLocalized
      : `${cleanLocalized}  ·  ×${displayMultiplier}`;
  }

  const scaled = value * multiplier;
  const pretty =
    Math.abs(scaled - Math.round(scaled)) < 0.05
      ? String(Math.round(scaled))
      : scaled.toFixed(1).replace(/\.0$/, "");

  const displayPretty = isRTL ? toPersianDigits(pretty) : pretty;

  if (localizedLine.includes("{qty}")) {
    return localizedLine.replace(/\{qty\}/g, displayPretty).trim();
  }

  return `${displayPretty} ${localizedLine}`.trim();
}

/**
 * Returns a localized meal object given a canonical meal and language.
 */
export function getLocalizedMeal(meal, language = "en") {
  if (!meal) return meal;
  if (language !== "fa") return meal;

  const fa = MEALS_FA[meal.id];
  if (!fa) return meal;

  return {
    ...meal,
    title: fa.title || meal.title,
    ingredients: (fa.ingredients && fa.ingredients.length === meal.ingredients.length)
      ? getScaledMealIngredients(meal, 1, "fa")
      : meal.ingredients,
    steps: (fa.steps && fa.steps.length === meal.steps.length)
      ? fa.steps
      : meal.steps,
  };
}

/**
 * Returns localized ingredients scaled by multiplier for the given meal and language.
 */
export function getScaledMealIngredients(meal, multiplier = 1, language = "en") {
  if (!meal) return [];
  const canonicalIngredients = meal.ingredients || [];

  if (language !== "fa") {
    return canonicalIngredients.map((line) =>
      scaleIngredientLine(line, multiplier),
    );
  }

  const fa = MEALS_FA[meal.id];
  if (!fa || !fa.ingredients || fa.ingredients.length !== canonicalIngredients.length) {
    return canonicalIngredients.map((line) =>
      scaleIngredientLine(line, multiplier),
    );
  }

  return canonicalIngredients.map((canonLine, idx) => {
    const faLine = fa.ingredients[idx];
    return scaleLocalizedIngredientLine(canonLine, faLine, multiplier, language === "fa");
  });
}

/**
 * Returns a localized category given a canonical category and language.
 */
export function getLocalizedCategory(category, language = "en") {
  if (!category) return category;
  if (language !== "fa") return category;

  const fa = CATEGORIES_FA[category.id];
  if (!fa) return category;

  return {
    ...category,
    title: fa.title || category.title,
  };
}

/**
 * Returns the localized category title directly.
 */
export function getCategoryTitle(categoryId, language = "en") {
  if (language === "fa" && CATEGORIES_FA[categoryId]) {
    return CATEGORIES_FA[categoryId].title;
  }
  const found = CATEGORIES.find((c) => c.id === categoryId);
  return found ? found.title : "";
}

/**
 * React Hook: returns current language from Redux store.
 */
export function useAppLanguage() {
  return useSelector((state) => state.preferences?.language || "en");
}

/**
 * React Hook: returns a localized meal object for the active language.
 */
export function useLocalizedMeal(meal) {
  const language = useAppLanguage();
  return useMemo(() => getLocalizedMeal(meal, language), [meal, language]);
}

/**
 * React Hook: returns an array of localized meals for the active language.
 */
export function useLocalizedMeals(meals) {
  const language = useAppLanguage();
  return useMemo(() => {
    if (!meals) return [];
    if (language !== "fa") return meals;
    return meals.map((m) => getLocalizedMeal(m, "fa"));
  }, [meals, language]);
}

/**
 * React Hook: returns an array of localized categories for the active language.
 */
export function useLocalizedCategories(categories = CATEGORIES) {
  const language = useAppLanguage();
  return useMemo(() => {
    if (!categories) return [];
    if (language !== "fa") return categories;
    return categories.map((c) => getLocalizedCategory(c, "fa"));
  }, [categories, language]);
}

export const INGREDIENT_TRANSLATIONS_FA = {
  "olive oil": "روغن زیتون",
  "salt": "نمک",
  "black pepper": "فلفل سیاه",
  "pepper": "فلفل",
  "garlic": "سیر",
  "onion": "پیاز",
  "onions": "پیاز",
  "butter": "کره",
  "egg": "تخم‌مرغ",
  "eggs": "تخم‌مرغ",
  "milk": "شیر",
  "flour": "آرد",
  "sugar": "شکر",
  "rice": "برنج",
  "pasta": "پاستا",
  "spaghetti": "اسپاگتی",
  "noodles": "نودل",
  "tomato": "گوجه‌فرنگی",
  "tomatoes": "گوجه‌فرنگی",
  "tomato sauce": "سس گوجه‌فرنگی",
  "lemon": "لیمو",
  "chicken": "مرغ",
  "chicken breast": "سینه مرغ",
  "chicken thighs": "ران مرغ",
  "beef": "گوشت گوساله",
  "beef steak": "استیک گوشت",
  "ground beef": "گوشت چرخ‌کرده",
  "fish": "ماهی",
  "salmon": "سالمون",
  "shrimp": "میگو",
  "potato": "سیب‌زمینی",
  "potatoes": "سیب‌زمینی",
  "carrot": "هویج",
  "carrots": "هویج",
  "cheese": "پنیر",
  "parmesan": "پارمزان",
  "mozzarella": "موزارلا",
  "cheddar": "چدار",
  "feta": "فتا",
  "yogurt": "ماست",
  "bread": "نان",
  "herbs": "سبزیجات معطر",
  "chili": "فلفل تند",
  "ginger": "زنجبیل",
  "soy sauce": "سس سویا",
  "coconut milk": "شیر نارگیل",
  "beans": "لوبیا",
  "spinach": "اسفناج",
  "mushroom": "قارچ",
  "mushrooms": "قارچ",
  "cream": "خامه",
  "heavy cream": "خامه سنگین",
  "sour cream": "خامه ترش",
  "cream cheese": "پنیر خامه‌ای",
  "parsley": "جعفری",
  "basil": "ریحان",
  "oregano": "پونه کوهی",
  "cilantro": "گشنیز",
  "avocado": "آووکادو",
  "lime": "لیمو ترش",
  "mustard": "خردل",
  "honey": "عسل",
  "vinegar": "سرکه",
  "bacon": "بیکن",
  "bell pepper": "فلفل دلمه‌ای",
  "cinnamon": "دارچین",
  "sesame": "کنجد",
  "sesame oil": "روغن کنجد",
  "chocolate": "شکلات",
  "cocoa": "کاکائو",
  "vanilla": "وانیل",
  "yeast": "خمیرمایه",
  "cucumber": "خیار",
  "mayonnaise": "مایونز",
  "mayo": "مایونز",
  "ketchup": "کچاپ",
  "lettuce": "کاهو",
  "lentils": "عدس",
  "peas": "نخودفرنگی",
  "chickpeas": "نخود",
  "corn": "ذرت",
  "tofu": "توفو",
  "bread crumbs": "پودر سوخاری",
  "white wine": "سرکه سفید",
  "red wine": "آب انگور قرمز",
  "vegetable broth": "عصاره سبزیجات",
  "chicken broth": "عصاره مرغ",
  "beef broth": "عصاره گوشت",
  "broth": "عصاره",
  "walnuts": "گردو",
  "almonds": "بادام",
  "cashews": "بادام هندی",
  "peanuts": "بادام زمینی",
  "turmeric": "زردچوبه",
  "cumin": "زیره",
  "paprika": "پاپریکا",
  "coriander": "تخم گشنیز",
  "curry powder": "پودر کاری",
  "dill": "شوید",
  "mint": "نعناع",
  "pork": "گوشت",
  "ham": "ژامبون",
  "sausage": "سوسیس",
  "oil": "روغن",
};

export const INGREDIENT_TRANSLATIONS_EN = Object.fromEntries(
  Object.entries(INGREDIENT_TRANSLATIONS_FA).map(([en, fa]) => [fa.trim(), en]),
);

/**
 * Localizes an ingredient name or token to English if it is in Persian.
 */
export function localizeIngredientToEnglish(text) {
  if (!text) return text;
  const clean = String(text).trim();
  if (INGREDIENT_TRANSLATIONS_EN[clean]) {
    const val = INGREDIENT_TRANSLATIONS_EN[clean];
    return val.charAt(0).toUpperCase() + val.slice(1);
  }
  return text;
}

/**
 * Localizes an ingredient name or token to Persian if active language is 'fa'.
 */
export function localizeIngredient(text, language = "en") {
  if (!text || language !== "fa") return text;
  const clean = String(text).trim().toLowerCase();
  if (INGREDIENT_TRANSLATIONS_FA[clean]) {
    return INGREDIENT_TRANSLATIONS_FA[clean];
  }
  const singular = clean.replace(/e?s$/, "");
  if (INGREDIENT_TRANSLATIONS_FA[singular]) {
    return INGREDIENT_TRANSLATIONS_FA[singular];
  }
  return text;
}

/**
 * Resolves the localized display name for a shopping list item.
 * Cross-references canonical meal ingredients with MEALS_FA when mealId is present.
 */
export function getLocalizedShoppingItemName(item, language = "en") {
  if (!item) return "";
  const name = typeof item === "string" ? item : item.name;
  if (!name) return "";

  if (language === "fa") {
    if (/[\u0600-\u06FF]/.test(name)) {
      return name;
    }

    const mealId =
      item.mealId ||
      (item.id && typeof item.id === "string" ? item.id.split("-")[0] : null);
    if (mealId && MEALS_FA[mealId]?.ingredients) {
      const canonicalMeal = MEALS.find((m) => m.id === mealId);
      const faIngredients = MEALS_FA[mealId].ingredients;
      if (canonicalMeal?.ingredients) {
        const exactIdx = canonicalMeal.ingredients.findIndex(
          (line) => line.trim().toLowerCase() === name.trim().toLowerCase(),
        );
        if (exactIdx !== -1 && faIngredients[exactIdx]) {
          return scaleLocalizedIngredientLine(
            canonicalMeal.ingredients[exactIdx],
            faIngredients[exactIdx],
            1,
            true,
          );
        }

        const cleanNameCore = name
          .replace(/^[\d\s.,/x×-]+/i, "")
          .trim()
          .toLowerCase();
        for (let idx = 0; idx < canonicalMeal.ingredients.length; idx++) {
          const canonLine = canonicalMeal.ingredients[idx];
          const canonCore = canonLine
            .replace(/^[\d\s.,/x×-]+/i, "")
            .trim()
            .toLowerCase();
          if (
            cleanNameCore &&
            canonCore &&
            (cleanNameCore.includes(canonCore) ||
              canonCore.includes(cleanNameCore))
          ) {
            const numName = parseFloat(name.replace(",", "."));
            const numCanon = parseFloat(canonLine.replace(",", "."));
            const mult =
              Number.isFinite(numName) &&
              Number.isFinite(numCanon) &&
              numCanon > 0
                ? numName / numCanon
                : 1;
            return scaleLocalizedIngredientLine(
              canonLine,
              faIngredients[idx],
              mult,
              true,
            );
          }
        }
      }
    }

    return localizeIngredient(name, "fa");
  } else {
    if (/[\u0600-\u06FF]/.test(name)) {
      const mealId =
        item.mealId ||
        (item.id && typeof item.id === "string" ? item.id.split("-")[0] : null);
      if (mealId && MEALS_FA[mealId]?.ingredients) {
        const canonicalMeal = MEALS.find((m) => m.id === mealId);
        const faIngredients = MEALS_FA[mealId].ingredients;
        if (canonicalMeal?.ingredients) {
          const cleanNameCore = name
            .replace(/^[\d\s.,/x×\u06F0-\u06F9\u0660-\u0669\-]+/i, "")
            .trim();
          for (let idx = 0; idx < faIngredients.length; idx++) {
            const faLine = faIngredients[idx].replace(/\{qty\}\s*/g, "").trim();
            if (
              faLine &&
              (name.includes(faLine) ||
                (cleanNameCore && faLine.includes(cleanNameCore)))
            ) {
              return canonicalMeal.ingredients[idx];
            }
          }
        }
      }
      return localizeIngredientToEnglish(name);
    }
    return name;
  }
}

/**
 * Resolves the localized meal/recipe title for a shopping list item.
 * Supports bidirectional translation (FA <-> EN) and handles prefixes
 * such as Batch ("Batch · " / "پخت عمده · ") and Dinner Parties ("Dinner parties · " / "مهمانی شام · ").
 */
export function getLocalizedShoppingItemMealTitle(item, language = "en") {
  if (!item) return "";
  const rawMealTitle = typeof item === "string" ? item : item.mealTitle || "";
  const mealId =
    item.mealId ||
    (item.id && typeof item.id === "string" ? item.id.split("-")[0] : null);

  if (!rawMealTitle && !mealId) return "";

  let prefixType = null; // 'batch' | 'dinner' | 'custom'
  let customPrefix = "";
  let baseTitle = rawMealTitle;

  if (
    rawMealTitle.startsWith("Batch ·") ||
    rawMealTitle.startsWith("پخت عمده ·")
  ) {
    prefixType = "batch";
    baseTitle = rawMealTitle.replace(/^(?:Batch|پخت عمده)\s*·\s*/, "").trim();
  } else if (rawMealTitle.includes(" · ")) {
    const parts = rawMealTitle.split(" · ");
    const head = parts[0].trim();
    baseTitle = parts.slice(1).join(" · ").trim();
    if (head === "Dinner parties" || head === "مهمانی شام") {
      prefixType = "dinner";
    } else {
      prefixType = "custom";
      customPrefix = head;
    }
  }

  let resolvedMealId =
    mealId && (MEALS_FA[mealId] || MEALS.some((m) => m.id === mealId))
      ? mealId
      : null;

  if (!resolvedMealId && baseTitle) {
    const foundFa = Object.entries(MEALS_FA).find(
      ([, data]) =>
        data.title &&
        (data.title === baseTitle ||
          baseTitle.includes(data.title) ||
          data.title.includes(baseTitle)),
    );
    if (foundFa) {
      resolvedMealId = foundFa[0];
    } else {
      const foundEn = MEALS.find(
        (m) =>
          m.title &&
          (m.title === baseTitle ||
            baseTitle.includes(m.title) ||
            m.title.includes(baseTitle)),
      );
      if (foundEn) {
        resolvedMealId = foundEn.id;
      }
    }
  }

  let localizedBase = baseTitle;
  if (resolvedMealId) {
    if (language === "fa") {
      localizedBase =
        MEALS_FA[resolvedMealId]?.title ||
        MEALS.find((m) => m.id === resolvedMealId)?.title ||
        baseTitle;
    } else {
      localizedBase =
        MEALS.find((m) => m.id === resolvedMealId)?.title ||
        MEALS_FA[resolvedMealId]?.title ||
        baseTitle;
    }
  } else if (language !== "fa" && /[\u0600-\u06FF]/.test(baseTitle)) {
    const fuzzyFa = Object.entries(MEALS_FA).find(
      ([, data]) =>
        data.title &&
        (baseTitle.includes(data.title) || data.title.includes(baseTitle)),
    );
    if (fuzzyFa) {
      const canonical = MEALS.find((m) => m.id === fuzzyFa[0]);
      if (canonical?.title) localizedBase = canonical.title;
    }
  }

  if (prefixType === "batch") {
    return language === "fa"
      ? `پخت عمده · ${localizedBase}`
      : `Batch · ${localizedBase}`;
  }
  if (prefixType === "dinner") {
    return language === "fa"
      ? `مهمانی شام · ${localizedBase}`
      : `Dinner parties · ${localizedBase}`;
  }
  if (prefixType === "custom" && customPrefix) {
    return `${customPrefix} · ${localizedBase}`;
  }

  return localizedBase;
}



