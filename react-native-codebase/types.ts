/**
 * FreshCart - Design System & App Types
 * File: types/index.ts
 * 
 * TypeScript definitions for FreshCart smart grocery list and AI recipe app.
 */

export type Category = 
  | 'Fruits' 
  | 'Vegetables' 
  | 'Dairy' 
  | 'Bakery' 
  | 'Meat & Seafood' 
  | 'Pantry' 
  | 'Beverages' 
  | 'Other';

export interface GroceryItem {
  id: string;
  name: string;
  category: Category;
  quantity: number; // Starts at 0
  price: number;    // Starts at 0.00
  unit?: string;     // Unit of measurement
  purchased: boolean;
  createdAt: number;
}

export interface PurchaseHistoryItem {
  id: string;
  purchaseDate: number;
  items: Array<{
    name: string;
    category: Category;
    quantity: number;
    price: number;
  }>;
  totalCost: number;
}

export interface RecipeIngredient {
  name: string;
  amount: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  prepTime: string;
  cookTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  calories: string;
  ingredients: RecipeIngredient[];
  steps: string[];
  chefTips: string;
  image?: string;
  isAiGenerated?: boolean;
}

export interface UserStats {
  totalTrips: number;
  totalSpent: number;
  totalItemsPurchased: number;
  streakDays: number;
}
