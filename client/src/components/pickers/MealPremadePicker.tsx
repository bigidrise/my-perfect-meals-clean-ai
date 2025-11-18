
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MealPremadePickerProps {
  open: boolean;
  onClose: () => void;
  mealType?: 'breakfast' | 'lunch' | 'dinner';
}

export default function MealPremadePicker({
  open,
  onClose,
  mealType = 'breakfast'
}: MealPremadePickerProps) {
  const [activeTab, setActiveTab] = useState(mealType);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-zinc-900 via-zinc-800 to-black border-white/20">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-white">
            <span>AI Premades - Quick Meal Options</span>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-black/30">
            <TabsTrigger value="breakfast" className="text-white data-[state=active]:bg-orange-600">
              Breakfast
            </TabsTrigger>
            <TabsTrigger value="lunch" className="text-white data-[state=active]:bg-orange-600">
              Lunch
            </TabsTrigger>
            <TabsTrigger value="dinner" className="text-white data-[state=active]:bg-orange-600">
              Dinner
            </TabsTrigger>
          </TabsList>

          <TabsContent value="breakfast" className="mt-4">
            <div className="text-center py-12 text-white/60 bg-black/20 rounded-xl border border-white/10">
              <p className="text-lg">Breakfast premade options will appear here</p>
              <p className="text-sm mt-2">Phase 3 will add actual meal options</p>
            </div>
          </TabsContent>

          <TabsContent value="lunch" className="mt-4">
            <div className="text-center py-12 text-white/60 bg-black/20 rounded-xl border border-white/10">
              <p className="text-lg">Lunch premade options will appear here</p>
              <p className="text-sm mt-2">Phase 3 will add actual meal options</p>
            </div>
          </TabsContent>

          <TabsContent value="dinner" className="mt-4">
            <div className="text-center py-12 text-white/60 bg-black/20 rounded-xl border border-white/10">
              <p className="text-lg">Dinner premade options will appear here</p>
              <p className="text-sm mt-2">Phase 3 will add actual meal options</p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
