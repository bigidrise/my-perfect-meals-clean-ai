// Temporary stub for macrosApi
// This module provides API functions for logging macros

interface MacroEntry {
  date?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  mealType?: string;
}

export async function addBulkMacros(entries: MacroEntry[]): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch('/api/macros/bulk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ entries }),
    });

    if (!response.ok) {
      throw new Error(`Failed to add bulk macros: ${response.statusText}`);
    }

    const data = await response.json();
    return { success: true, ...data };
  } catch (error) {
    console.error('Error adding bulk macros:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function logMacrosToBiometrics(macros: MacroEntry): Promise<{ success: boolean; message?: string }> {
  try {
    // Use window.location.origin to ensure absolute URL works on Railway
    const apiUrl = `${window.location.origin}/api/biometrics/log`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for Railway authentication
      body: JSON.stringify({
        date_iso: macros.date || new Date().toISOString(),
        meal_type: macros.mealType || 'lunch',
        calories_kcal: macros.calories,
        protein_g: macros.protein,
        carbs_g: macros.carbs,
        fat_g: macros.fat,
        source: 'macro-counter',
        title: 'Meal from Macro Counter'
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to log macros to biometrics: ${response.statusText}`);
    }

    const data = await response.json();
    return { success: true, ...data };
  } catch (error) {
    console.error('❌ Error logging macros to biometrics:', error);
    
    // Log the full error details for debugging
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to send macros to biometrics. Please try again.',
      timestamp: new Date().toISOString()
    };
  }
}
