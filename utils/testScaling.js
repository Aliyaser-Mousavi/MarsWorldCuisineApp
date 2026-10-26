const meals = require("./all-meals-raw.json");
const { MEALS_FA } = require("../data/dummy-data.fa.js");

function scaleLocalizedIngredientLine(canonicalLine, localizedLine, multiplier) {
  if (!localizedLine) return canonicalLine;
  const match = String(canonicalLine).match(/^(\d+\s*\/\s*\d+|\d+[.,]\d+|\d+)\s*(.*)$/);
  if (!match) {
    const cleanLocalized = localizedLine.replace(/\{qty\}\s*/, "").trim();
    return multiplier === 1 ? cleanLocalized : `${cleanLocalized}  ·  ×${multiplier}`;
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
    const cleanLocalized = localizedLine.replace(/\{qty\}\s*/, "").trim();
    return multiplier === 1 ? cleanLocalized : `${cleanLocalized}  ·  ×${multiplier}`;
  }

  const scaled = value * multiplier;
  const pretty =
    Math.abs(scaled - Math.round(scaled)) < 0.05
      ? String(Math.round(scaled))
      : scaled.toFixed(1).replace(/\.0$/, "");

  if (localizedLine.includes("{qty}")) {
    return localizedLine.replace("{qty}", pretty).trim();
  }
  return `${pretty} ${localizedLine}`.trim();
}

const sample = meals[0];
const faSample = MEALS_FA[sample.id];

console.log("=== Testing Persian Ingredient Scaling for m1 (Margherita Pizza) ===");
sample.ingredients.forEach((orig, idx) => {
  const fa = faSample.ingredients[idx];
  console.log("Original: " + orig);
  console.log("  1 Serv (x0.5): " + scaleLocalizedIngredientLine(orig, fa, 0.5));
  console.log("  2 Serv (x1.0): " + scaleLocalizedIngredientLine(orig, fa, 1.0));
  console.log("  4 Serv (x2.0): " + scaleLocalizedIngredientLine(orig, fa, 2.0));
  console.log("  6 Serv (x3.0): " + scaleLocalizedIngredientLine(orig, fa, 3.0));
});
