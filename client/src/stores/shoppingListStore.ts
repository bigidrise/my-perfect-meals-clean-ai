import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UniversalIngredient {
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
  sourceMeals?: string[];
  category?: string;
}

export interface ShoppingListItem extends UniversalIngredient {
  id: string;
  isChecked: boolean;
  category?: string; // Simplified category
}

interface ShoppingListStore {
  items: ShoppingListItem[];
  addItem: (item: Omit<ShoppingListItem, 'id' | 'isChecked'>) => void;
  addItems: (items: UniversalIngredient[]) => void;
  toggleItem: (id: string) => void;
  removeItem: (id: string) => void;
  clearChecked: () => void;
  clearAll: () => void;
  updateItem: (id: string, updates: Partial<ShoppingListItem>) => void;
  replaceItems: (items: ShoppingListItem[]) => void;
}

const generateId = () => `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

/**
 * Normalizes ingredient name for comparison (lowercase, trimmed)
 */
const normalizeName = (name: string): string => {
  return name.toLowerCase().trim();
};

/**
 * Checks if two items can be merged (same normalized name + same unit)
 */
const canMerge = (a: ShoppingListItem, b: UniversalIngredient): boolean => {
  return normalizeName(a.name) === normalizeName(b.name) && a.unit === b.unit;
};

export const useShoppingListStore = create<ShoppingListStore>()(
  persist(
    (set) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          // Try to find existing item to merge with
          const existingIndex = state.items.findIndex((existing) => canMerge(existing, item));

          if (existingIndex !== -1) {
            // Merge quantities and sourceMeals
            const updated = [...state.items];
            updated[existingIndex] = {
              ...updated[existingIndex],
              quantity: updated[existingIndex].quantity + item.quantity,
              sourceMeals: item.sourceMeals
                ? [...(updated[existingIndex].sourceMeals || []), ...item.sourceMeals]
                : updated[existingIndex].sourceMeals,
              notes: item.notes ? `${updated[existingIndex].notes || ''}${item.notes}` : updated[existingIndex].notes, // Simple concatenation for notes
            };
            return { items: updated };
          }

          // Add new item
          return {
            items: [
              ...state.items,
              {
                ...item,
                id: generateId(),
                isChecked: false,
                category: item.category ?? 'Pantry', // Default category if not provided
                notes: item.notes, // Ensure notes are carried over
                sourceMeals: item.sourceMeals
              },
            ],
          };
        });
      },

      addItems: (newItems) => {
        set((state) => {
          const updatedItems = [...state.items];

          newItems.forEach((newItem) => {
            const existingIndex = updatedItems.findIndex((existing) => canMerge(existing, newItem));

            if (existingIndex !== -1) {
              // Merge quantities, notes, and sourceMeals
              updatedItems[existingIndex] = {
                ...updatedItems[existingIndex],
                quantity: updatedItems[existingIndex].quantity + newItem.quantity,
                notes: newItem.notes ? `${updatedItems[existingIndex].notes || ''}${newItem.notes}` : updatedItems[existingIndex].notes,
                sourceMeals: newItem.sourceMeals
                  ? [...(updatedItems[existingIndex].sourceMeals || []), ...newItem.sourceMeals]
                  : updatedItems[existingIndex].sourceMeals,
              };
            } else {
              // Add new item
              updatedItems.push({
                ...newItem,
                id: generateId(),
                isChecked: false,
                category: newItem.category ?? 'Pantry', // Default category
                notes: newItem.notes,
                sourceMeals: newItem.sourceMeals
              });
            }
          });

          return { items: updatedItems };
        });
      },

      toggleItem: (id) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, isChecked: !item.isChecked } : item
          ),
        }));
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      clearChecked: () => {
        set((state) => ({
          items: state.items.filter((item) => !item.isChecked),
        }));
      },

      clearAll: () => {
        set({ items: [] });
      },

      updateItem: (id, updates) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        }));
      },

      replaceItems: (items) => {
        set({ items });
      },
    }),
    {
      name: 'shopping-list-storage', // Persist key
    }
  )
);