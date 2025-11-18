
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>AI Premades - Quick Meal Options</span>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
            <TabsTrigger value="lunch">Lunch</TabsTrigger>
            <TabsTrigger value="dinner">Dinner</TabsTrigger>
          </TabsList>

          <TabsContent value="breakfast" className="mt-4">
            <div className="text-center py-8 text-gray-500">
              Breakfast premade options will appear here
            </div>
          </TabsContent>

          <TabsContent value="lunch" className="mt-4">
            <div className="text-center py-8 text-gray-500">
              Lunch premade options will appear here
            </div>
          </TabsContent>

          <TabsContent value="dinner" className="mt-4">
            <div className="text-center py-8 text-gray-500">
              Dinner premade options will appear here
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
