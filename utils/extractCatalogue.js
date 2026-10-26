const fs = require("fs");
const path = require("path");

const content = fs.readFileSync(path.join(__dirname, "../data/dummy-data.js"), "utf8");

// Extract all meals using eval in an isolated context
const meals = [];
function Meal(id, categoryIds, title, affordability, complexity, imageUrl, duration, ingredients, steps, isGlutenFree, isVegan, isVegetarian, isLactoseFree) {
  return {
    id, categoryIds, title, affordability, complexity, imageUrl, duration, ingredients, steps, isGlutenFree, isVegan, isVegetarian, isLactoseFree
  };
}
function Category(id, title, color) {
  return { id, title, color };
}

// Extract CATEGORIES array string
const catMatch = content.match(/export const CATEGORIES = (\[[\s\S]*?\]);\s*export const MEALS/);
const catArray = eval(catMatch[1]);

// Extract MEALS array string
const mealMatch = content.match(/export const MEALS = (\[[\s\S]*?\]);\s*$/);
const mealArray = eval(mealMatch[1]);

console.log("Total Categories extracted:", catArray.length);
console.log("Total Meals extracted:", mealArray.length);

let totalIngredients = 0;
let totalSteps = 0;
let sampleMeals = mealArray.slice(0, 3);

mealArray.forEach(m => {
  totalIngredients += (m.ingredients || []).length;
  totalSteps += (m.steps || []).length;
});

console.log("Total Ingredients across all meals:", totalIngredients);
console.log("Total Steps across all meals:", totalSteps);

fs.writeFileSync(
  path.join(__dirname, "catalogue-manifest.json"),
  JSON.stringify({
    categories: catArray.map(c => ({ id: c.id, title: c.title })),
    mealsSummary: {
      count: mealArray.length,
      totalIngredients,
      totalSteps
    }
  }, null, 2)
);
console.log("Manifest written successfully.");
