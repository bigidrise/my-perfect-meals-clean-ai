
// client/src/data/toddlersMealsData.ts
// Data shape mirrors KidsMeals so the existing scaling UI works.
// Textures and prep steps are toddler-safe (1–3). Always supervise.

export type ToddlersMeal = {
  id: string;
  name: string;
  description: string;
  baseServings: number; // how the ingredient list was authored
  image?: string;
  healthBadges?: string[];
  ingredients: { item: string; quantity: number; unit: string }[];
  instructions?: string[];
  funFact?: string;
};

export const toddlersMeals: ToddlersMeal[] = [
  {
    id: "t1-mini-turkey-meatballs-peas",
    name: "Mini Turkey Meatballs with Sweet Peas",
    description: "Soft, tiny meatballs made with ground turkey, finely chopped veggies, and sweet peas on the side. Perfect finger food for developing pincer grasp.",
    baseServings: 2,
    image: "/images/toddlers/t1-mini-turkey-meatballs-peas.jpg",
    healthBadges: ["High Protein", "Iron-Rich", "Toddler-Safe"],
    ingredients: [
      { item: "ground turkey (93%)", quantity: 6, unit: "oz" },
      { item: "fine breadcrumbs", quantity: 0.25, unit: "cup" },
      { item: "egg, beaten", quantity: 0.5, unit: "each" },
      { item: "steamed peas", quantity: 0.5, unit: "cup" }
    ],
    instructions: [
      "Mix turkey, crumbs, and egg; form 1-inch meatballs.",
      "Bake at 375°F ~12–14 min until cooked through (165°F).",
      "Cool; serve halved/quartered with tender peas."
    ],
  },
  {
    id: "t2-sweet-potato-mash-chicken-bites",
    name: "Sweet Potato Mash with Chicken Bites",
    description: "Smooth, naturally sweet mashed sweet potato with tender, bite-sized pieces of chicken breast.",
    baseServings: 2,
    image: "/images/toddlers/t2-sweet-potato-mash-chicken-bites.jpg",
    healthBadges: ["Vitamin A", "Soft Texture"],
    ingredients: [
      { item: "cooked chicken breast, finely diced", quantity: 3, unit: "oz" },
      { item: "sweet potato, cooked & mashed", quantity: 1, unit: "cup" }
    ],
    instructions: [
      "Mash sweet potato; fold in chicken.",
      "Cool slightly; serve in ≤ 1/2-inch pieces."
    ],
  },
  {
    id: "t3-scrambled-egg-avocado-fingers",
    name: "Scrambled Egg & Avocado Fingers",
    description: "Soft scrambled egg with avocado strips.",
    baseServings: 2,
    image: "/images/toddlers/t3-scrambled-egg-avocado-fingers.jpg",
    healthBadges: ["Protein", "Healthy Fats"],
    ingredients: [
      { item: "eggs", quantity: 2, unit: "each" },
      { item: "avocado, ripe", quantity: 0.5, unit: "each" }
    ],
    instructions: [
      "Soft-scramble eggs on low heat.",
      "Slice avocado into thin strips; serve together."
    ],
  },
  {
    id: "t4-greek-yogurt-berries-oats",
    name: "Greek Yogurt, Berries & Oats",
    description: "Full-fat yogurt with soft berries and quick oats.",
    baseServings: 2,
    image: "/images/toddlers/t4-greek-yogurt-berries-oats.jpg",
    healthBadges: ["Calcium", "No Added Sugar"],
    ingredients: [
      { item: "full-fat Greek yogurt", quantity: 0.75, unit: "cup" },
      { item: "very soft berries, chopped", quantity: 0.5, unit: "cup" },
      { item: "quick oats", quantity: 2, unit: "tbsp" }
    ],
  },
  {
    id: "t5-banana-oat-mini-pancakes",
    name: "Banana Oat Mini Pancakes",
    description: "Soft 2-ingredient style minis.",
    baseServings: 2,
    image: "/images/toddlers/t5-banana-oat-mini-pancakes.jpg",
    healthBadges: ["No Added Sugar", "Soft Texture"],
    ingredients: [
      { item: "ripe banana, mashed", quantity: 1, unit: "each" },
      { item: "egg", quantity: 1, unit: "each" },
      { item: "quick oats (optional)", quantity: 2, unit: "tbsp" }
    ],
    instructions: [
      "Mix banana + egg (+ oats).",
      "Cook 2-inch pancakes on low; cool and cut small."
    ],
  },
  {
    id: "t6-salmon-flakes-soft-rice",
    name: "Salmon Flakes & Soft Rice",
    description: "Flaked cooked salmon over soft rice.",
    baseServings: 2,
    image: "/images/toddlers/t6-salmon-flakes-soft-rice.jpg",
    healthBadges: ["Omega-3", "Protein"],
    ingredients: [
      { item: "cooked salmon, flaked", quantity: 3, unit: "oz" },
      { item: "cooked rice, very soft", quantity: 0.75, unit: "cup" }
    ],
  },
  {
    id: "t7-lentil-pasta-marinara-low-salt",
    name: "Lentil Pasta Marinara (Low-Salt)",
    description: "Soft lentil pasta with mild, low-salt sauce.",
    baseServings: 2,
    image: "/images/toddlers/t7-lentil-pasta-marinara-low-salt.jpg",
    healthBadges: ["Iron", "Fiber", "Hidden Veg Option"],
    ingredients: [
      { item: "lentil pasta, cooked very soft", quantity: 1, unit: "cup" },
      { item: "low-salt marinara", quantity: 0.33, unit: "cup" }
    ],
  },
  {
    id: "t8-cottage-cheese-pear-slices",
    name: "Cottage Cheese & Pear Slices",
    description: "Soft pear with cottage cheese.",
    baseServings: 2,
    image: "/images/toddlers/t8-cottage-cheese-pear-slices.jpg",
    healthBadges: ["Calcium", "Protein"],
    ingredients: [
      { item: "full-fat cottage cheese", quantity: 0.5, unit: "cup" },
      { item: "ripe pear, peeled, thin", quantity: 0.5, unit: "each" }
    ],
  },
  {
    id: "t9-black-bean-sweet-corn-soft-bowl",
    name: "Black Bean & Sweet Corn Soft Bowl",
    description: "Very soft beans with corn and a bit of rice.",
    baseServings: 2,
    image: "/images/toddlers/t9-black-bean-sweet-corn-soft-bowl.jpg",
    healthBadges: ["Fiber", "Plant Protein"],
    ingredients: [
      { item: "black beans, very soft", quantity: 0.5, unit: "cup" },
      { item: "sweet corn, soft", quantity: 0.25, unit: "cup" },
      { item: "soft rice (optional)", quantity: 0.25, unit: "cup" }
    ],
  },
  {
    id: "t10-butternut-squash-mac-hidden-veg",
    name: "Butternut Squash Mac (Hidden Veg)",
    description: "Creamy squash purée folded into soft pasta.",
    baseServings: 2,
    image: "/images/toddlers/t10-butternut-squash-mac-hidden-veg.jpg",
    healthBadges: ["Hidden Veg", "Soft Texture"],
    ingredients: [
      { item: "small pasta shapes, very soft", quantity: 1, unit: "cup" },
      { item: "butternut squash purée", quantity: 0.5, unit: "cup" }
    ],
  },
  {
    id: "t11-chicken-carrot-rice-balls",
    name: "Chicken & Carrot Rice Balls",
    description: "Sticky rice with minced chicken and carrot.",
    baseServings: 2,
    image: "/images/toddlers/t11-chicken-carrot-rice-balls.jpg",
    healthBadges: ["Protein", "Hidden Veg"],
    ingredients: [
      { item: "cooked chicken, minced", quantity: 3, unit: "oz" },
      { item: "carrot, very finely grated", quantity: 0.25, unit: "cup" },
      { item: "sticky rice, warm", quantity: 0.75, unit: "cup" }
    ],
    instructions: [
      "Mix warm rice with chicken and carrot.",
      "Form tiny balls; cool; serve small pieces."
    ],
  },
  {
    id: "t12-hummus-soft-pita-strips",
    name: "Hummus & Soft Pita Strips",
    description: "Spreadable hummus with soft pita.",
    baseServings: 2,
    image: "/images/toddlers/t12-hummus-soft-pita-strips.jpg",
    healthBadges: ["Fiber", "Plant Protein"],
    ingredients: [
      { item: "plain hummus", quantity: 0.33, unit: "cup" },
      { item: "soft pita, cut thin", quantity: 0.5, unit: "each" }
    ],
  },
  {
    id: "t13-blueberry-chia-pudding",
    name: "Blueberry Chia Pudding",
    description: "Thick yogurt with blueberries + chia.",
    baseServings: 2,
    image: "/images/toddlers/t13-blueberry-chia-pudding.jpg",
    healthBadges: ["No Added Sugar", "Fiber"],
    ingredients: [
      { item: "full-fat yogurt", quantity: 0.75, unit: "cup" },
      { item: "blueberries, very soft", quantity: 0.33, unit: "cup" },
      { item: "chia seeds (soaked 10 min)", quantity: 1, unit: "tsp" }
    ],
  },
  {
    id: "t14-soft-broccoli-trees-cheddar",
    name: "Soft Broccoli Trees & Cheddar",
    description: "Steamed broccoli pieces with mild cheese.",
    baseServings: 2,
    image: "/images/toddlers/t14-soft-broccoli-trees-cheddar.jpg",
    healthBadges: ["Calcium", "Veggies"],
    ingredients: [
      { item: "broccoli florets, steamed very soft", quantity: 0.75, unit: "cup" },
      { item: "mild cheddar, finely grated", quantity: 2, unit: "tbsp" }
    ],
  },
  {
    id: "t15-turkey-spinach-quesadilla-soft",
    name: "Turkey & Spinach Quesadilla (soft)",
    description: "Mild turkey + spinach in soft tortilla.",
    baseServings: 2,
    image: "/images/toddlers/t15-turkey-spinach-quesadilla-soft.jpg",
    healthBadges: ["Hidden Veg", "Iron"],
    ingredients: [
      { item: "soft flour tortilla", quantity: 1, unit: "each" },
      { item: "cooked turkey, minced", quantity: 2, unit: "oz" },
      { item: "spinach, finely chopped", quantity: 0.25, unit: "cup" },
      { item: "mild cheese, shredded", quantity: 2, unit: "tbsp" }
    ],
  },
  {
    id: "t16-applesauce-oat-energy-bites",
    name: "Applesauce & Oat Energy Bites",
    description: "No-bake, no-sugar toddler bites.",
    baseServings: 2,
    image: "/images/toddlers/t16-applesauce-oat-energy-bites.jpg",
    healthBadges: ["No Added Sugar", "Soft Texture"],
    ingredients: [
      { item: "unsweetened applesauce", quantity: 0.5, unit: "cup" },
      { item: "quick oats", quantity: 0.5, unit: "cup" }
    ],
    instructions: [
      "Stir oats into applesauce; rest 5–10 min to soften.",
      "Form small spoonfuls; serve soft."
    ],
  },
  {
    id: "t17-quinoa-peas-tiny-tofu-cubes",
    name: "Quinoa, Peas & Tiny Tofu Cubes",
    description: "Very soft quinoa with peas and tofu.",
    baseServings: 2,
    image: "/images/toddlers/t17-quinoa-peas-tiny-tofu-cubes.jpg",
    healthBadges: ["Plant Protein", "Iron"],
    ingredients: [
      { item: "cooked quinoa, very soft", quantity: 0.75, unit: "cup" },
      { item: "silken/soft tofu, tiny cubes", quantity: 0.5, unit: "cup" },
      { item: "peas, steamed", quantity: 0.25, unit: "cup" }
    ],
  },
  {
    id: "t18-mashed-cauliflower-ground-beef",
    name: "Mashed Cauliflower & Ground Beef",
    description: "Cauli mash with finely crumbled beef.",
    baseServings: 2,
    image: "/images/toddlers/t18-mashed-cauliflower-ground-beef.jpg",
    healthBadges: ["Hidden Veg", "Iron"],
    ingredients: [
      { item: "cauliflower florets, steamed & mashed", quantity: 1, unit: "cup" },
      { item: "lean ground beef, cooked & crumbled", quantity: 3, unit: "oz" }
    ],
  },
  {
    id: "t19-pumpkin-yogurt-swirl",
    name: "Pumpkin Yogurt Swirl",
    description: "Pumpkin purée folded into full-fat yogurt.",
    baseServings: 2,
    image: "/images/toddlers/t19-pumpkin-yogurt-swirl.jpg",
    healthBadges: ["Vitamin A", "Calcium", "No Added Sugar"],
    ingredients: [
      { item: "full-fat yogurt", quantity: 0.75, unit: "cup" },
      { item: "pumpkin purée", quantity: 0.33, unit: "cup" }
    ],
  },
  {
    id: "t20-avocado-chickpea-smash",
    name: "Avocado Chickpea Smash",
    description: "Soft smashable dip/spread.",
    baseServings: 2,
    image: "/images/toddlers/t20-avocado-chickpea-smash.jpg",
    healthBadges: ["Fiber", "Healthy Fats", "Plant Protein"],
    ingredients: [
      { item: "ripe avocado", quantity: 0.5, unit: "each" },
      { item: "chickpeas, very soft", quantity: 0.33, unit: "cup" }
    ],
  },
];
