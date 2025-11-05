import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Sparkles } from "lucide-react";
import { mocktailsData } from "@/data/mocktailsData";
import { useState } from "react";
import ShoppingAggregateBar from "@/components/ShoppingAggregateBar";

export default function MocktailsLowCalMixersPage() {
  const [, setLocation] = useLocation();
  const [selectedMocktail, setSelectedMocktail] = useState<string | null>(null);

  const selected = mocktailsData.find((m) => m.id === selectedMocktail);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-black/60 via-orange-600 to-black/80">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => setLocation("/alcohol-hub")}
          className="fixed top-2 left-2 sm:top-4 sm:left-4 z-50 bg-emerald-900/40 backdrop-blur-none border border-emerald-400/60 hover:bg-emerald-800/50 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg flex items-center gap-2 font-semibold text-sm sm:text-base transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        {/* Header */}
        <div className="text-center mb-8 mt-14 bg-black/20 backdrop-blur-lg border border-emerald-400/70 rounded-2xl p-8 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-12 w-12 text-emerald-300" />
            <h1 className="text-3xl font-bold text-white">
              🍹 Mocktails & Low-Cal Mixers
            </h1>
          </div>
          <p className="text-md text-white/90 max-w-2xl mx-auto">
            Enjoy delicious alcohol-free drinks that won't compromise your
            health goals
          </p>
        </div>

        {/* Mocktails Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {mocktailsData.map((mocktail) => (
            <Card
              key={mocktail.id}
              className="cursor-pointer transform hover:scale-105 transition-all duration-200 bg-black/50 backdrop-blur-sm border border-emerald-400/70 shadow-xl hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              onClick={() => setSelectedMocktail(mocktail.id)}
            >
              <div className="aspect-square overflow-hidden rounded-t-lg">
                <img
                  src={mocktail.image}
                  alt={mocktail.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/images/meal-placeholder.jpg";
                  }}
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-2 text-white">
                  {mocktail.name}
                </h3>
                <p className="text-sm text-white/80 mb-3">
                  {mocktail.description}
                </p>
                <div className="flex justify-between text-xs text-emerald-200 font-semibold">
                  <span>{mocktail.calories} cal</span>
                  <span>{mocktail.carbs} carbs</span>
                  <span>{mocktail.sugar} sugar</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detail Modal */}
        {selected && (
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedMocktail(null)}
          >
            <Card
              className="max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-black/50 border border-emerald-400/70 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
              onClick={(e) => e.stopPropagation()}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-3xl font-bold text-white">
                    {selected.name}
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedMocktail(null)}
                    className="text-emerald-300 hover:text-white"
                  >
                    ✕
                  </Button>
                </div>

                <img
                  src={selected.image}
                  alt={selected.name}
                  className="w-full h-64 object-cover rounded-lg mb-4 border border-emerald-500/30"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/images/meal-placeholder.jpg";
                  }}
                />

                <p className="text-white/90 mb-4">{selected.description}</p>

                <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                  <div className="text-center">
                    <div className="font-bold text-2xl text-emerald-300">
                      {selected.calories}
                    </div>
                    <div className="text-sm text-white/70">calories</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-2xl text-emerald-300">
                      {selected.carbs}
                    </div>
                    <div className="text-sm text-white/70">carbs</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-2xl text-emerald-300">
                      {selected.sugar}
                    </div>
                    <div className="text-sm text-white/70">sugar</div>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="font-bold text-lg mb-2 text-white">
                    Ingredients
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    {selected.ingredients.map((ingredient, idx) => (
                      <li key={idx} className="text-white/90">
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4">
                  <h3 className="font-bold text-lg mb-2 text-white">
                    Instructions
                  </h3>
                  <ol className="list-decimal list-inside space-y-1">
                    {selected.instructions.map((instruction, idx) => (
                      <li key={idx} className="text-white/90">
                        {instruction}
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="mb-24">
                  <h3 className="font-bold text-lg mb-2 text-white">
                    Benefits
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selected.benefits.map((benefit, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-emerald-600/30 border border-emerald-400/60 text-emerald-100 rounded-full text-sm font-medium"
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Shopping Bar - Fixed within modal */}
                <div className="sticky bottom-0 left-0 right-0 mt-6">
                  <ShoppingAggregateBar
                    ingredients={selected.ingredients.map((ing) => ({
                      name: ing,
                      qty: 1,
                      unit: "serving",
                    }))}
                    source={selected.name}
                    sourceSlug="mocktails"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
