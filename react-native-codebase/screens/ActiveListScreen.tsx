/**
 * FreshCart - Active Shopping List Screen
 * File: screens/ActiveListScreen.tsx
 */

import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SectionList, 
  TouchableOpacity, 
  TextInput, 
  FlatList,
  StatusBar
} from 'react-native';
// Phosphor icon imports for native look and feel
import { 
  ClockCounterClockwise, 
  DotsThree, 
  MagnifyingGlass, 
  Check, 
  Plus, 
  Trash 
} from 'phosphor-react-native';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';

// Simulated Safe Area Padding
const safeArea = { top: 44 };

// Item type definition
interface GroceryItem {
  id: string;
  name: string;
  qty: number;
  unit: string;
  price: number;
  checked: boolean;
  category: string;
  emoji: string;
}

// Initial realistic data matching request parameters
const INITIAL_ITEMS: GroceryItem[] = [
  { id: '1', name: 'Milk', qty: 2, unit: 'L', price: 3.99, checked: false, category: 'Dairy', emoji: '🥛' },
  { id: '2', name: 'Eggs', qty: 12, unit: 'units', price: 4.50, checked: true, category: 'Dairy', emoji: '🥛' },
  { id: '3', name: 'Cheese', qty: 1, unit: 'pack', price: 5.99, checked: false, category: 'Dairy', emoji: '🥛' },
  { id: '4', name: 'Broccoli', qty: 1, unit: 'kg', price: 2.50, checked: false, category: 'Vegetables', emoji: '🥦' },
  { id: '5', name: 'Tomatoes', qty: 4, unit: 'units', price: 1.20, checked: false, category: 'Vegetables', emoji: '🥦' },
  { id: '6', name: 'Sourdough Bread', qty: 1, unit: 'units', price: 4.99, checked: true, category: 'Bakery', emoji: '🍞' },
];

const SUGGESTIONS = [
  { id: 's1', name: 'Milk', emoji: '🥛' },
  { id: 's2', name: 'Bananas', emoji: '🍌' },
  { id: 's3', name: 'Spinach', emoji: '🥬' },
  { id: 's4', name: 'Avocado', emoji: '🥑' },
  { id: 's5', name: 'Coffee', emoji: '☕' },
];

