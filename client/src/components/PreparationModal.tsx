import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PreparationModalProps {
  open: boolean;
  ingredientName: string;
  onClose: () => void;
  onSelect: (ingredient: string, style: string) => void;
}

export default function PreparationModal({
  open,
  ingredientName,
  onClose,
  onSelect
}: PreparationModalProps) {

  // 🔥 MASTER LIST OF PREP OPTIONS
  const PREP_OPTIONS: Record<string, string[]> = {
    // Eggs
    "Eggs": ["Scrambled", "Sunny Side Up", "Omelet", "Poached", "Hard Boiled"],
    "Egg Whites": ["Scrambled", "Omelet", "Pan-Seared", "Poached"],
    "Whole Eggs": ["Scrambled", "Sunny Side Up", "Omelet", "Poached", "Hard Boiled"],

    // Steak
    "Steak": ["Rare", "Medium Rare", "Medium", "Medium Well", "Well Done"],
    "Ribeye": ["Rare", "Medium Rare", "Medium", "Medium Well", "Well Done"],
    "Sirloin Steak": ["Rare", "Medium Rare", "Medium", "Medium Well", "Well Done"],
    "Filet Mignon": ["Rare", "Medium Rare", "Medium", "Medium Well", "Well Done"],

    // Potatoes (ALL PLURAL)
    "Potatoes": ["Hash Browns", "Home Style (Diced)", "Roasted Cubes", "Air-Fried", "Mashed", "Baked"],
    "Red Potatoes": ["Roasted Cubes", "Air-Fried", "Boiled"],
    "Sweet Potatoes": ["Baked", "Mashed", "Roasted Cubes", "Air-Fried"],
    "Yams": ["Baked", "Mashed", "Roasted Cubes"],

    // Rice
    "Rice": ["Steamed", "Fried Rice", "Pilaf"],
    "White Rice": ["Steamed", "Fried Rice", "Pilaf"],
    "Brown Rice": ["Steamed", "Fried Rice", "Pilaf"],
    "Jasmine Rice": ["Steamed", "Fried Rice"],
    "Basmati Rice": ["Steamed", "Pilaf"],
    "Wild Rice": ["Steamed", "Pilaf"],

    // Chicken
    "Chicken Breast": [
      "Grilled",
      "Grilled (BBQ)",
      "Grilled (Lemon Pepper)",
      "Teriyaki",
      "Pan-Seared",
      "Air-Fried",
      "Baked"
    ],
    "Chicken Thighs": [
      "Grilled",
      "Baked",
      "Smoked",
      "Teriyaki",
      "Pan-Seared",
      "Air-Fried"
    ],
    "Chicken Sausage": ["Pan-Seared", "Grilled", "Air-Fried"],
    "Ground Chicken": ["Pan-Seared", "Crumbled & Seasoned"],

    // Vegetables
    "Broccoli": ["Steamed", "Roasted", "Pan-Seared", "Air-Fried"],
    "Spinach": ["Sautéed", "Steamed", "Creamed", "Wilted"],
    "Asparagus": ["Grilled", "Roasted", "Pan-Seared", "Steamed"],
    "Brussels Sprouts": ["Roasted", "Air-Fried", "Sautéed"],

    // Salads
    "Lettuce": ["Garden Salad", "Cobb Salad", "Caesar Style", "Chopped"],
    "Spring Mix": ["Garden Salad", "Lightly Tossed", "Cobb Style"],
  };

  // If ingredient not found → fallback to generic
  const styles =
    PREP_OPTIONS[ingredientName] ||
    PREP_OPTIONS[
      Object.keys(PREP_OPTIONS).find((key) =>
        ingredientName.toLowerCase().includes(key.toLowerCase())
      ) || ""
    ] ||
    [];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-gradient-to-b from-zinc-900 via-zinc-800 to-black border border-white/20 rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-white text-lg font-semibold text-center">
            How do you want your {ingredientName}?
          </DialogTitle>
        </DialogHeader>

        {/* Grid of cooking style tiles */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          {styles.length > 0 ? (
            styles.map((style) => (
              <button
                key={style}
                onClick={() => {
                  onSelect(ingredientName, style);
                  onClose();
                }}
                className="
                  bg-black/40 border border-white/20 
                  hover:bg-white/10 
                  text-white text-sm 
                  rounded-xl py-3 px-2 
                  transition-all shadow-sm
                "
              >
                {style}
              </button>
            ))
          ) : (
            <p className="text-white/60 text-sm text-center col-span-2">
              This ingredient has no preparation options.
            </p>
          )}
        </div>

        {/* Cancel Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-black/40 text-white border border-white/20 rounded-lg hover:bg-white/10"
          >
            Cancel
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}