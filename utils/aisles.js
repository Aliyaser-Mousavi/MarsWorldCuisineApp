const AISLES = [
  {
    id: "produce",
    label: "Produce",
    icon: "nutrition-outline",
    keywords: [
      "tomato",
      "onion",
      "garlic",
      "lemon",
      "lime",
      "potato",
      "carrot",
      "spinach",
      "lettuce",
      "salad",
      "herb",
      "basil",
      "parsley",
      "cilantro",
      "pepper",
      "cucumber",
      "avocado",
      "apple",
      "berry",
      "fruit",
      "ginger",
      "chili",
      "mushroom",
      "cabbage",
      "celery",
      "zucchini",
      "eggplant",
      "corn",
      "bean",
      "peas",
    ],
  },
  {
    id: "meat",
    label: "Meat & seafood",
    icon: "fish-outline",
    keywords: [
      "chicken",
      "beef",
      "pork",
      "lamb",
      "fish",
      "salmon",
      "shrimp",
      "bacon",
      "sausage",
      "turkey",
      "steak",
      "mince",
      "meat",
    ],
  },
  {
    id: "dairy",
    label: "Dairy & eggs",
    icon: "water-outline",
    keywords: [
      "milk",
      "cheese",
      "butter",
      "yogurt",
      "cream",
      "egg",
      "mozzarella",
      "parmesan",
      "ricotta",
    ],
  },
  {
    id: "bakery",
    label: "Bakery & grains",
    icon: "cafe-outline",
    keywords: [
      "bread",
      "flour",
      "pasta",
      "rice",
      "noodle",
      "tortilla",
      "dough",
      "oat",
      "couscous",
      "quinoa",
    ],
  },
  {
    id: "pantry",
    label: "Pantry",
    icon: "cube-outline",
    keywords: [
      "oil",
      "salt",
      "sugar",
      "vinegar",
      "sauce",
      "spice",
      "cumin",
      "paprika",
      "stock",
      "broth",
      "can",
      "coconut",
      "soy",
      "honey",
      "yeast",
      "baking",
    ],
  },
];

export function getAisleForIngredient(name) {
  const text = String(name || "").toLowerCase();
  for (const aisle of AISLES) {
    if (aisle.keywords.some((k) => text.includes(k))) return aisle;
  }
  return {
    id: "other",
    label: "Other",
    icon: "ellipsis-horizontal",
  };
}

export function groupItemsByAisle(items) {
  const groups = {};
  items.forEach((item) => {
    const aisle = getAisleForIngredient(item.name);
    if (!groups[aisle.id]) {
      groups[aisle.id] = { ...aisle, items: [] };
    }
    groups[aisle.id].items.push(item);
  });

  const order = [...AISLES.map((a) => a.id), "other"];
  return order
    .map((id) => groups[id])
    .filter((g) => g && g.items.length > 0);
}
