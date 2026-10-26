const fs = require("fs");
const path = require("path");

const rootDir = path.join(__dirname, "..");
const enPath = path.join(rootDir, "locales", "en.json");
const faPath = path.join(rootDir, "locales", "fa.json");

const en = JSON.parse(fs.readFileSync(enPath, "utf8"));
const fa = JSON.parse(fs.readFileSync(faPath, "utf8"));

function flattenKeys(obj, prefix = "") {
  let keys = [];
  for (const k of Object.keys(obj)) {
    const full = prefix ? `${prefix}.${k}` : k;
    if (typeof obj[k] === "object" && obj[k] !== null && !Array.isArray(obj[k])) {
      keys = keys.concat(flattenKeys(obj[k], full));
    } else {
      keys.push(full);
    }
  }
  return keys;
}

const enKeys = new Set(flattenKeys(en));
const faKeys = new Set(flattenKeys(fa));

console.log("=== 1. Checking JSON Structure and Recursive Parity ===");
console.log(`Total EN keys: ${enKeys.size}`);
console.log(`Total FA keys: ${faKeys.size}`);

const missingInFa = [...enKeys].filter((k) => !faKeys.has(k));
const missingInEn = [...faKeys].filter((k) => !enKeys.has(k));

if (missingInFa.length > 0) {
  console.error("FAIL: Missing in FA dictionary:", missingInFa);
}
if (missingInEn.length > 0) {
  console.error("FAIL: Missing in EN dictionary:", missingInEn);
}

// 2. Discover all application screens and components
console.log("\n=== 2. Discovering and Scanning Application Screens & Components ===");

function getFilesRecursively(dir, filterExt = [".js", ".jsx"]) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(fullPath, filterExt));
    } else if (filterExt.includes(path.extname(file))) {
      results.push(fullPath);
    }
  }
  return results;
}

const screensFiles = getFilesRecursively(path.join(rootDir, "screens"));
const componentsFiles = getFilesRecursively(path.join(rootDir, "components"));
const allSourceFiles = [...screensFiles, ...componentsFiles, path.join(rootDir, "App.js")];