export const ActiveListScreen: React.FC = () => {
  const [items, setItems] = useState<GroceryItem[]>(INITIAL_ITEMS);
  const [searchQuery, setSearchQuery] = useState('');

  // Toggle checkout status
  const handleToggleCheck = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  // Delete an item from the shopping list
  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  // Add suggestion item back to shopping list
  const handleAddSuggestion = (suggestion: typeof SUGGESTIONS[0]) => {
    // Check if item is already in list
    const existingIndex = items.findIndex(it => it.name.toLowerCase() === suggestion.name.toLowerCase());
    if (existingIndex !== -1) {
      // Increase qty of existing item
      setItems(prev => prev.map((item, index) => 
        index === existingIndex ? { ...item, qty: item.qty + 1, checked: false } : item
      ));
    } else {
      // Add as a new item
      const newItem: GroceryItem = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
        name: suggestion.name,
        qty: 1,
        unit: 'units',
        price: 2.99, // default fallback price
        checked: false,
        category: suggestion.name === 'Milk' ? 'Dairy' : 'Vegetables',
        emoji: suggestion.emoji,
      };
      setItems(prev => [...prev, newItem]);
    }
  };

  // Add a fully new blank item manually
  const handleAddNewItem = () => {
    const newItem: GroceryItem = {
      id: Date.now().toString(),
      name: 'New Grocery Item',
      qty: 1,
      unit: 'units',
      price: 0.00,
      checked: false,
      category: 'Vegetables',
      emoji: '🛒',
    };
    setItems(prev => [...prev, newItem]);
  };

  // Calculate shopping statistics (Estimated total of unchecked/total items)
  const estimatedTotal = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  }, [items]);

  // Group items into Sections by Category, with Checked items rendered LAST inside their section
  const sectionData = useMemo(() => {
    const filtered = items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const categories = Array.from(new Set(filtered.map(it => it.category)));
    
    return categories.map(cat => {
      // Get items in this category
      const catItems = filtered.filter(it => it.category === cat);
      // Sort checked items LAST in their section
      const sortedItems = [...catItems].sort((a, b) => {
        if (a.checked === b.checked) return 0;
        return a.checked ? 1 : -1;
      });

      // Map appropriate category emoji prefix
      let emoji = '🛒';
      if (cat === 'Dairy') emoji = '🥛';
      if (cat === 'Vegetables') emoji = '🥦';
      if (cat === 'Bakery') emoji = '🍞';

      return {
        title: cat,
        emoji,
        data: sortedItems,
      };
    });
  }, [items, searchQuery]);

  // Render Swipe Left Left Action (Red delete panel)
  const renderRightActions = (id: string) => {
    return (
      <TouchableOpacity 
        style={styles.deleteAction} 
        onPress={() => handleDeleteItem(id)}
        activeOpacity={0.8}
      >
        <Trash size={20} color="#FFFFFF" weight="bold" />
        <Text style={styles.deleteActionText}>Delete</Text>
      </TouchableOpacity>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        {/* CUSTOM HEADER */}
        <View style={styles.header}>
          {/* Row 1 */}
          <View style={styles.headerRow1}>
            <Text style={styles.headerTitle}>Shopping List</Text>
            <View style={styles.headerIconsRight}>
              <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
                <ClockCounterClockwise size={22} color="#636366" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
                <DotsThree size={22} color="#636366" weight="bold" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Row 2 - Tappable total chip */}
          <TouchableOpacity style={styles.totalChip} activeOpacity={0.8}>
            <Text style={styles.totalAmount}>${estimatedTotal.toFixed(2)}</Text>
            <Text style={styles.totalSubtitle}>Tap to finish shopping</Text>
          </TouchableOpacity>

          {/* Row 3 - Search Input */}
          <View style={styles.searchContainer}>
            <MagnifyingGlass size={16} color="#8E8E93" style={styles.searchIcon} />
            <TextInput 
              style={styles.searchInput}
              placeholder="Search items..."
              placeholderTextColor="#8E8E93"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* MAIN LIST SECTION */}
        {items.length === 0 ? (
          /* EMPTY STATE */
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🛒</Text>
            <Text style={styles.emptyTitle}>Your list is empty</Text>
            <Text style={styles.emptySubtitle}>Add items to start shopping</Text>
            <TouchableOpacity 
              style={styles.emptyButton} 
              onPress={handleAddNewItem}
              activeOpacity={0.8}
            >
              <Text style={styles.emptyButtonText}>Add Item</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <SectionList
            sections={sectionData}
            keyExtractor={(item) => item.id}
            renderSectionHeader={({ section: { title, emoji } }) => (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>{emoji} {title}</Text>
              </View>
            )}
            renderItem={({ item }) => (
              <Swipeable 
                renderRightActions={() => renderRightActions(item.id)}
                friction={2}
              >
                <View style={[styles.itemRow, item.checked && styles.itemRowChecked]}>
                  {/* LEFT: Emoji and text */}
                  <View style={styles.itemRowLeft}>
                    <View style={styles.emojiCircle}>
                      <Text style={styles.emojiText}>{item.emoji}</Text>
                    </View>
                    <View style={styles.itemMeta}>
                      <Text style={[styles.itemName, item.checked && styles.itemNameChecked]}>
                        {item.name}
                      </Text>
                      <Text style={styles.itemUnit}>{item.qty} {item.unit}</Text>
                    </View>
                  </View>

                  {/* RIGHT: Qty badge, price, check */}
                  <View style={styles.itemRowRight}>
                    <View style={styles.qtyBadge}>
                      <Text style={styles.qtyText}>{item.qty}</Text>
                    </View>
                    <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                    <TouchableOpacity 
                      style={[styles.checkbox, item.checked && styles.checkboxChecked]}
                      onPress={() => handleToggleCheck(item.id)}
                      activeOpacity={0.8}
                    >
                      {item.checked && <Check size={14} color="#FFFFFF" weight="bold" />}
                    </TouchableOpacity>
                  </View>
                </View>
              </Swipeable>
            )}
            ListFooterComponent={
              /* SMART SUGGESTIONS SECTION inside footer */
              <View style={styles.suggestionsSection}>
                <Text style={styles.suggestionsTitle}>Add again? ✨</Text>
                <FlatList
                  horizontal
                  data={SUGGESTIONS}
                  keyExtractor={(item) => item.id}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.suggestionsList}
                  renderItem={({ item }) => (
                    <TouchableOpacity 
                      style={styles.suggestionChip}
                      onPress={() => handleAddSuggestion(item)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.suggestionText}>+ {item.name} {item.emoji}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            }
            contentContainerStyle={styles.listContent}
          />
        )}

        {/* FLOATING ACTION BUTTON (FAB) */}
        <TouchableOpacity 
          style={styles.fab} 
          onPress={handleAddNewItem}
          activeOpacity={0.8}
        >
          <Plus size={28} color="#FFFFFF" weight="bold" />
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 16,
    paddingTop: safeArea.top + 8,
    paddingBottom: 12,
  },
  headerRow1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1C1C1E',
    letterSpacing: -0.5,
  },
  headerIconsRight: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  iconButton: {
    padding: 4,
  },
  totalChip: {
    backgroundColor: '#D8F3DC',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D6A4F',
    lineHeight: 24,
  },
  totalSubtitle: {
    fontSize: 11,
    color: '#40916C',
    fontWeight: '600',
    marginTop: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    height: 40,
    marginTop: 12,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1C1C1E',
    padding: 0,
  },
  listContent: {
    paddingBottom: 120, // Space for FAB and tab navigation
  },
  sectionHeader: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  sectionHeaderText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#636366',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  itemRow: {
    height: 64,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#F2F2F7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  itemRowChecked: {
    opacity: 0.45,
  },
  itemRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emojiCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#D8F3DC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: {
    fontSize: 18,
  },
  itemMeta: {
    marginLeft: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  itemNameChecked: {
    textDecorationLine: 'line-through',
  },
  itemUnit: {
    fontSize: 12,
    color: '#636366',
    marginTop: 2,
  },
  itemRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  qtyBadge: {
    minWidth: 44,
    height: 30,
    backgroundColor: '#F2F2F7',
    borderWidth: 1,
    borderColor: '#C7C7CC',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  qtyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  itemPrice: {
    fontSize: 14,
    color: '#636366',
    fontWeight: '500',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#C7C7CC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2D6A4F',
    borderColor: '#2D6A4F',
  },
  suggestionsSection: {
    backgroundColor: '#F2F2F7',
    padding: 16,
    marginTop: 16,
  },
  suggestionsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 10,
  },
  suggestionsList: {
    gap: 8,
  },
  suggestionChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C7C7CC',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  suggestionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2D6A4F',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    marginTop: 100,
  },
  emptyIcon: {
    fontSize: 72,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#636366',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#2D6A4F',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2D6A4F',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
    zIndex: 999,
  },
  deleteAction: {
    backgroundColor: '#FF3B30',
    width: 80,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    gap: 4,
  },
  deleteActionText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
});

export default ActiveListScreen;
