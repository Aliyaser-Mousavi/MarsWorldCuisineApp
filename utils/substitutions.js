/** Common kitchen swaps shown on meal detail. */
const PAIRS = [
  { match: /butter/i, swap: "Olive oil or ghee", note: "Use a little less oil" },
  { match: /milk(?!\s*chocolate)/i, swap: "Oat or almond milk", note: "Works in most cooking" },
  { match: /cream/i, swap: "Coconut cream or Greek yogurt", note: "Yogurt off heat" },
  { match: /egg/i, swap: "Flax egg (1 tbsp flax + 3 tbsp water)", note: "Best for baking" },
  { match: /chicken/i, swap: "Turkey, tofu, or chickpeas", note: "Adjust cook time" },
  { match: /beef/i, swap: "Lamb, mushrooms, or lentils", note: "Season boldly" },
  { match: /pork/i, swap: "Chicken thighs or jackfruit", note: "Similar richness" },
  { match: /fish|salmon|cod|shrimp/i, swap: "Another firm white fish or tofu", note: "Watch timing" },
  { match: /flour/i, swap: "Gluten-free blend 1:1", note: "Or almond flour in some bakes" },
  { match: /pasta/i, swap: "Rice noodles or zucchini ribbons", note: "Sauce still shines" },
  { match: /rice/i, swap: "Quinoa, couscous, or cauliflower rice", note: "Change texture" },
  { match: /sugar/i, swap: "Honey or maple syrup", note: "Reduce liquid slightly" },
  { match: /soy sauce/i, swap: "Tamari or coconut aminos", note: "Gluten-free friendly" },
  { match: /cheese|mozzarella|parmesan|cheddar/i, swap: "Nutritional yeast or dairy-free cheese", note: "Salt to taste" },
  { match: /yogurt/i, swap: "Coconut yogurt or sour cream", note: "Check sweetness" },
  { match: /tomato/i, swap: "Roasted red peppers or passata", note: "Similar body" },
  { match: /onion/i, swap: "Shallots or leeks", note: "Gentler flavor" },
  { match: /garlic/i, swap: "Garlic powder or asafoetida", note: "Use sparingly" },
  { match: /lemon/i, swap: "Lime or white wine vinegar", note: "Bright acidity" },
  { match: /bread/i, swap: "Tortillas or lettuce wraps", note: "For sandwiches" },
];

export function getSubstitutions(ingredients = [], limit = 5) {
  const found = [];
  const seen = new Set();

  for (const line of ingredients) {
    for (const pair of PAIRS) {
      if (!pair.match.test(line)) continue;
      const key = pair.swap;
      if (seen.has(key)) continue;
      seen.add(key);
      found.push({
        original: line,
        swap: pair.swap,
        note: pair.note,
      });
      break;
    }
    if (found.length >= limit) break;
  }

  return found;
}
