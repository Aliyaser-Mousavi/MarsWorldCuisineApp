import Category from "../models/category";
import Meal from "../models/meal";
export const CATEGORIES = [
  new Category(
    "c1",
    "Italian",
    "https://plus.unsplash.com/premium_photo-1681406688895-30bd63b24eb3?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ),
  new Category(
    "c2",
    "Quick & Easy",
    "https://media.istockphoto.com/id/1690603779/photo/food-collage-layout-a-variety-of-dishes-a-collection-for-a-restaurant-banner.jpg?s=2048x2048&w=is&k=20&c=mlc1jGpqoDpIQCQ2XE7SKFFxVgNh_-FzM5bA_Xe7pxs=",
  ),
  new Category(
    "c3",
    "Hamburgers",
    "https://plus.unsplash.com/premium_photo-1668618295293-75f191aca356?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ),
  new Category(
    "c4",
    "German",
    "https://media.istockphoto.com/id/178369709/photo/flag-of-germany.webp?a=1&b=1&s=612x612&w=0&k=20&c=nf6SYliU7-D0XPkdlLxM-2cyMIR1DG89J3Nzjgu23ic=",
  ),
  new Category(
    "c5",
    "Salads",
    "https://images.unsplash.com/photo-1607532941433-304659e8198a?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8U2FsYWRzfGVufDB8fDB8fHww",
  ),
  new Category(
    "c6",
    "Exotic",
    "https://thumbs.dreamstime.com/b/flag-philippines-4837491.jpg",
  ),
  new Category(
    "c7",
    "Breakfast",
    "https://images.unsplash.com/photo-1611601184963-9d1de9b79ff3?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8QnJlYWtmYXN0JTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D",
  ),
  new Category(
    "c8",
    "Asian",
    "https://i.pinimg.com/736x/77/f4/f2/77f4f2c2fbbd6dce0cfe34bf951ee801.jpg",
  ),
  new Category(
    "c9",
    "French",
    "https://plus.unsplash.com/premium_photo-1675865394537-e90c5c5c39ac?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ),
  new Category(
    "c10",
    "Desserts",
    "https://media.istockphoto.com/id/2235222005/photo/autumn-desserts-table-scene-above-view-over-a-white-wood-background.jpg?s=1024x1024&w=is&k=20&c=tF9KQCL7QJUNRid2_9feKzb97M8R25R3IotK4qITCa0=",
  ),
  new Category(
    "c11",
    "Middle Eastern",
    "https://i.pinimg.com/736x/38/34/5c/38345c0b345425e4a2f3c4dfa9bb68f2.jpg",
  ),
  new Category(
    "c12",
    "Mexican",
    "https://plus.unsplash.com/premium_photo-1674591172745-448b9777dac8?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8TWV4aWNhbiUyMGZsYWd8ZW58MHx8MHx8fDA%3D",
  ),
  new Category(
    "c13",
    "Indian",
    "https://plus.unsplash.com/premium_photo-1674591172888-1184c4170a47?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ),
  new Category(
    "c14",
    "Seafood",
    "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8U2VhZm9vZHxlbnwwfHwwfHx8MA%3D%3D",
  ),
  new Category(
    "c15",
    "Vegan",
    "https://i.pinimg.com/736x/1b/24/64/1b2464ecf626e4f40359f436b73f7e3e.jpg",
  ),
  new Category(
    "c16",
    "Afghan",
    "https://i.pinimg.com/736x/18/6f/d9/186fd9d8245846d5df48a4541f655c6c.jpg",
  ),
  new Category(
    "c17",
    "Iranian",
    "https://i.pinimg.com/1200x/82/e9/38/82e93894b1135dc00cb1e3240b6d82a3.jpg",
  ),
  new Category(
    "c18",
    "World Classics",
    "https://i.pinimg.com/1200x/9d/28/ec/9d28ec57d59f7d0b43ad318365d97dd1.jpg",
  ),
  new Category(
    "c19",
    "Street Food",
    "https://i.pinimg.com/1200x/ca/05/08/ca0508e2ee57221d79f5460e9261712d.jpg",
  ),
  new Category(
    "c20",
    "Vegetarian",
    "https://i.pinimg.com/736x/f7/6a/26/f76a264bf889fccd255d89565e9eeb49.jpg",
  ),
];
export const MEALS = [
  new Meal(
    "m1",
    ["c1"],
    "Margherita Pizza",
    "affordable",
    "simple",
    "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    45,
    [
      "500g Pizza Flour (Type 00)",
      "325ml Warm Water",
      "7g Dried Yeast",
      "1 tsp Salt",
      "1/2 tsp Sugar",
      "200g Canned San Marzano Tomatoes",
      "200g Fresh Mozzarella Di Bufala",
      "Fresh Basil Leaves",
      "Extra Virgin Olive Oil",
      "Pinch of Sea Salt",
    ],
    [
      "Mix flour, yeast, sugar, and salt; add water and knead for 10 minutes until smooth.",
      "Let the dough rise in a warm place for 45-60 minutes until doubled in size.",
      "Preheat your oven to its maximum temperature (250-300°C) with a pizza stone inside.",
      "Crush the canned tomatoes by hand and season with a pinch of salt.",
      "Roll out the dough thinly, spread the tomato sauce, and add torn mozzarella.",
      "Bake for 7-10 minutes until the crust is charred and cheese is bubbly.",
      "Top with fresh basil and a drizzle of olive oil immediately after baking.",
    ],
    false, // isGlutenFree
    false, // isVegan
    true, // isVegetarian
    false, // isLactoseFree
  ),

  new Meal(
    "m2",
    ["c2"],
    "Grilled Cheese Sandwich",
    "affordable",
    "simple",
    "https://images.unsplash.com/photo-1528736235302-52922df5c122?q=80&w=1554&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    15,
    [
      "2 Slices of Sourdough or White Bread",
      "2 Slices of Sharp Cheddar Cheese",
      "1 Slice of Gruyère or Swiss Cheese",
      "2 tbsp Unsalted Butter (Softened)",
      "Pinch of Garlic Powder",
    ],
    [
      "Spread softened butter evenly on one side of each bread slice.",
      "Place one slice butter-side down on a cold non-stick skillet.",
      "Layer the Cheddar and Gruyère cheese on the bread.",
      "Top with the second slice of bread, butter-side up.",
      "Turn heat to medium-low and grill for 3-4 minutes until golden brown.",
      "Flip carefully and grill the other side until the cheese is completely melted.",
    ],
    false, // isGlutenFree
    false, // isVegan
    true, // isVegetarian
    false, // isLactoseFree
  ),

  new Meal(
    "m3",
    ["c3"],
    "Classic Cheeseburger",
    "pricey",
    "simple",
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500&auto=format&fit=crop",
    30,
    [
      "200g Ground Beef (80/20 fat ratio)",
      "1 Brioche Burger Bun",
      "1 Slice of American or Cheddar Cheese",
      "1 Slice of Tomato",
      "1 Leaf of Iceberg Lettuce",
      "2 Slices of Red Onion",
      "1 tbsp Butter",
      "Salt and Black Pepper",
      "1 tbsp Mayonnaise",
      "1 tsp Ketchup",
    ],
    [
      "Shape the ground beef into a patty slightly wider than the bun; season heavily with salt and pepper.",
      "Heat a cast-iron skillet over high heat and sear the patty for 3-4 minutes per side.",
      "Place the cheese on the patty in the last minute of cooking and cover with a lid to melt.",
      "Butter the halved buns and toast them on a separate pan until golden brown.",
      "Spread mayo and ketchup on the bottom bun, then layer lettuce, tomato, onion, and the patty.",
    ],
    false, // isGlutenFree
    false, // isVegan
    false, // isVegetarian
    false, // isLactoseFree
  ),

  new Meal(
    "m4",
    ["c4"],
    "Bratwurst with Sauerkraut",
    "luxurious",
    "challenging",
    "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?q=80&w=500&auto=format&fit=crop",
    50,
    [
      "4 Authentic Bratwurst Sausages",
      "500g Sauerkraut",
      "1 White Onion (Sliced)",
      "1 Apple (Grated)",
      "250ml German Lager Beer",
      "1 tbsp Caraway Seeds",
      "2 tbsp Dijon Mustard",
      "4 Crusty Bread Rolls",
      "2 tbsp Butter",
    ],
    [
      "In a large pan, sauté onions in butter until translucent.",
      "Add sauerkraut, grated apple, caraway seeds, and beer to the pan. Simmer for 20 minutes.",
      "In a separate skillet, brown the bratwursts on medium heat for 10-12 minutes.",
      "Add the browned sausages to the sauerkraut mixture for the last 5 minutes to infuse flavors.",
      "Serve the sausage inside sliced rolls topped with a large spoonful of sauerkraut and mustard.",
    ],
    false, // isGlutenFree
    false, // isVegan
    false, // isVegetarian
    false, // isLactoseFree
  ),

  new Meal(
    "m5",
    ["c5"],
    "Greek Salad",
    "affordable",
    "simple",
    "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=500&auto=format&fit=crop",
    15,
    [
      "3 Large Tomatoes (Chunky cut)",
      "1 English Cucumber (Sliced)",
      "1/2 Red Onion (Thinly sliced)",
      "100g Kalamata Olives",
      "200g Block of Feta Cheese",
      "1 tsp Dried Oregano",
      "3 tbsp Extra Virgin Olive Oil",
      "1 tbsp Red Wine Vinegar",
      "Pinch of Salt",
    ],
    [
      "Combine tomatoes, cucumber, and red onion in a large shallow bowl.",
      "Whisk olive oil and red wine vinegar together and drizzle over the vegetables.",
      "Place the whole block of Feta cheese on top and sprinkle with dried oregano.",
      "Add the Kalamata olives and serve at room temperature with crusty bread.",
    ],
    true, // isGlutenFree
    false, // isVegan
    true, // isVegetarian
    false, // isLactoseFree
  ),

  new Meal(
    "m6",
    ["c6"],
    "Sushi Platter",
    "luxurious",
    "hard",
    "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=500&auto=format&fit=crop",
    60,
    [
      "300g Sushi Rice",
      "50ml Rice Vinegar",
      "1 tbsp Sugar",
      "4 Nori Sheets",
      "150g Fresh Sashimi-grade Salmon",
      "1 Ripe Avocado",
      "1/2 Cucumber",
      "Soy Sauce",
      "Pickled Ginger",
      "Wasabi",
    ],
    [
      "Cook sushi rice and fold in vinegar and sugar while hot. Let it cool completely.",
      "Place a nori sheet on a bamboo mat and spread a thin layer of rice over it.",
      "Place thin strips of salmon, avocado, and cucumber across the center.",
      "Roll the mat tightly to form a cylinder, then cut into 6-8 even pieces.",
      "Serve with soy sauce, wasabi, and ginger.",
    ],
    true, // isGlutenFree
    false, // isVegan
    false, // isVegetarian
    true, // isLactoseFree
  ),

  new Meal(
    "m7",
    ["c7"],
    "Pancakes with Maple Syrup",
    "affordable",
    "simple",
    "https://plus.unsplash.com/premium_photo-1663854478296-dd00b6257021?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    25,
    [
      "1.5 Cups All-purpose Flour",
      "3.5 tsp Baking Powder",
      "1 tsp Salt",
      "1 tbsp White Sugar",
      "1.25 Cups Buttermilk",
      "1 Egg",
      "3 tbsp Melted Butter",
      "1 tsp Vanilla Extract",
      "Maple Syrup & Berries",
    ],
    [
      "Sift dry ingredients together in a large bowl.",
      "Whisk in buttermilk, egg, vanilla, and melted butter until just combined (don't overmix).",
      "Heat a lightly oiled pan over medium heat and pour 1/4 cup of batter for each pancake.",
      "Cook until bubbles form on top, flip, and cook until golden brown on both sides.",
    ],
    false, // isGlutenFree
    false, // isVegan
    true, // isVegetarian
    false, // isLactoseFree
  ),

  new Meal(
    "m8",
    ["c8"],
    "Pad Thai",
    "pricey",
    "challenging",
    "https://images.unsplash.com/photo-1645500498403-970672caf43e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    40,
    [
      "200g Flat Rice Noodles",
      "150g Fresh Shrimp",
      "50g Firm Tofu",
      "2 Eggs",
      "2 tbsp Tamarind Paste",
      "2 tbsp Fish Sauce",
      "1 tbsp Brown Sugar",
      "100g Bean Sprouts",
      "2 cloves Garlic",
      "2 tbsp Crushed Peanuts",
      "Lime Wedges",
    ],
    [
      "Soak rice noodles in warm water for 30 minutes until soft.",
      "Whisk tamarind, fish sauce, and sugar to make the sauce.",
      "Stir-fry shrimp and tofu in a wok until cooked; remove and set aside.",
      "Scramble eggs in the wok, add noodles and sauce, then toss in bean sprouts and protein.",
      "Serve topped with crushed peanuts and a squeeze of lime.",
    ],
    true, // isGlutenFree
    false, // isVegan
    false, // isVegetarian
    true, // isLactoseFree
  ),

  new Meal(
    "m9",
    ["c9", "c10"],
    "Crème Brûlée",
    "luxurious",
    "hard",
    "https://images.unsplash.com/photo-1676300184943-09b2a08319a3?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    60,
    [
      "2 Cups Heavy Cream",
      "5 Large Egg Yolks",
      "1/2 Cup Granulated Sugar",
      "1 Vanilla Bean",
      "Extra Sugar for Caramelizing",
      "Pinch of Salt",
    ],
    [
      "Preheat oven to 150°C and heat cream with vanilla until simmering.",
      "Whisk egg yolks and sugar, then slowly temper with the hot cream.",
      "Strain and pour into ramekins; bake in a water bath for 35-40 minutes.",
      "Chill for 4 hours, then caramelize sugar on top with a torch before serving.",
    ],
    true, // isGlutenFree
    false, // isVegan
    true, // isVegetarian
    false, // isLactoseFree
  ),
  new Meal(
    "m10",
    ["c11"],
    "Falafel with Hummus",
    "affordable",
    "simple",
    "https://plus.unsplash.com/premium_photo-1663853051503-57130cb26bc6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8RmFsYWZlbCUyMHdpdGglMjBIdW1tdXN8ZW58MHx8MHx8fDA%3D",
    45,
    [
      "2 Cups Dried Chickpeas (Soaked)",
      "1 Small Onion",
      "3 Garlic Cloves",
      "1 Cup Fresh Parsley",
      "1 tsp Cumin",
      "1/2 tsp Baking Soda",
      "Vegetable Oil",
      "200g Hummus",
      "Warm Pita Bread",
    ],
    [
      "Blend chickpeas, onion, garlic, and spices until grainy.",
      "Mix in baking soda, form into balls, and deep fry until golden brown.",
      "Serve hot with a side of creamy hummus and fresh pita bread.",
    ],
    false, // isGlutenFree
    true, // isVegan
    true, // isVegetarian
    true, // isLactoseFree
  ),
  new Meal(
    "m11",
    ["c12"],
    "Tacos al Pastor",
    "pricey",
    "challenging",
    "https://plus.unsplash.com/premium_photo-1681406994521-82c20814605d?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8VGFjb3MlMjBhbCUyMFBhc3RvcnxlbnwwfHwwfHx8MA%3D%3D",
    40,
    [
      "500g Pork Shoulder (Thinly sliced)",
      "Achiote Paste",
      "Dried Guajillo Chilies",
      "Pineapple Juice",
      "Apple Cider Vinegar",
      "Small Corn Tortillas",
      "1 Fresh Pineapple (Sliced)",
      "1 White Onion (Finely chopped)",
      "Fresh Cilantro",
      "Lime Wedges",
      "Salsa Verde",
    ],
    [
      "Blend achiote, soaked chilies, pineapple juice, and vinegar to create a marinade.",
      "Marinate pork slices for at least 4 hours (ideally overnight).",
      "Grill the pork over high heat until slightly charred and cooked through; chop into small bits.",
      "Grill pineapple slices until caramelized and chop them into small pieces.",
      "Warm the corn tortillas on a dry skillet.",
      "Place pork on tortillas, top with grilled pineapple, onions, and cilantro.",
      "Serve with a side of salsa verde and fresh lime wedges.",
    ],
    true, // isGlutenFree (Corn tortillas)
    false, // isVegan
    false, // isVegetarian
    true, // isLactoseFree
  ),

  new Meal(
    "m12",
    ["c13"],
    "Butter Chicken (Murgh Makhani)",
    "luxurious",
    "challenging",
    "https://images.unsplash.com/photo-1728910107534-e04e261768ae?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8QnV0dGVyJTIwQ2hpY2tlbnxlbnwwfHwwfHx8MA%3D%3D",
    50,
    [
      "800g Chicken Thighs (Bite-sized)",
      "1 Cup Greek Yogurt",
      "2 tbsp Lemon Juice",
      "100g Unsalted Butter",
      "1 tbsp Ginger-Garlic Paste",
      "400g Tomato Puree",
      "200ml Heavy Cream",
      "1 tbsp Garam Masala",
      "1 tsp Turmeric",
      "1 tsp Chili Powder",
      "Dried Fenugreek Leaves (Kasuri Methi)",
    ],
    [
      "Marinate chicken in yogurt, lemon juice, and half the spices for at least 1 hour.",
      "Pan-sear or grill the chicken until 80% cooked.",
      "In a large pan, melt butter and sauté ginger-garlic paste until fragrant.",
      "Add tomato puree and remaining spices; simmer for 15 minutes.",
      "Stir in the heavy cream and grilled chicken; cook for another 5-10 minutes.",
      "Crush dried fenugreek leaves over the sauce and stir.",
      "Serve hot with Basmati rice or garlic naan.",
    ],
    true, // isGlutenFree
    false, // isVegan
    false, // isVegetarian
    false, // isLactoseFree (Contains butter and cream)
  ),

  new Meal(
    "m13",
    ["c14"],
    "Grilled Salmon with Lemon",
    "pricey",
    "simple",
    "https://images.unsplash.com/photo-1485921325833-c519f76c4927?q=80&w=500&auto=format&fit=crop",
    30,
    [
      "2 Fresh Salmon Fillets",
      "1 Large Lemon (Sliced)",
      "2 tbsp Extra Virgin Olive Oil",
      "2 cloves Garlic (Minced)",
      "1 tsp Dried Dill or Fresh Parsley",
      "Sea Salt",
      "Cracked Black Pepper",
      "Asparagus or Broccoli (for side)",
    ],
    [
      "Pat the salmon fillets dry with paper towels.",
      "Whisk olive oil, minced garlic, lemon juice, salt, and pepper in a small bowl.",
      "Brush the marinade over both sides of the fillets.",
      "Preheat the grill to medium-high heat and oil the grates lightly.",
      "Grill salmon skin-side down for 4-5 minutes, then flip and grill for another 3-4 minutes.",
      "Place lemon slices on the grill for the last minute for extra flavor.",
      "Serve immediately garnished with fresh dill or parsley.",
    ],
    true, // isGlutenFree
    false, // isVegan
    false, // isVegetarian (Contains fish)
    true, // isLactoseFree
  ),

  new Meal(
    "m14",
    ["c15"],
    "Vegan Buddha Bowl",
    "affordable",
    "simple",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=500&auto=format&fit=crop",
    20,
    [
      "1 Cup Cooked Quinoa",
      "400g Canned Chickpeas (Rinsed)",
      "1 Ripe Avocado (Sliced)",
      "2 Cups Fresh Baby Spinach",
      "1 Large Carrot (Shredded)",
      "1/2 Red Cabbage (Sliced)",
      "2 tbsp Tahini",
      "1 tbsp Lemon Juice",
      "1 tsp Maple Syrup",
      "Water to thin",
    ],
    [
      "Cook quinoa according to package instructions and let it cool slightly.",
      "In a small bowl, whisk tahini, lemon juice, and maple syrup; add water until it reaches a drizzling consistency.",
      "Lightly sauté the spinach until just wilted, or leave raw if preferred.",
      "Divide quinoa into two bowls.",
      "Arrange chickpeas, avocado, spinach, carrots, and cabbage in sections over the quinoa.",
      "Drizzle generously with the tahini dressing and top with sesame seeds if desired.",
    ],
    true, // isGlutenFree
    true, // isVegan
    true, // isVegetarian
    true, // isLactoseFree
  ),

  new Meal(
    "m15",
    ["c13"],
    "Chicken Tikka Masala",
    "pricey",
    "challenging",
    "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=500&auto=format&fit=crop",
    45,
    [
      "800g Chicken Breast (Cubed)",
      "1 Cup Plain Yogurt",
      "2 tbsp Lemon Juice",
      "1 Large Onion (Finely chopped)",
      "3 cloves Garlic (Minced)",
      "1 tbsp Ginger (Grated)",
      "400g Tomato Sauce/Puree",
      "1 tbsp Garam Masala",
      "1 tsp Paprika",
      "1 tsp Turmeric",
      "150ml Heavy Cream",
      "Fresh Cilantro",
    ],
    [
      "Mix yogurt, lemon juice, and half the spices; marinate chicken for at least 30 minutes.",
      "Grill or pan-fry chicken pieces until charred and cooked through.",
      "Sauté onions, garlic, and ginger in a large pot until golden brown.",
      "Add tomato sauce and the remaining spices; simmer for 10-15 minutes.",
      "Stir in the heavy cream and add the cooked chicken pieces.",
      "Simmer for an additional 5 minutes to let the flavors meld.",
      "Garnish with chopped cilantro and serve with warm naan.",
    ],
    true, // isGlutenFree
    false, // isVegan
    false, // isVegetarian
    false, // isLactoseFree
  ),

  new Meal(
    "m16",
    ["c10"],
    "Chocolate Lava Cake",
    "affordable",
    "simple",
    "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=500&auto=format&fit=crop",
    20,
    [
      "100g High-quality Dark Chocolate",
      "50g Unsalted Butter",
      "2 Large Eggs",
      "2 tbsp Sugar",
      "2 tbsp All-purpose Flour",
      "Pinch of Salt",
      "1/2 tsp Vanilla Extract",
    ],
    [
      "Preheat oven to 200°C. Grease two ramekins with butter and dust with cocoa powder.",
      "Melt chocolate and butter together in a microwave or double boiler until smooth.",
      "In a separate bowl, whisk eggs and sugar until thick and pale.",
      "Gently fold the melted chocolate into the egg mixture.",
      "Sift in the flour and salt; fold gently until just combined.",
      "Divide the batter between the ramekins.",
      "Bake for 10-12 minutes. The sides should be firm, but the center should still be soft.",
      "Let sit for 1 minute, then carefully invert onto plates.",
    ],
    false, // isGlutenFree (Contains flour)
    false, // isVegan
    true, // isVegetarian
    false, // isLactoseFree (Contains butter)
  ),

  new Meal(
    "m17",
    ["c12"],
    "Chicken Quesadilla",
    "affordable",
    "simple",
    "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?q=80&w=500&auto=format&fit=crop",
    15,
    [
      "2 Large Flour Tortillas",
      "200g Cooked Chicken Breast (Shredded)",
      "1 Cup Shredded Cheddar or Monterey Jack",
      "1/2 Bell Pepper (Diced)",
      "1/4 Red Onion (Diced)",
      "1 tsp Taco Seasoning",
      "Sour Cream and Salsa for serving",
    ],
    [
      "Toss the shredded chicken with taco seasoning.",
      "Place one tortilla in a large dry skillet over medium heat.",
      "Sprinkle half the cheese over the tortilla, then add chicken, peppers, and onions.",
      "Top with the remaining cheese and the second tortilla.",
      "Cook for 3-4 minutes per side until the tortilla is crispy and the cheese is fully melted.",
      "Remove from heat and let it rest for a minute before slicing into wedges.",
      "Serve with salsa, sour cream, and guacamole.",
    ],
    false, // isGlutenFree (Flour tortillas)
    false, // isVegan
    false, // isVegetarian
    false, // isLactoseFree
  ),

  new Meal(
    "m18",
    ["c14"],
    "Classic Shrimp Scampi",
    "pricey",
    "simple",
    "https://images.unsplash.com/photo-1625943553852-781c6dd46faa?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8U2hyaW1wJTIwU2NhbXBpfGVufDB8fDB8fHww",
    25,
    [
      "250g Spaghetti or Linguine",
      "400g Large Shrimp (Peeled and deveined)",
      "4 cloves Garlic (Minced)",
      "50g Unsalted Butter",
      "2 tbsp Olive Oil",
      "1/2 Cup Dry White Wine",
      "1 tbsp Lemon Juice",
      "1/4 tsp Red Pepper Flakes",
      "Fresh Parsley (Chopped)",
    ],
    [
      "Cook the pasta in boiling salted water until al dente.",
      "While pasta cooks, heat olive oil and butter in a large skillet over medium heat.",
      "Add garlic and red pepper flakes; sauté for 1 minute until fragrant.",
      "Add shrimp in a single layer and cook for 2 minutes per side until pink.",
      "Remove shrimp from the pan; pour in white wine and lemon juice.",
      "Simmer the sauce for 3 minutes to reduce slightly.",
      "Toss the pasta and shrimp back into the pan with the sauce and parsley. Mix well.",
    ],
    false, // isGlutenFree (Wheat pasta)
    false, // isVegan
    false, // isVegetarian
    false, // isLactoseFree (Contains butter)
  ),

  new Meal(
    "m19",
    ["c1"],
    "Spaghetti Carbonara",
    "pricey",
    "simple",
    "https://images.unsplash.com/photo-1612874742237-6526221588e3?q=80&w=500&auto=format&fit=crop",
    20,
    [
      "200g Spaghetti",
      "100g Guanciale or Pancetta (Cubed)",
      "2 Large Eggs + 1 Yolk",
      "50g Pecorino Romano (Grated)",
      "50g Parmigiano Reggiano (Grated)",
      "1 tsp Coarse Black Pepper",
      "Salt for pasta water",
    ],
    [
      "Boil a large pot of salted water and cook spaghetti.",
      "In a small bowl, whisk the eggs, egg yolk, and both cheeses together until a thick paste forms.",
      "In a cold skillet, add guanciale and turn heat to medium; fry until crispy and fat has rendered.",
      "Reserve 1/2 cup of pasta water, then drain the spaghetti.",
      "Add the pasta to the skillet with guanciale and toss to coat in the fat.",
      "Remove the skillet from heat (Crucial step!).",
      "Quickly stir in the egg and cheese mixture, adding a little pasta water to create a creamy sauce without scrambling the eggs.",
      "Season heavily with black pepper and serve immediately.",
    ],
    false, // isGlutenFree
    false, // isVegan
    false, // isVegetarian (Contains Guanciale)
    false, // isLactoseFree
  ),
  new Meal(
    "m20",
    ["c18"],
    "Lamb Rogan Josh",
    "luxurious",
    "hard",
    "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=500&auto=format&fit=crop",
    60,
    [
      "800g Lamb Shoulder (Cubed)",
      "1 Cup Plain Yogurt",
      "3 tbsp Ghee or Oil",
      "2 Large Onions (Pureed)",
      "1 tbsp Ginger Paste",
      "2 tsp Kashmiri Red Chili Powder",
      "1 tsp Fennel Seeds (Ground)",
      "1 tsp Ground Ginger",
      "4 Green Cardamom Pods",
      "1 Cinnamon Stick",
      "Salt to taste",
    ],
    [
      "Heat ghee in a heavy pot and sear the lamb cubes until browned; remove and set aside.",
      "In the same pot, fry cardamom, cinnamon, and onion puree until the oil separates.",
      "Stir in ginger paste and the dry spices (chili, fennel, ginger).",
      "Return the lamb to the pot and stir to coat in spices.",
      "Whisk the yogurt until smooth and add it to the pot one spoonful at a time, stirring constantly.",
      "Add a splash of water, cover, and simmer on low heat for 45-60 minutes until the lamb is melt-in-the-mouth tender.",
      "Serve with steamed Basmati rice or fresh Naan.",
    ],
    true, // isGlutenFree
    false, // isVegan
    false, // isVegetarian
    false, // isLactoseFree (Contains yogurt and ghee)
  ),
  new Meal(
    "m21",
    ["c3"],
    "BBQ Bacon Burger",
    "pricey",
    "challenging",
    "https://images.unsplash.com/photo-1553979459-d2229ba7433b?q=80&w=500&auto=format&fit=crop",
    35,
    [
      "200g Ground Beef",
      "2 Slices of Smoked Bacon",
      "1 Brioche Bun",
      "2 Slices of Cheddar Cheese",
      "3-4 Crispy Onion Rings",
      "2 tbsp BBQ Sauce",
      "1 tsp Smoked Paprika",
      "Butter for Toasting",
    ],
    [
      "Season the beef patty with salt and smoked paprika; grill for 4 minutes per side.",
      "Fry the bacon strips until they reach your preferred level of crispiness.",
      "In the last minute of grilling, place cheese slices on the patty to melt.",
      "Toast the buttered buns on a hot pan until golden brown.",
      "Spread a generous layer of BBQ sauce on both halves of the bun.",
      "Stack the patty, bacon, and crispy onion rings inside the bun.",
      "Serve hot with extra BBQ sauce on the side.",
    ],
    false, // isGlutenFree (Bun & Onion Rings)
    false, // isVegan
    false, // isVegetarian
    false, // isLactoseFree
  ),

  new Meal(
    "m22",
    ["c7", "c18"],
    "Eggs Benedict",
    "luxurious",
    "hard",
    "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?q=80&w=500&auto=format&fit=crop",
    30,
    [
      "2 Large Eggs",
      "1 English Muffin",
      "2 Slices of Canadian Bacon (or Ham)",
      "3 Egg Yolks (for sauce)",
      "100g Unsalted Butter (Melted)",
      "1 tbsp Lemon Juice",
      "Pinch of Cayenne Pepper",
      "1 tsp White Vinegar",
    ],
    [
      "Make the Hollandaise: Whisk egg yolks and lemon juice in a bowl over simmering water. Slowly drizzle in melted butter while whisking constantly until thick.",
      "Season the sauce with a pinch of salt and cayenne pepper; keep warm.",
      "Poach the eggs: Simmer water with vinegar, create a gentle whirlpool, and drop eggs in for 3 minutes.",
      "Toast the halved English muffins and lightly sear the Canadian bacon in a pan.",
      "Assemble: Place bacon on the muffins, top with a poached egg, and pour Hollandaise sauce over it.",
      "Garnish with fresh chives or paprika.",
    ],
    false, // isGlutenFree (Muffin)
    false, // isVegan
    false, // isVegetarian (Bacon)
    false, // isLactoseFree
  ),

  new Meal(
    "m23",
    ["c15", "c5"],
    "Quinoa Tabbouleh",
    "affordable",
    "simple",
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=500&auto=format&fit=crop",
    15,
    [
      "1 Cup Cooked Quinoa",
      "2 Bunches of Fresh Parsley (Finely chopped)",
      "1/2 Bunch of Fresh Mint",
      "2 Firm Tomatoes (Diced)",
      "1 English Cucumber (Diced)",
      "3 tbsp Extra Virgin Olive Oil",
      "2 tbsp Fresh Lemon Juice",
      "1 clove Garlic (Minced)",
      "Pinch of Salt",
    ],
    [
      "Ensure the cooked quinoa is completely cooled to room temperature.",
      "Wash and dry the parsley and mint thoroughly before chopping them very finely.",
      "In a large bowl, combine the chopped herbs, tomatoes, cucumber, and quinoa.",
      "Whisk together olive oil, lemon juice, minced garlic, and salt.",
      "Pour the dressing over the salad and toss gently to combine.",
      "Let it sit for 10 minutes before serving to allow the flavors to meld.",
    ],
    true, // isGlutenFree
    true, // isVegan
    true, // isVegetarian
    true, // isLactoseFree
  ),

  new Meal(
    "m24",
    ["c9", "c18"],
    "Classic French Ratatouille",
    "pricey",
    "hard",
    "https://plus.unsplash.com/premium_photo-1713635953194-ab8a625b2477?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8UmF0YXRvdWlsbGV8ZW58MHx8MHx8fDA%3D",
    45,
    [
      "1 Eggplant",
      "1 Zucchini",
      "1 Yellow Squash",
      "4 Large Tomatoes",
      "2 Bell Peppers (Red & Yellow)",
      "3 cloves Garlic",
      "1 Onion",
      "Fresh Thyme & Rosemary",
      "Olive Oil",
      "Herbes de Provence",
    ],
    [
      "Prepare the sauce: Sauté onions, garlic, and diced bell peppers until soft. Spread at the bottom of a baking dish.",
      "Slice eggplant, zucchini, squash, and tomatoes into very thin, even rounds.",
      "Arrange the vegetable slices in an alternating pattern over the sauce, standing them vertically.",
      "Drizzle generously with olive oil and season with salt, pepper, and Herbes de Provence.",
      "Cover with parchment paper and bake at 190°C for 40 minutes.",
      "Uncover and bake for another 15-20 minutes until the vegetables are tender and slightly browned.",
    ],
    true, // isGlutenFree
    true, // isVegan
    true, // isVegetarian
    true, // isLactoseFree
  ),

  new Meal(
    "m25",
    ["c16"],
    "Kabuli Pulao",
    "pricey",
    "hard",
    "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=500&auto=format&fit=crop",
    90,
    [
      "500g Long-grain Basmati Rice",
      "700g Lamb Shanks",
      "3 Large Carrots (Julienned)",
      "1/2 Cup Black Raisins",
      "1/2 Cup Slivered Almonds",
      "2 Large Onions",
      "1 tbsp Cumin Powder",
      "1 tsp Cardamom Powder",
      "1 tsp Cloves",
      "Vegetable Oil",
      "Sugar",
    ],
    [
      "Brown the onions in oil, add lamb and spices, cover with water and slow-cook for 1 hour until the meat is tender.",
      "In a separate pan, sauté carrots with a bit of sugar until soft; add raisins and almonds at the end.",
      "Parboil the soaked rice in salted water until half-cooked, then drain.",
      "Layer the rice over the meat and broth, then top with the carrot and raisin mixture.",
      "Cover the pot with a tight lid (Dum) and steam on very low heat for 30-40 minutes.",
      "Gently mix the rice and meat when serving, ensuring the carrots stay on top as a garnish.",
    ],
    true, // isGlutenFree
    false, // isVegan
    false, // isVegetarian
    true, // isLactoseFree
  ),

  new Meal(
    "m26",
    ["c17"],
    "Ghormeh Sabzi",
    "pricey",
    "hard",
    "https://media.istockphoto.com/id/2223494636/photo/ghormeh-sabzi.webp?a=1&b=1&s=612x612&w=0&k=20&c=6LbIF9enTmlVUASewR5lhjWnqry8vuK9WC4WOXdtse8=",
    120,
    [
      "500g Lamb or Beef (Cubed)",
      "4 Cups Mixed Herbs (Parsley, Cilantro, Chives, Fenugreek)",
      "1/2 Cup Red Kidney Beans (Soaked)",
      "4 Dried Limes (Limo Amani)",
      "1 Large Onion",
      "1 tsp Turmeric",
      "Black Pepper",
      "Oil for frying",
    ],
    [
      "The Secret: Sauté the finely chopped herbs in oil for 15-20 minutes until very dark green (but not burnt).",
      "In a separate pot, sauté onions with turmeric, then add meat and brown it.",
      "Add kidney beans, fried herbs, and 3 cups of water to the meat.",
      "Pierce the dried limes with a fork and add them to the stew.",
      "Cover and simmer on low heat for 2-3 hours until the meat is tender and the oil floats on top.",
      "Serve with buttery Persian saffron rice.",
    ],
    true, // isGlutenFree
    false, // isVegan
    false, // isVegetarian
    true, // isLactoseFree
  ),

  new Meal(
    "m27",
    ["c8"],
    "Authentic Beef Pho",
    "pricey",
    "hard",
    "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?q=80&w=500&auto=format&fit=crop",
    180,
    [
      "1kg Beef Bones (Marrow & Knuckle)",
      "200g Thinly Sliced Raw Beef Eye Round",
      "1 Pack Rice Sticks (Pho Noodles)",
      "1 Large Onion & Ginger (Charred)",
      "Whole Spices (Star Anise, Cinnamon, Cloves, Coriander Seeds)",
      "Fish Sauce",
      "Fresh Basil, Bean Sprouts, Lime, and Chili",
    ],
    [
      "Boil bones for 10 minutes, then rinse them to ensure a clear broth.",
      "Simmer the cleaned bones with charred onion, ginger, and toasted spices for 3-6 hours.",
      "Strain the broth and season with fish sauce and a pinch of salt.",
      "Prepare rice noodles according to package instructions.",
      "Place noodles in a bowl, top with raw beef slices and onions.",
      "Pour the boiling hot broth over the beef to cook it instantly.",
      "Serve with a plate of fresh herbs, sprouts, and lime on the side.",
    ],
    true, // isGlutenFree (Rice noodles)
    false, // isVegan
    false, // isVegetarian
    true, // isLactoseFree
  ),

  new Meal(
    "m28",
    ["c16"],
    "Mantu (Afghan Dumplings)",
    "pricey",
    "hard",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYN66YQjm1DWF3amqkpSXYpPQ1Opw7yIb8hg&s",
    60,
    [
      "500g Ground Beef",
      "4 Large Onions (Finely chopped)",
      "Wonton Wrappers or Pasta Dough",
      "2 Cups Plain Yogurt",
      "2 cloves Garlic (Minced)",
      "1/2 Cup Tomato Paste",
      "1/4 Cup Yellow Split Peas (Cooked)",
      "Dried Mint",
      "Ground Coriander",
    ],
    [
      "Filling: Mix raw ground beef with the finely chopped onions and coriander seeds.",
      "Place a spoonful of filling in the center of each dough square and fold the corners to seal.",
      "Steam the dumplings in a multi-tier steamer for 30 minutes.",
      "Tomato Sauce: Sauté tomato paste with cooked split peas and spices until thick.",
      "Yogurt Sauce: Mix yogurt with minced garlic and a pinch of salt.",
      "To serve: Spread yogurt sauce on a plate, add dumplings, top with tomato gravy and dried mint.",
    ],
    false, // isGlutenFree (Wheat dough)
    false, // isVegan
    false, // isVegetarian
    false, // isLactoseFree (Yogurt sauce)
  ),

  new Meal(
    "m29",
    ["c12"],
    "Beef Enchiladas",
    "pricey",
    "challenging",
    "https://images.unsplash.com/photo-1730878423239-0fd430bbac37?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8QmVlZiUyMEVuY2hpbGFkYXN8ZW58MHx8MHx8fDA%3D",
    40,
    [
      "8 Corn Tortillas",
      "500g Ground Beef",
      "2 Cups Red Enchilada Sauce",
      "2 Cups Shredded Mexican Cheese Blend",
      "1/2 Cup Black Beans",
      "1/2 Onion (Diced)",
      "1 tsp Cumin",
      "Sour Cream for garnish",
    ],
    [
      "Cook ground beef with onions, beans, and cumin until browned. Drain excess fat.",
      "Warm the tortillas slightly to make them pliable.",
      "Dip each tortilla in enchilada sauce, fill with the beef mixture and a little cheese, then roll tightly.",
      "Place rolls seam-side down in a baking dish.",
      "Pour the remaining sauce over the top and sprinkle with the rest of the cheese.",
      "Bake at 190°C for 20 minutes until the cheese is bubbly and golden.",
    ],
    true, // isGlutenFree (Corn tortillas)
    false, // isVegan
    false, // isVegetarian
    false, // isLactoseFree
  ),

  new Meal(
    "m30",
    ["c8"],
    "Kung Pao Chicken",
    "affordable",
    "challenging",
    "https://images.unsplash.com/photo-1525755662778-989d0524087e?q=80&w=500&auto=format&fit=crop",
    25,
    [
      "400g Chicken Breast (Cubed)",
      "1/2 Cup Roasted Peanuts",
      "10-12 Dried Red Chilies",
      "2 cloves Garlic & 1 tsp Ginger (Minced)",
      "2 tbsp Soy Sauce",
      "1 tbsp Rice Vinegar",
      "1 tsp Sichuan Peppercorns",
      "1 tsp Cornstarch",
      "Green Onions",
    ],
    [
      "Marinate chicken cubes in 1 tbsp soy sauce and cornstarch for 15 minutes.",
      "Whisk together the remaining soy sauce, vinegar, and a teaspoon of sugar to make the sauce.",
      "Heat oil in a wok and stir-fry the chicken until golden; remove and set aside.",
      "In the same wok, fry dried chilies and Sichuan peppercorns until fragrant.",
      "Add garlic, ginger, and green onions; sauté for 30 seconds.",
      "Return chicken to the wok, add the peanuts and the sauce.",
      "Toss everything together over high heat until the sauce thickens and coats the chicken.",
    ],
    false, // isGlutenFree (Soy sauce contains wheat)
    false, // isVegan
    false, // isVegetarian
    true, // isLactoseFree
  ),
  new Meal(
    "m31",
    ["c17"],
    "Joojeh Kabab",
    "pricey",
    "simple",
    "https://images.unsplash.com/photo-1644364935906-792b2245a2c0?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Sm9vamVoJTIwS2FiYWJ8ZW58MHx8MHx8fDA%3D",
    40,
    [
      "800g Chicken Thighs or Breast",
      "1/2 tsp Saffron (Grind and brewed)",
      "1/2 Cup Greek Yogurt",
      "2 Large Onions (Slivered)",
      "4 tbsp Lemon Juice",
      "50g Butter (Melted)",
      "1 tsp Turmeric",
      "Salt & Black Pepper",
    ],
    [
      "In a large bowl, combine yogurt, saffron, lemon juice, salt, pepper, and onions.",
      "Add chicken pieces to the marinade, ensuring every piece is coated. Cover and refrigerate for 24 hours.",
      "Thread the marinated chicken onto skewers, avoiding the onion pieces.",
      "Grill over hot charcoal for 10-15 minutes, turning frequently.",
      "In the last few minutes, baste the chicken with a mixture of melted butter and saffron.",
      "Serve hot with grilled tomatoes and Persian saffron rice (Chelow).",
    ],
    true, // isGlutenFree
    false, // isVegan
    false, // isVegetarian
    false, // isLactoseFree (Contains yogurt and butter)
  ),

  new Meal(
    "m32",
    ["c13"],
    "Hyderabadi Chicken Biryani",
    "pricey",
    "hard",
    "https://plus.unsplash.com/premium_photo-1694141251673-1758913ade48?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Q2hpY2tlbiUyMEJpcnlhbml8ZW58MHx8MHx8fDA%3D",
    60,
    [
      "500g Basmati Rice",
      "700g Chicken",
      "1 Cup Fried Onions (Birista)",
      "1/2 Cup Plain Yogurt",
      "2 tbsp Ginger-Garlic Paste",
      "1 bunch Fresh Mint & Cilantro",
      "Whole Spices (Cardamom, Cinnamon, Star Anise)",
      "1 tsp Biryani Masala",
      "Saffron Milk",
    ],
    [
      "Marinate chicken with yogurt, ginger-garlic paste, biryani masala, and half the fried onions for 2 hours.",
      "Parboil the soaked basmati rice with whole spices until it is 70% cooked; drain the water.",
      "In a heavy-bottomed pot, place the marinated chicken at the bottom.",
      "Layer the parboiled rice over the chicken, then top with remaining fried onions, chopped mint, cilantro, and saffron milk.",
      "Seal the pot with dough or a tight lid (Dum) and cook on very low heat for 40-45 minutes.",
      "Fluff the rice gently from the sides and serve with Raita.",
    ],
    true, // isGlutenFree
    false, // isVegan
    false, // isVegetarian
    false, // isLactoseFree
  ),

  new Meal(
    "m33",
    ["c16"],
    "Afghan Bolani",
    "affordable",
    "challenging",
    "https://media.istockphoto.com/id/2196374149/photo/gutab.webp?a=1&b=1&s=612x612&w=0&k=20&c=eTN1p2s-QvMr9H7IOxkR7hdD01WfsOfz8KezDTPuzag=",
    45,
    [
      "3 Cups All-purpose Flour",
      "2 Cups Finely Chopped Leeks (or Scallions)",
      "2 Large Potatoes (Boiled and mashed)",
      "2 Green Chilies (Minced)",
      "1 tsp Cilantro Powder",
      "Vegetable Oil for frying",
      "Warm Water for dough",
    ],
    [
      "Prepare a smooth dough with flour, salt, and water; let it rest for 20 minutes.",
      "Prepare the filling: Mix chopped leeks (or mashed potatoes) with chilies and spices.",
      "Divide the dough into small balls and roll each into a very thin, large circle.",
      "Spread the filling on one half of the dough and fold the other half over it to form a semi-circle.",
      "Press the edges firmly to seal.",
      "Heat a lightly oiled skillet and fry each bolani for 2-3 minutes per side until golden and crispy.",
      "Serve warm with garlic yogurt dip.",
    ],
    false, // isGlutenFree (Wheat flour)
    true, // isVegan (If served without yogurt dip)
    true, // isVegetarian
    true, // isLactoseFree
  ),

  new Meal(
    "m34",
    ["c17"],
    "Kashk-e Bademjan",
    "affordable",
    "simple",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmda9o0kB-RuSt8r6w68lrP2hevxn4XV7jwg&s",
    35,
    [
      "4 Large Eggplants",
      "1/2 Cup Kashk (Liquid Whey)",
      "2 Large Onions (Sliced)",
      "4 cloves Garlic (Minced)",
      "2 tbsp Dried Mint",
      "1/2 Cup Walnuts (Optional/Crushed)",
      "Turmeric, Salt, and Oil",
    ],
    [
      "Peel eggplants and fry them until golden (or roast for a healthier version).",
      "Mash the cooked eggplants thoroughly with a fork.",
      "In a pan, sauté onions until golden brown; add garlic and turmeric.",
      "Heat oil in a small spoon and quickly fry the dried mint for 10 seconds (Mint Oil).",
      "Mix the mashed eggplants with half the kashk, fried onions, and walnuts.",
      "Garnish with a drizzle of kashk, the remaining fried onions, and the mint oil.",
      "Serve with fresh Sangak or Lavash bread.",
    ],
    true, // isGlutenFree
    false, // isVegan
    true, // isVegetarian
    false, // isLactoseFree (Kashk is a dairy product)
  ),

  new Meal(
    "m35",
    ["c1"],
    "Lasagna Bolognese",
    "pricey",
    "hard",
    "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=500&auto=format&fit=crop",
    60,
    [
      "12 Lasagna Sheets",
      "500g Ground Beef",
      "500ml Bechamel Sauce",
      "400g Tomato Sauce (Marinara)",
      "1 Cup Grated Parmesan Cheese",
      "2 Cups Mozzarella",
      "1 Onion & 2 cloves Garlic",
      "Fresh Basil",
    ],
    [
      "Bolognese: Sauté onion and garlic, add ground beef and brown it; stir in tomato sauce and simmer for 20 minutes.",
      "Prepare a creamy Bechamel sauce using butter, flour, and milk.",
      "In a baking dish, spread a layer of meat sauce, then a layer of lasagna sheets.",
      "Top with Bechamel, mozzarella, and meat sauce; repeat for 3-4 layers.",
      "Finish with a thick layer of Bechamel, mozzarella, and plenty of Parmesan.",
      "Cover with foil and bake at 190°C for 25 minutes, then uncover and bake for 15 more minutes until bubbly and golden.",
      "Let it rest for 10 minutes before slicing.",
    ],
    false, // isGlutenFree
    false, // isVegan
    false, // isVegetarian
    false, // isLactoseFree
  ),

  new Meal(
    "m36",
    ["c2"],
    "Avocado Toast",
    "affordable",
    "simple",
    "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=500&auto=format&fit=crop",
    5,
    [
      "2 Slices of Multigrain or Sourdough Bread",
      "1 Ripe Avocado",
      "1 tsp Lemon Juice",
      "1/2 tsp Red Pepper Flakes",
      "Sea Salt",
      "Extra Virgin Olive Oil",
      "Optional: Poached Egg",
    ],
    [
      "Toast the bread slices until golden and crunchy.",
      "In a small bowl, mash the avocado flesh with lemon juice and a pinch of salt.",
      "Spread the avocado generously over the warm toast.",
      "Drizzle with a little olive oil and sprinkle with red pepper flakes.",
      "Serve immediately, topped with a poached egg if desired.",
    ],
    false, // isGlutenFree (Unless GF bread used)
    true, // isVegan
    true, // isVegetarian
    true, // isLactoseFree
  ),

  new Meal(
    "m37",
    ["c3"],
    "Mushroom Swiss Burger",
    "pricey",
    "simple",
    "https://images.unsplash.com/photo-1579065413090-3ce766e7deca?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    25,
    [
      "200g Beef Patty",
      "2 Slices of Swiss Cheese",
      "1 Cup Sliced White Mushrooms",
      "1 tbsp Butter",
      "1 Brioche Bun",
      "2 tbsp Garlic Aioli",
      "1/2 tsp Thyme",
    ],
    [
      "Sauté mushrooms in butter with thyme and salt until dark and tender.",
      "Season the beef patty and grill or pan-sear for 4 minutes per side.",
      "Place Swiss cheese slices on the patty in the last minute and cover to melt.",
      "Toast the bun until golden.",
      "Spread garlic aioli on the bottom bun, add the patty, and pile the mushrooms on top.",
      "Close the burger and serve hot.",
    ],
    false, // isGlutenFree
    false, // isVegan
    false, // isVegetarian
    false, // isLactoseFree
  ),

  new Meal(
    "m38",
    ["c4"],
    "Chicken Schnitzel",
    "pricey",
    "challenging",
    "https://i.pinimg.com/1200x/8d/60/16/8d6016b1596c7ac9bec69b0cec14fbef.jpg",
    35,
    [
      "2 Chicken Breasts",
      "1/2 Cup All-purpose Flour",
      "2 Eggs (Beaten)",
      "1 Cup Panko Breadcrumbs",
      "1 tsp Paprika",
      "Vegetable Oil for frying",
      "Lemon Wedges",
      "Fresh Parsley",
    ],
    [
      "Place chicken breasts between plastic wrap and pound with a mallet until 1cm thick.",
      "Season flour with salt, pepper, and paprika.",
      "Dredge chicken in flour, then dip into beaten eggs, and finally coat thoroughly in breadcrumbs.",
      "Heat 2cm of oil in a large skillet. Fry chicken for 3-4 minutes per side until deep golden brown.",
      "Drain on paper towels.",
      "Serve immediately with a generous squeeze of lemon and chopped parsley.",
    ],
    false, // isGlutenFree
    false, // isVegan
    false, // isVegetarian
    true, // isLactoseFree
  ),

  new Meal(
    "m39",
    ["c5"],
    "Classic Caesar Salad",
    "affordable",
    "simple",
    "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Q2Flc2FyJTIwU2FsYWR8ZW58MHx8MHx8fDA%3D",
    15,
    [
      "1 Large Head of Romaine Lettuce",
      "1 Cup Garlic Croutons",
      "1/2 Cup Shaved Parmesan Cheese",
      "2 tbsp Caesar Dressing",
      "1 tsp Worchestershire Sauce",
      "Lemon Juice",
    ],
    [
      "Wash and thoroughly dry the Romaine leaves; tear them into bite-sized pieces.",
      "In a large bowl, toss the lettuce with just enough dressing to coat the leaves.",
      "Add the croutons and half of the Parmesan cheese; toss gently.",
      "Plate the salad and top with the remaining shaved Parmesan.",
      "Serve immediately to keep the croutons crunchy.",
    ],
    false, // isGlutenFree (Croutons)
    false, // isVegan (Dressing contains eggs/anchovies)
    true, // isVegetarian
    false, // isLactoseFree
  ),

  new Meal(
    "m40",
    ["c6"],
    "Moroccan Lamb Tagine",
    "luxurious",
    "hard",
    "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?q=80&w=500&auto=format&fit=crop",
    90,
    [
      "800g Lamb Shoulder (Cubed)",
      "1 Cup Dried Apricots",
      "1/2 Cup Toasted Almonds",
      "2 Cups Couscous",
      "1 Onion",
      "Spices (Ginger, Cinnamon, Saffron, Turmeric)",
      "1 tbsp Honey",
      "Fresh Cilantro",
    ],
    [
      "In a tagine or heavy pot, sear lamb cubes with spices and onions until browned.",
      "Add enough water to partially cover the meat, bring to a boil, then reduce to a low simmer.",
      "Cover and cook for 1 hour.",
      "Add dried apricots and honey; simmer for another 30 minutes until the meat is falling apart and the sauce has thickened.",
      "Prepare couscous according to package instructions (steaming is best).",
      "Serve the lamb over the fluffy couscous, garnished with toasted almonds and fresh cilantro.",
    ],
    false, // isGlutenFree (Couscous is wheat)
    false, // isVegan
    false, // isVegetarian
    true, // isLactoseFree
  ),
  new Meal(
    "m41",
    ["c7"],
    "Shakshuka",
    "affordable",
    "simple",
    "https://i.pinimg.com/736x/9c/0c/9c/9c0c9c104fa329394e1fb7273dfc0273.jpg",
    20,
    [
      "4 Large Eggs",
      "400g Tomato Puree",
      "1 Red Bell Pepper (Diced)",
      "2 cloves Garlic (Minced)",
      "1 tsp Cumin",
      "1 tsp Smoked Paprika",
      "50g Feta Cheese",
      "Fresh Parsley",
      "Olive Oil",
    ],
    [
      "Sauté diced bell peppers in olive oil until soft, then add minced garlic.",
      "Stir in tomato puree, cumin, and paprika; simmer for 10 minutes until thickened.",
      "Use a spoon to make small wells in the sauce and crack an egg into each.",
      "Cover the pan and cook on low heat for 5-7 minutes until the whites are set but yolks are runny.",
      "Crumble feta cheese over the top and garnish with fresh parsley.",
      "Serve warm with crusty bread for dipping.",
    ],
    true, // isGlutenFree
    false, // isVegan
    true, // isVegetarian
    false, // isLactoseFree (Contains Feta)
  ),

  new Meal(
    "m42",
    ["c8"],
    "Chicken Teriyaki",
    "affordable",
    "simple",
    "https://plus.unsplash.com/premium_photo-1695167739750-a1e7c856438b?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    25,
    [
      "500g Chicken Thighs (Bite-sized)",
      "1/2 Cup Soy Sauce",
      "1 tbsp Fresh Ginger (Grated)",
      "2 tbsp Honey",
      "1 tbsp Rice Vinegar",
      "1 tbsp Cornstarch",
      "Sesame Seeds",
      "Green Onions",
      "2 Cups Cooked Jasmine Rice",
    ],
    [
      "Whisk soy sauce, ginger, honey, and vinegar in a bowl to make the sauce.",
      "Sear chicken pieces in a hot skillet until golden brown and cooked through.",
      "Pour the sauce over the chicken and simmer on medium heat.",
      "Mix cornstarch with a little water and add to the pan to thicken the glaze.",
      "Toss until the chicken is perfectly coated and the sauce is glossy.",
      "Serve over a bed of steamed rice, topped with sesame seeds and sliced green onions.",
    ],
    false, // isGlutenFree (Soy sauce contains wheat)
    false, // isVegan
    false, // isVegetarian
    true, // isLactoseFree
  ),

  new Meal(
    "m43",
    ["c9"],
    "Quiche Lorraine",
    "pricey",
    "hard",
    "https://i.pinimg.com/736x/07/e9/53/07e9532c0bbbdf124e5c465ecba9a620.jpg",
    55,
    [
      "1 Shortcrust Pastry Sheet",
      "200g Smoked Bacon (Diced)",
      "3 Large Eggs",
      "200ml Heavy Cream",
      "150g Gruyère Cheese (Grated)",
      "Pinch of Nutmeg",
      "Salt and Black Pepper",
    ],
    [
      "Preheat oven to 190°C. Line a tart tin with pastry and blind bake for 15 minutes.",
      "Fry diced bacon until crispy, then drain on paper towels.",
      "In a bowl, whisk eggs, heavy cream, nutmeg, salt, and pepper until smooth.",
      "Spread the crispy bacon and half the grated Gruyère over the pre-baked crust.",
      "Pour the egg mixture over the fillings and sprinkle with the remaining cheese.",
      "Bake for 30-35 minutes until the filling is set and the top is golden brown.",
      "Allow to cool slightly before slicing.",
    ],
    false, // isGlutenFree
    false, // isVegan
    false, // isVegetarian (Contains bacon)
    false, // isLactoseFree
  ),

  new Meal(
    "m44",
    ["c10"],
    "Classic Tiramisu",
    "pricey",
    "hard",
    "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=500&auto=format&fit=crop",
    40,
    [
      "24 Ladyfingers (Savoiardi)",
      "250g Mascarpone Cheese",
      "300ml Strong Espresso (Cooled)",
      "3 Large Eggs (Separated)",
      "1/2 Cup Granulated Sugar",
      "2 tbsp Cocoa Powder",
      "1 tsp Vanilla Extract",
    ],
    [
      "Whisk egg yolks with sugar until pale and creamy; fold in mascarpone and vanilla.",
      "In a separate bowl, beat egg whites until stiff peaks form, then gently fold into the mascarpone mixture.",
      "Quickly dip each ladyfinger into the cold espresso (don't soak them too long).",
      "Arrange a layer of dipped ladyfingers in a dish, then spread half the cream over them.",
      "Repeat with another layer of ladyfingers and the remaining cream.",
      "Dust the top generously with cocoa powder.",
      "Refrigerate for at least 6 hours (ideally overnight) to set the layers.",
    ],
    false, // isGlutenFree
    false, // isVegan
    true, // isVegetarian
    false, // isLactoseFree
  ),

  new Meal(
    "m45",
    ["c11"],
    "Chicken Shawarma Wrap",
    "affordable",
    "challenging",
    "https://images.unsplash.com/photo-1561651823-34feb02250e4?q=80&w=500&auto=format&fit=crop",
    30,
    [
      "500g Chicken Strips",
      "2 tbsp Shawarma Spice Blend (Cumin, Coriander, Allspice)",
      "4 Fresh Pita Breads",
      "1/2 Cup Tahini Sauce",
      "Pickled Cucumbers & Turnips",
      "Creamy Garlic Sauce (Toum)",
      "1 tbsp Lemon Juice",
    ],
    [
      "Marinate chicken strips with shawarma spices, olive oil, and lemon juice for 1 hour.",
      "Grill or pan-fry the chicken over high heat until charred and tender.",
      "Warm the pita bread slightly on a flat grill.",
      "Spread a generous amount of garlic sauce (Toum) on the bread.",
      "Add the grilled chicken, pickles, and a drizzle of tahini sauce.",
      "Roll the pita tightly and toast it on the grill for 1 minute for a crispy finish.",
    ],
    false, // isGlutenFree
    false, // isVegan
    false, // isVegetarian
    true, // isLactoseFree
  ),

  new Meal(
    "m46",
    ["c12"],
    "Chicken Fajitas",
    "pricey",
    "simple",
    "https://images.unsplash.com/photo-1689773976415-293dd893f77e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Q2hpY2tlbiUyMEZhaml0YXN8ZW58MHx8MHx8fDA%3D",
    25,
    [
      "500g Chicken Breast (Slices)",
      "3 Bell Peppers (Mixed colors, sliced)",
      "1 Large Onion (Sliced)",
      "8 Flour Tortillas",
      "1 tbsp Chili Powder",
      "1 tsp Garlic Powder",
      "2 tbsp Lime Juice",
      "Sour Cream & Guacamole",
    ],
    [
      "Toss chicken slices with chili powder, garlic powder, salt, and lime juice.",
      "Heat oil in a cast-iron skillet until smoking hot.",
      "Sauté the chicken until browned; remove and set aside.",
      "In the same skillet, cook onions and bell peppers until slightly charred but still crisp.",
      "Mix the chicken back with the veggies and serve immediately on a sizzling platter.",
      "Build your fajitas using warm tortillas, sour cream, and guacamole.",
    ],
    false, // isGlutenFree (Flour tortillas)
    false, // isVegan
    false, // isVegetarian
    false, // isLactoseFree (Served with sour cream)
  ),

  new Meal(
    "m47",
    ["c13"],
    "Palak Paneer",
    "affordable",
    "challenging",
    "https://images.unsplash.com/photo-1589647363585-f4a7d3877b10?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8UGFsYWslMjBQYW5lZXJ8ZW58MHx8MHx8fDA%3D",
    40,
    [
      "500g Fresh Spinach",
      "250g Paneer Cheese (Cubed)",
      "1 tsp Garam Masala",
      "2 tbsp Heavy Cream",
      "1 tbsp Ginger-Garlic Paste",
      "1 Onion (Finely chopped)",
      "2 Green Chilies",
      "1 tsp Cumin Seeds",
    ],
    [
      "Blanch the spinach in boiling water for 2 minutes, then shock in ice water and puree until smooth.",
      "Lightly fry the paneer cubes in a pan until golden; set aside.",
      "Sauté cumin seeds and onions until golden, then add ginger-garlic paste and chilies.",
      "Pour in the spinach puree and add garam masala; simmer for 5-10 minutes.",
      "Stir in the heavy cream and fried paneer cubes.",
      "Cook for another 2 minutes and serve hot with Jeera rice or Paratha.",
    ],
    true, // isGlutenFree
    false, // isVegan
    true, // isVegetarian
    false, // isLactoseFree (Contains Paneer and cream)
  ),

  new Meal(
    "m48",
    ["c14"],
    "Fish and Chips",
    "pricey",
    "challenging",
    "https://images.unsplash.com/photo-1579208030886-b937da0925dc?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8RmlzaCUyMGFuZCUyMENoaXBzfGVufDB8fDB8fHww",
    35,
    [
      "4 Cod or Haddock Fillets",
      "4 Large Russet Potatoes",
      "1 Cup Flour",
      "1 Cup Cold Beer",
      "1 tsp Baking Powder",
      "Vegetable Oil for deep frying",
      "Tartar Sauce",
      "Malt Vinegar",
    ],
    [
      "Cut potatoes into thick chips, soak in cold water, dry, and double-fry until golden and crispy.",
      "Prepare the batter: Whisk flour, baking powder, and cold beer until smooth but not overmixed.",
      "Dredge fish fillets in dry flour, then dip into the beer batter.",
      "Carefully lower the fish into 180°C oil and fry for 4-6 minutes until deep golden brown.",
      "Drain on a wire rack to keep the batter crispy.",
      "Serve hot with the chips, a side of tartar sauce, and a splash of malt vinegar.",
    ],
    false, // isGlutenFree
    false, // isVegan
    false, // isVegetarian
    true, // isLactoseFree
  ),

  new Meal(
    "m49",
    ["c15"],
    "Vegan Red Lentil Soup",
    "affordable",
    "simple",
    "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=500&auto=format&fit=crop",
    45,
    [
      "1 Cup Red Lentils (Rinsed)",
      "2 Carrots (Diced)",
      "2 Stalks Celery (Sliced)",
      "1 Onion (Diced)",
      "1 tsp Turmeric",
      "1 tsp Cumin",
      "1.5 Liters Vegetable Broth",
      "Lemon Wedges",
      "Fresh Coriander",
    ],
    [
      "In a large pot, sauté onion, carrots, and celery until soft.",
      "Add turmeric and cumin, stirring for 1 minute to release the aroma.",
      "Stir in the lentils and pour in the vegetable broth.",
      "Bring to a boil, then reduce heat and simmer for 25-30 minutes until lentils are soft and soup has thickened.",
      "For a smoother texture, partially blend the soup with an immersion blender.",
      "Serve hot with a squeeze of fresh lemon and coriander leaves.",
    ],
    true, // isGlutenFree
    true, // isVegan
    true, // isVegetarian
    true, // isLactoseFree
  ),

  new Meal(
    "m50",
    ["c16"],
    "Ashak (Afghan Leek Dumplings)",
    "pricey",
    "hard",
    "https://i.ytimg.com/vi/jALnPwz0dA4/maxresdefault.jpg",
    60,
    [
      "1 Pack Wonton Wrappers (or Gyoza skins)",
      "500g Fresh Leeks or Chives (Finely chopped)",
      "300g Ground Beef (for sauce)",
      "2 Cups Greek Yogurt",
      "3 cloves Garlic (Minced)",
      "2 tbsp Tomato Paste",
      "1 tsp Dried Mint",
      "1 tsp Red Chili Flakes",
    ],
    [
      "Filling: Mix finely chopped leeks with chili flakes and salt.",
      "Place a spoonful of leeks in each wrapper, moisten the edges with water, and fold into a semi-circle or triangle, sealing tightly.",
      "Beef Sauce: Cook ground beef with tomato paste, onions, and spices until a thick gravy forms.",
      "Yogurt Sauce: Combine yogurt with minced garlic and a pinch of salt.",
      "Boil the dumplings in salted water for 3-4 minutes until they float.",
      "To serve: Spread yogurt sauce on a platter, place the boiled ashak on top, add a generous layer of beef sauce, and sprinkle with dried mint.",
    ],
    false, // isGlutenFree
    false, // isVegan
    false, // isVegetarian
    false, // isLactoseFree (Contains yogurt)
  ),
  new Meal(
    "m51",
    ["c17"],
    "Fesenjan (Pomegranate Walnut Stew)",
    "luxurious",
    "hard",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCIRvwswu10qrpAfMUr6QAsqaCOJX6Kyi9iQ&s",
    120,
    [
      "500g Chicken Pieces",
      "300g Walnuts (Finely ground)",
      "1 Cup Pomegranate Paste",
      "2 tbsp Sugar (Adjust to taste)",
      "1 Large Onion (Grated)",
      "1/2 tsp Turmeric",
      "Saffron",
    ],
    [
      "Toast the finely ground walnuts in a dry pot for 2-3 minutes until fragrant.",
      "Add 3 cups of cold water to the walnuts and simmer on very low heat for 1 hour until the natural oils are released.",
      "In a separate pan, sauté grated onions with turmeric and brown the chicken pieces.",
      "Add the chicken and pomegranate paste to the walnut mixture.",
      "Add sugar and a pinch of salt; cover and simmer on low heat for another 1.5 to 2 hours until the sauce is thick and dark.",
      "Serve with aromatic Persian saffron rice.",
    ],
    true, // isGlutenFree
    false, // isVegan
    false, // isVegetarian
    true, // isLactoseFree
  ),

  new Meal(
    "m52",
    ["c18"],
    "Beef Wellington",
    "luxurious",
    "hard",
    "https://images.unsplash.com/photo-1675718341348-65224936b742?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8QmVlZiUyMFdlbGxpbmd0b258ZW58MHx8MHx8fDA%3D",
    120,
    [
      "800g Beef Tenderloin (Center cut)",
      "500g Puff Pastry",
      "250g Mushrooms (Finely chopped)",
      "6-8 Slices of Prosciutto",
      "2 tbsp English Mustard",
      "2 Egg Yolks",
      "Fresh Thyme",
    ],
    [
      "Sear the beef tenderloin on high heat for 2 minutes per side; let it cool and brush with mustard.",
      "Make the Duxelles: Sauté chopped mushrooms with thyme until all moisture has evaporated.",
      "Lay out plastic wrap, place prosciutto slices on it, spread the mushroom duxelles, and then place the beef in the center.",
      "Roll the beef tightly in the prosciutto/mushroom layer using the plastic wrap; chill in the fridge for 30 minutes.",
      "Unwrap the beef and roll it inside the puff pastry; seal the edges and brush with egg wash.",
      "Score the pastry lightly and bake at 200°C for 25-30 minutes until the pastry is golden brown and beef is medium-rare.",
      "Let it rest for 10 minutes before carving.",
    ],
    false, // isGlutenFree
    false, // isVegan
    false, // isVegetarian
    true, // isLactoseFree
  ),

  new Meal(
    "m53",
    ["c1"],
    "Pesto Pasta",
    "affordable",
    "simple",
    "https://images.unsplash.com/photo-1473093226795-af9932fe5856?q=80&w=500&auto=format&fit=crop",
    20,
    [
      "400g Pasta (Spaghetti or Fusilli)",
      "2 Cups Fresh Basil Leaves",
      "1/3 Cup Pine Nuts",
      "1/2 Cup Parmesan Cheese (Grated)",
      "2 cloves Garlic",
      "1/2 Cup Extra Virgin Olive Oil",
    ],
    [
      "Toast pine nuts lightly in a pan until golden.",
      "In a food processor, blend basil, toasted nuts, garlic, and parmesan.",
      "Slowly drizzle in olive oil while blending until a smooth, thick sauce forms.",
      "Cook pasta in salted boiling water until al dente; reserve half a cup of pasta water.",
      "Toss the hot pasta with the fresh pesto, adding a little pasta water if needed to reach a creamy consistency.",
      "Serve with extra parmesan and fresh basil on top.",
    ],
    false, // isGlutenFree (Standard pasta)
    false, // isVegan (Contains cheese)
    true, // isVegetarian
    false, // isLactoseFree
  ),

  new Meal(
    "m54",
    ["c2"],
    "Chicken Quesadilla",
    "affordable",
    "simple",
    "https://images.unsplash.com/photo-1628430044262-fb84cffbb744?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    15,
    [
      "2 Large Flour Tortillas",
      "1 Cup Grilled Chicken (Shredded)",
      "1.5 Cups Cheddar & Monterey Jack Cheese",
      "1/2 Bell Pepper (Sautéed)",
      "Sour Cream & Salsa",
    ],
    [
      "Place one tortilla in a dry skillet over medium heat.",
      "Layer half the cheese, then the chicken and sautéed peppers, followed by the remaining cheese.",
      "Place the second tortilla on top (or fold one in half).",
      "Cook for 3 minutes per side until the tortilla is crispy and the cheese is completely melted.",
      "Remove from heat and let it sit for 1 minute before slicing into triangles.",
      "Serve with sour cream, salsa, and guacamole.",
    ],
    false, // isGlutenFree (Flour tortilla)
    false, // isVegan
    false, // isVegetarian
    false, // isLactoseFree
  ),

  new Meal(
    "m55",
    ["c3"],
    "Hawaiian Burger",
    "pricey",
    "simple",
    "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=500&auto=format&fit=crop",
    25,
    [
      "200g Beef Patty",
      "1 Fresh Pineapple Ring",
      "2 tbsp Teriyaki Sauce",
      "1 Slice Swiss Cheese",
      "1 Brioche Bun",
      "Red Onion & Lettuce",
    ],
    [
      "Grill the beef patty to your preferred doneness.",
      "Grill the pineapple slice for 2 minutes per side until caramelized char marks appear.",
      "Place Swiss cheese on the patty to melt during the last minute of grilling.",
      "Toast the bun and spread a little teriyaki sauce on the bottom.",
      "Assemble: Bun, lettuce, onion, cheesy patty, grilled pineapple, and more teriyaki sauce.",
      "Top with the bun and serve immediately.",
    ],
    false, // isGlutenFree
    false, // isVegan
    false, // isVegetarian
    false, // isLactoseFree
  ),

  new Meal(
    "m56",
    ["c4"],
    "Apple Strudel",
    "pricey",
    "hard",
    "https://media.istockphoto.com/id/1125180633/photo/apple-strudel-pie-with-flakey-crust-and-firm-apples.jpg?s=1024x1024&w=is&k=20&c=BquPCoveo3k1xzz_MvQTGMz1cyJA7a-bNQQrAcl4f1o=",
    60,
    [
      "4 Large Apples (Granny Smith)",
      "1 Pack Phyllo Pastry",
      "1/2 Cup Raisins",
      "1/2 Cup Breadcrumbs (Toasted)",
      "1 tsp Cinnamon",
      "100g Butter (Melted)",
      "1/2 Cup Sugar",
    ],
    [
      "Peel, core, and thinly slice apples; mix with sugar, cinnamon, and raisins.",
      "Lay out a sheet of phyllo, brush with melted butter, and repeat for 5-6 layers.",
      "Sprinkle toasted breadcrumbs over the top layer (to absorb apple juices).",
      "Spread the apple mixture along one edge of the pastry.",
      "Roll the pastry tightly, tucking in the ends like a burrito.",
      "Brush the outside with more butter and bake at 190°C for 35-40 minutes until golden and flaky.",
      "Dust with powdered sugar before serving warm.",
    ],
    false, // isGlutenFree (Wheat pastry)
    false, // isVegan (Contains butter)
    true, // isVegetarian
    false, // isLactoseFree
  ),

  new Meal(
    "m57",
    ["c5"],
    "Caprese Salad",
    "affordable",
    "simple",
    "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?q=80&w=500&auto=format&fit=crop",
    10,
    [
      "2 Large Ripe Tomatoes",
      "200g Fresh Buffalo Mozzarella",
      "1 bunch Fresh Basil Leaves",
      "2 tbsp Balsamic Glaze",
      "3 tbsp Extra Virgin Olive Oil",
    ],
    [
      "Slice the tomatoes and mozzarella into 1cm thick rounds.",
      "On a serving platter, alternate slices of tomato, mozzarella, and a large basil leaf.",
      "Drizzle generously with high-quality extra virgin olive oil.",
      "Finish with a drizzle of thick balsamic glaze and a pinch of sea salt.",
      "Serve at room temperature for the best flavor.",
    ],
    true, // isGlutenFree
    false, // isVegan (Contains Mozzarella)
    true, // isVegetarian
    false, // isLactoseFree
  ),

  new Meal(
    "m58",
    ["c6"],
    "Paella Valenciana",
    "luxurious",
    "hard",
    "https://images.unsplash.com/photo-1630175860333-5131bda75071?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    75,
    [
      "2 Cups Bomba Rice",
      "1/2 tsp Saffron Threads",
      "200g Shrimp",
      "200g Mussels",
      "300g Chicken Thighs (Cubed)",
      "1/2 Cup Frozen Peas",
      "1 Liter Seafood Broth",
    ],
    [
      "In a wide paella pan, brown the chicken pieces in olive oil; remove and set aside.",
      "Sauté onions, garlic, and diced peppers in the same pan.",
      "Add the rice and stir for 2 minutes to toast the grains.",
      "Pour in the warm seafood broth mixed with saffron; do not stir the rice again.",
      "Arrange the chicken, shrimp, and mussels on top of the rice.",
      "Simmer for 15-20 minutes until the liquid is absorbed and a 'socarrat' (crispy crust) forms on the bottom.",
      "Garnish with peas and lemon wedges.",
    ],
    true, // isGlutenFree
    false, // isVegan
    false, // isVegetarian
    true, // isLactoseFree
  ),

  new Meal(
    "m59",
    ["c7"],
    "Classic French Toast",
    "affordable",
    "simple",
    "https://i.pinimg.com/736x/20/58/0e/20580e215fa56d1be6c20a79c9ad4df2.jpg",
    15,
    [
      "4 Thick Slices of Brioche or Stale Bread",
      "2 Large Eggs",
      "1/2 Cup Whole Milk",
      "1 tsp Cinnamon",
      "1 tsp Vanilla Extract",
      "Butter for frying",
      "Honey or Maple Syrup",
    ],
    [
      "In a shallow bowl, whisk together eggs, milk, cinnamon, and vanilla.",
      "Dip each bread slice into the mixture, letting it soak for about 20 seconds per side.",
      "Melt butter in a skillet over medium heat.",
      "Fry the bread for 3-4 minutes per side until golden brown and slightly crisp on the edges.",
      "Serve hot with a drizzle of honey, fresh berries, or a dollop of yogurt.",
    ],
    false, // isGlutenFree
    false, // isVegan
    true, // isVegetarian
    false, // isLactoseFree
  ),

  new Meal(
    "m60",
    ["c8"],
    "Fried Spring Rolls",
    "affordable",
    "challenging",
    "https://images.unsplash.com/photo-1695712641569-05eee7b37b6d?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    40,
    [
      "10-12 Spring Roll Wrappers (Rice Paper)",
      "2 Cups Shredded Cabbage",
      "1 Cup Julienned Carrots",
      "50g Glass Noodles (Soaked)",
      "2 cloves Garlic",
      "1 tbsp Soy Sauce",
      "Vegetable Oil for deep frying",
    ],
    [
      "Sauté garlic, cabbage, and carrots in a wok until soft; stir in glass noodles and soy sauce.",
      "Let the filling cool completely before wrapping.",
      "Place 2 tablespoons of filling on a wrapper, fold the sides, and roll tightly, sealing with a bit of water.",
      "Heat oil to 180°C in a deep pan.",
      "Fry the rolls in batches for 3-5 minutes until golden and very crispy.",
      "Drain on paper towels and serve hot with sweet chili sauce.",
    ],
    true, // isGlutenFree (If using rice paper wrappers)
    true, // isVegan
    true, // isVegetarian
    true, // isLactoseFree
  ),
  new Meal(
    "m61",
    ["c9"],
    "French Onion Soup",
    "pricey",
    "hard",
    "https://i.pinimg.com/1200x/09/2a/04/092a0406bef634a163507cbde053f268.jpg",
    50,
    [
      "5 Large Yellow Onions (Thinly sliced)",
      "1 Liter Beef Broth",
      "1 Baguette",
      "200g Gruyère Cheese (Grated)",
      "2 tbsp Butter",
      "1 tbsp Flour",
      "Fresh Thyme",
    ],
    [
      "Melt butter and caramelize the onions on low heat for at least 40 minutes until deep brown and sweet.",
      "Stir in flour and cook for 1 minute, then slowly add beef broth and thyme.",
      "Simmer for 20 minutes to allow the flavors to meld.",
      "Toast thick slices of baguette until crunchy.",
      "Ladle the soup into oven-safe bowls, place bread on top, and cover with a thick layer of Gruyère.",
      "Broil in the oven until the cheese is bubbly, melted, and slightly browned.",
    ],
    false, // isGlutenFree (Contains flour & baguette)
    false, // isVegan
    false, // isVegetarian (Beef broth)
    false, // isLactoseFree
  ),

  new Meal(
    "m62",
    ["c10"],
    "Pistachio Baklava",
    "pricey",
    "hard",
    "https://images.unsplash.com/photo-1519676867240-f03562e64548?q=80&w=500&auto=format&fit=crop",
    90,
    [
      "1 Pack Phyllo Dough",
      "300g Raw Pistachios (Crushed)",
      "200g Clarified Butter (Ghee)",
      "1 Cup Sugar",
      "1/2 Cup Honey",
      "1 tbsp Rose Water",
      "1 tbsp Lemon Juice",
    ],
    [
      "Prepare the syrup by boiling sugar, water, honey, and lemon juice; let it cool completely.",
      "Brush a baking dish with melted butter and layer 10-12 sheets of phyllo, brushing each with butter.",
      "Spread a thick layer of crushed pistachios over the pastry.",
      "Cover with another 10-12 layers of buttered phyllo sheets.",
      "Carefully cut the pastry into diamond shapes before baking.",
      "Bake at 175°C for 45-50 minutes until golden and crisp.",
      "Pour the cold syrup over the hot baklava immediately after taking it out of the oven.",
    ],
    false, // isGlutenFree (Wheat flour)
    false, // isVegan (Honey & Butter)
    true, // isVegetarian
    false, // isLactoseFree
  ),

  new Meal(
    "m63",
    ["c11"],
    "Baba Ganoush",
    "affordable",
    "simple",
    "https://plus.unsplash.com/premium_photo-1700089152197-6b2ac14e85ec?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8QmFiYSUyMEdhbm91c2h8ZW58MHx8MHx8fDA%3D",
    30,
    [
      "2 Large Eggplants",
      "1/4 Cup Tahini",
      "3 tbsp Lemon Juice",
      "2 cloves Garlic (Minced)",
      "1/2 tsp Cumin",
      "Olive Oil",
      "Pomegranate Seeds",
    ],
    [
      "Char the eggplants over an open flame or under a broiler until the skin is burnt and flesh is soft.",
      "Scoop out the smoky flesh and drain in a colander for 10 minutes to remove excess moisture.",
      "Mash the eggplant with a fork or pulse in a blender (keep it slightly chunky).",
      "Stir in tahini, lemon juice, minced garlic, and cumin.",
      "Taste and adjust seasoning with salt.",
      "Drizzle generously with olive oil and garnish with pomegranate seeds or parsley before serving.",
    ],
    true, // isGlutenFree
    true, // isVegan
    true, // isVegetarian
    true, // isLactoseFree
  ),

  new Meal(
    "m64",
    ["c12"],
    "Guacamole with Chips",
    "affordable",
    "simple",
    "https://plus.unsplash.com/premium_photo-1681406689585-0b0c2e02ec44?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8R3VhY2Ftb2xlJTIwd2l0aCUyMENoaXBzfGVufDB8fDB8fHww",
    10,
    [
      "3 Ripe Avocados",
      "1/2 Red Onion (Finely diced)",
      "1 Roma Tomato (Seedless, diced)",
      "1/4 Cup Fresh Cilantro",
      "1 tbsp Lime Juice",
      "1 Jalapeño (Optional)",
      "Tortilla Chips",
    ],
    [
      "Cut avocados, remove the pits, and scoop the flesh into a bowl.",
      "Add lime juice immediately to prevent browning and mash to your desired consistency.",
      "Fold in the diced onion, tomato, cilantro, and jalapeño.",
      "Season with salt and a pinch of black pepper.",
      "Serve immediately with a bowl of crispy, salted corn tortilla chips.",
    ],
    true, // isGlutenFree
    true, // isVegan
    true, // isVegetarian
    true, // isLactoseFree
  ),

  new Meal(
    "m65",
    ["c13"],
    "Lamb Coconut Curry",
    "luxurious",
    "hard",
    "https://images.unsplash.com/photo-1545247181-516773cae754?q=80&w=500&auto=format&fit=crop",
    80,
    [
      "800g Lamb Shoulder (Cubed)",
      "400ml Coconut Milk",
      "2 Large Potatoes (Diced)",
      "2 tbsp Curry Powder",
      "1 tbsp Ginger-Garlic Paste",
      "1 Onion",
      "Cinnamon, Cardamom, Cloves",
      "Fresh Cilantro",
    ],
    [
      "Sear the lamb cubes in hot oil until browned on all sides; remove and set aside.",
      "Sauté onions with whole spices (cinnamon, cloves, cardamom) until fragrant.",
      "Add ginger-garlic paste and curry powder, stirring for 1 minute.",
      "Return lamb to the pot and pour in the coconut milk; simmer on low heat for 1 hour.",
      "Add diced potatoes and continue cooking for another 20-30 minutes until lamb and potatoes are tender.",
      "Garnish with fresh cilantro and serve with Basmati rice or Naan.",
    ],
    true, // isGlutenFree
    false, // isVegan
    false, // isVegetarian
    true, // isLactoseFree (Coconut milk is dairy-free)
  ),

  new Meal(
    "m66",
    ["c14"],
    "Grilled Garlic Lobster",
    "luxurious",
    "challenging",
    "https://images.unsplash.com/photo-1738231670072-ab51e6bf483e?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fEdyaWxsZWQlMjBMb2JzdGVyfGVufDB8fDB8fHww",
    45,
    [
      "2 Lobster Tails",
      "4 tbsp Butter (Melted)",
      "3 cloves Garlic (Minced)",
      "1 tsp Paprika",
      "1 tbsp Lemon Juice",
      "Fresh Parsley",
    ],
    [
      "Use kitchen shears to cut down the top of the lobster shell and gently lift the meat to sit on top (butterfly style).",
      "Whisk together melted butter, minced garlic, lemon juice, and paprika.",
      "Brush the lobster meat generously with the garlic butter mixture.",
      "Preheat the grill to medium-high heat.",
      "Grill the lobster tails for 8-10 minutes until the meat is opaque and the internal temperature reaches 60°C.",
      "Garnish with chopped parsley and serve with extra lemon wedges.",
    ],
    true, // isGlutenFree
    false, // isVegan
    false, // isVegetarian
    false, // isLactoseFree
  ),

  new Meal(
    "m67",
    ["c15"],
    "Mediterranean Chickpea Salad",
    "affordable",
    "simple",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=500&auto=format&fit=crop",
    15,
    [
      "1 can (400g) Chickpeas (Drained)",
      "1 English Cucumber (Diced)",
      "2 Large Tomatoes (Diced)",
      "1/2 Red Onion (Finely diced)",
      "1/4 Cup Fresh Parsley",
      "3 tbsp Extra Virgin Olive Oil",
      "2 tbsp Lemon Juice",
    ],
    [
      "Rinse the chickpeas thoroughly and place them in a large salad bowl.",
      "Add the chopped cucumber, tomatoes, red onion, and parsley.",
      "In a small jar, shake together olive oil, lemon juice, salt, and pepper.",
      "Pour the dressing over the salad and toss well to combine.",
      "Let the salad sit for 10 minutes before serving to allow the chickpeas to absorb the dressing.",
    ],
    true, // isGlutenFree
    true, // isVegan
    true, // isVegetarian
    true, // isLactoseFree
  ),

  new Meal(
    "m68",
    ["c16"],
    "Afghan Chicken Karahi",
    "pricey",
    "challenging",
    "https://images.unsplash.com/photo-1606471191009-63994c53433b?q=80&w=500&auto=format&fit=crop",
    40,
    [
      "800g Chicken (Bone-in pieces)",
      "4 Large Ripe Tomatoes (Halved)",
      "4-5 Green Chilies",
      "2 tbsp Ginger-Garlic Paste",
      "1 tsp Black Pepper",
      "1 tsp Coriander Powder",
      "1/2 Cup Vegetable Oil",
    ],
    [
      "Heat oil in a Karahi or deep wok and sauté chicken on high heat until the color changes.",
      "Add ginger-garlic paste and sauté for another 2 minutes.",
      "Place tomato halves (skin side up) over the chicken, cover, and cook for 10 minutes until tomatoes soften.",
      "Remove the tomato skins with tongs and mash the pulp into the chicken.",
      "Add sliced green chilies, black pepper, and coriander powder.",
      "Cook uncovered on high heat, stirring constantly, until the water evaporates and oil separates from the thick tomato sauce.",
      "Garnish with julienned ginger and serve with hot Naan.",
    ],
    true, // isGlutenFree
    false, // isVegan
    false, // isVegetarian
    true, // isLactoseFree
  ),

  new Meal(
    "m69",
    ["c17"],
    "Tahchin (Persian Saffron Rice Cake)",
    "luxurious",
    "hard",
    "https://media.istockphoto.com/id/1296166176/photo/tahchin-or-tah-chin-is-an-iranian-rice-cake-primarily-consisting-of-rice-yogurt-saffron-and.webp?a=1&b=1&s=612x612&w=0&k=20&c=Vlvn1iA3svmM9Y0qAipieZXxM21WMbxxNVSW8YeE_Oc=",
    90,
    [
      "3 Cups Basmati Rice",
      "2 Cups Thick Greek Yogurt",
      "2 Egg Yolks",
      "1 tsp Saffron (Brewed)",
      "500g Chicken Breast (Cooked and shredded)",
      "1/2 Cup Barberries (Zereshk)",
      "Butter & Oil",
    ],
    [
      "Parboil the rice in salted water until half-cooked; drain.",
      "In a large bowl, whisk together yogurt, egg yolks, brewed saffron, and a little oil.",
      "Mix the parboiled rice with the yogurt mixture until every grain is yellow.",
      "In a non-stick pot or baking dish, spread half the rice and press down firmly.",
      "Add a layer of shredded chicken and barberries in the middle (leave the edges clear).",
      "Cover with the remaining rice and press down again; top with small cubes of butter.",
      "Cover with foil and bake at 180°C for 60-90 minutes until a thick, golden, crispy crust (Tahdig) forms all around.",
      "Flip onto a platter and serve like a cake.",
    ],
    true, // isGlutenFree
    false, // isVegan
    false, // isVegetarian (Original recipe has chicken)
    false, // isLactoseFree
  ),

  new Meal(
    "m70",
    ["c18"],
    "Classic Shepherd's Pie",
    "pricey",
    "challenging",
    "https://plus.unsplash.com/premium_photo-1723770033472-0b0452d98225?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8U2hlcGhlcmQncyUyMFBpZXxlbnwwfHwwfHx8MA%3D%3D",
    50,
    [
      "600g Ground Lamb",
      "1kg Potatoes (Boiled and mashed)",
      "1 Cup Peas & Carrots",
      "1 Onion (Diced)",
      "2 tbsp Tomato Paste",
      "1 Cup Beef or Lamb Broth",
      "50g Butter",
      "1/2 Cup Milk",
    ],
    [
      "Sauté onions and ground lamb until browned. Stir in tomato paste, peas, carrots, and broth. Simmer for 15 minutes.",
      "Prepare a creamy mash by mixing boiled potatoes with butter, milk, and salt.",
      "Transfer the meat mixture into a large baking dish.",
      "Spread the mashed potatoes evenly over the meat, then score the top with a fork for extra crunch.",
      "Bake at 200°C for 25-30 minutes until the potatoes are golden and the sauce is bubbling up around the edges.",
      "Let it cool for 5 minutes before serving.",
    ],
    false, // isGlutenFree (Usually thickened with a little flour)
    false, // isVegan
    false, // isVegetarian
    false, // isLactoseFree
  ),
  new Meal(
    "m71",
    ["c1"],
    "Bruschetta with Tomato",
    "affordable",
    "simple",
    "https://images.unsplash.com/photo-1572656631137-7935297eff55?q=80&w=500&auto=format&fit=crop",
    15,
    [
      "1 Italian Baguette (Sliced)",
      "4 Medium Tomatoes (Diced)",
      "2 cloves Garlic",
      "1/2 Cup Fresh Basil",
      "1/4 Cup Extra Virgin Olive Oil",
      "Balsamic Glaze",
    ],
    [
      "Toast the baguette slices in the oven or on a grill until golden and crispy.",
      "Rub a halved garlic clove over the warm surface of each bread slice for flavor.",
      "In a bowl, mix diced tomatoes with chopped basil, olive oil, salt, and pepper.",
      "Spoon the tomato mixture generously onto each toasted slice.",
      "Drizzle with a little balsamic glaze before serving immediately.",
    ],
    false, // isGlutenFree (Wheat baguette)
    true, // isVegan
    true, // isVegetarian
    true, // isLactoseFree
  ),

  new Meal(
    "m72",
    ["c2"],
    "Egg Salad Sandwich",
    "affordable",
    "simple",
    "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=500&auto=format&fit=crop",
    15,
    [
      "4 Hard-boiled Eggs",
      "3 tbsp Mayonnaise",
      "1 tsp Yellow Mustard",
      "2 Slices of White or Whole Wheat Bread",
      "Fresh Chives",
      "Lettuce Leaves",
    ],
    [
      "Peel the hard-boiled eggs and chop them into small pieces.",
      "In a bowl, combine eggs, mayonnaise, mustard, and chopped chives; mix until creamy.",
      "Season with salt and a dash of paprika or black pepper.",
      "Place a lettuce leaf on one slice of bread, spread the egg salad on top, and cover with the second slice.",
      "Cut diagonally and serve chilled.",
    ],
    false, // isGlutenFree
    false, // isVegan
    true, // isVegetarian
    true, // isLactoseFree (If using dairy-free mayo)
  ),

  new Meal(
    "m73",
    ["c3"],
    "Double Bacon Burger",
    "luxurious",
    "challenging",
    "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?q=80&w=500&auto=format&fit=crop",
    35,
    [
      "2 Beef Patties (150g each)",
      "4 Strips of Smoked Bacon",
      "2 Slices of Aged Cheddar",
      "1 Brioche Bun",
      "Caramelized Onions",
      "Special Burger Sauce",
    ],
    [
      "Fry the bacon strips until perfectly crispy; drain on paper towels.",
      "Grill the beef patties on high heat (3-4 mins per side). Place cheese on each patty in the last minute to melt.",
      "Toast the brioche bun with a bit of butter until golden brown.",
      "Layer the bottom bun with sauce, then place the first cheesy patty.",
      "Add two bacon strips, the second cheesy patty, and the remaining bacon.",
      "Top with caramelized onions and the upper bun.",
    ],
    false, // isGlutenFree
    false, // isVegan
    false, // isVegetarian
    false, // isLactoseFree
  ),

  new Meal(
    "m74",
    ["c4"],
    "German Potato Salad (Kartoffelsalat)",
    "affordable",
    "simple",
    "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=500&auto=format&fit=crop",
    30,
    [
      "1kg Waxy Potatoes",
      "1/2 Cup White Vinegar",
      "1 Large Red Onion (Diced)",
      "1 tbsp Dijon Mustard",
      "1/2 Cup Vegetable Broth",
      "Fresh Parsley",
      "Oil",
    ],
    [
      "Boil potatoes in their skins until tender, then peel and slice while still warm.",
      "Sauté onions in a little oil until translucent.",
      "Whisk together vinegar, mustard, warm vegetable broth, salt, and pepper.",
      "Pour the dressing over the warm potato slices (this helps absorption).",
      "Fold in fresh parsley and let the salad rest for 30 minutes before serving.",
      "Can be served warm or at room temperature.",
    ],
    true, // isGlutenFree
    true, // isVegan
    true, // isVegetarian
    true, // isLactoseFree
  ),

  new Meal(
    "m75",
    ["c5"],
    "Fresh Fruit Salad",
    "affordable",
    "simple",
    "https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=500&auto=format&fit=crop",
    10,
    [
      "1 Apple",
      "1 Banana",
      "1 Cup Strawberries",
      "2 Oranges",
      "1 tbsp Honey (or Maple Syrup)",
      "Fresh Mint Leaves",
    ],
    [
      "Wash and peel the fruits as needed.",
      "Chop all fruits into uniform, bite-sized pieces.",
      "Place them in a large bowl and toss gently to combine flavors.",
      "Drizzle with honey and a squeeze of orange juice for extra sweetness.",
      "Garnish with finely chopped mint and serve immediately.",
    ],
    true, // isGlutenFree
    true, // isVegan (If using Maple syrup)
    true, // isVegetarian
    true, // isLactoseFree
  ),

  new Meal(
    "m76",
    ["c6"],
    "Brazilian Moqueca (Fish Stew)",
    "pricey",
    "hard",
    "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=500&auto=format&fit=crop",
    50,
    [
      "600g White Fish Fillets (Cod or Snapper)",
      "400ml Coconut Milk",
      "2 Bell Peppers (Sliced)",
      "1 tbsp Dende (Palm) Oil",
      "2 Limes",
      "Fresh Cilantro",
      "2 Large Tomatoes (Sliced)",
    ],
    [
      "Marinate fish fillets with lime juice, garlic, and salt for 20 minutes.",
      "In a heavy clay pot (if available), layer sliced onions, peppers, and tomatoes.",
      "Place the marinated fish pieces on top of the vegetables.",
      "Pour in the coconut milk and bring to a very gentle simmer.",
      "Cook for 15-20 minutes without stirring to keep the fish intact.",
      "Stir in the palm oil and sprinkle with a generous amount of cilantro.",
      "Serve hot with white rice.",
    ],
    true, // isGlutenFree
    false, // isVegan
    false, // isVegetarian
    true, // isLactoseFree
  ),

  new Meal(
    "m77",
    ["c7"],
    "Oatmeal with Berries",
    "affordable",
    "simple",
    "https://media.istockphoto.com/id/979149642/photo/oatmeal-porridge-with-fresh-berries-and-nuts-top-view.webp?a=1&b=1&s=612x612&w=0&k=20&c=wtNo8XEzrQ8LH1mMzPUble3mU9Ime8IKV2dzFlwsaqw=",
    10,
    [
      "1 Cup Rolled Oats",
      "2 Cups Milk (Dairy or Almond)",
      "1/2 Cup Blueberries",
      "1 tbsp Honey",
      "1/4 tsp Cinnamon",
      "Crushed Walnuts",
    ],
    [
      "In a small saucepan, bring milk and cinnamon to a boil.",
      "Add the oats and reduce heat to low, stirring occasionally.",
      "Simmer for 5-7 minutes until the mixture is thick and creamy.",
      "Pour into a bowl and top with fresh blueberries and walnuts.",
      "Drizzle with honey and serve warm.",
    ],
    true, // isGlutenFree (If using certified GF oats)
    false, // isVegan (If using dairy milk/honey)
    true, // isVegetarian
    true, // isLactoseFree (If using almond milk)
  ),

  new Meal(
    "m78",
    ["c8"],
    "Japanese Pork Ramen",
    "pricey",
    "hard",
    "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=500&auto=format&fit=crop",
    120,
    [
      "200g Ramen Noodles",
      "300g Pork Belly (Chashu)",
      "1 Liter Miso/Pork Broth",
      "1 Soft-boiled Egg (Marinated)",
      "Bamboo Shoots",
      "Nori Seaweed",
      "Green Onions",
    ],
    [
      "Slow-roast or braise the pork belly for 2 hours until it is melt-in-the-mouth tender.",
      "Prepare a rich broth by simmering miso paste with pork stock and aromatics.",
      "Cook ramen noodles in boiling water until just firm; drain well.",
      "Place noodles in a deep bowl and pour over the hot, flavorful broth.",
      "Top with thin slices of chashu pork, a halved soft-boiled egg, nori, and bamboo shoots.",
      "Garnish with finely sliced green onions and serve steaming hot.",
    ],
    false, // isGlutenFree (Wheat noodles)
    false, // isVegan
    false, // isVegetarian
    true, // isLactoseFree
  ),

  new Meal(
    "m79",
    ["c9"],
    "Beef Tartare",
    "luxurious",
    "hard",
    "https://i.pinimg.com/736x/f0/18/55/f01855aec3ef39559f5d0cb88b81fd59.jpg",
    25,
    [
      "250g Raw Beef Tenderloin (Prime grade)",
      "1 Fresh Egg Yolk",
      "1 tbsp Capers (Minced)",
      "1 Shallot (Finely diced)",
      "1 tsp Dijon Mustard",
      "Worcestershire Sauce",
      "Toast Points",
    ],
    [
      "Chill the beef in the freezer for 15 minutes to make it easier to cut.",
      "Using a sharp knife, hand-mince the beef into very small, uniform cubes (do not use a processor).",
      "In a chilled bowl, mix the beef with capers, shallots, mustard, and a dash of Worcestershire sauce.",
      "Shape the mixture into a neat circle on a plate.",
      "Make a small indentation on top and carefully place the raw egg yolk in the center.",
      "Serve immediately with crispy toast points or crackers.",
    ],
    true, // isGlutenFree (Without toast)
    false, // isVegan
    false, // isVegetarian
    true, // isLactoseFree
  ),

  new Meal(
    "m80",
    ["c10"],
    "Classic Panna Cotta",
    "pricey",
    "simple",
    "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=500&auto=format&fit=crop",
    20,
    [
      "500ml Heavy Cream",
      "50g Sugar",
      "2 sheets Gelatin (or 1 tsp powder)",
      "1 Vanilla Bean (Scraped)",
      "1 Cup Mixed Berry Sauce",
    ],
    [
      "Soak gelatin in cold water for 5 minutes until soft.",
      "In a saucepan, heat cream, sugar, and vanilla seeds over medium heat (do not let it boil).",
      "Remove from heat, squeeze excess water from the gelatin, and whisk it into the warm cream until dissolved.",
      "Pour the mixture into ramekins or glass molds.",
      "Refrigerate for at least 4-6 hours until completely set.",
      "To serve, run a knife around the edge and flip onto a plate, or serve in the glass topped with berry sauce.",
    ],
    true, // isGlutenFree
    false, // isVegan
    true, // isVegetarian
    false, // isLactoseFree
  ),
  new Meal(
    "m81",
    ["c11"],
    "Kofta Kebab",
    "pricey",
    "challenging",
    "https://plus.unsplash.com/premium_photo-1770815084799-72c976c30acc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fEtvZnRhJTIwS2ViYWJ8ZW58MHx8MHx8fDA%3D",
    35,
    [
      "500g Ground Beef or Lamb",
      "1 Large Onion (Grated and drained)",
      "1/2 Cup Fresh Parsley (Finely chopped)",
      "1 tsp Allspice",
      "1/2 tsp Cinnamon",
      "1/2 tsp Cumin",
      "Salt & Black Pepper",
    ],
    [
      "Mix the ground meat with the grated onion, parsley, and all the spices in a large bowl.",
      "Knead the mixture by hand for about 5 minutes until it becomes sticky and holds together.",
      "Take a handful of meat and shape it around a metal skewer, forming a long, uniform kebab.",
      "Grill over medium-high heat (ideally over charcoal) for 8-10 minutes, turning occasionally.",
      "Serve hot with pita bread, grilled tomatoes, and a side of hummus.",
    ],
    true, // isGlutenFree
    false, // isVegan
    false, // isVegetarian
    true, // isLactoseFree
  ),

  new Meal(
    "m82",
    ["c12"],
    "Chiles Rellenos",
    "pricey",
    "hard",
    "https://media.istockphoto.com/id/159305135/photo/chile-relleno-stuffed-with-mashed-potatoes.webp?a=1&b=1&s=612x612&w=0&k=20&c=euPmCewbx7GuNjwzblTJGTJOCfqqeSAbInnvMlK3Qus=",
    50,
    [
      "4 Large Poblano Peppers",
      "200g Monterey Jack Cheese",
      "3 Large Eggs (Separated)",
      "1 Cup Tomato Sauce (Ranchera style)",
      "1/2 Cup Flour",
      "Vegetable Oil for frying",
    ],
    [
      "Roast the poblano peppers over an open flame until charred, then let them steam in a bag and peel off the skin.",
      "Make a small slit in each pepper and carefully remove the seeds; stuff with a slice of cheese.",
      "Beat the egg whites until stiff peaks form, then gently fold in the yolks to make a light batter.",
      "Dredge the stuffed peppers in flour, dip into the egg batter, and fry in hot oil until golden brown.",
      "Drain on paper towels and serve immediately topped with warm tomato sauce.",
    ],
    false, // isGlutenFree (Uses flour for coating)
    false, // isVegan
    true, // isVegetarian
    false, // isLactoseFree
  ),

  new Meal(
    "m83",
    ["c13"],
    "Samosas (Potato & Pea)",
    "affordable",
    "hard",
    "https://images.unsplash.com/photo-1601050690294-397f3c324515?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8U2Ftb3Nhc3xlbnwwfHwwfHx8MA%3D%3D",
    45,
    [
      "2 Cups All-Purpose Flour",
      "3 Large Potatoes (Boiled and cubed)",
      "1/2 Cup Green Peas",
      "1 tsp Cumin Seeds",
      "1 tbsp Grated Ginger",
      "1 tsp Garam Masala",
      "Vegetable Oil",
    ],
    [
      "Prepare the dough by mixing flour, oil, and water; knead until smooth and let it rest.",
      "For the filling: Sauté cumin seeds, ginger, and peas; add cubed potatoes and spices. Mash slightly.",
      "Divide the dough into small balls, roll into circles, and cut each circle in half.",
      "Fold each semi-circle into a cone, fill with the potato mixture, and seal the edges with water.",
      "Deep fry the samosas on medium heat until they are crisp and golden brown.",
      "Serve with mint or tamarind chutney.",
    ],
    false, // isGlutenFree (Wheat dough)
    true, // isVegan
    true, // isVegetarian
    true, // isLactoseFree
  ),

  new Meal(
    "m84",
    ["c14"],
    "Fresh Fish Ceviche",
    "pricey",
    "simple",
    "https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?q=80&w=500&auto=format&fit=crop",
    20,
    [
      "500g Fresh White Fish Fillets (Sea Bass or Snapper)",
      "1/2 Cup Fresh Lime Juice",
      "1 Small Red Onion (Thinly sliced)",
      "1/2 Cup Fresh Cilantro (Chopped)",
      "1 Red Chili (Minced)",
      "1 Sweet Potato (Boiled, for side)",
    ],
    [
      "Cut the fresh fish into small, uniform cubes (about 1.5 cm).",
      "In a glass bowl, cover the fish with lime juice and refrigerate for 15-20 minutes until the fish turns opaque.",
      "Add the red onion, chili, and cilantro to the fish; toss gently.",
      "Season with salt and a pinch of black pepper.",
      "Serve immediately in chilled bowls, traditionally accompanied by slices of boiled sweet potato or corn.",
    ],
    true, // isGlutenFree
    false, // isVegan
    false, // isVegetarian
    true, // isLactoseFree
  ),

  new Meal(
    "m85",
    ["c15"],
    "Vegan Tofu Stir-fry",
    "affordable",
    "simple",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500&auto=format&fit=crop",
    20,
    [
      "400g Firm Tofu (Pressed and diced)",
      "2 Cups Broccoli Florets",
      "3 tbsp Soy Sauce",
      "1 tbsp Fresh Ginger (Minced)",
      "1 tbsp Sesame Oil",
      "2 tbsp Cornstarch",
      "Sesame Seeds",
    ],
    [
      "Toss the diced tofu in cornstarch to coat lightly.",
      "Heat sesame oil in a wok and fry the tofu until all sides are golden and crispy.",
      "Add broccoli and ginger to the wok; stir-fry for 3-5 minutes until the broccoli is bright green but crisp.",
      "Pour in the soy sauce and a splash of water, tossing until the sauce thickens and coats the ingredients.",
      "Garnish with toasted sesame seeds and serve over rice or noodles.",
    ],
    false, // isGlutenFree (Soy sauce contains wheat)
    true, // isVegan
    true, // isVegetarian
    true, // isLactoseFree
  ),

  new Meal(
    "m86",
    ["c16"],
    "Afghan Kofta Chalau",
    "pricey",
    "challenging",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpUMDudDpYG_e1TGLegQmMdg2MQOnOSOIsQw&s",
    50,
    [
      "500g Ground Beef",
      "2 Cups Basmati Rice",
      "2 Large Tomatoes (Pureed)",
      "1 tbsp Tomato Paste",
      "1 Onion (Grated)",
      "2 cloves Garlic",
      "Spices (Coriander, Cumin, Turmeric)",
    ],
    [
      "Meatballs: Mix beef with grated onion, garlic, and spices. Shape into small round balls.",
      "Sauce: Sauté onions and garlic, add tomato puree, tomato paste, and spices; simmer with 1 cup of water.",
      "Place the meatballs into the simmering sauce, cover, and cook for 30 minutes on low heat.",
      "Rice (Chalau): Parboil basmati rice, then drain and steam with oil and cumin until fluffy and white.",
      "Serve the meatballs and gravy on a separate platter alongside the white rice.",
    ],
    true, // isGlutenFree
    false, // isVegan
    false, // isVegetarian
    true, // isLactoseFree
  ),

  new Meal(
    "m87",
    ["c17"],
    "Kabab Koobideh",
    "pricey",
    "hard",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrajRJ91xAq1fHNkfRT3hZMu0uRz7QFmw77w&s",
    45,
    [
      "800g Minced Lamb (20% fat)",
      "2 Large Onions (Grated and squeezed dry)",
      "1/2 tsp Saffron (Brewed)",
      "1 tsp Sumac",
      "Basmati Rice",
      "Butter",
    ],
    [
      "Mix the minced lamb with the dried onion pulp, salt, pepper, and brewed saffron.",
      "Knead the meat for at least 10 minutes until it feels like a paste (crucial for sticking to the skewer).",
      "Mould the meat onto wide, flat skewers, using wet hands to create the traditional indentations.",
      "Grill over hot charcoal, turning frequently during the first minute to set the meat.",
      "Serve over a bed of saffron rice with a cube of butter and a generous sprinkle of sumac.",
    ],
    true, // isGlutenFree
    false, // isVegan
    false, // isVegetarian
    false, // isLactoseFree (Served with butter)
  ),

  new Meal(
    "m88",
    ["c18"],
    "Steak Frites",
    "luxurious",
    "challenging",
    "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=500&auto=format&fit=crop",
    30,
    [
      "2 Sirloin Steaks (250g each)",
      "3 Large Potatoes",
      "50g Unsalted Butter",
      "Fresh Rosemary & Thyme",
      "2 cloves Garlic",
    ],
    [
      "Peel potatoes and cut into thin matchsticks. Fry in oil at 160°C for 5 minutes, then at 190°C until golden and crisp.",
      "Season steaks generously with salt and pepper.",
      "Sear the steaks in a hot cast-iron skillet for 3-4 minutes per side.",
      "Add butter, garlic, and herbs to the pan; baste the steak with the melted butter for 2 minutes.",
      "Let the steak rest for 5 minutes before slicing.",
      "Serve with the hot fries and a dollop of herb butter.",
    ],
    true, // isGlutenFree
    false, // isVegan
    false, // isVegetarian
    false, // isLactoseFree
  ),

  new Meal(
    "m89",
    ["c1"],
    "Creamy Mushroom Risotto",
    "pricey",
    "hard",
    "https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=500&auto=format&fit=crop",
    45,
    [
      "1.5 Cups Arborio Rice",
      "300g Mixed Mushrooms (Sliced)",
      "1.2 Liters Vegetable Broth (Warm)",
      "1/2 Cup Dry White Wine",
      "1/2 Cup Parmesan Cheese",
      "2 tbsp Butter",
      "1 Shallot (Minced)",
    ],
    [
      "Sauté mushrooms in a large pan with olive oil until browned; remove and set aside.",
      "In the same pan, sauté shallots, then add rice and toast for 2 minutes.",
      "Deglaze with white wine and stir until evaporated.",
      "Add the warm broth one ladle at a time, stirring constantly and waiting for each ladle to be absorbed before adding the next.",
      "Once the rice is tender but firm (about 20 mins), stir back in the mushrooms, butter, and parmesan.",
      "Serve immediately while creamy.",
    ],
    true, // isGlutenFree
    false, // isVegan
    true, // isVegetarian
    false, // isLactoseFree
  ),

  new Meal(
    "m90",
    ["c2"],
    "Caprese Pesto Wrap",
    "affordable",
    "simple",
    "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=500&auto=format&fit=crop",
    10,
    [
      "1 Large Tortilla",
      "150g Fresh Mozzarella (Sliced)",
      "1 Large Tomato (Sliced)",
      "1 Cup Fresh Baby Spinach",
      "2 tbsp Basil Pesto",
    ],
    [
      "Spread a generous layer of basil pesto over the entire surface of the tortilla.",
      "Layer the fresh spinach, followed by slices of tomato and mozzarella.",
      "Drizzle with a little balsamic glaze if desired.",
      "Fold the sides in and roll the tortilla tightly.",
      "Optionally, grill the wrap for 1-2 minutes per side until the cheese begins to soften.",
    ],
    false, // isGlutenFree (Flour tortilla)
    false, // isVegan
    true, // isVegetarian
    false, // isLactoseFree
  ),
  new Meal(
    "m91",
    ["c16"],
    "Afghan Shorwa (Meat Stew)",
    "affordable",
    "challenging",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeeBpJRuJgUR_DArPC15Jqim80wxKItUJfgw&s",
    90,
    [
      "500g Lamb Shanks or Bones",
      "3 Large Potatoes",
      "1 Cup Yellow Peas (Soaked)",
      "2 Large Onions",
      "2 tbsp Tomato Paste",
      "Dried Lime (Limo Amani)",
      "Fresh Nan Bread",
    ],
    [
      "Sauté onions until golden, then add lamb and brown it thoroughly.",
      "Add tomato paste, yellow peas, and 6 cups of water. Bring to a boil.",
      "Lower the heat and simmer for 1 hour; then add potatoes and dried lime.",
      "Cook for another 30-40 minutes until the meat falls off the bone and potatoes are soft.",
      "Traditionally, the broth is served first in a bowl with pieces of bread (Tari), followed by the meat and vegetables.",
    ],
    false, // isGlutenFree (Typically served with bread inside)
    false, // isVegan
    false, // isVegetarian
    true, // isLactoseFree
  ),

  new Meal(
    "m92",
    ["c17"],
    "Mirza Ghasemi",
    "affordable",
    "simple",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyqiu0bbKw9VuaZHPgP_vDCgSMwy5MTlVcJw&s",
    40,
    [
      "3 Large Eggplants",
      "4 cloves Garlic (Crushed)",
      "3 Ripe Tomatoes (Peeled and chopped)",
      "2 Large Eggs",
      "1 tsp Turmeric",
      "Olive Oil",
    ],
    [
      "Grill the eggplants over an open flame until the skin is charred and the flesh is smoky and soft.",
      "Peel the charred skin off and finely chop or mash the eggplant flesh.",
      "Sauté garlic and turmeric in oil, then add the chopped tomatoes and cook until the water evaporates.",
      "Mix in the mashed eggplant and cook for 10 minutes to meld flavors.",
      "Make small wells in the mixture, crack the eggs into them, and stir until the eggs are just set.",
    ],
    true, // isGlutenFree
    false, // isVegan
    true, // isVegetarian
    true, // isLactoseFree
  ),

  new Meal(
    "m93",
    ["c8"],
    "Dim Sum (Shrimp Dumplings)",
    "pricey",
    "hard",
    "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?q=80&w=500&auto=format&fit=crop",
    60,
    [
      "250g Shrimp (Minced)",
      "Dumpling Wrappers (Wheat or Rice based)",
      "1 tbsp Fresh Ginger",
      "2 tbsp Soy Sauce",
      "1 tsp Sesame Oil",
      "Bamboo Shoots (Finely chopped)",
    ],
    [
      "Mix minced shrimp with ginger, soy sauce, sesame oil, and bamboo shoots to create the filling.",
      "Place a small spoonful of filling in the center of each wrapper.",
      "Fold and pleat the edges carefully to seal the dumplings (Har Gow style).",
      "Line a bamboo steamer with parchment paper or cabbage leaves.",
      "Steam the dumplings over boiling water for 8-10 minutes until the filling is pink and the wrapper is translucent.",
      "Serve hot with a dipping sauce of soy sauce and chili oil.",
    ],
    false, // isGlutenFree (Standard wheat wrappers)
    false, // isVegan
    false, // isVegetarian
    true, // isLactoseFree
  ),

  new Meal(
    "m94",
    ["c13"],
    "Garlic Naan Bread",
    "affordable",
    "simple",
    "https://images.unsplash.com/photo-1585238342024-78d387f4a707?q=80&w=500&auto=format&fit=crop",
    20,
    [
      "2 Cups All-Purpose Flour",
      "1/2 Cup Plain Yogurt",
      "1 tsp Yeast",
      "1/2 tsp Sugar",
      "4 tbsp Butter",
      "3 cloves Garlic (Minced)",
    ],
    [
      "Mix flour, yeast, sugar, yogurt, and warm water. Knead into a soft dough and let it rise for 1 hour.",
      "Divide the dough into small balls and roll them out into flat, oval shapes.",
      "Heat a heavy skillet or cast-iron pan over high heat.",
      "Place the dough on the pan; once bubbles form, flip and cook until charred spots appear.",
      "Immediately brush the hot bread with a mixture of melted butter and minced garlic.",
      "Garnish with fresh cilantro.",
    ],
    false, // isGlutenFree (Wheat flour)
    false, // isVegan (Contains yogurt and butter)
    true, // isVegetarian
    false, // isLactoseFree
  ),

  new Meal(
    "m95",
    ["c10"],
    "New York Cheesecake",
    "pricey",
    "hard",
    "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=500&auto=format&fit=crop",
    70,
    [
      "900g Cream Cheese (Room temperature)",
      "1.5 Cups Graham Cracker Crumbs",
      "1 Cup Sugar",
      "4 Large Eggs",
      "1 Cup Sour Cream",
      "1 tbsp Vanilla Extract",
      "1/2 Cup Melted Butter",
    ],
    [
      "Combine cracker crumbs and melted butter; press firmly into the bottom of a springform pan.",
      "Beat the cream cheese and sugar until smooth; add eggs one at a time, followed by sour cream and vanilla.",
      "Pour the filling over the crust.",
      "Bake in a water bath (to prevent cracking) at 160°C for 60-70 minutes.",
      "Turn off the oven and let the cheesecake cool inside with the door slightly open for 1 hour.",
      "Chill in the refrigerator for at least 6 hours before serving.",
    ],
    false, // isGlutenFree (Crackers contain gluten)
    false, // isVegan
    true, // isVegetarian
    false, // isLactoseFree
  ),

  new Meal(
    "m96",
    ["c15"],
    "Zucchini Noodles (Zoodles)",
    "affordable",
    "simple",
    "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=500&auto=format&fit=crop",
    15,
    [
      "3 Large Zucchinis",
      "2 cloves Garlic (Slivered)",
      "1 Cup Cherry Tomatoes (Halved)",
      "2 tbsp Olive Oil",
      "Fresh Basil",
      "Parmesan (Optional)",
    ],
    [
      "Use a spiralizer to turn the zucchinis into long, noodle-like strands.",
      "Heat olive oil in a large skillet and sauté garlic for 1 minute.",
      "Add the cherry tomatoes and cook until they just start to burst.",
      "Add the zucchini noodles and toss for only 2-3 minutes (do not overcook or they will become watery).",
      "Season with salt and pepper, and garnish with fresh basil and a sprinkle of parmesan.",
    ],
    true, // isGlutenFree
    true, // isVegan (Without parmesan)
    true, // isVegetarian
    true, // isLactoseFree (Without parmesan)
  ),

  new Meal(
    "m97",
    ["c11"],
    "Classic Tabbouleh Salad",
    "affordable",
    "simple",
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=500&auto=format&fit=crop",
    20,
    [
      "1/2 Cup Fine Bulgur",
      "3 bunches Flat-leaf Parsley",
      "1/2 Cup Fresh Mint",
      "2 Large Tomatoes",
      "1/4 Cup Lemon Juice",
      "1/3 Cup Extra Virgin Olive Oil",
    ],
    [
      "Soak the bulgur in boiling water for 15 minutes, then drain and squeeze out all excess liquid.",
      "Very finely chop the parsley and mint (ensure they are dry before chopping).",
      "Dice the tomatoes finely and drain the excess juice.",
      "In a large bowl, combine the bulgur, herbs, and tomatoes.",
      "Whisk together lemon juice and olive oil; pour over the salad and toss well.",
      "Serve chilled.",
    ],
    false, // isGlutenFree (Bulgur is wheat)
    true, // isVegan
    true, // isVegetarian
    true, // isLactoseFree
  ),

  new Meal(
    "m98",
    ["c3"],
    "Black Bean Veggie Burger",
    "affordable",
    "simple",
    "https://images.unsplash.com/photo-1520072959219-c595dc870360?q=80&w=500&auto=format&fit=crop",
    20,
    [
      "1 can Black Beans (Mashed)",
      "1/2 Cup Breadcrumbs",
      "1/4 Cup Diced Onions",
      "1 tsp Cumin",
      "1 Large Egg (as binder)",
      "Whole Wheat Buns",
      "Avocado Slices",
    ],
    [
      "In a bowl, mix mashed black beans, breadcrumbs, onions, cumin, and egg until well combined.",
      "Form the mixture into 4 patties.",
      "Grill or pan-fry the patties for about 5 minutes on each side until firm and slightly browned.",
      "Toast the buns and assemble with lettuce, tomato, avocado, and the veggie patty.",
      "Serve with sweet potato fries.",
    ],
    false, // isGlutenFree (Breadcrumbs and Bun)
    false, // isVegan (Contains egg)
    true, // isVegetarian
    true, // isLactoseFree
  ),

  new Meal(
    "m99",
    ["c14"],
    "Creamy Clam Chowder",
    "pricey",
    "challenging",
    "https://images.unsplash.com/photo-1560684352-8497838a2229?q=80&w=500&auto=format&fit=crop",
    40,
    [
      "500g Fresh or Canned Clams",
      "3 Large Potatoes (Diced)",
      "2 Cups Heavy Cream",
      "4 Slices of Bacon (Diced)",
      "1 Onion",
      "2 tbsp Flour",
      "1 tsp Thyme",
    ],
    [
      "Fry the diced bacon in a large pot until crispy; remove bacon but keep the fat.",
      "Sauté onions in the bacon fat, then stir in flour to create a roux.",
      "Slowly add clam juice and diced potatoes; simmer until potatoes are tender.",
      "Stir in the heavy cream, clams, and thyme; simmer for 5-10 minutes without boiling.",
      "Season with plenty of black pepper and serve topped with the crispy bacon.",
    ],
    false, // isGlutenFree (Uses flour)
    false, // isVegan
    false, // isVegetarian
    false, // isLactoseFree
  ),

  new Meal(
    "m100",
    ["c18"],
    "Holiday Roast Turkey",
    "luxurious",
    "hard",
    "https://i.pinimg.com/736x/67/d0/98/67d09837629b18928d71d7b0811eb88a.jpg",
    180,
    [
      "5kg Whole Turkey",
      "200g Butter (Softened)",
      "4 Cups Traditional Stuffing",
      "Fresh Sage and Rosemary",
      "Cranberry Sauce",
      "1 Lemon",
      "1 Onion",
    ],
    [
      "Clean the turkey and pat dry. Stuff the cavity with halved lemon, onion, and herbs.",
      "Carefully loosen the skin over the breast and spread herb butter underneath.",
      "Generously season the outside with salt and pepper.",
      "Roast at 165°C, basting every 30 minutes with the pan juices.",
      "Cook for approximately 3 hours or until the internal temperature reaches 74°C.",
      "Let the turkey rest for at least 30 minutes before carving to keep it juicy.",
      "Serve with stuffing, gravy, and cranberry sauce.",
    ],
    false, // isGlutenFree (Typically contains stuffing/bread)
    false, // isVegan
    false, // isVegetarian
    false, // isLactoseFree
  ),
  new Meal(
    "m101",
    ["c14"], // Seafood
    "Honey Garlic Salmon",
    "pricey",
    "simple",
    "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=500&auto=format&fit=crop",
    20,
    [
      "2 Salmon Fillets",
      "3 tbsp Honey",
      "2 tbsp Soy Sauce",
      "1 tbsp Lemon Juice",
      "3 cloves Garlic",
      "Asparagus",
    ],
    [
      "Whisk honey, soy sauce, lemon juice, and minced garlic to make the glaze.",
      "Season salmon with salt and pepper, then sear in a pan for 3 minutes per side.",
      "Pour the glaze into the pan and let it bubble and thicken over the salmon.",
      "Serve with sautéed asparagus.",
    ],
    true, // isGlutenFree (If using Tamari)
    false, // isVegan
    false, // isVegetarian
    true, // isLactoseFree
  ),

  new Meal(
    "m102",
    ["c15"], // Keto / Vegan
    "Cauliflower Steak",
    "affordable",
    "simple",
    "https://i.pinimg.com/1200x/ec/a5/51/eca551848ba84611faa46c0048f14f63.jpg",
    25,
    [
      "1 Large Cauliflower",
      "Olive Oil",
      "Smoked Paprika",
      "Garlic Powder",
      "Chimichurri Sauce",
    ],
    [
      "Cut the cauliflower into thick 1-inch 'steaks'.",
      "Brush both sides with olive oil and spices.",
      "Roast at 200°C for 25 minutes until golden and edges are crispy.",
      "Top with fresh chimichurri sauce before serving.",
    ],
    true, // isGlutenFree
    true, // isVegan
    true, // isVegetarian
    true, // isLactoseFree
  ),

  new Meal(
    "m103",
    ["c12"], // Street Food / Mexican
    "Street Corn (Elote)",
    "affordable",
    "simple",
    "https://i.pinimg.com/1200x/be/fd/d2/befdd222e9e23ae6398775ac6e6c53f9.jpg",
    15,
    [
      "4 Ears of Corn",
      "1/4 Cup Mayonnaise",
      "1/2 Cup Cotija Cheese",
      "Chili Powder",
      "Lime Wedges",
      "Cilantro",
    ],
    [
      "Grill the corn until charred on all sides.",
      "Brush each ear with a thin layer of mayonnaise.",
      "Roll the corn in crumbled Cotija cheese until coated.",
      "Sprinkle with chili powder and cilantro; serve with lime.",
    ],
    true, // isGlutenFree
    false, // isVegan
    true, // isVegetarian
    false, // isLactoseFree
  ),

  new Meal(
    "m104",
    ["c8"], // Asian
    "Vietnamese Pho",
    "pricey",
    "hard",
    "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?q=80&w=500&auto=format&fit=crop",
    180,
    [
      "Beef Bones",
      "Rice Noodles",
      "Beef Sirloin (Thinly sliced)",
      "Star Anise & Cinnamon",
      "Ginger & Onion",
      "Fresh Basil & Bean Sprouts",
    ],
    [
      "Char the onion and ginger, then simmer with beef bones and spices for at least 3-4 hours to make the clear broth.",
      "Cook rice noodles until tender.",
      "Place raw beef slices over the noodles in a bowl.",
      "Pour the boiling hot broth over the beef (the heat of the broth cooks the meat instantly).",
      "Serve with a side of fresh herbs, lime, and bean sprouts.",
    ],
    true, // isGlutenFree
    false, // isVegan
    false, // isVegetarian
    true, // isLactoseFree
  ),

  new Meal(
    "m105",
    ["c3"], // Burger/Keto
    "Lettuce Wrapped Keto Burger",
    "pricey",
    "simple",
    "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=500&auto=format&fit=crop",
    20,
    [
      "Beef Patty",
      "Large Iceberg Lettuce Leaves",
      "Bacon",
      "Avocado",
      "Sugar-free Mayo",
      "Pickles",
    ],
    [
      "Grill the beef patty and bacon until cooked.",
      "Use two large, sturdy lettuce leaves as the 'bun'.",
      "Layer the patty, bacon, avocado, and pickles inside.",
      "Top with sugar-free mayo and wrap tightly.",
    ],
    true, // isGlutenFree
    false, // isVegan
    false, // isVegetarian
    true, // isLactoseFree
  ),

  new Meal(
    "m106",
    ["c1"], // Italian
    "Chicken Marsala",
    "pricey",
    "challenging",
    "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=500&auto=format&fit=crop",
    40,
    [
      "Chicken Breast",
      "Mushrooms",
      "Marsala Wine",
      "Heavy Cream",
      "Shallots",
      "Flour",
    ],
    [
      "Pound chicken breasts until thin, dredge in flour, and pan-fry until golden.",
      "In the same pan, sauté shallots and mushrooms.",
      "Deglaze with Marsala wine and simmer until reduced by half.",
      "Add a splash of cream to create a velvety sauce and return chicken to the pan.",
    ],
    false, // isGlutenFree
    false, // isVegan
    false, // isVegetarian
    false, // isLactoseFree
  ),

  new Meal(
    "m107",
    ["c11"], // Middle Eastern
    "Stuffed Grape Leaves (Dolma)",
    "affordable",
    "hard",
    "https://images.unsplash.com/photo-1623341214825-9f4f963727da?q=80&w=500&auto=format&fit=crop",
    90,
    [
      "Grape Leaves",
      "Rice",
      "Ground Beef (Optional)",
      "Fresh Dill & Parsley",
      "Lemon Juice",
      "Olive Oil",
    ],
    [
      "Prepare the filling with rice, herbs, and spices (and meat if using).",
      "Place a small amount of filling on each leaf and roll tightly like a cigar.",
      "Layer the rolls in a pot, add water, lemon juice, and olive oil.",
      "Place a heavy plate on top to keep them submerged and simmer for 45-60 minutes.",
    ],
    true, // isGlutenFree
    false, // isVegan (Depends on meat)
    false, // isVegetarian (Depends on meat)
    true, // isLactoseFree
  ),

  new Meal(
    "m109",
    ["c6"], // Exotic/Tropical
    "Poke Bowl",
    "pricey",
    "simple",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500&auto=format&fit=crop",
    20,
    [
      "Raw Tuna or Salmon",
      "Sushi Rice",
      "Edamame",
      "Radish",
      "Seaweed Salad",
      "Spicy Mayo",
    ],
    [
      "Dice the raw fish and marinate in soy sauce and sesame oil.",
      "Prepare a bowl with a base of warm sushi rice.",
      "Arrange edamame, sliced radish, and seaweed salad on top.",
      "Add the marinated fish and drizzle with spicy mayo.",
    ],
    false, // isGlutenFree (Soy sauce)
    false, // isVegan
    false, // isVegetarian
    false, // isLactoseFree (Mayo)
  ),

  new Meal(
    "m110",
    ["c18"], // Roast/Global
    "Peking Duck",
    "luxurious",
    "hard",
    "https://i.pinimg.com/736x/a2/ef/8a/a2ef8a122a459ce459d59c9d85da814a.jpg",
    240,
    [
      "Whole Duck",
      "Maltose or Honey",
      "Five Spice Powder",
      "Spring Onions",
      "Cucumber",
      "Hoisin Sauce",
      "Thin Pancakes",
    ],
    [
      "Air-dry the duck skin for several hours, then brush with a maltose/honey glaze.",
      "Roast the duck until the skin is dark red and extremely crispy.",
      "Carve the crispy skin and meat into thin slices.",
      "Serve with thin pancakes, hoisin sauce, and julienned cucumber and onions.",
    ],
    false, // isGlutenFree
    false, // isVegan
    false, // isVegetarian
    true, // isLactoseFree
  ),
  new Meal(
    "m111",
    ["c19"], // Street Food
    "Crispy Fried Chicken",
    "pricey",
    "challenging",
    "https://i.pinimg.com/1200x/05/b6/07/05b607b4e531b4fb917b772b513c453e.jpg",
    45,
    [
      "1kg Chicken Wings/Thighs",
      "2 Cups Buttermilk",
      "2 Cups Flour",
      "1 tsp Paprika",
      "1 tsp Garlic Powder",
      "Vegetable Oil",
    ],
    [
      "Marinate chicken in buttermilk for at least 4 hours.",
      "Mix flour with paprika, garlic powder, salt, and pepper.",
      "Dredge chicken in the flour mixture, pressing firmly to coat.",
      "Deep fry at 175°C until golden brown and internal temperature reaches 75°C.",
      "Let it rest on a wire rack to maintain crispiness.",
    ],
    false, // isGlutenFree
    false, // isVegan
    false, // isVegetarian
    false, // isLactoseFree
  ),

  new Meal(
    "m112",
    ["c20"], // Vegetarian
    "Eggplant Parmesan",
    "pricey",
    "hard",
    "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=500&auto=format&fit=crop",
    60,
    [
      "2 Large Eggplants",
      "Marinara Sauce",
      "Mozzarella Cheese",
      "Parmesan",
      "Breadcrumbs",
      "Fresh Basil",
    ],
    [
      "Slice eggplants, salt them to remove moisture, then bread and fry them until golden.",
      "In a baking dish, layer marinara sauce, fried eggplant, and mozzarella.",
      "Repeat layers and finish with a heavy sprinkle of parmesan.",
      "Bake at 190°C for 25-30 minutes until bubbling and golden.",
      "Garnish with fresh basil before serving.",
    ],
    false, // isGlutenFree
    false, // isVegan
    true, // isVegetarian
    false, // isLactoseFree
  ),

  new Meal(
    "m113",
    ["c19"], // Street Food
    "Beef Tacos al Pastor",
    "affordable",
    "challenging",
    "https://images.unsplash.com/photo-1551782450-17144efb9c50?q=80&w=500&auto=format&fit=crop",
    40,
    [
      "500g Beef (Thinly sliced)",
      "Pineapple Slices",
      "Corn Tortillas",
      "Achiote Paste",
      "Dried Chilies",
      "White Onion & Cilantro",
    ],
    [
      "Marinate beef in a blend of achiote, chilies, and vinegar for 6 hours.",
      "Grill the meat alongside pineapple slices until slightly charred.",
      "Finely chop the meat and pineapple.",
      "Warm the tortillas and fill with meat, pineapple, diced onion, and cilantro.",
      "Serve with a squeeze of lime.",
    ],
    true, // isGlutenFree
    false, // isVegan
    false, // isVegetarian
    true, // isLactoseFree
  ),

  new Meal(
    "m114",
    ["c20"], // Vegetarian
    "Mushroom and Spinach Quiche",
    "pricey",
    "hard",
    "https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=500&auto=format&fit=crop",
    75,
    [
      "Pie Crust",
      "4 Eggs",
      "1 Cup Heavy Cream",
      "2 Cups Mushrooms",
      "2 Cups Spinach",
      "Swiss Cheese",
    ],
    [
      "Pre-bake the pie crust for 10 minutes.",
      "Sauté mushrooms and spinach until all moisture is evaporated.",
      "Whisk eggs and cream; stir in the vegetables and cheese.",
      "Pour mixture into the crust and bake at 175°C for 35-40 minutes until set.",
      "Let it cool slightly before slicing.",
    ],
    false, // isGlutenFree
    false, // isVegan
    true, // isVegetarian
    false, // isLactoseFree
  ),

  new Meal(
    "m115",
    ["c19"], // Street Food
    "Falafel Wrap",
    "affordable",
    "simple",
    "https://i.pinimg.com/1200x/49/24/f0/4924f0f319f581c07ad97b8375216743.jpg",
    30,
    [
      "2 Cups Dried Chickpeas (Soaked)",
      "Fresh Parsley & Cilantro",
      "Garlic",
      "Cumin",
      "Tahini Sauce",
      "Pita Bread",
    ],
    [
      "Pulse soaked chickpeas, herbs, garlic, and spices in a processor (do not puree).",
      "Form into small balls and deep fry until dark brown and crispy.",
      "Spread tahini on pita bread, add falafels, lettuce, and pickles.",
      "Roll tightly and serve.",
    ],
    false, // isGlutenFree (Pita)
    true, // isVegan
    true, // isVegetarian
    true, // isLactoseFree
  ),
  new Meal(
    "m118",
    ["c12"], // Mexican
    "Enchiladas Rojas",
    "pricey",
    "hard",
    "https://i.pinimg.com/736x/84/7b/6a/847b6a28bd82602e3ae03eb50a5f88be.jpg",
    50,
    [
      "Corn Tortillas",
      "Shredded Chicken",
      "Dried Guajillo Chilies",
      "Garlic",
      "Queso Fresco",
      "Sour Cream",
    ],
    [
      "Blend soaked chilies and garlic to make the red sauce; simmer until thick.",
      "Dip tortillas in the sauce, fill with chicken, and roll them up.",
      "Place in a baking dish, cover with more sauce and cheese.",
      "Bake for 15 minutes until hot.",
      "Top with sour cream and onions.",
    ],
    true, // isGlutenFree
    false, // isVegan
    false, // isVegetarian
    false, // isLactoseFree
  ),

  new Meal(
    "m119",
    ["c10"], // Desserts
    "Tiramisu",
    "luxurious",
    "hard",
    "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=500&auto=format&fit=crop",
    45,
    [
      "Ladyfingers",
      "Mascarpone Cheese",
      "Strong Espresso",
      "Eggs",
      "Sugar",
      "Cocoa Powder",
    ],
    [
      "Whisk egg yolks and sugar over a water bath, then fold in mascarpone.",
      "Gently fold in whipped egg whites (یا خامه فرم گرفته) to make the cream.",
      "Quickly dip ladyfingers in cold espresso and layer them in a dish.",
      "Spread half the cream over the ladyfingers; repeat with another layer.",
      "Dust generously with cocoa powder and refrigerate for at least 6 hours.",
    ],
    false, // isGlutenFree
    false, // isVegan
    true, // isVegetarian
    false, // isLactoseFree
  ),
  new Meal(
    "m121",
    ["c19"], // Street Food
    "Vietnamese Banh Mi",
    "affordable",
    "simple",
    "https://i.pinimg.com/1200x/42/66/0b/42660b9a3025ca97cdc1bc8f80431cb6.jpg",
    20,
    [
      "1 Baguette (Crispy)",
      "Pork Paté or Grilled Pork",
      "Pickled Daikon & Carrots",
      "Fresh Cilantro",
      "Cucumber Slices",
      "Jalapeño",
      "Mayonnaise",
    ],
    [
      "Slice the baguette lengthwise and spread a thin layer of mayonnaise and paté.",
      "Layer the grilled pork (or tofu for a veggie version) inside.",
      "Add the pickled vegetables, cucumber slices, and jalapeños for heat.",
      "Top with a generous amount of fresh cilantro and a dash of soy sauce.",
      "Serve immediately while the bread is still crusty.",
    ],
    false, // isGlutenFree
    false, // isVegan
    false, // isVegetarian
    false, // isLactoseFree
  ),

  new Meal(
    "m122",
    ["c20"], // Vegetarian
    "Spinach & Ricotta Lasagna",
    "pricey",
    "hard",
    "https://images.unsplash.com/photo-1619895092538-128341789043?q=80&w=500&auto=format&fit=crop",
    75,
    [
      "Lasagna Noodles",
      "500g Fresh Spinach",
      "500g Ricotta Cheese",
      "Marinara Sauce",
      "Mozzarella & Parmesan",
      "Nutmeg",
    ],
    [
      "Sauté spinach until wilted, squeeze out all excess water, and mix with ricotta and nutmeg.",
      "Spread a thin layer of marinara sauce in a baking dish.",
      "Layer noodles, the spinach-ricotta mixture, and mozzarella cheese.",
      "Repeat the layers until the dish is full, ending with a thick layer of cheese.",
      "Bake at 180°C for 45 minutes until golden and bubbling.",
    ],
    false, // isGlutenFree
    false, // isVegan
    true, // isVegetarian
    false, // isLactoseFree
  ),

  new Meal(
    "m123",
    ["c19"], // Street Food
    "Japanese Takoyaki",
    "affordable",
    "hard",
    "https://i.pinimg.com/736x/fe/58/0c/fe580c83a433505a674e19b1a835ab2b.jpg",
    40,
    [
      "Takoyaki Batter (Flour, Dashi, Eggs)",
      "Octopus (Cooked & Diced)",
      "Tempura Scraps (Tenkasu)",
      "Pickled Ginger",
      "Takoyaki Sauce",
      "Katsuobushi (Bonito Flakes)",
    ],
    [
      "Heat a takoyaki pan and grease the holes well.",
      "Pour batter into the holes and add a piece of octopus, ginger, and tenkasu to each.",
      "As the batter cooks, use a pick to flip the balls 90 degrees repeatedly until they form a perfect sphere.",
      "Continue cooking until the outside is golden and crispy.",
      "Top with takoyaki sauce, mayo, and dancing bonito flakes.",
    ],
    false, // isGlutenFree
    false, // isVegan
    false, // isVegetarian
    true, // isLactoseFree
  ),

  new Meal(
    "m124",
    ["c20"], // Vegetarian
    "Mushroom Risotto Cakes",
    "affordable",
    "challenging",
    "https://images.unsplash.com/photo-1541529086526-db283c563270?q=80&w=500&auto=format&fit=crop",
    30,
    [
      "Leftover Mushroom Risotto",
      "1 Egg",
      "Breadcrumbs",
      "Mozzarella Cubes",
      "Parmesan",
      "Parsley",
    ],
    [
      "Mix cold risotto with an egg and extra parmesan to make it sticky.",
      "Take a scoop of risotto, place a mozzarella cube in the center, and form into a patty.",
      "Coat the patties in breadcrumbs.",
      "Pan-fry in olive oil until both sides are crispy and the cheese inside has melted.",
      "Serve hot with a side of garlic aioli.",
    ],
    false, // isGlutenFree
    false, // isVegan
    true, // isVegetarian
    false, // isLactoseFree
  ),

  new Meal(
    "m125",
    ["c19"], // Street Food
    "Canadian Poutine",
    "affordable",
    "simple",
    "https://i.pinimg.com/1200x/9a/98/f1/9a98f18bb80bb7b6a6eb9ce652818d56.jpg",
    25,
    [
      "Russet Potatoes (Fried)",
      "Fresh Cheese Curds",
      "Brown Gravy (Beef or Chicken based)",
      "Black Pepper",
    ],
    [
      "Fry hand-cut potatoes twice for maximum crispiness.",
      "Place the hot fries in a bowl and top with a generous amount of fresh cheese curds.",
      "Pour piping hot gravy over the fries so the cheese begins to soften but not fully melt.",
      "Season with black pepper and serve immediately.",
    ],
    false, // isGlutenFree (If gravy uses flour)
    false, // isVegan
    false, // isVegetarian
    false, // isLactoseFree
  ),

  new Meal(
    "m126",
    ["c20"], // Vegetarian
    "Lentil Shepherd’s Pie",
    "affordable",
    "challenging",
    "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=500&auto=format&fit=crop",
    50,
    [
      "2 Cups Cooked Lentils",
      "3 Large Potatoes (Mashed)",
      "Carrots & Peas",
      "Vegetable Broth",
      "Tomato Paste",
      "Thyme & Rosemary",
    ],
    [
      "Sauté onions and carrots, then add lentils, herbs, and broth; simmer until thickened.",
      "Stir in the peas and pour the mixture into a baking dish.",
      "Spread a thick layer of creamy mashed potatoes on top.",
      "Use a fork to create ridges on the surface (for extra crunch).",
      "Bake at 200°C for 20 minutes until the potato peaks are golden brown.",
    ],
    true, // isGlutenFree
    false, // isVegan (If using butter in mash)
    true, // isVegetarian
    false, // isLactoseFree
  ),

  new Meal(
    "m127",
    ["c19"], // Street Food
    "Corndogs",
    "affordable",
    "simple",
    "https://images.unsplash.com/photo-1623653387945-2fd25214f8fc?q=80&w=500&auto=format&fit=crop",
    20,
    [
      "8 Hotdogs (Beef or Poultry)",
      "1 Cup Cornmeal",
      "1 Cup Flour",
      "1 Egg",
      "1 Cup Milk",
      "Honey",
      "Wooden Skewers",
    ],
    [
      "Insert skewers into the hotdogs and pat them dry.",
      "Mix cornmeal, flour, egg, milk, and honey to make a thick, smooth batter.",
      "Pour the batter into a tall glass and dip each hotdog until fully coated.",
      "Deep fry in hot oil, rotating constantly, until the batter is golden brown.",
      "Serve with mustard and ketchup.",
    ],
    false, // isGlutenFree
    false, // isVegan
    false, // isVegetarian
    false, // isLactoseFree
  ),

  new Meal(
    "m128",
    ["c20"], // Vegetarian
    "Cauliflower Buffalo Wings",
    "affordable",
    "simple",
    "https://images.unsplash.com/photo-1623653387945-2fd25214f8fc?q=80&w=500&auto=format&fit=crop",
    35,
    [
      "1 Head of Cauliflower",
      "1/2 Cup Flour",
      "Buffalo Sauce",
      "Garlic Powder",
      "Butter (Melted)",
      "Ranch Dressing (Side)",
    ],
    [
      "Cut cauliflower into florets and coat them in a simple flour and water batter.",
      "Bake the florets at 220°C for 20 minutes until they start to crisp.",
      "Toss the baked cauliflower in a mixture of buffalo sauce and melted butter.",
      "Bake for another 10 minutes to set the sauce.",
      "Serve hot with celery sticks and ranch dressing.",
    ],
    false, // isGlutenFree
    false, // isVegan
    true, // isVegetarian
    false, // isLactoseFree
  ),

  new Meal(
    "m129",
    ["c19"], // Street Food
    "German Currywurst",
    "affordable",
    "simple",
    "https://i.pinimg.com/1200x/1b/9c/4c/1b9c4c12a24d09f9f9972ea0f66ba264.jpg",
    20,
    [
      "2 Bratwurst Sausages",
      "Ketchup",
      "Curry Powder",
      "Onion Powder",
      "French Fries (Side)",
    ],
    [
      "Grill or pan-fry the bratwurst until fully cooked and browned.",
      "Slice the sausage into bite-sized pieces.",
      "Prepare the sauce by mixing ketchup with a dash of curry powder and spices.",
      "Pour the sauce generously over the sausage slices.",
      "Dust with more curry powder and serve with a side of hot fries.",
    ],
    true, // isGlutenFree
    false, // isVegan
    false, // isVegetarian
    true, // isLactoseFree
  ),

  new Meal(
    "m130",
    ["c20"], // Vegetarian
    "Greek Spanakopita",
    "pricey",
    "hard",
    "https://i.pinimg.com/1200x/c9/61/e0/c961e0df0f142fba092294e684b5f5fa.jpg",
    60,
    [
      "Phyllo Pastry Sheets",
      "500g Spinach",
      "300g Feta Cheese",
      "Fresh Dill",
      "Onions",
      "Melted Butter",
    ],
    [
      "Sauté onions and spinach, let cool, and mix with crumbled feta and chopped dill.",
      "Layer several sheets of phyllo dough in a pan, brushing each with melted butter.",
      "Spread the spinach-feta mixture over the dough.",
      "Top with more buttered phyllo sheets.",
      "Score the top layer into squares and bake at 180°C until the pastry is flaky and golden brown.",
    ],
    false, // isGlutenFree
    false, // isVegan
    true, // isVegetarian
    false, // isLactoseFree
  ),
  new Meal(
    "m131",
    ["c1"], // Italian
    "Penne Arrabbiata",
    "affordable",
    "simple",
    "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=500&auto=format&fit=crop",
    20,
    [
      "300g Penne Pasta",
      "2 cloves Garlic",
      "Dried Red Chili Flakes",
      "400g Canned Tomatoes",
      "Fresh Parsley",
    ],
    [
      "Sauté garlic and chili flakes in olive oil until fragrant.",
      "Add tomatoes and simmer for 10 minutes to thicken the sauce.",
      "Boil pasta until al dente, then toss directly into the spicy sauce.",
      "Garnish with fresh parsley and serve hot.",
    ],
    true, // isGlutenFree (If using GF pasta)
    true, // isVegan
    true, // isVegetarian
    true, // isLactoseFree
  ),
  new Meal(
    "m117",
    ["c1"], // Italian
    "Cacio e Pepe",
    "affordable",
    "challenging",
    "https://images.unsplash.com/photo-1663153465971-7fbb838043ca?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    15,
    ["Spaghetti", "Pecorino Romano Cheese", "Black Peppercorns", "Salt"],
    [
      "Toast crushed black peppercorns in a pan until fragrant.",
      "Boil spaghetti in a small amount of water (to keep it starchy).",
      "Mix finely grated Pecorino with a little pasta water to create a paste.",
      "Toss the pasta in the pepper pan, remove from heat, and quickly stir in the cheese paste until creamy.",
      "Serve immediately on warm plates.",
    ],
    false, // isGlutenFree
    false, // isVegan
    true, // isVegetarian
    false, // isLactoseFree
  ),

  new Meal(
    "m132",
    ["c2"], // Quick & Easy
    "Avocado Toast with Poached Egg",
    "affordable",
    "simple",
    "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=500&auto=format&fit=crop",
    15,
    [
      "2 Slices of Sourdough",
      "1 Ripe Avocado",
      "2 Eggs",
      "Lemon Juice",
      "Chili Flakes",
    ],
    [
      "Toast the bread until golden and crunchy.",
      "Mash avocado with lemon juice, salt, and pepper; spread on toast.",
      "Poach eggs in simmering water for 3 minutes until whites are set but yolks are runny.",
      "Place eggs on top and sprinkle with chili flakes.",
    ],
    false, // isGlutenFree
    false, // isVegan
    true, // isVegetarian
    true, // isLactoseFree
  ),

  new Meal(
    "m134",
    ["c4"], // German
    "Schnitzel Wiener Art",
    "pricey",
    "challenging",
    "https://i.pinimg.com/400x/50/e9/1f/50e91fa3b496086f32ca06ee5065a66e.jpg",
    35,
    ["Veal or Pork Cutlets", "Flour", "2 Eggs", "Breadcrumbs", "Lemon Wedges"],
    [
      "Pound the cutlets until very thin.",
      "Dredge in flour, dip in beaten eggs, and coat with breadcrumbs.",
      "Fry in a generous amount of butter or oil until golden and wavy.",
      "Serve with lemon wedges and a side of potato salad.",
    ],
    false, // isGlutenFree
    false, // isVegan
    false, // isVegetarian
    false, // isLactoseFree
  ),

  new Meal(
    "m136",
    ["c6"], // Exotic
    "Thai Green Curry",
    "pricey",
    "hard",
    "https://i.pinimg.com/1200x/9f/36/2c/9f362c73113c37c088849e23234b87aa.jpg",
    45,
    [
      "Chicken or Tofu",
      "Green Curry Paste",
      "Coconut Milk",
      "Bamboo Shoots",
      "Thai Basil",
    ],
    [
      "Fry curry paste in coconut cream until fragrant.",
      "Add protein and cook through.",
      "Pour in remaining coconut milk and add bamboo shoots.",
      "Simmer for 10 minutes and stir in fresh Thai basil at the end.",
    ],
    true, // isGlutenFree
    false, // isVegan (If using fish sauce)
    false, // isVegetarian
    true, // isLactoseFree
  ),

  new Meal(
    "m139",
    ["c9"], // French
    "Coq au Vin",
    "luxurious",
    "hard",
    "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=500&auto=format&fit=crop",
    120,
    [
      "Chicken Thighs",
      "Red Wine (Burgundy)",
      "Pearl Onions",
      "Mushrooms",
      "Bacon",
    ],
    [
      "Brown the chicken and bacon in a large pot.",
      "Add mushrooms and onions, then pour in the wine.",
      "Slow-cook for 1.5 hours until the chicken is tender and the sauce is dark and rich.",
      "Serve with mashed potatoes or crusty bread.",
    ],
    true, // isGlutenFree (If no flour used)
    false, // isVegan
    false, // isVegetarian
    true, // isLactoseFree
  ),

  new Meal(
    "m140",
    ["c10"], // Desserts
    "Baklava",
    "pricey",
    "hard",
    "https://i.pinimg.com/736x/62/4f/bb/624fbb4dc47ab008aa3f7d0342c9da28.jpg",
    90,
    [
      "Phyllo Dough",
      "Crushed Walnuts/Pistachios",
      "Butter",
      "Honey Syrup",
      "Cinnamon",
    ],
    [
      "Layer sheets of phyllo dough, brushing each with melted butter.",
      "Spread a thick layer of crushed nuts and cinnamon in the middle.",
      "Continue layering dough, then cut into diamond shapes.",
      "Bake until golden and pour cold honey syrup over the hot pastry.",
    ],
    false, // isGlutenFree
    false, // isVegan
    true, // isVegetarian
    false, // isLactoseFree
  ),

  new Meal(
    "m142",
    ["c12"], // Mexican
    "Quesadillas",
    "affordable",
    "simple",
    "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?q=80&w=500&auto=format&fit=crop",
    15,
    [
      "Flour Tortillas",
      "Monterey Jack Cheese",
      "Grilled Chicken",
      "Salsa",
      "Guacamole",
    ],
    [
      "Place cheese and chicken on half of a tortilla.",
      "Fold over and grill in a pan until cheese is melted and tortilla is crispy.",
      "Cut into wedges and serve with salsa and guacamole.",
    ],
    false, // isGlutenFree
    false, // isVegan
    false, // isVegetarian
    false, // isLactoseFree
  ),

  new Meal(
    "m143",
    ["c13"], // Indian
    "Dal Makhani",
    "affordable",
    "hard",
    "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=500&auto=format&fit=crop",
    120,
    ["Black Lentils", "Kidney Beans", "Butter", "Cream", "Ginger-Garlic Paste"],
    [
      "Slow-cook lentils and beans overnight or for several hours.",
      "Sauté spices and tomato puree, then add the cooked lentils.",
      "Simmer for a long time, adding butter and cream at the end for a velvety texture.",
      "Serve with garlic naan.",
    ],
    true, // isGlutenFree
    false, // isVegan
    true, // isVegetarian
    false, // isLactoseFree
  ),

  new Meal(
    "m144",
    ["c14"], // Seafood
    "Lobster Roll",
    "luxurious",
    "challenging",
    "https://i.pinimg.com/1200x/9f/e2/d1/9fe2d12c32dbaac266939fc5b231ead5.jpg",
    30,
    [
      "Fresh Lobster Meat",
      "Butter",
      "Brioche Hotdog Bun",
      "Lemon Juice",
      "Chives",
    ],
    [
      "Poach lobster meat in melted butter until just tender.",
      "Toast the brioche bun with butter.",
      "Fill the bun with lobster and drizzle with lemon juice.",
      "Top with fresh chives and serve with chips.",
    ],
    false, // isGlutenFree
    false, // isVegan
    false, // isVegetarian
    false, // isLactoseFree
  ),

  new Meal(
    "m145",
    ["c15"], // Vegan
    "Vegan Chickpea Curry",
    "affordable",
    "simple",
    "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=500&auto=format&fit=crop",
    25,
    [
      "2 cans Chickpeas",
      "Coconut Milk",
      "Spinach",
      "Turmeric & Ginger",
      "Rice",
    ],
    [
      "Sauté ginger and onions, add spices and chickpeas.",
      "Pour in coconut milk and simmer for 15 minutes.",
      "Stir in fresh spinach at the last minute until wilted.",
      "Serve over a bed of fluffy basmati rice.",
    ],
    true, // isGlutenFree
    true, // isVegan
    true, // isVegetarian
    true, // isLactoseFree
  ),

  new Meal(
    "m148",
    ["c18"], // World Classics
    "Beef Stroganoff",
    "luxurious",
    "challenging",
    "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=500&auto=format&fit=crop",
    40,
    ["Beef Sirloin", "Mushrooms", "Sour Cream", "Beef Broth", "Egg Noodles"],
    [
      "Sear beef strips quickly and set aside.",
      "Sauté mushrooms and onions, add broth and simmer.",
      "Stir in sour cream to create a rich sauce and return the beef.",
      "Serve over a bed of buttery egg noodles.",
    ],
    false, // isGlutenFree
    false, // isVegan
    false, // isVegetarian
    false, // isLactoseFree
  ),

  new Meal(
    "m149",
    ["c19"], // Street Food
    "Churros with Chocolate Sauce",
    "affordable",
    "simple",
    "https://i.pinimg.com/736x/6d/31/af/6d31af7cafd0ed1ac9769f54817175cd.jpg",
    30,
    ["Flour", "Butter", "Cinnamon Sugar", "Dark Chocolate", "Heavy Cream"],
    [
      "Make a choux pastry dough and pipe long strips into hot oil.",
      "Fry until golden and immediately roll in cinnamon sugar.",
      "Melt chocolate with cream to make a dipping sauce.",
      "Serve warm and crispy.",
    ],
    false, // isGlutenFree
    false, // isVegan
    true, // isVegetarian
    false, // isLactoseFree
  ),

  new Meal(
    "m150",
    ["c20"], // Vegetarian
    "Butternut Squash Ravioli",
    "pricey",
    "hard",
    "https://i.pinimg.com/1200x/28/48/f0/2848f0d5a465d63ee8961060054d0cd9.jpg",
    60,
    [
      "Butternut Squash",
      "Fresh Pasta Sheets",
      "Sage",
      "Brown Butter",
      "Amaretti Cookies",
    ],
    [
      "Roast squash, mash it, and mix with amaretti crumbs for sweetness.",
      "Fill pasta sheets with the squash mixture and seal into ravioli.",
      "Boil until they float.",
      "Toss in a pan with foaming brown butter and fresh sage leaves until crispy.",
    ],
    false, // isGlutenFree
    false, // isVegan
    true, // isVegetarian
    false, // isLactoseFree
  ),
];