const translationKeyRegex = /t\(\s*["']([a-zA-Z0-9_\.]+)["']/g;
const referencedKeys = new Set();

for (const filePath of allSourceFiles) {
  const content = fs.readFileSync(filePath, "utf8");
  let match;
  while ((match = translationKeyRegex.exec(content)) !== null) {
    referencedKeys.add(match[1]);
  }
}

// Whitelist known dynamic keys and plural base keys
const dynamicKeyPrefixes = [
  "mealPlan.days.",
  "tonight.moods.",
  "duel.metrics.",
  "categories.items.",
  "search.suggestions.",
];

function hasKeyOrPlural(keySet, key) {
  if (keySet.has(key)) return true;
  if (keySet.has(`${key}_one`) || keySet.has(`${key}_other`)) return true;
  return false;
}

const missingReferencedInEn = [];
const missingReferencedInFa = [];

for (const key of referencedKeys) {
  if (key === "window") continue; // Dimensions.get("window") artifact
  const isDynamic = dynamicKeyPrefixes.some((p) => key.startsWith(p));
  if (!isDynamic) {
    if (!hasKeyOrPlural(enKeys, key)) missingReferencedInEn.push(key);
    if (!hasKeyOrPlural(faKeys, key)) missingReferencedInFa.push(key);
  }
}

console.log(`Discovered ${referencedKeys.size} distinct t(...) key calls across ${allSourceFiles.length} files.`);
if (missingReferencedInEn.length > 0) {
  console.error("FAIL: Used in code but missing in EN json:", missingReferencedInEn);
}
if (missingReferencedInFa.length > 0) {
  console.error("FAIL: Used in code but missing in FA json:", missingReferencedInFa);
}

// 3. Built-in Recipe Catalogue Translation & Integrity Validation
console.log("\n=== 3. Validating Built-in Recipe Catalogue Translations (dummy-data.fa.js) ===");

const rawMeals = require("./all-meals-raw.json");
const { CATEGORIES_FA, MEALS_FA } = require("../data/dummy-data.fa.js");
const manifest = require("./catalogue-manifest.json");

console.log(`Original Meals Count: ${rawMeals.length}`);
console.log(`Original Categories Count: ${manifest.categories.length}`);
console.log(`Translated Meals Count: ${Object.keys(MEALS_FA).length}`);
console.log(`Translated Categories Count: ${Object.keys(CATEGORIES_FA).length}`);

let catalogueErrors = 0;

// Validate Categories
manifest.categories.forEach((cat) => {
  const tr = CATEGORIES_FA[cat.id];
  if (!tr) {
    console.error(`MISSING CATEGORY TRANSLATION: ${cat.id} (${cat.title})`);
    catalogueErrors++;
  } else if (!tr.title || tr.title.trim() === "") {
    console.error(`EMPTY CATEGORY TITLE: ${cat.id}`);
    catalogueErrors++;
  }
});

// Validate Meals
rawMeals.forEach((m) => {
  const tr = MEALS_FA[m.id];
  if (!tr) {
    console.error(`MISSING MEAL TRANSLATION: ${m.id} (${m.title})`);
    catalogueErrors++;
    return;
  }

  if (!tr.title || tr.title.trim() === "") {
    console.error(`EMPTY MEAL TITLE: ${m.id}`);
    catalogueErrors++;
  }

  if (!tr.ingredients || tr.ingredients.length !== m.ingredients.length) {
    console.error(
      `INGREDIENT COUNT MISMATCH [${m.id} - ${m.title}]: Expected ${m.ingredients.length}, got ${tr.ingredients ? tr.ingredients.length : 0}`
    );
    catalogueErrors++;
  } else {
    tr.ingredients.forEach((ing, idx) => {
      if (!ing || ing.trim() === "") {
        console.error(`EMPTY INGREDIENT [${m.id}] line ${idx + 1}`);
        catalogueErrors++;
      }
    });
  }

  if (!tr.steps || tr.steps.length !== m.steps.length) {
    console.error(
      `STEPS COUNT MISMATCH [${m.id} - ${m.title}]: Expected ${m.steps.length}, got ${tr.steps ? tr.steps.length : 0}`
    );
    catalogueErrors++;
  } else {
    tr.steps.forEach((step, idx) => {
      if (!step || step.trim() === "") {
        console.error(`EMPTY STEP [${m.id}] step ${idx + 1}`);
        catalogueErrors++;
      }
    });
  }
});

console.log(`Catalogue Validation Errors: ${catalogueErrors}`);
if (catalogueErrors === 0) {
  console.log(`SUCCESS: 100% Catalogue Translation Parity: All ${rawMeals.length} recipes and ${manifest.categories.length} categories validated.`);
}

// 4. Raw key leak protection check
console.log("\n=== 4. Checking for Unresolved Raw Keys in Source Code ===");
const rawKeyPattern = /["'](?:navigation|common|preferences|auth|tonight|mealDetail|shoppingList|mealPlan|pantry|timers|history|aboutDeveloper)\.[a-zA-Z0-9_\.]+["']/g;
let potentialRawLeaks = [];

for (const filePath of allSourceFiles) {
  const content = fs.readFileSync(filePath, "utf8");
  const relPath = path.relative(rootDir, filePath);
  const lines = content.split("\n");
  lines.forEach((line, lineNum) => {
    if (line.includes("t(") || line.includes("import") || line.trim().startsWith("//") || line.trim().startsWith("*")) {
      return;
    }
    const matches = line.match(rawKeyPattern);
    if (matches) {
      matches.forEach((m) => {
        if (!line.includes("t(") && !line.includes("t`")) {
          potentialRawLeaks.push({ file: relPath, line: lineNum + 1, match: m });
        }
      });
    }
  });
}

if (potentialRawLeaks.length > 0) {
  console.warn("WARNING: Potential raw translation key literals found outside t():", potentialRawLeaks);
} else {
  console.log("SUCCESS: No raw translation keys detected outside t() calls.");
}

const hasErrors =
  missingInFa.length > 0 ||
  missingInEn.length > 0 ||
  missingReferencedInEn.length > 0 ||
  missingReferencedInFa.length > 0 ||
  catalogueErrors > 0;

if (hasErrors) {
  console.error("\n❌ VALIDATION FAILED: Translation parity, missing key, or catalogue mismatch found.");
  process.exit(1);
} else {
  console.log(`\n✅ ALL CHECKS PASSED: 100% parity across UI strings and entire recipe catalogue in both English and Persian.`);
  process.exit(0);
}
