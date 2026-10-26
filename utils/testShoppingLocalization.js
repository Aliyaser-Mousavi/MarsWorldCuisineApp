const rawMeals = require("./all-meals-raw.json");
const { MEALS_FA } = require("../data/dummy-data.fa.js");

// Load translations for ingredients
const INGREDIENT_TRANSLATIONS_FA = {
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
  "cheese": "پنیر",
  "mozzarella": "موزارلا",
  "bread": "نان",
  "oil": "روغن",
};

const INGREDIENT_TRANSLATIONS_EN = Object.fromEntries(
  Object.entries(INGREDIENT_TRANSLATIONS_FA).map(([en, fa]) => [fa.trim(), en]),
);

function getLocalizedShoppingItemMealTitle(item, language = "en") {
  if (!item) return "";
  const rawMealTitle = typeof item === "string" ? item : (item.mealTitle || "");
  const mealId =
    item.mealId ||
    (item.id && typeof item.id === "string" ? item.id.split("-")[0] : null);

  if (!rawMealTitle && !mealId) return "";

  let prefixType = null;
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
    mealId && (MEALS_FA[mealId] || rawMeals.some((m) => m.id === mealId))
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
      const foundEn = rawMeals.find(
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
        rawMeals.find((m) => m.id === resolvedMealId)?.title ||
        baseTitle;
    } else {
      localizedBase =
        rawMeals.find((m) => m.id === resolvedMealId)?.title ||
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
      const canonical = rawMeals.find((m) => m.id === fuzzyFa[0]);
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

console.log("=== Testing Shopping List & Store Walk Localization ===");

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${message}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

// Scenario 1: Margherita Pizza added in Persian mode, rendered in English
console.log("\nTest 1: Recipe added in Persian, viewed in English");
const itemFaInEn = {
  id: "m1-dough",
  mealId: "m1",
  mealTitle: "پیتزا مارگاریتا",
  name: "۵۰۰ گرم آرد پیتزا",
};
const res1 = getLocalizedShoppingItemMealTitle(itemFaInEn, "en");
assert(
  res1 === "Margherita Pizza",
  `Expected "Margherita Pizza", got "${res1}"`,
);

// Scenario 2: Margherita Pizza added in English mode, rendered in Persian
console.log("\nTest 2: Recipe added in English, viewed in Persian");
const itemEnInFa = {
  id: "m1-flour",
  mealId: "m1",
  mealTitle: "Margherita Pizza",
  name: "500g Pizza Flour",
};
const res2 = getLocalizedShoppingItemMealTitle(itemEnInFa, "fa");
assert(
  res2 === "پیتزا مارگاریتا",
  `Expected "پیتزا مارگاریتا", got "${res2}"`,
);

// Scenario 3: Batch cooking added in Persian, rendered in English
console.log("\nTest 3: Batch cooking added in Persian, viewed in English");
const batchFaInEn = {
  id: "m1-flour",
  mealId: "m1",
  mealTitle: "پخت عمده · پیتزا مارگاریتا",
};
const res3 = getLocalizedShoppingItemMealTitle(batchFaInEn, "en");
assert(
  res3 === "Batch · Margherita Pizza",
  `Expected "Batch · Margherita Pizza", got "${res3}"`,
);

// Scenario 4: Batch cooking added in English, rendered in Persian
console.log("\nTest 4: Batch cooking added in English, viewed in Persian");
const batchEnInFa = {
  id: "m1-flour",
  mealId: "m1",
  mealTitle: "Batch · Margherita Pizza",
};
const res4 = getLocalizedShoppingItemMealTitle(batchEnInFa, "fa");
assert(
  res4 === "پخت عمده · پیتزا مارگاریتا",
  `Expected "پخت عمده · پیتزا مارگاریتا", got "${res4}"`,
);

// Scenario 5: Dinner party menu item in English and Persian
console.log("\nTest 5: Dinner party menu items");
const dinnerPartyFaInEn = {
  id: "m1-cheese",
  mealId: "m1",
  mealTitle: "مهمانی شام · پیتزا مارگاریتا",
};
const res5 = getLocalizedShoppingItemMealTitle(dinnerPartyFaInEn, "en");
assert(
  res5 === "Dinner parties · Margherita Pizza",
  `Expected "Dinner parties · Margherita Pizza", got "${res5}"`,
);

const dinnerPartyEnInFa = {
  id: "m1-cheese",
  mealId: "m1",
  mealTitle: "Dinner parties · Margherita Pizza",
};
const res5b = getLocalizedShoppingItemMealTitle(dinnerPartyEnInFa, "fa");
assert(
  res5b === "مهمانی شام · پیتزا مارگاریتا",
  `Expected "مهمانی شام · پیتزا مارگاریتا", got "${res5b}"`,
);

// Scenario 6: Missing mealId fallback lookup via title
console.log("\nTest 6: Missing mealId with Persian title, viewed in English");
const noMealId = {
  mealTitle: "پیتزا مارگاریتا",
};
const res6 = getLocalizedShoppingItemMealTitle(noMealId, "en");
assert(
  res6 === "Margherita Pizza",
  `Expected "Margherita Pizza", got "${res6}"`,
);

// Scenario 7: All 140 recipes test
console.log("\nTest 7: All 140 recipes bidirectional resolution");
let allPassed = true;
rawMeals.forEach((meal) => {
  const faData = MEALS_FA[meal.id];
  if (!faData || !faData.title) return;

  // Added in FA, viewed in EN
  const enTitle = getLocalizedShoppingItemMealTitle(
    { mealId: meal.id, mealTitle: faData.title },
    "en",
  );
  if (enTitle !== meal.title) {
    allPassed = false;
    console.error(`Mismatch for ${meal.id}: expected "${meal.title}", got "${enTitle}"`);
  }

  // Added in EN, viewed in FA
  const faTitle = getLocalizedShoppingItemMealTitle(
    { mealId: meal.id, mealTitle: meal.title },
    "fa",
  );
  if (faTitle !== faData.title) {
    allPassed = false;
    console.error(`Mismatch for ${meal.id}: expected "${faData.title}", got "${faTitle}"`);
  }
});

assert(allPassed, "All 140 meals correctly resolved in both EN and FA directions!");

console.log(`\nResults: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
