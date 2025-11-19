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
  // Define cooking styles based on ingredient type
  const getCookingStyles = (ingredient: string): string[] => {
    const lower = ingredient.toLowerCase();

    // Eggs
    if (lower.includes('egg')) {
      return ['Scrambled', 'Fried', 'Poached', 'Hard-Boiled', 'Soft-Boiled', 'Over Easy', 'Omelette'];
    }

    // Red Meats (Beef, Pork, Lamb)
    if (lower.includes('steak') || lower.includes('beef') || lower.includes('pork') || lower.includes('lamb')) {
      return ['Grilled', 'Pan-Seared', 'Broiled', 'Baked', 'Slow-Cooked', 'Rare', 'Medium-Rare', 'Medium', 'Medium-Well', 'Well-Done'];
    }

    // Poultry
    if (lower.includes('chicken') || lower.includes('turkey')) {
      return ['Grilled', 'Baked', 'Pan-Seared', 'Roasted', 'Air-Fried', 'Poached'];
    }

    // Fish & Seafood
    if (lower.includes('salmon') || lower.includes('tuna') || lower.includes('fish') || lower.includes('tilapia') || lower.includes('cod') || lower.includes('halibut') || lower.includes('shrimp')) {
      return ['Grilled', 'Baked', 'Pan-Seared', 'Poached', 'Blackened', 'Broiled'];
    }

    // Rice & Grains
    if (lower.includes('rice') || lower.includes('quinoa') || lower.includes('couscous') || lower.includes('farro') || lower.includes('barley')) {
      return ['Steamed', 'Boiled', 'Pilaf-Style', 'Fried'];
    }

    // Vegetables
    if (lower.includes('broccoli') || lower.includes('asparagus') || lower.includes('spinach') ||
        lower.includes('cauliflower') || lower.includes('zucchini') || lower.includes('pepper') ||
        lower.includes('green bean') || lower.includes('carrot') || lower.includes('brussels') ||
        lower.includes('kale') || lower.includes('cabbage')) {
      return ['Steamed', 'Roasted', 'Grilled', 'Sautéed', 'Stir-Fried', 'Raw'];
    }

    // Potatoes
    if (lower.includes('potato') || lower.includes('yam')) {
      return ['Baked', 'Roasted', 'Mashed', 'Boiled', 'Grilled', 'Air-Fried'];
    }

    // Salad Greens
    if (lower.includes('lettuce') || lower.includes('spring mix') || lower.includes('greens') || lower.includes('romaine')) {
      return ['Raw', 'Lightly Wilted'];
    }

    // Default styles
    return ['Grilled', 'Baked', 'Pan-Seared', 'Steamed', 'Roasted'];
  };

  // If ingredient not found → fallback to generic
  const styles = getCookingStyles(ingredientName);

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