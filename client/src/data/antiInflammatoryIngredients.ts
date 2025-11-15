
export const antiInflammatoryProteins: string[] = [
  "Wild-caught salmon",
  "Sardines",
  "Mackerel",
  "Anchovies",
  "Tuna (light)",
  "Trout",
  "Cod",
  "Haddock",
  "Halibut",
  "Sea bass",

  "Skinless chicken breast",
  "Skinless turkey breast",
  "Ground turkey (93%+ lean)",
  "Turkey tenderloin",
  "Chicken thighs (trimmed)",

  "Eggs",
  "Egg whites",
  "Plain Greek yogurt (unsweetened)",
  "Skyr (plain)",
  "Cottage cheese (low sodium)",

  "Organic tofu",
  "Organic tempeh",
  "Edamame",
  "Lentils (red, green, black)",
  "Chickpeas",
  "Black beans",
  "Kidney beans",
  "Navy beans",
  "Cannellini beans",

  "Quinoa (complete protein)",
  "Farro",
  "Amaranth",
  "Hemp seeds",
  "Chia seeds",
  "Pumpkin seeds (pepitas)",
  "Sunflower seeds (unsalted)",

  "Grass-fed beef (96% lean)",
  "Bison (extra lean)",
  "Venison (extra lean)",
  "Pasture-raised egg substitute"
];

export const antiInflammatoryStarchyCarbs: string[] = [
  "Sweet potato",
  "Purple potato",
  "Japanese sweet potato",
  "Butternut squash",
  "Acorn squash",
  "Kabocha squash",
  "Pumpkin",
  
  "Quinoa",
  "Brown rice",
  "Wild rice",
  "Black rice",
  "Farro",
  "Buckwheat",
  "Amaranth",
  "Millet",
  "Steel-cut oats",
  "Rolled oats",
  
  "Lentils (cooked)",
  "Chickpeas (cooked)",
  "Black beans (cooked)",
  "Kidney beans (cooked)"
];

export const antiInflammatoryFibrousCarbs: string[] = [
  "Spinach",
  "Kale",
  "Swiss chard",
  "Collard greens",
  "Arugula",
  "Romaine lettuce",
  "Mixed greens",
  
  "Broccoli",
  "Cauliflower",
  "Brussels sprouts",
  "Cabbage (green, purple)",
  "Bok choy",
  
  "Asparagus",
  "Green beans",
  "Sugar snap peas",
  "Bell peppers (all colors)",
  "Zucchini",
  "Cucumber",
  "Celery",
  "Carrots",
  "Beets",
  "Radishes",
  "Tomatoes",
  "Cherry tomatoes",
  
  "Mushrooms (shiitake, oyster, portobello)",
  "Seaweed (nori, dulse)",
  "Artichoke hearts"
];

export const antiInflammatoryFats: string[] = [
  "Extra virgin olive oil",
  "Avocado oil",
  "Flaxseed oil (cold-pressed)",
  "Walnut oil",
  
  "Avocado",
  "Olives (low sodium)",
  
  "Walnuts",
  "Almonds (raw, unsalted)",
  "Pecans",
  "Pistachios (unsalted)",
  "Brazil nuts",
  "Macadamia nuts",
  
  "Ground flaxseed",
  "Chia seeds",
  "Hemp seeds",
  "Pumpkin seeds (unsalted)",
  "Sunflower seeds (unsalted)",
  
  "Almond butter (unsweetened)",
  "Cashew butter (unsweetened)",
  "Tahini (sesame seed butter)",
  
  "Coconut oil (unrefined)",
  "MCT oil"
];

export const antiInflammatoryFruit: Array<{ name: string; gi: "Low GI" | "Moderate GI" }> = [
  { name: "Blueberries", gi: "Low GI" },
  { name: "Strawberries", gi: "Low GI" },
  { name: "Raspberries", gi: "Low GI" },
  { name: "Blackberries", gi: "Low GI" },
  { name: "Cherries", gi: "Low GI" },
  { name: "Grapefruit", gi: "Low GI" },
  { name: "Apple (with skin)", gi: "Low GI" },
  { name: "Pear", gi: "Low GI" },
  { name: "Plum", gi: "Low GI" },
  { name: "Peach", gi: "Low GI" },
  { name: "Orange", gi: "Low GI" },
  { name: "Kiwi", gi: "Low GI" },
  { name: "Papaya", gi: "Moderate GI" },
  { name: "Pomegranate seeds", gi: "Low GI" },
  { name: "Lemon", gi: "Low GI" },
  { name: "Lime", gi: "Low GI" }
];

export const antiInflammatoryIngredients = {
  Proteins: antiInflammatoryProteins,
  "Starchy Carbs": antiInflammatoryStarchyCarbs,
  "Fibrous Carbs": antiInflammatoryFibrousCarbs,
  Fats: antiInflammatoryFats,
  Fruit: antiInflammatoryFruit
};
