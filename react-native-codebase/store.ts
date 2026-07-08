/**
 * FreshCart - State Management Store
 * File: store/useGroceryStore.ts
 * 
 * Zustand state manager handling active grocery list, shopping history,
 * theme configuration (Dark Mode), and Firebase sync states.
 */

import { create } from 'zustand';
import { GroceryItem, PurchaseHistoryItem, Category, UserStats } from '../types';

interface GroceryState {
  items: GroceryItem[];
  history: PurchaseHistoryItem[];
  stats: UserStats;
  isDarkMode: boolean;
  isLoading: boolean;
  
  // Active List Actions
  addItem: (name: string, category: Category) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updatePrice: (id: string, price: number) => void;
  togglePurchased: (id: string) => void;
  removeItem: (id: string) => void;
  
  // Shopping Complete Action
  finishShopping: () => Promise<void>;
  
  // Settings & Theme
  toggleTheme: () => void;
  clearAllData: () => void;
  seedSampleData: () => void;
}

export const useGroceryStore = create<GroceryState>((set, get) => ({
  items: [],
  history: [],
  stats: {
    totalTrips: 0,
    totalSpent: 0,
    totalItemsPurchased: 0,
    streakDays: 3,
  },
  isDarkMode: false,
  isLoading: false,

  // Business Rule: New items start with quantity = 0, price = $0.00, and purchased = false
  addItem: (name, category) => set((state) => {
    const newItem: GroceryItem = {
      id: Math.random().toString(36).substring(7),
      name,
      category,
      quantity: 0, // Rule: Starts at 0
      price: 0.00, // Rule: Starts at $0.00
      purchased: false,
      createdAt: Date.now(),
    };
    return { items: [...state.items, newItem] };
  }),

  updateQuantity: (id, quantity) => set((state) => ({
    items: state.items.map((item) => 
      item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
    )
  })),

  updatePrice: (id, price) => set((state) => ({
    items: state.items.map((item) => 
      item.id === id ? { ...item, price: Math.max(0, parseFloat(price.toFixed(2))) } : item
    )
  })),

  togglePurchased: (id) => set((state) => ({
    items: state.items.map((item) => 
      item.id === id ? { ...item, purchased: !item.purchased } : item
    )
  })),

  removeItem: (id) => set((state) => ({
    items: state.items.filter((item) => item.id !== id)
  })),

  // Business Rule: Finish Shopping saves only purchased items.
  // Items with quantity 0 remain for the next shopping trip.
  // Also, items that are unpurchased (purchased = false) remain.
  finishShopping: async () => {
    set({ isLoading: true });
    
    // Simulate API delay / Firebase write
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const state = get();
    const allItems = state.items;
    
    // Purchased items are those with quantity > 0 and marked as purchased (purchased = true)
    const purchased = allItems.filter(item => item.quantity > 0 && item.purchased);
    
    // Remaining items are those with quantity === 0, or those that were not marked as purchased
    const remaining = allItems.filter(item => item.quantity === 0 || !item.purchased);

    if (purchased.length === 0) {
      set({ isLoading: false });
      return; // Nothing to save
    }

    const totalCost = purchased.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const itemsPurchasedCount = purchased.reduce((sum, item) => sum + item.quantity, 0);

    const newHistoryItem: PurchaseHistoryItem = {
      id: Math.random().toString(36).substring(7),
      purchaseDate: Date.now(),
      items: purchased.map(item => ({
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        price: item.price,
      })),
      totalCost,
    };

    set((state) => ({
      items: remaining, // Items with quantity 0 or unpurchased remain in the list
      history: [newHistoryItem, ...state.history],
      stats: {
        ...state.stats,
        totalTrips: state.stats.totalTrips + 1,
        totalSpent: parseFloat((state.stats.totalSpent + totalCost).toFixed(2)),
        totalItemsPurchased: state.stats.totalItemsPurchased + itemsPurchasedCount,
      },
      isLoading: false,
    }));
  },

  toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

  clearAllData: () => set({
    items: [],
    history: [],
    stats: {
      totalTrips: 0,
      totalSpent: 0,
      totalItemsPurchased: 0,
      streakDays: 0,
    }
  }),

  seedSampleData: () => set({
    items: [
      { id: '1', name: 'Organic Bananas', category: 'Fruits', quantity: 3, price: 0.89, purchased: true, createdAt: Date.now() - 50000 },
      { id: '2', name: 'Avocados', category: 'Fruits', quantity: 2, price: 1.50, purchased: false, createdAt: Date.now() - 40000 },
      { id: '3', name: 'Fresh Spinach', category: 'Vegetables', quantity: 0, price: 0.00, purchased: false, createdAt: Date.now() - 30000 },
      { id: '4', name: 'Whole Milk', category: 'Dairy', quantity: 1, price: 3.49, purchased: true, createdAt: Date.now() - 20000 },
      { id: '5', name: 'Sourdough Bread', category: 'Bakery', quantity: 0, price: 0.00, purchased: false, createdAt: Date.now() - 10000 },
    ],
    history: [
      {
        id: 'h1',
        purchaseDate: Date.now() - 86400000 * 3, // 3 days ago
        items: [
          { name: 'Organic Strawberries', category: 'Fruits', quantity: 2, price: 3.99 },
          { name: 'Greek Yogurt', category: 'Dairy', quantity: 4, price: 1.25 },
          { name: 'Salmon Fillet', category: 'Meat & Seafood', quantity: 1, price: 12.99 }
        ],
        totalCost: 20.97
      },
      {
        id: 'h2',
        purchaseDate: Date.now() - 86400000 * 7, // 7 days ago
        items: [
          { name: 'Eggs (12pk)', category: 'Dairy', quantity: 1, price: 4.29 },
          { name: 'Sourdough Bread', category: 'Bakery', quantity: 1, price: 4.50 }
        ],
        totalCost: 8.79
      }
    ],
    stats: {
      totalTrips: 2,
      totalSpent: 29.76,
      totalItemsPurchased: 9,
      streakDays: 3,
    }
  })
}));
