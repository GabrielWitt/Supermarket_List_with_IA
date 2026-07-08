/**
 * FreshCart - Business Rule Unit Tests
 * File: tests/grocery.test.ts
 * 
 * Jest unit tests verifying core business rules and calculations:
 * 1. New items initialized with quantity = 0 and price = $0.00.
 * 2. Total calculation (quantity x price).
 * 3. Finish Shopping archives purchased items (quantity > 0, purchased = true).
 * 4. Unpurchased and quantity = 0 items persist for subsequent trips.
 */

import { useGroceryStore } from '../store';

describe('FreshCart - Business Rules & Calculations', () => {
  beforeEach(() => {
    // Reset state before each test
    const store = useGroceryStore.getState();
    store.clearAllData();
  });

  test('Rule 1 & 2: New items start with quantity = 0 and price = $0.00', () => {
    const store = useGroceryStore.getState();
    store.addItem('Organic Honey', 'Pantry');

    const updatedStore = useGroceryStore.getState();
    expect(updatedStore.items).toHaveLength(1);
    
    const addedItem = updatedStore.items[0];
    expect(addedItem.name).toBe('Organic Honey');
    expect(addedItem.category).toBe('Pantry');
    expect(addedItem.quantity).toBe(0); // Business Rule check
    expect(addedItem.price).toBe(0.00); // Business Rule check
    expect(addedItem.purchased).toBe(false);
  });

  test('Rule 3: Total is calculated correctly as quantity x price', () => {
    const store = useGroceryStore.getState();
    store.addItem('Organic Avocados', 'Fruits');
    
    let state = useGroceryStore.getState();
    const itemId = state.items[0].id;
    
    // Update quantity and price
    store.updateQuantity(itemId, 3);
    store.updatePrice(itemId, 1.50);
    
    state = useGroceryStore.getState();
    const updatedItem = state.items[0];
    
    const itemTotal = updatedItem.quantity * updatedItem.price;
    expect(itemTotal).toBe(4.50); // 3 * 1.50
  });

  test('Rule 4 & 5: Finish Shopping saves/archives purchased items and preserves items with quantity = 0', async () => {
    const store = useGroceryStore.getState();
    
    // Item A: Purchased (quantity > 0, purchased = true)
    store.addItem('Whole Milk', 'Dairy');
    // Item B: Not Purchased but qty > 0 (quantity > 0, purchased = false)
    store.addItem('Sourdough Bread', 'Bakery');
    // Item C: Zero quantity (quantity = 0, purchased = false)
    store.addItem('Fresh Spinach', 'Vegetables');

    let state = useGroceryStore.getState();
    const idA = state.items[0].id;
    const idB = state.items[1].id;
    const idC = state.items[2].id;

    // Configure Item A (purchased)
    store.updateQuantity(idA, 2);
    store.updatePrice(idA, 3.49); // Total = 6.98
    store.togglePurchased(idA); // purchased = true

    // Configure Item B (not purchased yet)
    store.updateQuantity(idB, 1);
    store.updatePrice(idB, 4.50); // Total = 4.50
    // purchased = false

    // Configure Item C (quantity 0)
    // qty = 0, price = 0, purchased = false

    // Execute Finish Shopping
    await store.finishShopping();

    const finalState = useGroceryStore.getState();

    // Verification 1: Only Item A (Whole Milk) should be archived in history
    expect(finalState.history).toHaveLength(1);
    const historyItem = finalState.history[0];
    expect(historyItem.items).toHaveLength(1);
    expect(historyItem.items[0].name).toBe('Whole Milk');
    expect(historyItem.totalCost).toBe(6.98);

    // Verification 2: Items with quantity 0 AND unpurchased items remain in the active list
    // Active items should contain 'Sourdough Bread' (not purchased) and 'Fresh Spinach' (quantity 0)
    expect(finalState.items).toHaveLength(2);
    
    const remainingNames = finalState.items.map(item => item.name);
    expect(remainingNames).toContain('Sourdough Bread');
    expect(remainingNames).toContain('Fresh Spinach');

    // Verification 3: Total spent in user stats should reflect only the purchased item
    expect(finalState.stats.totalSpent).toBe(6.98);
    expect(finalState.stats.totalTrips).toBe(1);
    expect(finalState.stats.totalItemsPurchased).toBe(2); // 2 cartons of milk
  });
});
