// 20 PRE-DESIGNED KIDS MEALS for Kids Meals Hub
// Healthy, kid-friendly meals with fun presentation and balanced nutrition

export type KidsMeal = {
  id: string;
  slug: string;
  name: string;
  description: string;
  baseServings: number;
  healthBadges: string[];
  ingredients: { item: string; quantity: number; unit: string }[];
  instructions: string[];
  funFact?: string;
  image?: string;
};

export const kidsMeals: KidsMeal[] = [
  {
    id: "mini-chicken-quesadillas",
    slug: "mini-chicken-quesadillas",
    name: "Mini Chicken Quesadillas",
    description: "Bite-sized quesadillas with tender chicken and cheese.",
    baseServings: 2,
    healthBadges: ["High Protein", "Kid Favorite"],
    ingredients: [
      { item: "Small flour tortillas", quantity: 4, unit: "pieces" },
      { item: "Cooked chicken, shredded", quantity: 150, unit: "g" },
      { item: "Mild cheddar cheese, shredded", quantity: 100, unit: "g" },
      { item: "Bell peppers, diced fine", quantity: 0.25, unit: "cup" }
    ],
    instructions: [
      "Fill tortillas with chicken, cheese, and peppers.",
      "Cook in skillet 2-3 min per side until golden.",
      "Cut into triangles and serve with mild salsa."
    ],
    funFact: "Quesadillas means 'little cheeses' in Spanish!",
    image: "/images/kids-meals/mini-chicken-quesadillas.jpg" 
  },
  {
    id: "rainbow-veggie-pasta",
    slug: "rainbow-veggie-pasta",
    name: "Rainbow Veggie Pasta",
    description: "Colorful pasta with hidden vegetables in a creamy sauce.",
    baseServings: 4,
    healthBadges: ["Vegetarian", "Hidden Veggies"],
    ingredients: [
      { item: "Whole wheat pasta", quantity: 300, unit: "g" },
      { item: "Carrots, finely diced", quantity: 1, unit: "cup" },
      { item: "Yellow bell pepper, diced", quantity: 0.5, unit: "cup" },
      { item: "Zucchini, diced", quantity: 0.5, unit: "cup" },
      { item: "Cream cheese", quantity: 100, unit: "g" },
      { item: "Milk", quantity: 0.5, unit: "cup" }
    ],
    instructions: [
      "Cook pasta according to package directions.",
      "Sauté vegetables until tender, about 5 minutes.",
      "Mix cream cheese and milk for sauce; toss everything together."
    ],
    funFact: "Eating a rainbow of colors gives your body different vitamins!",
    image: "/images/kids-meals/rainbow-veggie-pasta.jpg"
  },
  {
    id: "turkey-apple-roll-ups",
    slug: "turkey-apple-roll-ups",
    name: "Turkey & Apple Roll-Ups",
    description: "Fun tortilla spirals with turkey, cream cheese, and crisp apples.",
    baseServings: 2,
    healthBadges: ["High Protein", "No Cook"],
    ingredients: [
      { item: "Large flour tortillas", quantity: 2, unit: "pieces" },
      { item: "Cream cheese, softened", quantity: 4, unit: "tbsp" },
      { item: "Sliced turkey", quantity: 100, unit: "g" },
      { item: "Apple, thinly sliced", quantity: 1, unit: "small" },
      { item: "Lettuce leaves", quantity: 4, unit: "pieces" }
    ],
    instructions: [
      "Spread cream cheese on tortillas.",
      "Layer turkey, apple slices, and lettuce.",
      "Roll tightly and slice into pinwheels."
    ],
    funFact: "Apples help keep your teeth clean and strong!",
    image: "/images/kids-meals/turkey-apple-roll-ups.jpg"
  },
  {
    id: "cheesy-broccoli-bites",
    slug: "cheesy-broccoli-bites",
    name: "Cheesy Broccoli Bites",
    description: "Crispy baked bites that make broccoli fun to eat.",
    baseServings: 3,
    healthBadges: ["Vegetarian", "Hidden Veggies"],
    ingredients: [
      { item: "Broccoli florets, steamed", quantity: 2, unit: "cups" },
      { item: "Cheddar cheese, shredded", quantity: 1, unit: "cup" },
      { item: "Breadcrumbs", quantity: 0.5, unit: "cup" },
      { item: "Eggs", quantity: 2, unit: "large" },
      { item: "Garlic powder", quantity: 0.5, unit: "tsp" }
    ],
    instructions: [
      "Chop steamed broccoli finely.",
      "Mix with cheese, breadcrumbs, eggs, and garlic powder.",
      "Form into small balls and bake at 375°F (190°C) for 20 minutes."
    ],
    funFact: "Broccoli looks like tiny trees and makes you grow strong!",
    image: "/images/kids-meals/cheesy-broccoli-bites.jpg"
  },
  {
    id: "banana-pancake-bites",
    slug: "banana-pancake-bites",
    name: "Banana Pancake Bites",
    description: "Mini pancakes with mashed banana baked right in.",
    baseServings: 2,
    healthBadges: ["Vegetarian", "Naturally Sweet"],
    ingredients: [
      { item: "Ripe bananas, mashed", quantity: 2, unit: "medium" },
      { item: "Eggs", quantity: 2, unit: "large" },
      { item: "Flour", quantity: 0.5, unit: "cup" },
      { item: "Baking powder", quantity: 1, unit: "tsp" },
      { item: "Vanilla extract", quantity: 0.5, unit: "tsp" }
    ],
    instructions: [
      "Mix all ingredients until smooth.",
      "Pour into mini muffin tins.",
      "Bake at 350°F (175°C) for 12-15 minutes."
    ],
    funFact: "Bananas give you energy to run and play!",
    image: "/images/kids-meals/banana-pancake-bites.jpg"
  },
  {
    id: "chicken-veggie-meatballs",
    slug: "chicken-veggie-meatballs",
    name: "Chicken & Veggie Meatballs",
    description: "Tender meatballs with hidden vegetables and mild flavors.",
    baseServings: 4,
    healthBadges: ["High Protein", "Hidden Veggies"],
    ingredients: [
      { item: "Ground chicken", quantity: 500, unit: "g" },
      { item: "Carrots, finely grated", quantity: 0.5, unit: "cup" },
      { item: "Zucchini, finely grated", quantity: 0.5, unit: "cup" },
      { item: "Breadcrumbs", quantity: 0.5, unit: "cup" },
      { item: "Egg", quantity: 1, unit: "large" }
    ],
    instructions: [
      "Mix all ingredients gently.",
      "Form into small balls.",
      "Bake at 400°F (200°C) for 18-20 minutes."
    ],
    funFact: "These meatballs have vegetables hiding inside like a treasure!",
    image: "/images/kids-meals/chicken-veggie-meatballs.jpg"
  },
  {
    id: "sweet-potato-fries",
    slug: "sweet-potato-fries",
    name: "Crispy Sweet Potato Fries",
    description: "Naturally sweet fries that are baked, not fried.",
    baseServings: 3,
    healthBadges: ["Vegetarian", "Naturally Sweet"],
    ingredients: [
      { item: "Sweet potatoes", quantity: 2, unit: "large" },
      { item: "Olive oil", quantity: 2, unit: "tbsp" },
      { item: "Paprika", quantity: 0.5, unit: "tsp" },
      { item: "Salt", quantity: 0.25, unit: "tsp" }
    ],
    instructions: [
      "Cut sweet potatoes into fry shapes.",
      "Toss with oil and seasonings.",
      "Bake at 425°F (220°C) for 25-30 minutes, flipping once."
    ],
    funFact: "Sweet potatoes are orange because they're full of vitamin A for your eyes!",
    image: "/images/kids-meals/sweet-potato-fries.jpg"
  },
  {
    id: "mini-pizza-bagels",
    slug: "mini-pizza-bagels",
    name: "Mini Pizza Bagels",
    description: "Individual pizza bagels that kids can customize.",
    baseServings: 2,
    healthBadges: ["Vegetarian", "Customizable"],
    ingredients: [
      { item: "Mini bagels, halved", quantity: 4, unit: "pieces" },
      { item: "Pizza sauce", quantity: 0.5, unit: "cup" },
      { item: "Mozzarella cheese, shredded", quantity: 1, unit: "cup" },
      { item: "Mini pepperoni (optional)", quantity: 0.25, unit: "cup" }
    ],
    instructions: [
      "Spread sauce on bagel halves.",
      "Sprinkle with cheese and toppings.",
      "Bake at 400°F (200°C) for 8-10 minutes."
    ],
    funFact: "Pizza was invented in Italy and means 'pie'!",
    image: "/images/kids-meals/mini-pizza-bagels.jpg"
  },
  {
    id: "fruit-yogurt-parfait",
    slug: "fruit-yogurt-parfait",
    name: "Fruit & Yogurt Parfait",
    description: "Layered goodness with yogurt, fruit, and granola.",
    baseServings: 2,
    healthBadges: ["Vegetarian", "No Cook", "Probiotic"],
    ingredients: [
      { item: "Greek yogurt, vanilla", quantity: 1, unit: "cup" },
      { item: "Mixed berries", quantity: 1, unit: "cup" },
      { item: "Granola", quantity: 0.5, unit: "cup" },
      { item: "Honey", quantity: 1, unit: "tbsp" }
    ],
    instructions: [
      "Layer yogurt, berries, and granola in cups.",
      "Repeat layers.",
      "Drizzle with honey on top."
    ],
    funFact: "Yogurt has good bacteria that help your tummy feel happy!",
    image: "/images/kids-meals/fruit-yogurt-parfait.jpg"
  },
  {
    id: "chicken-nugget-wraps",
    slug: "chicken-nugget-wraps",
    name: "Chicken Nugget Wraps",
    description: "Soft wraps filled with crispy chicken nuggets and veggies.",
    baseServings: 2,
    healthBadges: ["High Protein", "Kid Favorite"],
    ingredients: [
      { item: "Soft flour tortillas", quantity: 2, unit: "large" },
      { item: "Chicken nuggets, cooked", quantity: 8, unit: "pieces" },
      { item: "Lettuce, shredded", quantity: 1, unit: "cup" },
      { item: "Mild ranch dressing", quantity: 2, unit: "tbsp" }
    ],
    instructions: [
      "Warm tortillas slightly.",
      "Place nuggets, lettuce, and dressing in center.",
      "Roll up tightly and cut in half."
    ],
    funFact: "Wraps are like edible blankets for your food!",
    image: "/images/kids-meals/chicken-nugget-wraps.jpg"
  },
  {
    id: "veggie-mac-cheese",
    slug: "veggie-mac-cheese",
    name: "Hidden Veggie Mac & Cheese",
    description: "Classic mac and cheese with pureed vegetables mixed in.",
    baseServings: 4,
    healthBadges: ["Vegetarian", "Hidden Veggies"],
    ingredients: [
      { item: "Macaroni pasta", quantity: 300, unit: "g" },
      { item: "Cheddar cheese, shredded", quantity: 2, unit: "cups" },
      { item: "Milk", quantity: 1, unit: "cup" },
      { item: "Butternut squash puree", quantity: 0.5, unit: "cup" },
      { item: "Butter", quantity: 2, unit: "tbsp" }
    ],
    instructions: [
      "Cook pasta according to package directions.",
      "Make cheese sauce with milk, cheese, and butter.",
      "Stir in squash puree until smooth and creamy."
    ],
    funFact: "The orange vegetables make the cheese even more orange!",
    image: "/images/kids-meals/veggie-mac-cheese.jpg"
  },
  {
    id: "turkey-cheese-roll",
    slug: "turkey-cheese-roll",
    name: "Turkey & Cheese Roll",
    description: "Simple roll-ups that are perfect for little hands.",
    baseServings: 1,
    healthBadges: ["High Protein", "No Cook"],
    ingredients: [
      { item: "Sliced turkey", quantity: 3, unit: "slices" },
      { item: "Cheese slices", quantity: 2, unit: "pieces" },
      { item: "Cucumber sticks", quantity: 4, unit: "pieces" }
    ],
    instructions: [
      "Lay turkey slices flat.",
      "Place cheese and cucumber on top.",
      "Roll up tightly and secure with toothpick if needed."
    ],
    funFact: "Rolling food makes it fun to eat and easy to hold!",
    image: "/images/kids-meals/turkey-cheese-roll.jpg"
  },
  {
    id: "mini-meatball-sliders",
    slug: "mini-meatball-sliders",
    name: "Mini Meatball Sliders",
    description: "Tiny burgers with meatballs instead of patties.",
    baseServings: 3,
    healthBadges: ["High Protein", "Kid Favorite"],
    ingredients: [
      { item: "Mini burger buns", quantity: 6, unit: "pieces" },
      { item: "Cooked meatballs", quantity: 6, unit: "small" },
      { item: "Marinara sauce", quantity: 0.25, unit: "cup" },
      { item: "Mozzarella cheese, sliced", quantity: 6, unit: "pieces" }
    ],
    instructions: [
      "Warm meatballs in sauce.",
      "Place meatball on bun bottom.",
      "Top with cheese and bun top."
    ],
    funFact: "Sliders got their name because they slide down easy!",
    image: "/images/kids-meals/mini-meatball-sliders.jpg"
  },
  {
    id: "apple-cinnamon-oatmeal",
    slug: "apple-cinnamon-oatmeal",
    name: "Apple Cinnamon Oatmeal",
    description: "Warm, comforting oatmeal with sweet apple pieces.",
    baseServings: 2,
    healthBadges: ["Vegetarian", "Fiber Rich"],
    ingredients: [
      { item: "Rolled oats", quantity: 1, unit: "cup" },
      { item: "Milk", quantity: 2, unit: "cups" },
      { item: "Apple, diced", quantity: 1, unit: "medium" },
      { item: "Cinnamon", quantity: 0.5, unit: "tsp" },
      { item: "Honey", quantity: 1, unit: "tbsp" }
    ],
    instructions: [
      "Cook oats with milk for 5 minutes.",
      "Stir in diced apple and cinnamon.",
      "Sweeten with honey and serve warm."
    ],
    funFact: "Oats give you energy that lasts all morning long!",
    image: "/images/kids-meals/apple-cinnamon-oatmeal.jpg"
  },
  {
    id: "chicken-rice-balls",
    slug: "chicken-rice-balls",
    name: "Chicken Rice Balls",
    description: "Fun finger food with chicken and rice shaped into balls.",
    baseServings: 3,
    healthBadges: ["High Protein", "Gluten-Free"],
    ingredients: [
      { item: "Cooked rice", quantity: 2, unit: "cups" },
      { item: "Cooked chicken, finely shredded", quantity: 1, unit: "cup" },
      { item: "Egg", quantity: 1, unit: "large" },
      { item: "Cheese, grated", quantity: 0.5, unit: "cup" }
    ],
    instructions: [
      "Mix rice, chicken, egg, and cheese.",
      "Form into small balls with damp hands.",
      "Bake at 375°F (190°C) for 15 minutes."
    ],
    funFact: "Rice is eaten by more people around the world than any other food!",
    image: "/images/kids-meals/chicken-rice-balls.jpg"
  },
  {
    id: "strawberry-banana-smoothie-bowl",
    slug: "strawberry-banana-smoothie-bowl",
    name: "Strawberry Banana Smoothie Bowl",
    description: "Thick smoothie you can eat with a spoon and fun toppings.",
    baseServings: 2,
    healthBadges: ["Vegetarian", "Naturally Sweet", "No Cook"],
    ingredients: [
      { item: "Frozen strawberries", quantity: 1, unit: "cup" },
      { item: "Frozen banana", quantity: 1, unit: "medium" },
      { item: "Greek yogurt", quantity: 0.5, unit: "cup" },
      { item: "Granola for topping", quantity: 0.25, unit: "cup" },
      { item: "Fresh berries for topping", quantity: 0.5, unit: "cup" }
    ],
    instructions: [
      "Blend frozen fruit with yogurt until thick.",
      "Pour into bowls.",
      "Top with granola and fresh berries."
    ],
    funFact: "Smoothie bowls are like ice cream but made from fruit!",
    image: "/images/kids-meals/strawberry-banana-smoothie-bowl.jpg"
  },
  {
    id: "cheese-crackers-grapes",
    slug: "cheese-crackers-grapes",
    name: "Cheese, Crackers & Grapes",
    description: "Perfect snack plate with protein, carbs, and fruit.",
    baseServings: 1,
    healthBadges: ["Vegetarian", "No Cook", "Balanced"],
    ingredients: [
      { item: "Whole grain crackers", quantity: 8, unit: "pieces" },
      { item: "Mild cheddar cheese, cubed", quantity: 0.25, unit: "cup" },
      { item: "Red grapes", quantity: 0.5, unit: "cup" }
    ],
    instructions: [
      "Arrange crackers on plate.",
      "Add cheese cubes and grapes.",
      "Let kids build their own bites."
    ],
    funFact: "This snack has all three food groups on one plate!",
    image: "/images/kids-meals/cheese-crackers-grapes.jpg"
  },
  {
    id: "mini-corn-muffins",
    slug: "mini-corn-muffins",
    name: "Mini Corn Muffins",
    description: "Sweet, bite-sized muffins perfect for little hands.",
    baseServings: 4,
    healthBadges: ["Vegetarian", "Kid-Sized"],
    ingredients: [
      { item: "Cornmeal", quantity: 1, unit: "cup" },
      { item: "Flour", quantity: 1, unit: "cup" },
      { item: "Sugar", quantity: 0.25, unit: "cup" },
      { item: "Baking powder", quantity: 1, unit: "tbsp" },
      { item: "Milk", quantity: 1, unit: "cup" },
      { item: "Egg", quantity: 1, unit: "large" },
      { item: "Butter, melted", quantity: 0.25, unit: "cup" }
    ],
    instructions: [
      "Mix dry ingredients in one bowl.",
      "Mix wet ingredients in another bowl.",
      "Combine and bake in mini muffin tins at 400°F (200°C) for 12-15 minutes."
    ],
    funFact: "Corn was first grown by Native Americans thousands of years ago!",
    image: "/images/kids-meals/mini-corn-muffins.jpg"
  },
  {
    id: "peanut-butter-banana-toast",
    slug: "peanut-butter-banana-toast",
    name: "Peanut Butter Banana Toast",
    description: "Classic combination that kids love for breakfast or snack.",
    baseServings: 1,
    healthBadges: ["High Protein", "Naturally Sweet"],
    ingredients: [
      { item: "Whole grain bread", quantity: 2, unit: "slices" },
      { item: "Natural peanut butter", quantity: 2, unit: "tbsp" },
      { item: "Banana, sliced", quantity: 1, unit: "medium" },
      { item: "Honey", quantity: 1, unit: "tsp" }
    ],
    instructions: [
      "Toast bread until golden.",
      "Spread peanut butter on toast.",
      "Arrange banana slices and drizzle with honey."
    ],
    funFact: "Peanuts aren't actually nuts - they grow underground like potatoes!",
    image: "/images/kids-meals/peanut-butter-banana-toast.jpg"
  },
  {
    id: "veggie-fried-rice",
    slug: "veggie-fried-rice",
    name: "Kid-Friendly Veggie Fried Rice",
    description: "Mild fried rice with colorful vegetables and scrambled egg.",
    baseServings: 3,
    healthBadges: ["Vegetarian", "Hidden Veggies"],
    ingredients: [
      { item: "Cooked rice, cooled", quantity: 3, unit: "cups" },
      { item: "Eggs", quantity: 2, unit: "large" },
      { item: "Frozen peas and carrots", quantity: 1, unit: "cup" },
      { item: "Green onions, chopped", quantity: 2, unit: "stalks" },
      { item: "Soy sauce (low sodium)", quantity: 2, unit: "tbsp" },
      { item: "Sesame oil", quantity: 1, unit: "tsp" }
    ],
    instructions: [
      "Scramble eggs and set aside.",
      "Stir-fry vegetables until tender.",
      "Add rice, eggs, and seasonings; stir until heated through."
    ],
    funFact: "Fried rice was invented as a way to use leftover rice!",
    image: "/images/kids-meals/veggie-fried-rice.jpg"
  }
];