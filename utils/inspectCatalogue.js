const fs = require("fs");
const path = require("path");

const content = fs.readFileSync(path.join(__dirname, "../data/dummy-data.js"), "utf8");

// Parse CATEGORIES
const catMatches = [...content.matchAll(/new Category\(\s*['"]([^'"]+)['"],\s*['"]([^'"]+)['"]/g)];
console.log("Categories found:", catMatches.length);
catMatches.forEach(m => console.log(`  ${m[1]}: ${m[2]}`));

// Parse MEALS
const mealIdMatches = [...content.matchAll(/new Meal\(\s*['"]([^'"]+)['"],/g)];
console.log("\nMeals found:", mealIdMatches.length);
console.log("Meal IDs:", mealIdMatches.map(m => m[1]));

// Parse exports
const exportMatches = [...content.matchAll(/export const ([A-Za-z0-9_]+)/g)].map(m => m[1]);
console.log("\nExported constants:", exportMatches);
