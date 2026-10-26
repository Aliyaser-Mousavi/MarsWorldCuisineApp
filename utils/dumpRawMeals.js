const fs = require("fs");
const path = require("path");

const content = fs.readFileSync(path.join(__dirname, "../data/dummy-data.js"), "utf8");

function Meal(id, categoryIds, title, affordability, complexity, imageUrl, duration, ingredients, steps, isGlutenFree, isVegan, isVegetarian, isLactoseFree) {
  return { id, categoryIds, title, affordability, complexity, imageUrl, duration, ingredients, steps, isGlutenFree, isVegan, isVegetarian, isLactoseFree };
}
function Category(id, title, color) {
  return { id, title, color };
}

const catMatch = content.match(/export const CATEGORIES = (\[[\s\S]*?\]);\s*export const MEALS/);
const catArray = eval(catMatch[1]);

const mealMatch = content.match(/export const MEALS = (\[[\s\S]*?\]);\s*$/);
const mealArray = eval(mealMatch[1]);

// Write full parsed dataset for inspection and batching
fs.writeFileSync(
  path.join(__dirname, "all-meals-raw.json"),
  JSON.stringify(mealArray, null, 2),
  "utf8"
);

console.log(`Exported ${mealArray.length} raw meals to all-meals-raw.json`);
console.log(`First meal: ${mealArray[0].id} - ${mealArray[0].title}`);
console.log(`Last meal: ${mealArray[mealArray.length - 1].id} - ${mealArray[mealArray.length - 1].title}`);
