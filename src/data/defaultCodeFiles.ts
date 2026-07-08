/**
 * Code File Repository for the FreshCart Codebase Explorer
 */

export interface CodeFile {
  path: string;
  name: string;
  language: string;
  code: string;
}

export const DEFAULT_CODE_FILES: CodeFile[] = [
  {
    path: 'types/index.ts',
    name: 'index.ts',
    language: 'typescript',
    code: `/**
 * FreshCart - Design System & App Types
 * File: types/index.ts
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
  price: number;    // Starts at $0.00
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
}`
  },
  {
    path: 'store/useGroceryStore.ts',
    name: 'useGroceryStore.ts',
    language: 'typescript',
    code: `/**
 * FreshCart - Zustand State Management Store
 * File: store/useGroceryStore.ts
 */

import { create } from 'zustand';
import { GroceryItem, PurchaseHistoryItem, Category, UserStats } from '../types';

interface GroceryState {
  items: GroceryItem[];
  history: PurchaseHistoryItem[];
  stats: UserStats;
  isDarkMode: boolean;
  isLoading: boolean;
  
  addItem: (name: string, category: Category) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updatePrice: (id: string, price: number) => void;
  togglePurchased: (id: string) => void;
  removeItem: (id: string) => void;
  finishShopping: () => Promise<void>;
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

  // Rule: New items start with quantity = 0, price = $0.00
  addItem: (name, category) => set((state) => ({
    items: [
      ...state.items,
      {
        id: Math.random().toString(36).substring(7),
        name,
        category,
        quantity: 0, // Starts at 0
        price: 0.00, // Starts at $0.00
        purchased: false,
        createdAt: Date.now(),
      }
    ]
  })),

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

  // Rule: Finish Shopping saves only purchased items.
  // Items with quantity 0 remain for the next shopping trip.
  finishShopping: async () => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate write
    
    const { items, history, stats } = get();
    const purchased = items.filter(item => item.quantity > 0 && item.purchased);
    const remaining = items.filter(item => item.quantity === 0 || !item.purchased);

    if (purchased.length === 0) {
      set({ isLoading: false });
      return;
    }

    const totalCost = purchased.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const itemVolume = purchased.reduce((sum, item) => sum + item.quantity, 0);

    const newHistoryItem: PurchaseHistoryItem = {
      id: Math.random().toString(36).substring(7),
      purchaseDate: Date.now(),
      items: purchased.map(item => ({
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        price: item.price
      })),
      totalCost
    };

    set({
      items: remaining, // Items with qty 0 or unpurchased remain
      history: [newHistoryItem, ...history],
      stats: {
        ...stats,
        totalTrips: stats.totalTrips + 1,
        totalSpent: parseFloat((stats.totalSpent + totalCost).toFixed(2)),
        totalItemsPurchased: stats.totalItemsPurchased + itemVolume
      },
      isLoading: false
    });
  },

  toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  clearAllData: () => set({ items: [], history: [], stats: { totalTrips: 0, totalSpent: 0, totalItemsPurchased: 0, streakDays: 0 } }),
  seedSampleData: () => set({
    items: [
      { id: '1', name: 'Organic Bananas', category: 'Fruits', quantity: 3, price: 0.89, purchased: true, createdAt: Date.now() },
      { id: '2', name: 'Avocados', category: 'Fruits', quantity: 2, price: 1.50, purchased: false, createdAt: Date.now() },
      { id: '3', name: 'Fresh Spinach', category: 'Vegetables', quantity: 0, price: 0.00, purchased: false, createdAt: Date.now() },
      { id: '4', name: 'Whole Milk', category: 'Dairy', quantity: 1, price: 3.49, purchased: true, createdAt: Date.now() },
      { id: '5', name: 'Sourdough Bread', category: 'Bakery', quantity: 0, price: 0.00, purchased: false, createdAt: Date.now() }
    ],
    stats: { totalTrips: 5, totalSpent: 114.50, totalItemsPurchased: 42, streakDays: 5 }
  })
}));`
  },
  {
    path: 'components/GroceryItemCard.tsx',
    name: 'GroceryItemCard.tsx',
    language: 'typescript',
    code: `/**
 * FreshCart - Grocery Item Card Component
 * File: components/GroceryItemCard.tsx
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Check, Trash, PencilSimple } from 'phosphor-react-native';
import { GroceryItem } from '../types';

interface GroceryItemCardProps {
  item: GroceryItem;
  onPressQuantity: (item: GroceryItem) => void;
  onPressPrice: (item: GroceryItem) => void;
  onTogglePurchased: (id: string) => void;
  onDelete: (id: string) => void;
  isDarkMode?: boolean;
}

const CATEGORY_COLORS = {
  Fruits: { bg: '#E2F0D9', text: '#2D6A4F' },
  Vegetables: { bg: '#E8F5E9', text: '#1B5E20' },
  Dairy: { bg: '#E3F2FD', text: '#1565C0' },
  Bakery: { bg: '#FFF3E0', text: '#E65100' },
  'Meat & Seafood': { bg: '#FFEBEE', text: '#C62828' },
  Pantry: { bg: '#EDE7F6', text: '#4527A0' },
  Beverages: { bg: '#F3E5F5', text: '#6A1B9A' },
  Other: { bg: '#F2F2F7', text: '#636366' },
};

export const GroceryItemCard: React.FC<GroceryItemCardProps> = ({
  item,
  onPressQuantity,
  onPressPrice,
  onTogglePurchased,
  onDelete,
  isDarkMode = false
}) => {
  const categoryColor = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.Other;
  const isPurchased = item.purchased && item.quantity > 0;
  const totalCost = (item.quantity * item.price).toFixed(2);

  return (
    <View style={[styles.card, isDarkMode && styles.cardDark, isPurchased && styles.cardPurchased]}>
      <TouchableOpacity 
        style={[styles.checkbox, isPurchased && styles.checkboxChecked, isDarkMode && styles.checkboxDark]} 
        onPress={() => onTogglePurchased(item.id)}
      >
        {isPurchased && <Check size={14} color="#FFFFFF" weight="bold" />}
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <View style={styles.nameRow}>
          <Text style={[styles.itemName, isDarkMode && styles.textDark, isPurchased && styles.textLineThrough]}>
            {item.name}
          </Text>
          <View style={[styles.badge, { backgroundColor: categoryColor.bg }]}>
            <Text style={[styles.badgeText, { color: categoryColor.text }]}>{item.category}</Text>
          </View>
        </View>

        <View style={styles.interactiveRow}>
          <TouchableOpacity style={[styles.pill, isDarkMode && styles.pillDark]} onPress={() => onPressQuantity(item)}>
            <Text style={styles.pillLabel}>Qty:</Text>
            <Text style={[styles.pillValue, isDarkMode && styles.textDark, item.quantity > 0 && styles.qtyHighlighted]}>
              {item.quantity}
            </Text>
            <PencilSimple size={12} color="#636366" style={styles.pillIcon} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.pill, isDarkMode && styles.pillDark]} onPress={() => onPressPrice(item)}>
            <Text style={styles.pillLabel}>Price:</Text>
            <Text style={[styles.pillValue, isDarkMode && styles.textDark]}>\${item.price.toFixed(2)}</Text>
            <PencilSimple size={12} color="#636366" style={styles.pillIcon} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={[styles.totalValue, isDarkMode && styles.textDark, isPurchased && styles.textLineThrough]}>
          \${totalCost}
        </Text>
      </View>

      <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(item.id)}>
        <Trash size={16} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  cardDark: { backgroundColor: '#1C1C1E', borderColor: '#2C2C2E' },
  cardPurchased: { backgroundColor: '#F2F9F4', borderColor: '#C2E7D1' },
  checkbox: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#C7C7CC', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  checkboxChecked: { backgroundColor: '#2D6A4F', borderColor: '#2D6A4F' },
  checkboxDark: { borderColor: '#48484A' },
  infoContainer: { flex: 1, justifyContent: 'center' },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  itemName: { fontSize: 16, fontWeight: '600', color: '#1C1C1E', marginRight: 8 },
  textLineThrough: { textDecorationLine: 'line-through', color: '#8E8E93' },
  textDark: { color: '#FFFFFF' },
  badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  badgeText: { fontSize: 10, fontWeight: '600' },
  interactiveRow: { flexDirection: 'row', alignItems: 'center' },
  pill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F2F2F7', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8, marginRight: 8 },
  pillDark: { backgroundColor: '#2C2C2E' },
  pillLabel: { fontSize: 11, color: '#636366', marginRight: 4 },
  pillValue: { fontSize: 12, fontWeight: '600', color: '#1C1C1E' },
  qtyHighlighted: { color: '#2D6A4F', fontWeight: '700' },
  pillIcon: { marginLeft: 4 },
  totalContainer: { alignItems: 'flex-end', justifyContent: 'center', paddingHorizontal: 8, borderLeftWidth: 1, borderLeftColor: '#E5E5EA', minWidth: 70 },
  totalLabel: { fontSize: 10, color: '#8E8E93', textTransform: 'uppercase', fontWeight: '600' },
  totalValue: { fontSize: 14, fontWeight: '700', color: '#1C1C1E' },
  deleteButton: { padding: 8, marginLeft: 4 }
});`
  },
  {
    path: 'components/AddItemModal.tsx',
    name: 'AddItemModal.tsx',
    language: 'typescript',
    code: `/**
 * FreshCart - Add Item Bottom Sheet Modal
 * File: components/AddItemModal.tsx
 * 
 * Elegant slide-up bottom sheet modal to add new grocery items.
 * Adheres strictly to the FreshCart Design System.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import { X, MagnifyingGlass } from 'phosphor-react-native';
import { Category, GroceryItem } from '../types';

const { height: screenHeight } = Dimensions.get('window');

interface AddItemModalProps {
  visible: boolean;
  onClose: () => void;
  onAddItem: (item: Omit<GroceryItem, 'id' | 'createdAt' | 'purchased'>) => void;
  isDarkMode?: boolean;
}

// Category mappings with emojis for displaying chips
const CATEGORIES_WITH_EMOJIS: Array<{ key: Category; label: string }> = [
  { key: 'Dairy', label: '🥛 Dairy' },
  { key: 'Vegetables', label: '🥦 Vegetables' },
  { key: 'Meat & Seafood', label: '🥩 Meat' },
  { key: 'Fruits', label: '🍎 Fruits' },
  { key: 'Bakery', label: '🍞 Bakery' },
  { key: 'Beverages', label: '🥤 Drinks' },
  { key: 'Pantry', label: '🧊 Frozen' },
  { key: 'Other', label: '📦 Other' },
];

const RECENT_CHIPS = [
  { name: 'Milk', category: 'Dairy' as Category },
  { name: 'Eggs', category: 'Dairy' as Category },
  { name: 'Bread', category: 'Bakery' as Category },
  { name: 'Chicken', category: 'Meat & Seafood' as Category },
  { name: 'Cheese', category: 'Dairy' as Category },
];

const UNITS = ['units', 'kg', 'g', 'lb', 'L', 'ml', 'pack'];

// Auto-detect category from item name
const autoDetectCategory = (name: string): Category => {
  const lower = name.toLowerCase();
  
  if (lower.includes('milk') || lower.includes('cheese') || lower.includes('yogurt') || lower.includes('butter') || lower.includes('cream') || lower.includes('dairy')) {
    return 'Dairy';
  }
  if (lower.includes('apple') || lower.includes('banana') || lower.includes('berry') || lower.includes('orange') || lower.includes('lemon') || lower.includes('grape') || lower.includes('fruit') || lower.includes('peach') || lower.includes('strawberry')) {
    return 'Fruits';
  }
  if (lower.includes('broccoli') || lower.includes('tomato') || lower.includes('lettuce') || lower.includes('carrot') || lower.includes('onion') || lower.includes('potato') || lower.includes('garlic') || lower.includes('spinach') || lower.includes('cucumber') || lower.includes('salad') || lower.includes('vegetable')) {
    return 'Vegetables';
  }
  if (lower.includes('bread') || lower.includes('loaf') || lower.includes('croissant') || lower.includes('bun') || lower.includes('bagel') || lower.includes('cake') || lower.includes('muffin') || lower.includes('bakery')) {
    return 'Bakery';
  }
  if (lower.includes('chicken') || lower.includes('beef') || lower.includes('pork') || lower.includes('steak') || lower.includes('fish') || lower.includes('salmon') || lower.includes('shrimp') || lower.includes('meat') || lower.includes('seafood') || lower.includes('turkey')) {
    return 'Meat & Seafood';
  }
  if (lower.includes('soda') || lower.includes('juice') || lower.includes('water') || lower.includes('cola') || lower.includes('drink') || lower.includes('tea') || lower.includes('coffee') || lower.includes('beverage')) {
    return 'Beverages';
  }
  if (lower.includes('rice') || lower.includes('pasta') || lower.includes('cereal') || lower.includes('flour') || lower.includes('oil') || lower.includes('sugar') || lower.includes('salt') || lower.includes('frozen') || lower.includes('pantry') || lower.includes('can')) {
    return 'Pantry';
  }
  return 'Other';
};

export const AddItemModal: React.FC<AddItemModalProps> = ({
  visible,
  onClose,
  onAddItem,
  isDarkMode = false,
}) => {
  // Form State
  const [selectedCategory, setSelectedCategory] = useState<Category>('Other');
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState('units');
  const [price, setPrice] = useState('');

  // Animation values
  const translateY = useRef(new Animated.Value(screenHeight)).current;

  // Handles smooth opening and closing animations
  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: screenHeight,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  // Auto-detect category on item name change
  useEffect(() => {
    if (name.trim()) {
      const detected = autoDetectCategory(name);
      setSelectedCategory(detected);
    }
  }, [name]);

  const handleClose = () => {
    Animated.timing(translateY, {
      toValue: screenHeight,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert('Por favor, ingresa el nombre del artículo.');
      return;
    }

    const qtyNum = parseFloat(quantity) || 1;
    const priceNum = parseFloat(price) || 0;

    onAddItem({
      name: name.trim(),
      category: selectedCategory,
      quantity: qtyNum,
      price: priceNum,
      unit
    });

    // Reset states
    setName('');
    setSelectedCategory('Other');
    setQuantity('1');
    setUnit('units');
    setPrice('');

    handleClose();
  };

  const handleSelectRecent = (recentName: string, recentCategory: Category) => {
    setName(recentName);
    setSelectedCategory(recentCategory);
  };

  if (!visible) return null;

  const safeAreaBottom = Platform.OS === 'ios' ? 34 : 16;

  return (
    <View style={StyleSheet.absoluteFillObject}>
      {/* Overlay backdrop */}
      <Pressable style={styles.overlay} onPress={handleClose} />

      {/* Slide-up Container */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <Animated.View style={[
          styles.sheet, 
          isDarkMode && styles.sheetDark,
          { transform: [{ translateY }], paddingBottom: safeAreaBottom + 16 }
        ]}>
          {/* Drag handle indicator */}
          <View style={styles.dragHandle} />

          {/* Title row */}
          <View style={styles.titleRow}>
            <Text style={[styles.title, isDarkMode && styles.textWhite]}>Add Item</Text>
            <TouchableOpacity 
              style={[styles.closeBtn, isDarkMode && styles.closeBtnDark]} 
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <X size={16} color={isDarkMode ? '#FFFFFF' : '#1C1C1E'} weight="bold" />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.scrollContainer} 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Search Input style element */}
            <View style={[styles.searchContainer, isDarkMode && styles.searchContainerDark]}>
              <MagnifyingGlass size={16} color="#8E8E93" style={styles.searchIcon} />
              <TextInput 
                style={[styles.searchInput, isDarkMode && styles.textWhite]}
                placeholder="Search or type item name"
                placeholderTextColor="#8E8E93"
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Recent chips section */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionLabel}>Recent</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipsRow}
              >
                {RECENT_CHIPS.map((chip, idx) => {
                  let emoji = '🛒';
                  if (chip.name === 'Milk') emoji = '🥛';
                  if (chip.name === 'Eggs') emoji = '🥚';
                  if (chip.name === 'Bread') emoji = '🍞';
                  if (chip.name === 'Chicken') emoji = '🍗';
                  if (chip.name === 'Cheese') emoji = '🧀';

                  return (
                    <TouchableOpacity
                      key={idx}
                      style={[styles.recentChip, isDarkMode && styles.recentChipDark]}
                      onPress={() => handleSelectRecent(chip.name, chip.category)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.recentChipText, isDarkMode && styles.textWhite]}>
                        {emoji} {chip.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Category chips section */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionLabel}>Category</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipsRow}
              >
                {CATEGORIES_WITH_EMOJIS.map((cat) => {
                  const isSelected = selectedCategory === cat.key;
                  return (
                    <TouchableOpacity
                      key={cat.key}
                      style={[
                        styles.categoryChip,
                        isDarkMode && styles.categoryChipDark,
                        isSelected && styles.categoryChipSelected,
                      ]}
                      onPress={() => setSelectedCategory(cat.key)}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.categoryChipText,
                        isDarkMode && styles.textWhite,
                        isSelected && styles.categoryChipTextSelected
                      ]}>
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Item Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Item name *</Text>
              <TextInput 
                style={[styles.fullInput, isDarkMode && styles.fullInputDark, isDarkMode && styles.textWhite]}
                placeholder="e.g. Greek Yogurt"
                placeholderTextColor="#AEAEB2"
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Quantity + Unit Row */}
            <View style={styles.rowContainer}>
              {/* Qty Input */}
              <View style={styles.qtyContainer}>
                <Text style={styles.inputLabel}>Qty</Text>
                <TextInput 
                  style={[styles.fullInput, isDarkMode && styles.fullInputDark, isDarkMode && styles.textWhite, { textAlign: 'center' }]}
                  placeholder="1"
                  placeholderTextColor="#AEAEB2"
                  value={quantity}
                  keyboardType="numeric"
                  onChangeText={setQuantity}
                />
              </View>

              {/* Unit scroll section */}
              <View style={styles.unitContainer}>
                <Text style={styles.inputLabel}>Unit</Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.chipsRow}
                >
                  {UNITS.map((u) => {
                    const isSelected = unit === u;
                    return (
                      <TouchableOpacity
                        key={u}
                        style={[
                          styles.unitChip,
                          isDarkMode && styles.unitChipDark,
                          isSelected && styles.unitChipSelected,
                        ]}
                        onPress={() => setUnit(u)}
                        activeOpacity={0.7}
                      >
                        <Text style={[
                          styles.unitChipText,
                          isDarkMode && styles.textWhite,
                          isSelected && styles.unitChipTextSelected
                        ]}>
                          {u}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            </View>

            {/* Price Input with Prefix */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Price per unit (optional)</Text>
              <View style={[styles.priceInputRow, isDarkMode && styles.priceInputRowDark]}>
                <Text style={styles.currencyPrefix}>$</Text>
                <TextInput 
                  style={[styles.priceInput, isDarkMode && styles.textWhite]}
                  placeholder="0.00"
                  placeholderTextColor="#AEAEB2"
                  keyboardType="decimal-pad"
                  value={price}
                  onChangeText={setPrice}
                />
              </View>
            </View>

            {/* Add to List Button */}
            <TouchableOpacity 
              style={styles.addButton} 
              onPress={handleSave}
              activeOpacity={0.8}
            >
              <Text style={styles.addButtonText}>Add to List</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 10,
  },
  keyboardContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    zIndex: 20,
  },
  sheet: {
    height: '88%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 16,
  },
  sheetDark: {
    backgroundColor: '#1C1C1E',
  },
  dragHandle: {
    width: 36,
    height: 4,
    backgroundColor: '#C7C7CC',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  textWhite: {
    color: '#FFFFFF',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnDark: {
    backgroundColor: '#2C2C2E',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    height: 44,
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 10,
  },
  searchContainerDark: {
    backgroundColor: '#2C2C2E',
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
  sectionContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#636366',
    marginBottom: 6,
  },
  chipsRow: {
    gap: 8,
    paddingVertical: 2,
  },
  recentChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C7C7CC',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  recentChipDark: {
    backgroundColor: '#1C1C1E',
    borderColor: '#3A3A3C',
  },
  recentChipText: {
    fontSize: 13,
    color: '#1C1C1E',
    fontWeight: '500',
  },
  categoryChip: {
    backgroundColor: '#F2F2F7',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  categoryChipDark: {
    backgroundColor: '#2C2C2E',
  },
  categoryChipSelected: {
    backgroundColor: '#D8F3DC',
  },
  categoryChipText: {
    fontSize: 13,
    color: '#636366',
    fontWeight: '500',
  },
  categoryChipTextSelected: {
    color: '#2D6A4F',
    fontWeight: '600',
  },
  inputContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#636366',
    marginBottom: 6,
  },
  fullInput: {
    height: 44,
    borderColor: '#C7C7CC',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#1C1C1E',
    backgroundColor: '#FFFFFF',
  },
  fullInputDark: {
    backgroundColor: '#1C1C1E',
    borderColor: '#3A3A3C',
  },
  rowContainer: {
    flexDirection: 'row',
    marginTop: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  qtyContainer: {
    width: 88,
  },
  unitContainer: {
    flex: 1,
  },
  unitChip: {
    backgroundColor: '#F2F2F7',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  unitChipDark: {
    backgroundColor: '#2C2C2E',
  },
  unitChipSelected: {
    backgroundColor: '#D8F3DC',
  },
  unitChipText: {
    fontSize: 12,
    color: '#636366',
    fontWeight: '500',
  },
  unitChipTextSelected: {
    color: '#2D6A4F',
    fontWeight: '600',
  },
  priceInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderColor: '#C7C7CC',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
  },
  priceInputRowDark: {
    backgroundColor: '#1C1C1E',
    borderColor: '#3A3A3C',
  },
  currencyPrefix: {
    fontSize: 14,
    color: '#636366',
    marginRight: 4,
    fontWeight: '600',
  },
  priceInput: {
    flex: 1,
    fontSize: 14,
    color: '#1C1C1E',
    padding: 0,
  },
  addButton: {
    height: 52,
    backgroundColor: '#2D6A4F',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});`
  },
  {
    path: 'components/EditItemModal.tsx',
    name: 'EditItemModal.tsx',
    language: 'typescript',
    code: `/**
 * FreshCart - Edit Item Bottom Sheet Modal
 * File: components/EditItemModal.tsx
 * 
 * Elegant bottom sheet modal to edit quantity, unit, and price of a grocery item.
 * Adheres strictly to the FreshCart Design System.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import { X, Plus, Minus } from 'phosphor-react-native';
import { Category, GroceryItem } from '../types';

const { height: screenHeight } = Dimensions.get('window');

interface EditItemModalProps {
  visible: boolean;
  item: GroceryItem | null;
  onClose: () => void;
  onSave: (id: string, updates: { quantity: number; unit: string; price: number }) => void;
  isDarkMode?: boolean;
}

const UNITS = ['units', 'kg', 'g', 'lb', 'L', 'ml', 'pack'];

const getCategoryDetails = (category: Category) => {
  switch (category) {
    case 'Fruits':
      return { emoji: '🍎', bg: '#FFF9DB' };
    case 'Vegetables':
      return { emoji: '🥦', bg: '#E5F9EC' };
    case 'Dairy':
      return { emoji: '🥛', bg: '#E5F1FF' };
    case 'Bakery':
      return { emoji: '🍞', bg: '#FFF2E5' };
    case 'Meat & Seafood':
      return { emoji: '🥩', bg: '#FFEBEA' };
    case 'Beverages':
      return { emoji: '🥤', bg: '#F5E6FF' };
    case 'Pantry':
      return { emoji: '🧊', bg: '#EAF9FF' };
    default:
      return { emoji: '📦', bg: '#F2F2F7' };
  }
};

export const EditItemModal: React.FC<EditItemModalProps> = ({
  visible,
  item,
  onClose,
  onSave,
  isDarkMode = false,
}) => {
  // Form State
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState<string>('units');
  const [price, setPrice] = useState<string>('');

  // Animation values
  const translateY = React.useRef(new Animated.Value(screenHeight)).current;

  // Sync state with item when visible changes or item changes
  useEffect(() => {
    if (visible && item) {
      setQuantity(item.quantity || 1);
      setUnit(item.unit || 'units');
      setPrice(item.price ? item.price.toFixed(2) : '');
      
      // Animate slide up
      Animated.timing(translateY, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }).start();
    } else {
      // Animate slide down
      Animated.timing(translateY, {
        toValue: screenHeight,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, item]);

  if (!visible || !item) return null;

  const categoryDetails = getCategoryDetails(item.category);

  const handleClose = () => {
    Animated.timing(translateY, {
      toValue: screenHeight,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  const handleSave = () => {
    const priceNum = parseFloat(price) || 0;
    onSave(item.id, {
      quantity,
      unit,
      price: priceNum,
    });
    handleClose();
  };

  const incrementQty = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQty = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const calculatedTotal = (quantity * (parseFloat(price) || 0)).toFixed(2);
  const safeAreaBottom = Platform.OS === 'ios' ? 34 : 16;

  return (
    <View style={StyleSheet.absoluteFillObject}>
      {/* Overlay backdrop */}
      <Pressable style={styles.overlay} onPress={handleClose} />

      {/* Slide-up Container */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <Animated.View style={[
          styles.sheet, 
          isDarkMode && styles.sheetDark,
          { transform: [{ translateY }], paddingBottom: safeAreaBottom + 16 }
        ]}>
          {/* Drag handle indicator */}
          <View style={styles.dragHandle} />

          {/* Item Header */}
          <View style={styles.headerContainer}>
            <View style={[styles.emojiContainer, { backgroundColor: categoryDetails.bg }]}>
              <Text style={styles.emojiText}>{categoryDetails.emoji}</Text>
            </View>
            <View style={styles.headerText}>
              <Text style={[styles.itemName, isDarkMode && styles.textWhite]}>{item.name}</Text>
              <Text style={styles.categoryLabel}>{item.category}</Text>
            </View>
            <TouchableOpacity 
              style={[styles.closeBtn, isDarkMode && styles.closeBtnDark]} 
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <X size={16} color={isDarkMode ? '#FFFFFF' : '#1C1C1E'} weight="bold" />
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={[styles.divider, isDarkMode && styles.dividerDark]} />

          <ScrollView 
            style={styles.scrollContainer} 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Quantity Section */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionLabel}>Quantity</Text>
              
              {/* Stepper row */}
              <View style={styles.stepperRow}>
                <TouchableOpacity 
                  style={[styles.stepperBtn, isDarkMode && styles.stepperBtnDark]} 
                  onPress={decrementQty}
                  activeOpacity={0.7}
                >
                  <Minus size={20} color={isDarkMode ? '#FFFFFF' : '#1C1C1E'} weight="bold" />
                </TouchableOpacity>
                
                <Text style={[styles.qtyValue, isDarkMode && styles.textWhite]}>{quantity}</Text>
                
                <TouchableOpacity 
                  style={[styles.stepperBtn, styles.stepperBtnPlus]} 
                  onPress={incrementQty}
                  activeOpacity={0.7}
                >
                  <Plus size={20} color="#2D6A4F" weight="bold" />
                </TouchableOpacity>
              </View>

              {/* Unit Chips */}
              <View style={styles.unitRowContainer}>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.unitChipsScroll}
                >
                  {UNITS.map((u) => {
                    const isSelected = unit === u;
                    return (
                      <TouchableOpacity
                        key={u}
                        style={[
                          styles.unitChip,
                          isDarkMode && styles.unitChipDark,
                          isSelected && styles.unitChipSelected,
                        ]}
                        onPress={() => setUnit(u)}
                        activeOpacity={0.7}
                      >
                        <Text style={[
                          styles.unitChipText,
                          isDarkMode && styles.textWhite,
                          isSelected && styles.unitChipTextSelected
                        ]}>
                          {u}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            </View>

            {/* Price Section */}
            <View style={styles.priceSectionContainer}>
              <Text style={styles.sectionLabel}>Price per unit</Text>
              <View style={[styles.priceInputWrapper, isDarkMode && styles.priceInputWrapperDark]}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput 
                  style={[styles.priceInput, isDarkMode && styles.textWhite]}
                  placeholder="0.00"
                  placeholderTextColor="#AEAEB2"
                  keyboardType="decimal-pad"
                  value={price}
                  onChangeText={setPrice}
                />
              </View>
              
              <Text style={styles.liveTotalText}>
                Total: <Text style={styles.liveTotalVal}>\${calculatedTotal}</Text>
              </Text>
            </View>

            {/* Buttons Row */}
            <View style={styles.buttonsRow}>
              <TouchableOpacity 
                style={[styles.btnCancel, isDarkMode && styles.btnCancelDark]} 
                onPress={handleClose}
                activeOpacity={0.7}
              >
                <Text style={[styles.btnCancelText, isDarkMode && styles.textWhite]}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.btnSave} 
                onPress={handleSave}
                activeOpacity={0.8}
              >
                <Text style={styles.btnSaveText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 10,
  },
  keyboardContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    zIndex: 20,
  },
  sheet: {
    height: '60%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 16,
  },
  sheetDark: {
    backgroundColor: '#1C1C1E',
  },
  dragHandle: {
    width: 36,
    height: 4,
    backgroundColor: '#C7C7CC',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  emojiContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: {
    fontSize: 20,
  },
  headerText: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  categoryLabel: {
    fontSize: 13,
    color: '#636366',
    fontWeight: '500',
  },
  textWhite: {
    color: '#FFFFFF',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnDark: {
    backgroundColor: '#2C2C2E',
  },
  divider: {
    height: 1,
    backgroundColor: '#F2F2F7',
    marginTop: 16,
    width: '100%',
  },
  dividerDark: {
    backgroundColor: '#2C2C2E',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  sectionContainer: {
    padding: 16,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#636366',
    marginBottom: 8,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  stepperBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnDark: {
    backgroundColor: '#2C2C2E',
  },
  stepperBtnPlus: {
    backgroundColor: '#D8F3DC',
  },
  qtyValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1C1E',
    minWidth: 64,
    textAlign: 'center',
  },
  unitRowContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  unitChipsScroll: {
    gap: 8,
    paddingHorizontal: 4,
  },
  unitChip: {
    backgroundColor: '#F2F2F7',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  unitChipDark: {
    backgroundColor: '#2C2C2E',
  },
  unitChipSelected: {
    backgroundColor: '#D8F3DC',
  },
  unitChipText: {
    fontSize: 13,
    color: '#636366',
    fontWeight: '500',
  },
  unitChipTextSelected: {
    color: '#2D6A4F',
    fontWeight: '600',
  },
  priceSectionContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  priceInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  priceInputWrapperDark: {
    backgroundColor: '#2C2C2E',
  },
  currencySymbol: {
    fontSize: 16,
    color: '#636366',
    fontWeight: '600',
    marginRight: 4,
  },
  priceInput: {
    flex: 1,
    fontSize: 15,
    color: '#1C1C1E',
    padding: 0,
  },
  liveTotalText: {
    fontSize: 14,
    color: '#2D6A4F',
    fontWeight: '500',
    marginTop: 8,
  },
  liveTotalVal: {
    fontWeight: '700',
  },
  buttonsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 20,
    gap: 12,
  },
  btnCancel: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCancelDark: {
    backgroundColor: '#2C2C2E',
  },
  btnCancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#636366',
  },
  btnSave: {
    flex: 2,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#2D6A4F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSaveText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});`
  },
  {
    path: 'components/FinishShoppingModal.tsx',
    name: 'FinishShoppingModal.tsx',
    language: 'typescript',
    code: `/**
 * FreshCart - Finish Shopping Confirmation Modal
 * File: components/FinishShoppingModal.tsx
 * 
 * Centered confirmation dialog before finishing shopping.
 * Offers options to record store name, see summary, and automatically move items to the pantry.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  Switch,
  Dimensions,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableWithoutFeedback
} from 'react-native';
import { ShoppingCartSimple } from 'phosphor-react-native';

const { width: screenWidth } = Dimensions.get('window');

interface FinishShoppingModalProps {
  visible: boolean;
  itemsPurchasedCount: number;
  totalCost: number;
  timeSpentMinutes: number;
  defaultStore?: string;
  onClose: () => void;
  onConfirm: (storeName: string, moveToPantry: boolean) => Promise<void> | void;
  isDarkMode?: boolean;
}

export const FinishShoppingModal: React.FC<FinishShoppingModalProps> = ({
  visible,
  itemsPurchasedCount,
  totalCost,
  timeSpentMinutes,
  defaultStore = 'Walmart',
  onClose,
  onConfirm,
  isDarkMode = false,
}) => {
  const [storeName, setStoreName] = useState(defaultStore);
  const [moveToPantry, setMoveToPantry] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Sync with defaultStore prop when modal becomes visible
  useEffect(() => {
    if (visible) {
      setStoreName(defaultStore);
      setMoveToPantry(true);
      setIsLoading(false);
    }
  }, [visible, defaultStore]);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm(storeName, moveToPantry);
    } catch (error) {
      console.error('Error finishing shopping:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.keyboardContainer}
            >
              <View style={[
                styles.card,
                isDarkMode && styles.cardDark
              ]}>
                {/* ICON (centered) */}
                <View style={styles.iconContainer}>
                  <ShoppingCartSimple size={28} color="#2D6A4F" weight="bold" />
                </View>

                {/* TITLE */}
                <Text style={[styles.title, isDarkMode && styles.textWhite]}>
                  Finish Shopping?
                </Text>

                {/* SUMMARY ROWS */}
                <View style={styles.summaryContainer}>
                  <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, isDarkMode && styles.textGrayLighter]}>
                      Items purchased
                    </Text>
                    <Text style={styles.summaryValueHighlighted}>
                      \${itemsPurchasedCount} items
                    </Text>
                  </View>

                  <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, isDarkMode && styles.textGrayLighter]}>
                      List total
                    </Text>
                    <Text style={styles.summaryValueHighlighted}>
                      \$\${totalCost.toFixed(2)}
                    </Text>
                  </View>

                  <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, isDarkMode && styles.textGrayLighter]}>
                      Time spent
                    </Text>
                    <Text style={[styles.summaryValue, isDarkMode && styles.textWhite]}>
                      \${timeSpentMinutes} minutes
                    </Text>
                  </View>
                </View>

                {/* STORE INPUT */}
                <View style={styles.inputContainer}>
                  <Text style={[styles.inputLabel, isDarkMode && styles.textGrayLighter]}>
                    Store name (optional)
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      isDarkMode && styles.inputDark
                    ]}
                    placeholder="e.g. Walmart"
                    placeholderTextColor="#AEAEB2"
                    value={storeName}
                    onChangeText={setStoreName}
                  />
                </View>

                {/* DIVIDER */}
                <View style={[styles.divider, isDarkMode && styles.dividerDark]} />

                {/* PANTRY TOGROW */}
                <View style={styles.pantryRow}>
                  <View style={styles.pantryTextContainer}>
                    <Text style={[styles.pantryTitle, isDarkMode && styles.textWhite]}>
                      Move to Pantry?
                    </Text>
                    <Text style={styles.pantrySubtitle}>
                      Add purchased items to your pantry
                    </Text>
                  </View>
                  <Switch
                    value={moveToPantry}
                    onValueChange={setMoveToPantry}
                    thumbColor={Platform.OS === 'android' ? '#FFFFFF' : undefined}
                    trackColor={{ false: '#C7C7CC', true: '#2D6A4F' }}
                  />
                </View>

                {/* BUTTONS */}
                <View style={styles.buttonsContainer}>
                  <TouchableOpacity
                    style={[
                      styles.btnCancel,
                      isDarkMode && styles.btnCancelDark
                    ]}
                    onPress={onClose}
                    disabled={isLoading}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.btnCancelText, isDarkMode && styles.textWhite]}>
                      Cancel
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.btnConfirm}
                    onPress={handleConfirm}
                    disabled={isLoading}
                    activeOpacity={0.8}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.btnConfirmText}>
                        Finish Shopping ✓
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: screenWidth * 0.9,
    maxWidth: 380,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 3,
  },
  cardDark: {
    backgroundColor: '#1C1C1E',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#D8F3DC',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
    textAlign: 'center',
    marginTop: 16,
  },
  textWhite: {
    color: '#FFFFFF',
  },
  textGrayLighter: {
    color: '#AEAEB2',
  },
  summaryContainer: {
    marginTop: 16,
    gap: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#636366',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 14,
    color: '#1C1C1E',
    fontWeight: '600',
  },
  summaryValueHighlighted: {
    fontSize: 14,
    color: '#2D6A4F',
    fontWeight: '700',
  },
  inputContainer: {
    marginTop: 16,
  },
  inputLabel: {
    fontSize: 13,
    color: '#636366',
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 48,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#1C1C1E',
  },
  inputDark: {
    backgroundColor: '#2C2C2E',
    color: '#FFFFFF',
  },
  divider: {
    height: 1,
    backgroundColor: '#F2F2F7',
    marginTop: 16,
    width: '100%',
  },
  dividerDark: {
    backgroundColor: '#2C2C2E',
  },
  pantryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  pantryTextContainer: {
    flex: 1,
    paddingRight: 16,
  },
  pantryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  pantrySubtitle: {
    fontSize: 12,
    color: '#636366',
    marginTop: 2,
    fontWeight: '500',
  },
  buttonsContainer: {
    marginTop: 20,
    gap: 12,
  },
  btnCancel: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCancelDark: {
    backgroundColor: '#2C2C2E',
  },
  btnCancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#636366',
  },
  btnConfirm: {
    width: '100%',
    height: 52,
    borderRadius: 12,
    backgroundColor: '#2D6A4F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnConfirmText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});`
  },
  {
    path: 'components/QuantityModal.tsx',
    name: 'QuantityModal.tsx',
    language: 'typescript',
    code: `/**
 * FreshCart - Quantity Editor Modal
 * File: components/QuantityModal.tsx
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Plus, Minus, X } from 'phosphor-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GroceryItem } from '../types';

interface QuantityModalProps {
  visible: boolean;
  item: GroceryItem | null;
  onClose: () => void;
  onSave: (id: string, quantity: number) => void;
  isDarkMode?: boolean;
}

export const QuantityModal: React.FC<QuantityModalProps> = ({
  visible,
  item,
  onClose,
  onSave,
  isDarkMode = false
}) => {
  const insets = useSafeAreaInsets();
  const [qty, setQty] = useState<number>(0);

  useEffect(() => {
    if (item) {
      setQty(item.quantity);
    }
  }, [item, visible]);

  const handleSave = () => {
    if (item) {
      onSave(item.id, qty);
      onClose();
    }
  };

  if (!item) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.content, isDarkMode && styles.contentDark, { paddingBottom: Math.max(24, insets.bottom) }]}>
          <View style={styles.header}>
            <Text style={[styles.title, isDarkMode && styles.textDark]}>Set Quantity</Text>
            <TouchableOpacity onPress={onClose} style={[styles.closeBtn, isDarkMode && styles.closeBtnDark]}>
              <X size={18} color={isDarkMode ? '#FFFFFF' : '#1C1C1E'} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.subtitle, isDarkMode && styles.textDarkVariant]}>{item.name}</Text>

          <View style={styles.editorRow}>
            <TouchableOpacity 
              style={[styles.mathBtn, isDarkMode && styles.mathBtnDark]} 
              onPress={() => setQty(q => Math.max(0, q - 1))}
            >
              <Minus size={22} color="#2D6A4F" weight="bold" />
            </TouchableOpacity>

            <TextInput
              style={[styles.input, isDarkMode && styles.inputDark]}
              keyboardType="number-pad"
              value={String(qty)}
              onChangeText={(txt) => {
                const parsed = parseInt(txt) || 0;
                setQty(Math.max(0, parsed));
              }}
            />

            <TouchableOpacity 
              style={[styles.mathBtn, isDarkMode && styles.mathBtnDark]} 
              onPress={() => setQty(q => q + 1)}
            >
              <Plus size={22} color="#2D6A4F" weight="bold" />
            </TouchableOpacity>
          </View>

          <View style={styles.presetRow}>
            {[1, 2, 3, 5, 10].map(val => (
              <TouchableOpacity 
                key={val} 
                style={[styles.presetBtn, isDarkMode && styles.presetBtnDark, qty === val && styles.presetBtnActive]}
                onPress={() => setQty(val)}
              >
                <Text style={[styles.presetText, qty === val && styles.presetTextActive]}>+{val}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Save Quantity</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  content: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  contentDark: { backgroundColor: '#1C1C1E' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  title: { fontSize: 20, fontWeight: '700', color: '#1C1C1E' },
  subtitle: { fontSize: 15, color: '#636366', marginBottom: 24 },
  textDark: { color: '#FFFFFF' },
  textDarkVariant: { color: '#8E8E93' },
  closeBtn: { padding: 8, borderRadius: 99, backgroundColor: '#F2F2F7' },
  closeBtnDark: { backgroundColor: '#2C2C2E' },
  editorRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 16 },
  mathBtn: { width: 54, height: 54, borderRadius: 27, borderWidth: 2, borderColor: '#2D6A4F', alignItems: 'center', justifyContent: 'center', backgroundColor: '#D8F3DC' },
  mathBtnDark: { backgroundColor: '#1B4332', borderColor: '#2D6A4F' },
  input: { fontSize: 28, fontWeight: '700', color: '#1C1C1E', textAlign: 'center', width: 100, marginHorizontal: 16, borderBottomWidth: 2, borderBottomColor: '#2D6A4F', paddingBottom: 4 },
  inputDark: { color: '#FFFFFF' },
  presetRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 16 },
  presetBtn: { flex: 1, marginHorizontal: 4, paddingVertical: 8, borderRadius: 8, backgroundColor: '#F2F2F7', alignItems: 'center' },
  presetBtnDark: { backgroundColor: '#2C2C2E' },
  presetBtnActive: { backgroundColor: '#2D6A4F' },
  presetText: { fontSize: 13, fontWeight: '600', color: '#1C1C1E' },
  presetTextActive: { color: '#FFFFFF' },
  saveBtn: { backgroundColor: '#2D6A4F', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  saveBtnText: { color: '#FFFFFF', fontSize: 17, fontWeight: '600' }
});`
  },
  {
    path: 'components/PriceModal.tsx',
    name: 'PriceModal.tsx',
    language: 'typescript',
    code: `/**
 * FreshCart - Unit Price Editor Modal
 * File: components/PriceModal.tsx
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput } from 'react-native';
import { X } from 'phosphor-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GroceryItem } from '../types';

interface PriceModalProps {
  visible: boolean;
  item: GroceryItem | null;
  onClose: () => void;
  onSave: (id: string, price: number) => void;
  isDarkMode?: boolean;
}

export const PriceModal: React.FC<PriceModalProps> = ({
  visible,
  item,
  onClose,
  onSave,
  isDarkMode = false
}) => {
  const insets = useSafeAreaInsets();
  const [priceStr, setPriceStr] = useState<string>('0.00');

  useEffect(() => {
    if (item) {
      setPriceStr(item.price === 0 ? '' : item.price.toFixed(2));
    }
  }, [item, visible]);

  const handleSave = () => {
    if (item) {
      const parsedPrice = parseFloat(priceStr) || 0.00;
      onSave(item.id, parsedPrice);
      onClose();
    }
  };

  if (!item) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.content, isDarkMode && styles.contentDark, { paddingBottom: Math.max(24, insets.bottom) }]}>
          <View style={styles.header}>
            <Text style={[styles.title, isDarkMode && styles.textDark]}>Set Unit Price</Text>
            <TouchableOpacity onPress={onClose} style={[styles.closeBtn, isDarkMode && styles.closeBtnDark]}>
              <X size={18} color={isDarkMode ? '#FFFFFF' : '#1C1C1E'} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.subtitle, isDarkMode && styles.textDarkVariant]}>{item.name}</Text>

          <View style={styles.inputContainer}>
            <Text style={[styles.dollarSign, isDarkMode && styles.textDark]}>\$</Text>
            <TextInput
              style={[styles.input, isDarkMode && styles.inputDark]}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor="#8E8E93"
              value={priceStr}
              onChangeText={(txt) => {
                // Filter characters to allow only numeric and single dot
                const filtered = txt.replace(/[^0-9.]/g, '');
                setPriceStr(filtered);
              }}
            />
          </View>

          <View style={styles.quickSelectRow}>
            {[0.99, 1.49, 2.99, 4.99, 9.99].map(val => (
              <TouchableOpacity 
                key={val} 
                style={[styles.quickBtn, isDarkMode && styles.quickBtnDark]}
                onPress={() => setPriceStr(val.toFixed(2))}
              >
                <Text style={styles.quickText}>\${val.toFixed(2)}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Save Price</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  content: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  contentDark: { backgroundColor: '#1C1C1E' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  title: { fontSize: 20, fontWeight: '700', color: '#1C1C1E' },
  subtitle: { fontSize: 15, color: '#636366', marginBottom: 24 },
  textDark: { color: '#FFFFFF' },
  textDarkVariant: { color: '#8E8E93' },
  closeBtn: { padding: 8, borderRadius: 99, backgroundColor: '#F2F2F7' },
  closeBtnDark: { backgroundColor: '#2C2C2E' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderBottomWidth: 2, borderBottomColor: '#2D6A4F', paddingBottom: 8, marginVertical: 16 },
  dollarSign: { fontSize: 32, fontWeight: '700', color: '#1C1C1E', marginRight: 4 },
  input: { fontSize: 32, fontWeight: '700', color: '#1C1C1E', minWidth: 150, textAlign: 'left' },
  inputDark: { color: '#FFFFFF' },
  quickSelectRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginVertical: 16 },
  quickBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: '#F2F2F7', borderWidth: 1, borderColor: '#E5E5EA' },
  quickBtnDark: { backgroundColor: '#2C2C2E', borderColor: '#3A3A3C' },
  quickText: { fontSize: 13, fontWeight: '600', color: '#2D6A4F' },
  saveBtn: { backgroundColor: '#2D6A4F', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  saveBtnText: { color: '#FFFFFF', fontSize: 17, fontWeight: '600' }
});`
  },
  {
    path: 'services/firebase.ts',
    name: 'firebase.ts',
    language: 'typescript',
    code: `/**
 * FreshCart - Firebase Sync Service
 * File: services/firebase.ts
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { GroceryItem, PurchaseHistoryItem } from '../types';

const firebaseConfig = {
  apiKey: "YOUR_EXPO_PUBLIC_FIREBASE_API_KEY",
  authDomain: "gen-lang-client-0931318243.firebaseapp.com",
  projectId: "gen-lang-client-0931318243",
  storageBucket: "gen-lang-client-0931318243.firebasestorage.app",
  messagingSenderId: "642248019805",
  appId: "1:642248019805:web:577a1877d7755547a3a2b4"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);

export async function syncGroceryItemsToCloud(userId: string, items: GroceryItem[]): Promise<void> {
  const userListRef = doc(db, 'users', userId, 'config', 'groceryList');
  await setDoc(userListRef, { items, lastSync: Date.now() }, { merge: true });
}

export async function savePurchaseToCloudHistory(userId: string, historyItem: PurchaseHistoryItem): Promise<void> {
  const historyDocRef = doc(db, 'users', userId, 'history', historyItem.id);
  await setDoc(historyDocRef, historyItem);
}`
  },
  {
    path: 'screens/SplashScreen.tsx',
    name: 'SplashScreen.tsx',
    language: 'typescript',
    code: `/**
 * FreshCart - Splash Screen Component
 * File: screens/SplashScreen.tsx
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, StatusBar } from 'react-native';
import { auth } from '../services/firebase';

// Simple navigation typing for Stack Navigation
interface SplashScreenProps {
  navigation: {
    replace: (screenName: string) => void;
  };
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  useEffect(() => {
    let isMounted = true;

    const checkAuthState = async () => {
      // Hold splash screen for ~1.8 seconds to display brand assets
      await new Promise((resolve) => setTimeout(resolve, 1800));

      if (!isMounted) return;

      try {
        // Retrieve current authenticated session state from Firebase Auth
        const user = auth.currentUser;
        
        // Direct transition routing - replace to prevent going back to splash
        navigation.replace(user ? 'Main' : 'Login');
      } catch (error) {
        console.error('Failed to resolve authentication state:', error);
        // Fallback safety transition
        navigation.replace('Login');
      }
    };

    checkAuthState();

    return () => {
      isMounted = false;
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Configure StatusBar to be light-content over the brand primary color */}
      <StatusBar barStyle="light-content" backgroundColor="#2D6A4F" />

      {/* Main Branding Stack */}
      <View style={styles.brandStack}>
        {/* App Icon: Shopping Cart Emoji */}
        <Text style={styles.appIcon} accessibilityRole="image" accessibilityLabel="Shopping Cart Icon">
          🛒
        </Text>

        {/* App Name */}
        <Text style={styles.appName}>FreshCart</Text>

        {/* Tagline */}
        <Text style={styles.tagline}>Shop smart. Cook smarter.</Text>
      </View>

      {/* Loading Indicator pinned to the bottom area */}
      <View style={styles.indicatorContainer}>
        <ActivityIndicator size="small" color="#FFFFFF" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D6A4F', // Brand primary green
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandStack: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  appIcon: {
    fontSize: 72,
  },
  appName: {
    fontSize: 34,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 16,
  },
  tagline: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.75)', // White with 0.75 opacity
    marginTop: 8,
    textAlign: 'center',
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 60,
  },
});

export default SplashScreen;`
  },
  {
    path: 'screens/HomeScreen.tsx',
    name: 'HomeScreen.tsx',
    language: 'typescript',
    code: `/**
 * FreshCart - Home Dashboard Screen
 * File: screens/HomeScreen.tsx
 */

import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar 
} from 'react-native';
// Phosphor icon imports for native Expo UI
import { Bell, WarningCircle, CaretRight, ShoppingCart, ArrowUpRight } from 'phosphor-react-native';

// Simple interface mimicking the Safe Area context
const safeArea = { top: 44 }; // Typical notch safe area padding in iOS

export const HomeScreen: React.FC = () => {
  // Realistic mock variables for dynamic display
  const hasNotifications = true;
  const expiringItemsCount = 3;
  const totalItems = 12;
  const estimatedTotal = 34.50;
  const checkedItemsCount = 4;
  const totalItemsToTrack = 10;
  const completionPercentage = (checkedItemsCount / totalItemsToTrack) * 100;

  return (
    <View style={styles.container}>
      {/* Set status bar style for top background alignment */}
      <StatusBar barStyle="light-content" backgroundColor="#2D6A4F" />

      {/* TOP HEADER */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greetingText}>Good morning, Gabriel 👋</Text>
            <Text style={styles.dateText}>Sunday, July 6, 2026</Text>
          </View>
          <TouchableOpacity style={styles.bellButton} activeOpacity={0.7}>
            <Bell size={24} color="#FFFFFF" weight="regular" />
            {hasNotifications && <View style={styles.notificationBadge} />}
          </TouchableOpacity>
        </View>
      </View>

      {/* CONTENT WITH OVERLAP SCROLL VIEW */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* CARD 1 — Active Shopping List (Overlapping Header) */}
        <View style={styles.overlapCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardTitleContainer}>
              <Text style={styles.cardTitle}>🛒 Current List</Text>
            </View>
            <TouchableOpacity style={styles.openButtonRow} activeOpacity={0.7}>
              <Text style={styles.openButtonText}>Open</Text>
              <CaretRight size={14} color="#2D6A4F" weight="bold" />
            </TouchableOpacity>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.pillBadge}>
              <Text style={styles.pillText}>{totalItems} items</Text>
            </View>
            <View style={styles.pillBadge}>
              <Text style={styles.pillText}>\${estimatedTotal.toFixed(2)} estimated</Text>
            </View>
          </View>

          {/* Progress Bar Container */}
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: completionPercentage + '%' }]} />
          </View>

          {/* Progress Text Description */}
          <Text style={styles.progressLabel}>
            {checkedItemsCount} of {totalItemsToTrack} items checked
          </Text>
        </View>

        {/* EXPIRING BANNER */}
        {expiringItemsCount > 0 && (
          <TouchableOpacity style={styles.warningBanner} activeOpacity={0.9}>
            <View style={styles.warningRow}>
              <View style={styles.warningLeft}>
                <WarningCircle size={20} color="#FF9500" weight="fill" />
                <Text style={styles.warningText}>{expiringItemsCount} items expiring soon</Text>
              </View>
              <View style={styles.warningRight}>
                <Text style={styles.warningActionText}>View</Text>
                <CaretRight size={12} color="#FF9500" weight="bold" />
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* SECTION TITLE: Your Activity */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Activity</Text>
        </View>

        {/* STATS GRID (2x2 Layout) */}
        <View style={styles.gridContainer}>
          <View style={styles.gridRow}>
            {/* Stat Card 1 */}
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Recipes Saved</Text>
            </View>

            {/* Stat Card 2 */}
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>5</Text>
              <Text style={styles.statLabel}>Lists Completed</Text>
            </View>
          </View>

          <View style={styles.gridRow}>
            {/* Stat Card 3 */}
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>34</Text>
              <Text style={styles.statLabel}>Pantry Items</Text>
            </View>

            {/* Stat Card 4 */}
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>\$245</Text>
              <Text style={styles.statLabel}>Total Tracked</Text>
            </View>
          </View>
        </View>

        {/* SECTION: Recipe for Today */}
        <View style={styles.sectionHeaderWithAction}>
          <Text style={styles.sectionTitle}>Recipe for Today</Text>
          <TouchableOpacity activeOpacity={0.7} style={styles.seeAllRow}>
            <Text style={styles.seeAllText}>See all</Text>
            <ArrowUpRight size={14} color="#2D6A4F" weight="bold" />
          </TouchableOpacity>
        </View>

        {/* RECIPE CARD */}
        <View style={styles.recipeCard}>
          {/* Gradient-like Solid Aesthetic Color block for background image fallback */}
          <View style={styles.recipeImagePlaceholder}>
            <View style={styles.recipeImageGradientCover}>
              <Text style={styles.recipeBadge}>HEALTHY CHOICE</Text>
              <Text style={styles.recipeName}>Honey Sesame Chicken & Broccoli</Text>
              <Text style={styles.recipeMeta}>30 min • 4 servings</Text>
            </View>
          </View>

          {/* Action button in the recipe card */}
          <TouchableOpacity style={styles.cookButton} activeOpacity={0.8}>
            <Text style={styles.cookButtonText}>Cook this recipe →</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom spacer padding for safety above native tab bars */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7', // Native iOS light gray background
  },
  header: {
    backgroundColor: '#2D6A4F', // Brand Green
    paddingTop: safeArea.top + 16,
    paddingBottom: 40, // Expanded padding bottom for card overlap effect
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  dateText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 4,
  },
  bellButton: {
    padding: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30', // Vibrant notification red dot
    borderWidth: 1.5,
    borderColor: '#2D6A4F',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Safe padding for the floating navigation tab bar
  },
  overlapCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: -20, // Critical negative margins to overlapping header effect
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3, // Android shadow fallback
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  openButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  openButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D6A4F',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  pillBadge: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  pillText: {
    fontSize: 12,
    color: '#636366',
    fontWeight: '500',
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#F2F2F7',
    borderRadius: 3,
    width: '100%',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2D6A4F',
    borderRadius: 3,
  },
  progressLabel: {
    fontSize: 12,
    color: '#636366',
    marginTop: 6,
    fontWeight: '500',
  },
  warningBanner: {
    backgroundColor: '#FFF3CD', // Soft yellow warning background
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 149, 0, 0.15)',
  },
  warningRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  warningLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  warningText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF9500',
  },
  warningRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  warningActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF9500',
  },
  sectionHeader: {
    marginTop: 24,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  sectionHeaderWithAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  seeAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2D6A4F',
  },
  gridContainer: {
    marginHorizontal: 16,
    gap: 12,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2D6A4F',
  },
  statLabel: {
    fontSize: 12,
    color: '#636366',
    marginTop: 4,
    fontWeight: '500',
  },
  recipeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  recipeImagePlaceholder: {
    height: 160,
    backgroundColor: '#40916C', // Fallback primary background green
  },
  recipeImageGradientCover: {
    flex: 1,
    backgroundColor: 'rgba(27, 67, 50, 0.75)', // Deep forest overlay mimicry
    padding: 16,
    justifyContent: 'flex-end',
  },
  recipeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#2D6A4F',
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  recipeMeta: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
    fontWeight: '500',
  },
  cookButton: {
    backgroundColor: '#2D6A4F',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cookButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  bottomSpacer: {
    height: 20,
  }
});

export default HomeScreen;`
  },
  {
    path: 'screens/ActiveListScreen.tsx',
    name: 'ActiveListScreen.tsx',
    language: 'typescript',
    code: `/**
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
            <Text style={styles.totalAmount}>\${estimatedTotal.toFixed(2)}</Text>
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
                    <Text style={styles.itemPrice}>\${item.price.toFixed(2)}</Text>
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

export default ActiveListScreen;`
  },
  {
    path: 'screens/LoginScreen.tsx',
    name: 'LoginScreen.tsx',
    language: 'typescript',
    code: `/**
 * FreshCart - Login Screen Component
 * File: screens/LoginScreen.tsx
 */

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  ScrollView, 
  Platform,
  StatusBar
} from 'react-native';
import { Eye, EyeSlash } from 'phosphor-react-native';

interface LoginScreenProps {
  navigation: {
    replace: (screenName: string) => void;
    navigate?: (screenName: string) => void;
  };
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = (): boolean => {
    const tempErrors: { email?: string; password?: string } = {};
    let isValid = true;

    if (!email) {
      tempErrors.email = 'Email address is required.';
      isValid = false;
    } else if (!email.includes('@') || !email.includes('.')) {
      tempErrors.email = 'Please enter a valid email address.';
      isValid = false;
    }

    if (!password) {
      tempErrors.password = 'Password is required.';
      isValid = false;
    } else if (password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters.';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSignIn = () => {
    if (!validate()) return;

    setIsLoading(true);

    // Mock authentication with a realistic delay
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to Main Dashboard on successful login
      navigation.replace('Main');
    }, 1500);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#2D6A4F" />
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* TOP HEADER SECTION */}
        <View style={styles.topSection}>
          <Text style={styles.appIcon} accessibilityRole="image" accessibilityLabel="Shopping Cart">
            🛒
          </Text>
          <Text style={styles.appName}>FreshCart</Text>
          <Text style={styles.appTagline}>Your smart kitchen companion</Text>
        </View>

        {/* FORM SECTION OVERLAPPING THE TOP SECTION */}
        <View style={styles.formSection}>
          <Text style={styles.welcomeTitle}>Welcome back</Text>
          <Text style={styles.welcomeSubtitle}>Sign in to your account</Text>

          {/* EMAIL INPUT */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={[styles.inputWrapper, errors.email ? styles.inputErrorBorder : null]}>
              <TextInput
                style={styles.textInput}
                placeholder="you@example.com"
                placeholderTextColor="#A0A0A0"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                }}
              />
            </View>
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          {/* PASSWORD INPUT */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={[styles.inputWrapper, errors.password ? styles.inputErrorBorder : null]}>
              <TextInput
                style={styles.textInput}
                placeholder="••••••••"
                placeholderTextColor="#A0A0A0"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
                }}
              />
              <TouchableOpacity 
                style={styles.eyeButton} 
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.7}
              >
                {showPassword ? (
                  <EyeSlash size={20} color="#636366" />
                ) : (
                  <Eye size={20} color="#636366" />
                )}
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          {/* FORGOT PASSWORD */}
          <TouchableOpacity 
            style={styles.forgotPasswordButton} 
            activeOpacity={0.7}
            onPress={() => navigation.navigate?.('ForgotPassword')}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* SIGN IN BUTTON */}
          <TouchableOpacity 
            style={styles.signInButton} 
            onPress={handleSignIn}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.signInButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          {/* OR DIVIDER */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* GOOGLE SIGN IN BUTTON */}
          <TouchableOpacity style={styles.googleButton} activeOpacity={0.8}>
            <View style={styles.googleContent}>
              <Text style={styles.googleLogo}>G</Text>
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </View>
          </TouchableOpacity>

          {/* FOOTER REGISTER LINK */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity 
              activeOpacity={0.7}
              onPress={() => navigation.navigate?.('Register')}
            >
              <Text style={styles.registerLinkText}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#F2F2F7',
  },
  topSection: {
    height: 220,
    backgroundColor: '#2D6A4F',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  appIcon: {
    fontSize: 48,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 8,
  },
  appTagline: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  formSection: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -20,
    padding: 28,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: '#636366',
    marginTop: 4,
    marginBottom: 28,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#636366',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
    height: 52,
    paddingHorizontal: 16,
  },
  inputErrorBorder: {
    borderColor: '#FF3B30',
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#1C1C1E',
    height: '100%',
    padding: 0,
  },
  eyeButton: {
    padding: 8,
    marginRight: -8,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  forgotPasswordText: {
    color: '#2D6A4F',
    fontSize: 14,
    fontWeight: '600',
  },
  signInButton: {
    backgroundColor: '#2D6A4F',
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
    shadowColor: '#2D6A4F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E5EA',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '500',
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#C7C7CC',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  googleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  googleLogo: {
    color: '#4285F4',
    fontSize: 18,
    fontWeight: '900',
  },
  googleButtonText: {
    color: '#1C1C1E',
    fontSize: 15,
    fontWeight: '600',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  footerText: {
    color: '#636366',
    fontSize: 14,
  },
  registerLinkText: {
    color: '#2D6A4F',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default LoginScreen;`
  },
  {
    path: 'screens/RegisterScreen.tsx',
    name: 'RegisterScreen.tsx',
    language: 'typescript',
    code: `/**
 * FreshCart - Register Screen Component
 * File: screens/RegisterScreen.tsx
 */

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  ScrollView, 
  Platform,
  StatusBar
} from 'react-native';
import { CaretLeft, Eye, EyeSlash } from 'phosphor-react-native';

interface RegisterScreenProps {
  navigation?: {
    goBack: () => void;
    navigate: (screenName: string) => void;
    replace: (screenName: string) => void;
  };
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validate = (): boolean => {
    const tempErrors: typeof errors = {};
    let isValid = true;

    // Name: required, length >= 2
    if (!name.trim()) {
      tempErrors.name = 'Full name is required.';
      isValid = false;
    } else if (name.trim().length < 2) {
      tempErrors.name = 'Name must be at least 2 characters.';
      isValid = false;
    }

    // Email: valid format
    if (!email.trim()) {
      tempErrors.email = 'Email address is required.';
      isValid = false;
    } else if (!email.includes('@') || !email.includes('.')) {
      tempErrors.email = 'Please enter a valid email address.';
      isValid = false;
    }

    // Password: length >= 8
    if (!password) {
      tempErrors.password = 'Password is required.';
      isValid = false;
    } else if (password.length < 8) {
      tempErrors.password = 'Password must be at least 8 characters.';
      isValid = false;
    }

    // Confirm: must match password exactly
    if (!confirmPassword) {
      tempErrors.confirmPassword = 'Please confirm your password.';
      isValid = false;
    } else if (confirmPassword !== password) {
      tempErrors.confirmPassword = 'Passwords do not match.';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleRegister = () => {
    if (!validate()) return;

    setIsLoading(true);

    // Mock registration with realistic delay
    setTimeout(() => {
      setIsLoading(false);
      // Navigate or login successfully
      if (navigation) {
        navigation.replace('Main');
      }
    }, 1500);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* HEADER ROW */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation?.goBack()}
          activeOpacity={0.7}
        >
          <CaretLeft size={24} color="#2D6A4F" weight="bold" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Account</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* HERO TITLE SECTION */}
        <Text style={styles.headlineLg}>Create Account</Text>
        <Text style={styles.bodyMd}>Join FreshCart today</Text>

        {/* FULL NAME INPUT */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Full Name</Text>
          <View style={[styles.inputWrapper, errors.name ? styles.inputErrorBorder : null]}>
            <TextInput
              style={styles.textInput}
              placeholder="Gabriel Torres"
              placeholderTextColor="#A0A0A0"
              autoCapitalize="words"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
              }}
            />
          </View>
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        {/* EMAIL INPUT */}
        <View style={[styles.inputGroup, { marginTop: 16 }]}>
          <Text style={styles.inputLabel}>Email</Text>
          <View style={[styles.inputWrapper, errors.email ? styles.inputErrorBorder : null]}>
            <TextInput
              style={styles.textInput}
              placeholder="you@example.com"
              placeholderTextColor="#A0A0A0"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
              }}
            />
          </View>
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        {/* PASSWORD INPUT */}
        <View style={[styles.inputGroup, { marginTop: 16 }]}>
          <Text style={styles.inputLabel}>Password</Text>
          <View style={[styles.inputWrapper, errors.password ? styles.inputErrorBorder : null]}>
            <TextInput
              style={styles.textInput}
              placeholder="••••••••"
              placeholderTextColor="#A0A0A0"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
              }}
            />
            <TouchableOpacity 
              style={styles.eyeButton} 
              onPress={() => setShowPassword(!showPassword)}
              activeOpacity={0.7}
            >
              {showPassword ? (
                <EyeSlash size={20} color="#636366" />
              ) : (
                <Eye size={20} color="#636366" />
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.helperText}>At least 8 characters</Text>
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
        </View>

        {/* CONFIRM PASSWORD INPUT */}
        <View style={[styles.inputGroup, { marginTop: 16 }]}>
          <Text style={styles.inputLabel}>Confirm Password</Text>
          <View style={[styles.inputWrapper, errors.confirmPassword ? styles.inputErrorBorder : null]}>
            <TextInput
              style={styles.textInput}
              placeholder="••••••••"
              placeholderTextColor="#A0A0A0"
              secureTextEntry={!showConfirm}
              autoCapitalize="none"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: undefined }));
              }}
            />
            <TouchableOpacity 
              style={styles.eyeButton} 
              onPress={() => setShowConfirm(!showConfirm)}
              activeOpacity={0.7}
            >
              {showConfirm ? (
                <EyeSlash size={20} color="#636366" />
              ) : (
                <Eye size={20} color="#636366" />
              )}
            </TouchableOpacity>
          </View>
          {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
        </View>

        {/* CREATE ACCOUNT BUTTON */}
        <TouchableOpacity 
          style={styles.createButton} 
          onPress={handleRegister}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.createButtonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        {/* DIVIDER */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>— or —</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* GOOGLE SIGN IN BUTTON */}
        <TouchableOpacity style={styles.googleButton} activeOpacity={0.8}>
          <View style={styles.googleContent}>
            <Text style={styles.googleLogo}>G</Text>
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </View>
        </TouchableOpacity>

        {/* FOOTER */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity 
            activeOpacity={0.7}
            onPress={() => navigation?.navigate('Login')}
          >
            <Text style={styles.signInLinkText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'between',
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1C1C1E',
    flex: 1,
    textAlign: 'center',
    marginRight: 24, // balance back button
  },
  headerPlaceholder: {
    width: 24,
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 40,
    backgroundColor: '#FFFFFF',
  },
  headlineLg: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1C1E',
    marginTop: 8,
  },
  bodyMd: {
    fontSize: 15,
    color: '#636366',
    marginTop: 4,
    marginBottom: 32,
  },
  inputGroup: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#636366',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
    height: 52,
    paddingHorizontal: 16,
  },
  inputErrorBorder: {
    borderColor: '#FF3B30',
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#1C1C1E',
    height: '100%',
    padding: 0,
  },
  eyeButton: {
    padding: 8,
    marginRight: -8,
  },
  helperText: {
    color: '#636366',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '400',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  createButton: {
    backgroundColor: '#2D6A4F',
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    shadowColor: '#2D6A4F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E5EA',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '500',
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#C7C7CC',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  googleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  googleLogo: {
    color: '#4285F4',
    fontSize: 18,
    fontWeight: '900',
  },
  googleButtonText: {
    color: '#1C1C1E',
    fontSize: 15,
    fontWeight: '600',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  footerText: {
    color: '#636366',
    fontSize: 14,
  },
  signInLinkText: {
    color: '#2D6A4F',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default RegisterScreen;`
  },
  {
    path: 'screens/ForgotPasswordScreen.tsx',
    name: 'ForgotPasswordScreen.tsx',
    language: 'typescript',
    code: `/**
 * FreshCart - Forgot Password Screen Component
 * File: screens/ForgotPasswordScreen.tsx
 */

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  ScrollView, 
  Platform,
  StatusBar
} from 'react-native';
import { CaretLeft, EnvelopeSimple, CheckCircle } from 'phosphor-react-native';

interface ForgotPasswordScreenProps {
  navigation?: {
    goBack: () => void;
    navigate: (screenName: string) => void;
    replace: (screenName: string) => void;
  };
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = (): boolean => {
    if (!email.trim()) {
      setError('Email address is required.');
      return false;
    } else if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSendLink = () => {
    if (!validate()) return;

    setIsLoading(true);

    // Mock sending reset link with delay
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  const handleResendEmail = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('Reset link resent successfully!');
    }, 1000);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* HEADER ROW */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => {
            if (submitted) {
              setSubmitted(false);
            } else {
              navigation?.goBack();
            }
          }}
          activeOpacity={0.7}
        >
          <CaretLeft size={24} color="#2D6A4F" weight="bold" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reset Password</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {!submitted ? (
          /* ==================== FORM STATE ==================== */
          <View style={styles.stateContainer}>
            {/* Centered Icon Area */}
            <View style={styles.iconContainerForm}>
              <EnvelopeSimple size={36} color="#2D6A4F" weight="regular" />
            </View>

            <Text style={styles.titleForm}>Reset Password</Text>
            <Text style={styles.subtitleForm}>
              Enter your email and we'll send you a link to reset your password.
            </Text>

            {/* EMAIL INPUT */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={[styles.inputWrapper, error ? styles.inputErrorBorder : null]}>
                <TextInput
                  style={styles.textInput}
                  placeholder="you@example.com"
                  placeholderTextColor="#A0A0A0"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (error) setError(null);
                  }}
                />
              </View>
              {error && <Text style={styles.errorText}>{error}</Text>}
            </View>

            {/* SEND BUTTON */}
            <TouchableOpacity 
              style={styles.sendButton} 
              onPress={handleSendLink}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.sendButtonText}>Send Reset Link</Text>
              )}
            </TouchableOpacity>

            {/* BACK TO LOGIN TEXT BUTTON */}
            <TouchableOpacity 
              style={styles.textButtonBack} 
              onPress={() => navigation?.navigate('Login')}
              activeOpacity={0.7}
            >
              <Text style={styles.textButtonBackLabel}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* ==================== SUCCESS STATE ==================== */
          <View style={styles.stateContainer}>
            {/* Centered Icon Area */}
            <View style={styles.iconContainerSuccess}>
              <CheckCircle size={40} color="#34C759" weight="fill" />
            </View>

            <Text style={styles.titleSuccess}>Check Your Email</Text>
            <Text style={styles.subtitleSuccess}>
              We've sent a reset link to{\'\n\'}
              <Text style={styles.emailHighlight}>{email}</Text>
            </Text>

            {/* BACK TO LOGIN PRIMARY BUTTON */}
            <TouchableOpacity 
              style={styles.backLoginButton} 
              onPress={() => navigation?.navigate('Login')}
              activeOpacity={0.8}
            >
              <Text style={styles.backLoginButtonText}>Back to Login</Text>
            </TouchableOpacity>

            {/* RESEND EMAIL TEXT BUTTON */}
            <TouchableOpacity 
              style={styles.resendButton} 
              onPress={handleResendEmail}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#636366" />
              ) : (
                <Text style={styles.resendButtonText}>Resend Email</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'between',
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1C1C1E',
    flex: 1,
    textAlign: 'center',
    marginRight: 24, // balance back button
  },
  headerPlaceholder: {
    width: 24,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
  },
  stateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: 40,
  },
  iconContainerForm: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#D8F3DC',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  titleForm: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1C1C1E',
    textAlign: 'center',
    marginTop: 24,
  },
  subtitleForm: {
    fontSize: 15,
    color: '#636366',
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 300,
    lineHeight: 20,
  },
  inputGroup: {
    width: '100%',
    marginTop: 32,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#636366',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
    height: 52,
    paddingHorizontal: 16,
  },
  inputErrorBorder: {
    borderColor: '#FF3B30',
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#1C1C1E',
    height: '100%',
    padding: 0,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
    alignSelf: 'flex-start',
  },
  sendButton: {
    backgroundColor: '#2D6A4F',
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 24,
    shadowColor: '#2D6A4F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  textButtonBack: {
    marginTop: 24,
    padding: 8,
  },
  textButtonBackLabel: {
    color: '#2D6A4F',
    fontSize: 15,
    fontWeight: '600',
  },
  iconContainerSuccess: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#E5F9EC',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
  },
  titleSuccess: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1C1C1E',
    textAlign: 'center',
    marginTop: 24,
  },
  subtitleSuccess: {
    fontSize: 15,
    color: '#636366',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  emailHighlight: {
    fontWeight: '600',
    color: '#1C1C1E',
  },
  backLoginButton: {
    backgroundColor: '#2D6A4F',
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 40,
    shadowColor: '#2D6A4F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  backLoginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  resendButton: {
    marginTop: 16,
    padding: 8,
  },
  resendButtonText: {
    color: '#636366',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default ForgotPasswordScreen;`
  },
  {
    path: 'screens/ProfileScreen.tsx',
    name: 'ProfileScreen.tsx',
    language: 'typescript',
    code: `/**
 * FreshCart - Profile & Stats Screen
 * File: screens/ProfileScreen.tsx
 */

import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  FlatList,
  StatusBar
} from 'react-native';
import { 
  Gear, 
  Bell, 
  ShieldCheck, 
  Star, 
  SignOut, 
  CaretRight 
} from 'phosphor-react-native';

const safeArea = { top: 44 };

interface RecipeShortcut {
  id: string;
  title: string;
  color: string;
  time: string;
}

const RECENT_RECIPES: RecipeShortcut[] = [
  { id: 'r1', title: 'Honey Sesame Chicken', color: '#40916C', time: '30 min' },
  { id: 'r2', title: 'Fluffy Pancakes', color: '#52B788', time: '15 min' },
  { id: 'r3', title: 'Classic Carbonara', color: '#1B4332', time: '20 min' },
];

export const ProfileScreen: React.FC = () => {
  const handleEditProfile = () => {
    // Action placeholder
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2D6A4F" />

      {/* TOP HEADER SECTION */}
      <View style={styles.header}>
        {/* Avatar Area */}
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarInitials}>GW</Text>
        </View>

        {/* User Info */}
        <Text style={styles.userName}>Gabriel Witt</Text>
        <Text style={styles.userEmail}>gabrowitt@gmail.com</Text>

        {/* Edit Profile Pill */}
        <TouchableOpacity 
          style={styles.editProfileButton} 
          onPress={handleEditProfile}
          activeOpacity={0.8}
        >
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* OVERLAPPING SCROLLVIEW CONTENT */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cardContainer}>
          
          {/* STATS SECTION */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Your Activity</Text>
            
            {/* 2x2 Grid */}
            <View style={styles.gridContainer}>
              <View style={styles.gridRow}>
                {/* Stat 1 */}
                <View style={styles.statCard}>
                  <Text style={styles.statEmoji}>🍳</Text>
                  <Text style={styles.statValue}>12</Text>
                  <Text style={styles.statLabel}>Recipes Saved</Text>
                </View>

                {/* Stat 2 */}
                <View style={styles.statCard}>
                  <Text style={styles.statEmoji}>📋</Text>
                  <Text style={styles.statValue}>5</Text>
                  <Text style={styles.statLabel}>Lists Completed</Text>
                </View>
              </View>

              <View style={styles.gridRow}>
                {/* Stat 3 */}
                <View style={styles.statCard}>
                  <Text style={styles.statEmoji}>📦</Text>
                  <Text style={styles.statValue}>34</Text>
                  <Text style={styles.statLabel}>Pantry Items</Text>
                </View>

                {/* Stat 4 */}
                <View style={styles.statCard}>
                  <Text style={styles.statEmoji}>💰</Text>
                  <Text style={styles.statValue}>\$245</Text>
                  <Text style={styles.statLabel}>Total Tracked</Text>
                </View>
              </View>
            </View>
          </View>

          {/* RECENT RECIPES HORIZONTAL LIST */}
          <View style={styles.recentSection}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Recent Recipes</Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.seeAllText}>See all →</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              horizontal
              data={RECENT_RECIPES}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recentListContent}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.miniCard} activeOpacity={0.85}>
                  <View style={[styles.miniImageArea, { backgroundColor: item.color }]}>
                    <Text style={styles.miniCardTime}>{item.time}</Text>
                  </View>
                  <Text style={styles.miniCardTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>

          {/* NAVIGATION ROWS CARD */}
          <View style={styles.navRowsCard}>
            {/* Row 1: Settings */}
            <TouchableOpacity style={styles.navRow} activeOpacity={0.7}>
              <View style={styles.navRowLeft}>
                <Gear size={20} color="#636366" />
                <Text style={styles.navRowLabel}>Settings</Text>
              </View>
              <CaretRight size={16} color="#C7C7CC" weight="bold" />
            </TouchableOpacity>

            {/* Row 2: Notifications */}
            <TouchableOpacity style={styles.navRow} activeOpacity={0.7}>
              <View style={styles.navRowLeft}>
                <Bell size={20} color="#636366" />
                <Text style={styles.navRowLabel}>Notifications</Text>
              </View>
              <CaretRight size={16} color="#C7C7CC" weight="bold" />
            </TouchableOpacity>

            {/* Row 3: Privacy */}
            <TouchableOpacity style={styles.navRow} activeOpacity={0.7}>
              <View style={styles.navRowLeft}>
                <ShieldCheck size={20} color="#636366" />
                <Text style={styles.navRowLabel}>Privacy</Text>
              </View>
              <CaretRight size={16} color="#C7C7CC" weight="bold" />
            </TouchableOpacity>

            {/* Row 4: Rate FreshCart */}
            <TouchableOpacity style={[styles.navRow, styles.lastNavRow]} activeOpacity={0.7}>
              <View style={styles.navRowLeft}>
                <Star size={20} color="#636366" />
                <Text style={styles.navRowLabel}>Rate FreshCart</Text>
              </View>
              <CaretRight size={16} color="#C7C7CC" weight="bold" />
            </TouchableOpacity>
          </View>

          {/* DANGER ROW (Sign Out) */}
          <View style={styles.dangerRowsCard}>
            <TouchableOpacity style={styles.dangerRow} activeOpacity={0.7}>
              <View style={styles.navRowLeft}>
                <SignOut size={20} color="#FF3B30" />
                <Text style={styles.dangerRowLabel}>Sign Out</Text>
              </View>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    backgroundColor: '#2D6A4F',
    paddingTop: safeArea.top + 16,
    paddingBottom: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  avatarInitials: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D6A4F',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 12,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 4,
  },
  editProfileButton: {
    marginTop: 12,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  editProfileText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  cardContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#F2F2F7',
    marginTop: -24,
  },
  statsSection: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  gridContainer: {
    gap: 12,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  statEmoji: {
    fontSize: 28,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2D6A4F',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#636366',
    marginTop: 2,
    fontWeight: '500',
    textAlign: 'center',
  },
  recentSection: {
    marginTop: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D6A4F',
  },
  recentListContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  miniCard: {
    width: 110,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    overflow: 'hidden',
  },
  miniImageArea: {
    height: 80,
    justifyContent: 'flex-end',
    padding: 6,
  },
  miniCardTime: {
    fontSize: 9,
    color: '#FFFFFF',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    fontWeight: '600',
  },
  miniCardTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1C1C1E',
    padding: 8,
    lineHeight: 15,
  },
  navRowsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  navRow: {
    height: 52,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#F2F2F7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastNavRow: {
    borderBottomWidth: 0,
  },
  navRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  navRowLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  dangerRowsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  dangerRow: {
    height: 52,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dangerRowLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FF3B30',
  }
});

export default ProfileScreen;`
  },
  {
    path: 'screens/SettingsScreen.tsx',
    name: 'SettingsScreen.tsx',
    language: 'typescript',
    code: `/**
 * FreshCart - Settings Screen
 * File: screens/SettingsScreen.tsx
 */

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Switch,
  StatusBar
} from 'react-native';
import { 
  User, 
  Envelope, 
  LockSimple, 
  Moon, 
  CurrencyDollar, 
  Storefront, 
  Bell, 
  WarningCircle, 
  Sparkle, 
  FileText, 
  ShieldCheck, 
  Star, 
  Info, 
  Trash, 
  CaretRight, 
  CaretLeft 
} from 'phosphor-react-native';

const safeArea = { top: 44 };

interface SettingsScreenProps {
  navigation?: {
    goBack: () => void;
  };
}

interface SettingsRowProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  hasSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (val: boolean) => void;
  hasChevron?: boolean;
  onPress?: () => void;
  isLast?: boolean;
  isDanger?: boolean;
}

const SettingsRow: React.FC<SettingsRowProps> = ({
  icon,
  label,
  value,
  hasSwitch,
  switchValue,
  onSwitchChange,
  hasChevron = true,
  onPress,
  isLast = false,
  isDanger = false,
}) => {
  const content = (
    <View style={[styles.rowContainer, isLast ? null : styles.rowBorder]}>
      <View style={styles.rowLeft}>
        {icon}
        <Text style={[styles.rowLabel, isDanger ? styles.dangerText : null]}>
          {label}
        </Text>
      </View>
      <View style={styles.rowRight}>
        {value ? (
          <Text style={[styles.rowValue, isDanger ? styles.dangerText : null]}>{value}</Text>
        ) : null}
        {hasSwitch ? (
          <Switch
            value={switchValue}
            onValueChange={onSwitchChange}
            trackColor={{ false: '#767577', true: '#2D6A4F' }}
            thumbColor={switchValue ? '#FFFFFF' : '#F2F2F7'}
          />
        ) : null}
        {hasChevron && !hasSwitch ? (
          <CaretRight size={16} color="#C7C7CC" weight="bold" />
        ) : null}
      </View>
    </View>
  );

  if (hasSwitch) {
    return <View style={styles.rowWrapper}>{content}</View>;
  }

  return (
    <TouchableOpacity 
      style={styles.rowWrapper} 
      onPress={onPress} 
      activeOpacity={0.7}
      disabled={!onPress}
    >
      {content}
    </TouchableOpacity>
  );
};

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [expirationAlerts, setExpirationAlerts] = useState(true);
  const [smartSuggestions, setSmartSuggestions] = useState(false);

  const handleRowPress = (label: string) => {
    // Action placeholder
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F2F2F7" />

      {/* HEADER SECTION */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation?.goBack()}
          activeOpacity={0.7}
        >
          <CaretLeft size={24} color="#1C1C1E" weight="bold" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ACCOUNT SECTION */}
        <Text style={styles.sectionLabel}>Account</Text>
        <View style={styles.sectionCard}>
          <SettingsRow 
            icon={<User size={20} color="#636366" />}
            label="Name"
            value="Gabriel Torres"
            onPress={() => handleRowPress('Name')}
          />
          <SettingsRow 
            icon={<Envelope size={20} color="#636366" />}
            label="Email"
            value="gabriel@email.com"
            onPress={() => handleRowPress('Email')}
          />
          <SettingsRow 
            icon={<LockSimple size={20} color="#636366" />}
            label="Change Password"
            isLast={true}
            onPress={() => handleRowPress('Change Password')}
          />
        </View>

        {/* PREFERENCES SECTION */}
        <Text style={styles.sectionLabel}>Preferences</Text>
        <View style={styles.sectionCard}>
          <SettingsRow 
            icon={<Moon size={20} color="#636366" />}
            label="Dark Mode"
            hasSwitch={true}
            switchValue={darkMode}
            onSwitchChange={setDarkMode}
          />
          <SettingsRow 
            icon={<CurrencyDollar size={20} color="#636366" />}
            label="Currency"
            value="USD $"
            onPress={() => handleRowPress('Currency')}
          />
          <SettingsRow 
            icon={<Storefront size={20} color="#636366" />}
            label="Default Store"
            value="Walmart"
            isLast={true}
            onPress={() => handleRowPress('Default Store')}
          />
        </View>

        {/* NOTIFICATIONS SECTION */}
        <Text style={styles.sectionLabel}>Notifications</Text>
        <View style={styles.sectionCard}>
          <SettingsRow 
            icon={<Bell size={20} color="#636366" />}
            label="Push Notifications"
            hasSwitch={true}
            switchValue={pushNotifications}
            onSwitchChange={setPushNotifications}
          />
          <SettingsRow 
            icon={<WarningCircle size={20} color="#636366" />}
            label="Expiration Alerts"
            hasSwitch={true}
            switchValue={expirationAlerts}
            onSwitchChange={setExpirationAlerts}
          />
          <SettingsRow 
            icon={<Sparkle size={20} color="#636366" />}
            label="Smart Suggestions"
            hasSwitch={true}
            switchValue={smartSuggestions}
            onSwitchChange={setSmartSuggestions}
            isLast={true}
          />
        </View>

        {/* ABOUT SECTION */}
        <Text style={styles.sectionLabel}>About</Text>
        <View style={styles.sectionCard}>
          <SettingsRow 
            icon={<FileText size={20} color="#636366" />}
            label="Terms of Service"
            onPress={() => handleRowPress('Terms of Service')}
          />
          <SettingsRow 
            icon={<ShieldCheck size={20} color="#636366" />}
            label="Privacy Policy"
            onPress={() => handleRowPress('Privacy Policy')}
          />
          <SettingsRow 
            icon={<Star size={20} color="#636366" />}
            label="Rate FreshCart"
            onPress={() => handleRowPress('Rate FreshCart')}
          />
          <SettingsRow 
            icon={<Info size={20} color="#636366" />}
            label="Version"
            value="1.0.0"
            hasChevron={false}
            isLast={true}
          />
        </View>

        {/* DANGER SECTION */}
        <View style={[styles.sectionCard, styles.dangerSection]}>
          <SettingsRow 
            icon={<Trash size={20} color="#FF3B30" />}
            label="Delete Account"
            hasChevron={false}
            isLast={true}
            isDanger={true}
            onPress={() => handleRowPress('Delete Account')}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    height: 96,
    backgroundColor: '#F2F2F7',
    paddingTop: safeArea.top,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  headerSpacer: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#636366',
    letterSpacing: 1.5,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
    textTransform: 'uppercase',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  rowWrapper: {
    backgroundColor: '#FFFFFF',
  },
  rowContainer: {
    height: 52,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E5EA',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rowLabel: {
    fontSize: 15,
    color: '#1C1C1E',
    marginLeft: 12,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowValue: {
    fontSize: 14,
    color: '#636366',
  },
  dangerText: {
    color: '#FF3B30',
    fontWeight: '600',
  },
  dangerSection: {
    marginTop: 24,
    marginBottom: 40,
  }
});

export default SettingsScreen;`
  },
  {
    path: 'screens/NotificationSettingsScreen.tsx',
    name: 'NotificationSettingsScreen.tsx',
    language: 'typescript',
    code: `/**
 * FreshCart - Notification Settings Screen
 * File: screens/NotificationSettingsScreen.tsx
 */

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Switch,
  StatusBar,
  Alert
} from 'react-native';
import { 
  Bell, 
  ShoppingCart, 
  Clock, 
  WarningCircle, 
  Sparkle, 
  BookOpen, 
  CaretRight, 
  CaretLeft 
} from 'phosphor-react-native';

const safeArea = { top: 44 };

interface NotificationSettingsScreenProps {
  navigation?: {
    goBack: () => void;
  };
}

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export const NotificationSettingsScreen: React.FC<NotificationSettingsScreenProps> = ({ navigation }) => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [shoppingReminders, setShoppingReminders] = useState(true);
  const [selectedDays, setSelectedDays] = useState<string[]>(['SUN', 'WED']);
  const [reminderTime, setReminderTime] = useState('10:00 AM');
  const [expirationAlerts, setExpirationAlerts] = useState(true);
  const [alertDays, setAlertDays] = useState(3);
  const [aiSuggestions, setAiSuggestions] = useState(false);
  const [recipeIdeas, setRecipeIdeas] = useState(false);

  const handleToggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(prev => prev.filter(d => d !== day));
    } else {
      setSelectedDays(prev => [...prev, day]);
    }
  };

  const handleRequestPermission = () => {
    setPermissionGranted(true);
    Alert.alert('Notifications Enabled', 'FreshCart will now send you smart alerts!');
  };

  const handleSelectTime = () => {
    const times = ['08:00 AM', '10:00 AM', '12:00 PM', '04:00 PM', '06:00 PM', '08:00 PM'];
    Alert.alert(
      'Select Reminder Time',
      'Choose a time to receive lists alerts:',
      times.map(t => ({
        text: t,
        onPress: () => setReminderTime(t)
      })),
      { cancelable: true }
    );
  };

  const handleSelectDaysBefore = () => {
    const options = [1, 2, 3, 5, 7];
    Alert.alert(
      'Expiration Alerts',
      'Alert how many days before expiration?',
      options.map(opt => ({
        text: \`\${opt} days before\`,
        onPress: () => setAlertDays(opt)
      })),
      { cancelable: true }
    );
  };

  const handleSavePreferences = () => {
    Alert.alert('Settings Saved', 'Your notification preferences have been successfully updated.');
    navigation?.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F2F2F7" />

      {/* CUSTOM HEADER */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation?.goBack()}
          activeOpacity={0.7}
        >
          <CaretLeft size={24} color="#1C1C1E" weight="bold" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* PERMISSION BANNER */}
        {!permissionGranted && (
          <View style={styles.bannerCard}>
            <View style={styles.bannerHeader}>
              <Bell size={20} color="#FF9500" weight="bold" />
              <Text style={styles.bannerText}>
                Enable notifications to get alerts and reminders
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.bannerButton}
              onPress={handleRequestPermission}
              activeOpacity={0.8}
            >
              <Text style={styles.bannerButtonText}>Enable Notifications</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* SECTION: SHOPPING REMINDERS */}
        <Text style={styles.sectionLabel}>Shopping Reminders</Text>
        <View style={styles.sectionCard}>
          <View style={styles.rowContainer}>
            <View style={styles.rowLeft}>
              <ShoppingCart size={20} color="#636366" />
              <Text style={styles.rowLabel}>Shopping Reminders</Text>
            </View>
            <Switch
              value={shoppingReminders}
              onValueChange={setShoppingReminders}
              trackColor={{ false: '#767577', true: '#2D6A4F' }}
              thumbColor={shoppingReminders ? '#FFFFFF' : '#F2F2F7'}
            />
          </View>

          {/* Expanded Content */}
          {shoppingReminders && (
            <View style={styles.expandedContent}>
              <Text style={styles.expandedSectionSubtitle}>Remind me on:</Text>
              
              <View style={styles.daysContainer}>
                {DAYS.map(day => {
                  const isSelected = selectedDays.includes(day);
                  return (
                    <TouchableOpacity
                      key={day}
                      style={[styles.dayChip, isSelected && styles.dayChipSelected]}
                      onPress={() => handleToggleDay(day)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.dayChipText, isSelected && styles.dayChipTextSelected]}>
                        {day}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <TouchableOpacity 
                style={styles.subRowClickable}
                onPress={handleSelectTime}
                activeOpacity={0.7}
              >
                <View style={styles.subRowLeft}>
                  <Clock size={16} color="#636366" />
                  <Text style={styles.subRowLabel}>Time</Text>
                </View>
                <View style={styles.subRowRight}>
                  <Text style={styles.subRowValue}>{reminderTime}</Text>
                  <CaretRight size={14} color="#C7C7CC" weight="bold" />
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* SECTION: PANTRY */}
        <Text style={styles.sectionLabel}>Pantry</Text>
        <View style={styles.sectionCard}>
          <View style={styles.rowContainer}>
            <View style={styles.rowLeft}>
              <WarningCircle size={20} color="#636366" />
              <Text style={styles.rowLabel}>Expiration Alerts</Text>
            </View>
            <Switch
              value={expirationAlerts}
              onValueChange={setExpirationAlerts}
              trackColor={{ false: '#767577', true: '#2D6A4F' }}
              thumbColor={expirationAlerts ? '#FFFFFF' : '#F2F2F7'}
            />
          </View>

          {expirationAlerts && (
            <TouchableOpacity 
              style={[styles.rowContainer, styles.rowSubBorder]}
              onPress={handleSelectDaysBefore}
              activeOpacity={0.7}
            >
              <Text style={styles.subRowDescriptionLabel}>Alert how many days before?</Text>
              <View style={styles.subRowRight}>
                <Text style={styles.subRowValue}>{alertDays} days</Text>
                <CaretRight size={14} color="#C7C7CC" weight="bold" />
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* SECTION: RECIPES & AI */}
        <Text style={styles.sectionLabel}>Recipes & AI</Text>
        <View style={styles.sectionCard}>
          <View style={styles.rowContainerNoBorder}>
            <View style={styles.rowLeft}>
              <Sparkle size={20} color="#636366" />
              <View style={styles.columnLabel}>
                <Text style={styles.rowLabel}>Weekly AI Suggestions</Text>
                <Text style={styles.rowDescription}>
                  Personalized recipe ideas every Sunday
                </Text>
              </View>
            </View>
            <Switch
              value={aiSuggestions}
              onValueChange={setAiSuggestions}
              trackColor={{ false: '#767577', true: '#2D6A4F' }}
              thumbColor={aiSuggestions ? '#FFFFFF' : '#F2F2F7'}
            />
          </View>

          <View style={[styles.rowContainer, styles.rowTopBorder]}>
            <View style={styles.rowLeft}>
              <BookOpen size={20} color="#636366" />
              <Text style={styles.rowLabel}>New Recipe Ideas</Text>
            </View>
            <Switch
              value={recipeIdeas}
              onValueChange={setRecipeIdeas}
              trackColor={{ false: '#767577', true: '#2D6A4F' }}
              thumbColor={recipeIdeas ? '#FFFFFF' : '#F2F2F7'}
            />
          </View>
        </View>

        {/* SAVE PREFERENCES BUTTON */}
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSavePreferences}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>Save Preferences</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    height: 96,
    backgroundColor: '#F2F2F7',
    paddingTop: safeArea.top,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  headerSpacer: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  bannerCard: {
    backgroundColor: '#FFF3CD',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FFEBAA',
  },
  bannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bannerText: {
    flex: 1,
    fontSize: 14,
    color: '#856404',
    fontWeight: '500',
    lineHeight: 18,
  },
  bannerButton: {
    backgroundColor: '#2D6A4F',
    borderRadius: 8,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  bannerButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#636366',
    letterSpacing: 1.5,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
    textTransform: 'uppercase',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  rowContainer: {
    height: 52,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowContainerNoBorder: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowTopBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E5EA',
  },
  rowSubBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E5EA',
    paddingLeft: 44,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  columnLabel: {
    flex: 1,
    flexDirection: 'column',
    gap: 2,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  rowDescription: {
    fontSize: 12,
    color: '#636366',
    lineHeight: 16,
  },
  expandedContent: {
    paddingLeft: 44,
    paddingRight: 16,
    paddingBottom: 16,
  },
  expandedSectionSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#636366',
    marginBottom: 8,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  dayChip: {
    backgroundColor: '#F2F2F7',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  dayChipSelected: {
    backgroundColor: '#2D6A4F',
  },
  dayChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#636366',
  },
  dayChipTextSelected: {
    color: '#FFFFFF',
  },
  subRowClickable: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    paddingVertical: 8,
  },
  subRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  subRowLabel: {
    fontSize: 14,
    color: '#636366',
    fontWeight: '500',
  },
  subRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  subRowValue: {
    fontSize: 14,
    color: '#2D6A4F',
    fontWeight: '600',
  },
  subRowDescriptionLabel: {
    fontSize: 14,
    color: '#636366',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#2D6A4F',
    height: 52,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2D6A4F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default NotificationSettingsScreen;`
  },
  {
    path: 'screens/HistoryScreen.tsx',
    name: 'HistoryScreen.tsx',
    language: 'typescript',
    code: `/**
 * FreshCart - Shopping History Screen
 * File: screens/HistoryScreen.tsx
 * 
 * Lists completed grocery trips with dynamic search and filter chips.
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { CaretLeft, CaretRight, MagnifyingGlass } from 'phosphor-react-native';

interface TripItem {
  id: string;
  date: string;
  store: string;
  items: number;
  total: number;
  duration: number;
}

const HISTORIC_TRIPS: TripItem[] = [
  { id: '1', date: 'July 3, 2026', store: 'Walmart', items: 23, total: 52.35, duration: 45 },
  { id: '2', date: 'June 28, 2026', store: 'Supermaxi', items: 15, total: 38.90, duration: 32 },
  { id: '3', date: 'June 21, 2026', store: 'Walmart', items: 31, total: 67.20, duration: 58 },
  { id: '4', date: 'June 14, 2026', store: 'Mi Comisariato', items: 8, total: 22.40, duration: 20 },
  { id: '5', date: 'June 7, 2026', store: 'Walmart', items: 19, total: 64.95, duration: 41 },
];

interface HistoryScreenProps {
  navigation?: {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
  };
  onBack?: () => void;
  onSelectTrip?: (trip: TripItem) => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  navigation,
  onBack,
  onSelectTrip,
}) => {
  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'This Week' | 'This Month' | 'By Store'>('All');

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation) {
      navigation.goBack();
    }
  };

  const handleTripSelect = (trip: TripItem) => {
    if (onSelectTrip) {
      onSelectTrip(trip);
    } else if (navigation) {
      navigation.navigate('HistoryDetail', { trip });
    }
  };

  const filteredTrips = useMemo(() => {
    return HISTORIC_TRIPS.filter(trip => {
      const matchesSearch = 
        trip.store.toLowerCase().includes(searchText.toLowerCase()) ||
        trip.date.toLowerCase().includes(searchText.toLowerCase());
      
      if (!matchesSearch) return false;

      if (selectedFilter === 'All') return true;
      if (selectedFilter === 'This Week') {
        return trip.date.includes('July');
      }
      if (selectedFilter === 'This Month') {
        return trip.date.includes('July') || trip.date.includes('June');
      }
      if (selectedFilter === 'By Store') {
        return trip.store !== '';
      }
      return true;
    });
  }, [searchText, selectedFilter]);

  const totalSpent = useMemo(() => {
    return filteredTrips.reduce((sum, trip) => sum + trip.total, 0);
  }, [filteredTrips]);

  const renderFilterChip = (filterType: 'All' | 'This Week' | 'This Month' | 'By Store') => {
    const isSelected = selectedFilter === filterType;
    return (
      <TouchableOpacity
        key={filterType}
        style={[styles.chip, isSelected ? styles.chipSelected : styles.chipUnselected]}
        onPress={() => setSelectedFilter(filterType)}
        activeOpacity={0.8}
      >
        <Text style={[styles.chipText, isSelected ? styles.chipTextSelected : styles.chipTextUnselected]}>
          {filterType}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7}>
          <CaretLeft size={24} color="#1C1C1E" weight="bold" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shopping History</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <MagnifyingGlass size={18} color="#8E8E93" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search stores or dates..."
            placeholderTextColor="#8E8E93"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      <View style={styles.chipsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsScrollContent}
        >
          {renderFilterChip('All')}
          {renderFilterChip('This Week')}
          {renderFilterChip('This Month')}
          {renderFilterChip('By Store')}
        </ScrollView>
      </View>

      <View style={styles.summaryBar}>
        <Text style={styles.summaryTripsText}>
          {filteredTrips.length} shopping {filteredTrips.length === 1 ? 'trip' : 'trips'}
        </Text>
        <Text style={styles.summaryTotalText}>
          Total: \$\${totalSpent.toFixed(2)}
        </Text>
      </View>

      {filteredTrips.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyTitle}>No shopping trips yet</Text>
          <Text style={styles.emptySubtitle}>Complete a list to see your history</Text>
        </View>
      ) : (
        <FlatList
          data={filteredTrips}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => handleTripSelect(item)}
              activeOpacity={0.8}
            >
              <View style={styles.cardContent}>
                <View style={styles.cardLeft}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardDate}>{item.date}</Text>
                    <Text style={styles.cardTotal}>\$\${item.total.toFixed(2)}</Text>
                  </View>
                  <Text style={styles.cardSubtitle}>
                    {item.store} • {item.items} items • {item.duration} min
                  </Text>
                </View>
                <CaretRight size={16} color="#C7C7CC" weight="bold" style={styles.caret} />
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  headerPlaceholder: {
    width: 32,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: '#1C1C1E',
  },
  chipsContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingVertical: 8,
  },
  chipsScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    marginRight: 4,
  },
  chipSelected: {
    backgroundColor: '#D8F3DC',
  },
  chipUnselected: {
    backgroundColor: '#F2F2F7',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextSelected: {
    color: '#2D6A4F',
  },
  chipTextUnselected: {
    color: '#636366',
  },
  summaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  summaryTripsText: {
    fontSize: 14,
    color: '#636366',
    fontWeight: '500',
  },
  summaryTotalText: {
    fontSize: 16,
    color: '#2D6A4F',
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardLeft: {
    flex: 1,
    paddingRight: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  cardDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  cardTotal: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2D6A4F',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#636366',
    marginTop: 4,
    fontWeight: '500',
  },
  caret: {
    alignSelf: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 80,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#636366',
    textAlign: 'center',
    lineHeight: 20,
  },
});`
  },
  {
    path: 'screens/HistoryDetailScreen.tsx',
    name: 'HistoryDetailScreen.tsx',
    language: 'typescript',
    code: `/**
 * FreshCart - History Detail Screen
 * File: screens/HistoryDetailScreen.tsx
 * 
 * Shows details for a specific completed shopping trip.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar
} from 'react-native';
import {
  CaretLeft,
  CalendarBlank,
  Storefront,
  Package,
  CurrencyDollar,
  Timer,
  CheckCircle
} from 'phosphor-react-native';

interface TripDetails {
  id: string;
  date: string;
  store: string;
  items: number;
  total: number;
  duration: number;
}

const DEFAULT_TRIP: TripDetails = {
  id: '1',
  date: 'July 3, 2026',
  store: 'Walmart',
  items: 23,
  total: 52.35,
  duration: 45
};

const PURCHASED_ITEMS_DATA = [
  {
    title: 'Dairy',
    emoji: '🥛',
    data: [
      { id: 'd1', name: 'Milk', quantity: '2L', price: 7.98 },
      { id: 'd2', name: 'Eggs', quantity: '12u', price: 4.50 },
      { id: 'd3', name: 'Cheese', quantity: '1pack', price: 5.99 },
    ]
  },
  {
    title: 'Vegetables',
    emoji: '🥦',
    data: [
      { id: 'v1', name: 'Broccoli', quantity: '1kg', price: 2.50 },
      { id: 'v2', name: 'Tomatoes', quantity: '4u', price: 1.20 },
      { id: 'v3', name: 'Onion', quantity: '1kg', price: 0.99 },
    ]
  },
  {
    title: 'Bakery',
    emoji: '🍞',
    data: [
      { id: 'b1', name: 'Sourdough Bread', quantity: '1u', price: 4.99 },
      { id: 'b2', name: 'Crackers', quantity: '1pack', price: 2.49 },
    ]
  }
];

interface HistoryDetailScreenProps {
  route?: {
    params?: {
      trip?: TripDetails;
    }
  };
  navigation?: {
    goBack: () => void;
    navigate: (screen: string, params?: any) => void;
  };
  onBack?: () => void;
  onUseAgain?: (trip: TripDetails) => void;
}

export const HistoryDetailScreen: React.FC<HistoryDetailScreenProps> = ({
  route,
  navigation,
  onBack,
  onUseAgain,
}) => {
  const trip = route?.params?.trip || DEFAULT_TRIP;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation) {
      navigation.goBack();
    }
  };

  const handleUseAgain = () => {
    if (onUseAgain) {
      onUseAgain(trip);
    } else {
      alert(\`Re-adding \${trip.items} items from \${trip.store} to your active list!\`);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7}>
          <CaretLeft size={24} color="#1C1C1E" weight="bold" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{trip.date}</Text>
        <TouchableOpacity style={styles.useAgainButton} onPress={handleUseAgain} activeOpacity={0.7}>
          <Text style={styles.useAgainText}>Use Again</Text>
        </TouchableOpacity>
      </View>

      <SectionList
        sections={PURCHASED_ITEMS_DATA}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.scrollContent}
        ListHeaderComponent={
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>
              {trip.store} — {trip.date}
            </Text>

            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <CalendarBlank size={20} color="#636366" weight="regular" />
                <View style={styles.statInfo}>
                  <Text style={styles.statLabel}>Date</Text>
                  <Text style={styles.statValue} numberOfLines={1}>
                    {trip.date.split(',')[0]}
                  </Text>
                </View>
              </View>

              <View style={styles.statBox}>
                <Storefront size={20} color="#636366" weight="regular" />
                <View style={styles.statInfo}>
                  <Text style={styles.statLabel}>Store</Text>
                  <Text style={styles.statValue} numberOfLines={1}>
                    {trip.store}
                  </Text>
                </View>
              </View>

              <View style={styles.statBox}>
                <Package size={20} color="#636366" weight="regular" />
                <View style={styles.statInfo}>
                  <Text style={styles.statLabel}>Items</Text>
                  <Text style={styles.statValue} numberOfLines={1}>
                    {trip.items} items
                  </Text>
                </View>
              </View>

              <View style={styles.statBox}>
                <CurrencyDollar size={20} color="#636366" weight="regular" />
                <View style={styles.statInfo}>
                  <Text style={styles.statLabel}>Total</Text>
                  <Text style={styles.statValue} numberOfLines={1}>
                    \$\${trip.total.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.durationRow}>
              <Timer size={16} color="#636366" weight="regular" />
              <Text style={styles.durationText}>
                Completed in {trip.duration} minutes
              </Text>
            </View>
          </View>
        }
        renderSectionHeader={({ section: { title, emoji } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderTitle}>
              {emoji} {title}
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <View style={styles.itemLeft}>
              <View style={styles.emojiCircle}>
                <Text style={styles.emojiText}>🛍️</Text>
              </View>
              <Text style={styles.itemName}>{item.name}</Text>
            </View>
            <View style={styles.itemRight}>
              <Text style={styles.itemQuantity}>{item.quantity}</Text>
              <Text style={styles.itemPrice}>\$\${item.price.toFixed(2)}</Text>
              <CheckCircle size={18} color="#34C759" weight="fill" style={styles.checkIcon} />
            </View>
          </View>
        )}
        renderSectionFooter={() => <View style={styles.sectionFooterSpacer} />}
        ListFooterComponent={<View style={styles.listFooterSpacer} />}
      />

      <View style={styles.footer}>
        <Text style={styles.footerTotal}>Total: \$\${trip.total.toFixed(2)}</Text>
        <Text style={styles.footerCount}>{trip.items} items purchased</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  useAgainButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  useAgainText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D6A4F',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    gap: 12,
  },
  statBox: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '47%',
    backgroundColor: '#F2F2F7',
    padding: 10,
    borderRadius: 12,
    gap: 8,
  },
  statInfo: {
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    color: '#636366',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1C1E',
    marginTop: 1,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
    gap: 6,
  },
  durationText: {
    fontSize: 12,
    color: '#636366',
    fontWeight: '500',
  },
  sectionHeader: {
    backgroundColor: '#E5E5EA',
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginTop: 8,
  },
  sectionHeaderTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#48484A',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    height: 52,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  emojiCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  emojiText: {
    fontSize: 16,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemQuantity: {
    fontSize: 13,
    color: '#636366',
    fontWeight: '500',
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C1C1E',
    width: 50,
    textAlign: 'right',
  },
  checkIcon: {
    marginLeft: 4,
  },
  sectionFooterSpacer: {
    height: 8,
  },
  listFooterSpacer: {
    height: 80,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: 'flex-end',
  },
  footerTotal: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2D6A4F',
  },
  footerCount: {
    fontSize: 12,
    color: '#636366',
    marginTop: 2,
    fontWeight: '500',
  },
});`
  },
  {
    path: 'screens/SuggestionsScreen.tsx',
    name: 'SuggestionsScreen.tsx',
    language: 'typescript',
    code: `/**
 * FreshCart - Smart Suggestions Screen
 * File: screens/SuggestionsScreen.tsx
 * 
 * Provides AI-powered personalized grocery suggestions based on user shopping history.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
  Alert
} from 'react-native';
import { CaretLeft, Sparkle } from 'phosphor-react-native';

interface GroupCardData {
  id: string;
  items: Array<{ name: string; emoji: string; category: string }>;
}

const SUGGESTED_GROUPS: GroupCardData[] = [
  {
    id: 'g1',
    items: [
      { name: 'Milk', emoji: '🥛', category: 'Dairy' },
      { name: 'Eggs', emoji: '🥚', category: 'Dairy' },
      { name: 'Bread', emoji: '🍞', category: 'Bakery' },
    ]
  },
  {
    id: 'g2',
    items: [
      { name: 'Broccoli', emoji: '🥦', category: 'Vegetables' },
      { name: 'Tomatoes', emoji: '🍅', category: 'Vegetables' },
      { name: 'Onion', emoji: '🧅', category: 'Vegetables' },
    ]
  },
  {
    id: 'g3',
    items: [
      { name: 'Chicken', emoji: '🍗', category: 'Meat & Seafood' },
      { name: 'Garlic', emoji: '🧄', category: 'Vegetables' },
      { name: 'Spinach', emoji: '🥬', category: 'Vegetables' },
    ]
  }
];

interface RecentItemData {
  id: string;
  name: string;
  emoji: string;
  daysAgo: number;
  category: string;
}

const NOT_BOUGHT_RECENTLY: RecentItemData[] = [
  { id: 'r1', name: 'Tomatoes', emoji: '🍅', daysAgo: 23, category: 'Vegetables' },
  { id: 'r2', name: 'Orange Juice', emoji: '🥤', daysAgo: 18, category: 'Beverages' },
  { id: 'r3', name: 'Yogurt', emoji: '🥛', daysAgo: 31, category: 'Dairy' },
  { id: 'r4', name: 'Chicken', emoji: '🍗', daysAgo: 12, category: 'Meat & Seafood' },
];

interface FrequentItemData {
  id: string;
  name: string;
  emoji: string;
  times: number;
  category: string;
}

const MOST_FREQUENT: FrequentItemData[] = [
  { id: 'f1', name: 'Milk', emoji: '🥛', times: 12, category: 'Dairy' },
  { id: 'f2', name: 'Eggs', emoji: '🥚', times: 10, category: 'Dairy' },
  { id: 'f3', name: 'Bread', emoji: '🍞', times: 8, category: 'Bakery' },
  { id: 'f4', name: 'Tomatoes', emoji: '🍅', times: 6, category: 'Vegetables' },
  { id: 'f5', name: 'Broccoli', emoji: '🥦', times: 5, category: 'Vegetables' },
];

interface SuggestionsScreenProps {
  navigation?: {
    goBack: () => void;
  };
  onBack?: () => void;
  onAddItemsToList?: (items: Array<{ name: string; category: string }>) => void;
}

export const SuggestionsScreen: React.FC<SuggestionsScreenProps> = ({
  navigation,
  onBack,
  onAddItemsToList,
}) => {
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation) {
      navigation.goBack();
    }
  };

  const handleAddGroup = (group: GroupCardData) => {
    const itemsToAdd = group.items.map(it => ({ name: it.name, category: it.category }));
    if (onAddItemsToList) {
      onAddItemsToList(itemsToAdd);
    }
    setAddedItems(prev => ({ ...prev, [group.id]: true }));
    Alert.alert('Added Bundle', \`Added Milk, Eggs, and Bread to your shopping list!\`);
  };

  const handleAddSingle = (item: RecentItemData | FrequentItemData) => {
    if (onAddItemsToList) {
      onAddItemsToList([{ name: item.name, category: item.category }]);
    }
    setAddedItems(prev => ({ ...prev, [item.id]: true }));
    Alert.alert('Item Added', \`"\${item.name}" has been added to your shopping list!\`);
  };

  const handleAddAll = () => {
    const allItems: Array<{ name: string; category: string }> = [];
    
    // Add all groups
    SUGGESTED_GROUPS.forEach(g => {
      g.items.forEach(it => {
        if (!allItems.some(added => added.name === it.name)) {
          allItems.push({ name: it.name, category: it.category });
        }
      });
    });

    // Add all not bought recently
    NOT_BOUGHT_RECENTLY.forEach(r => {
      if (!allItems.some(added => added.name === r.name)) {
        allItems.push({ name: r.name, category: r.category });
      }
    });

    // Add all most frequent
    MOST_FREQUENT.forEach(f => {
      if (!allItems.some(added => added.name === f.name)) {
        allItems.push({ name: f.name, category: f.category });
      }
    });

    if (onAddItemsToList) {
      onAddItemsToList(allItems);
    }

    // Mark everything as added
    const newAddedState: Record<string, boolean> = {};
    SUGGESTED_GROUPS.forEach(g => { newAddedState[g.id] = true; });
    NOT_BOUGHT_RECENTLY.forEach(r => { newAddedState[r.id] = true; });
    MOST_FREQUENT.forEach(f => { newAddedState[f.id] = true; });
    setAddedItems(newAddedState);

    Alert.alert('Success', \`Added \${allItems.length} suggestions to your shopping list!\`);
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7}>
          <CaretLeft size={24} color="#1C1C1E" weight="bold" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Smart Suggestions</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView 
        style={styles.scrollContainer} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* AI BANNER */}
        <View style={styles.aiBanner}>
          <View style={styles.aiBannerRow}>
            <Sparkle size={20} color="#FFFFFF" weight="fill" />
            <Text style={styles.aiBannerTitle}>Based on your last 5 shopping trips</Text>
          </View>
          <Text style={styles.aiBannerSubtitle}>AI-powered suggestions just for you</Text>
        </View>

        {/* SECTION 1 - Usually bought together */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Usually bought together</Text>
          <View style={styles.groupsContainer}>
            {SUGGESTED_GROUPS.map((group) => {
              const isAdded = addedItems[group.id];
              return (
                <View key={group.id} style={styles.groupCard}>
                  <View style={styles.groupItemsRow}>
                    {group.items.map((it, index) => (
                      <View key={index} style={styles.groupItemPill}>
                        <Text style={styles.groupItemEmoji}>{it.emoji}</Text>
                        <Text style={styles.groupItemName}>{it.name}</Text>
                      </View>
                    ))}
                  </View>
                  <TouchableOpacity
                    style={styles.groupAddButton}
                    onPress={() => handleAddGroup(group)}
                    disabled={isAdded}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.groupAddButtonText, isAdded && styles.buttonDisabledText]}>
                      {isAdded ? 'Added ✓' : 'Add all 3 to list'}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>

        {/* SECTION 2 - You haven't bought recently */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>You haven't bought recently</Text>
          <View style={styles.flatListContainer}>
            {NOT_BOUGHT_RECENTLY.map((item) => {
              const isAdded = addedItems[item.id];
              return (
                <View key={item.id} style={styles.recentItemRow}>
                  <View style={styles.recentItemLeft}>
                    <View style={styles.emojiCircle}>
                      <Text style={styles.emojiCircleText}>{item.emoji}</Text>
                    </View>
                    <View style={styles.recentItemInfo}>
                      <Text style={styles.recentItemName}>{item.name}</Text>
                      <Text style={styles.recentItemSubtitle}>
                        Last bought {item.daysAgo} days ago
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[styles.addChip, isAdded && styles.addChipSelected]}
                    onPress={() => handleAddSingle(item)}
                    disabled={isAdded}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.addChipText, isAdded && styles.addChipTextSelected]}>
                      {isAdded ? 'Added' : '+ Add'}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>

        {/* SECTION 3 - Your most frequent */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Your most frequent</Text>
            <Text style={styles.sectionTitleRight}>(last 30 days)</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.frequentScrollContent}
          >
            {MOST_FREQUENT.map((item) => {
              const isAdded = addedItems[item.id];
              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.frequentChip}
                  onPress={() => handleAddSingle(item)}
                  disabled={isAdded}
                  activeOpacity={0.8}
                >
                  <Text style={styles.frequentEmoji}>{item.emoji}</Text>
                  <Text style={styles.frequentName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.frequentCount}>×{item.times}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* FOOTER ACTION BUTTON */}
        <View style={styles.footerContainer}>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={handleAddAll}
            activeOpacity={0.8}
          >
            <Text style={styles.footerButtonText}>Add All Suggestions</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  headerPlaceholder: {
    width: 32,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  aiBanner: {
    margin: 16,
    backgroundColor: '#2D6A4F',
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  aiBannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aiBannerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  aiBannerSubtitle: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 2,
    fontWeight: '400',
  },
  sectionContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1C1E',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 16,
  },
  sectionTitleRight: {
    fontSize: 12,
    color: '#636366',
    fontWeight: '500',
  },
  groupsContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  groupCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  groupItemsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  groupItemPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 4,
  },
  groupItemEmoji: {
    fontSize: 14,
  },
  groupItemName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  groupAddButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  groupAddButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D6A4F',
  },
  buttonDisabledText: {
    color: '#8E8E93',
  },
  flatListContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  recentItemRow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  recentItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  emojiCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  emojiCircleText: {
    fontSize: 18,
  },
  recentItemInfo: {
    flex: 1,
  },
  recentItemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  recentItemSubtitle: {
    fontSize: 12,
    color: '#636366',
    marginTop: 2,
    fontWeight: '500',
  },
  addChip: {
    backgroundColor: '#D8F3DC',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  addChipSelected: {
    backgroundColor: '#E5E5EA',
  },
  addChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2D6A4F',
  },
  addChipTextSelected: {
    color: '#8E8E93',
  },
  frequentScrollContent: {
    paddingHorizontal: 16,
    gap: 12,
    paddingVertical: 4,
  },
  frequentChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    width: 88,
    alignItems: 'center',
  },
  frequentEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  frequentName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1C1C1E',
    textAlign: 'center',
  },
  frequentCount: {
    fontSize: 12,
    color: '#2D6A4F',
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 4,
  },
  footerContainer: {
    marginHorizontal: 16,
    marginTop: 20,
  },
  footerButton: {
    height: 52,
    backgroundColor: '#2D6A4F',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  footerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});`
  },
  {
    path: 'screens/PantryScreen.tsx',
    name: 'PantryScreen.tsx',
    language: 'typescript',
    code: `/**
 * FreshCart - Pantry Overview Screen
 * File: screens/PantryScreen.tsx
 * 
 * Lists user's pantry inventory with category filtering, search, and color-coded expiration dates.
 * Features swipeable rows for editing/deleting items.
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Alert
} from 'react-native';
import { 
  CaretLeft, 
  Plus, 
  WarningCircle, 
  MagnifyingGlass, 
  PencilSimple, 
  Trash,
  Box
} from 'phosphor-react-native';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';

// Define category types
export type PantryCategory = 'Dairy' | 'Vegetables' | 'Meat & Seafood' | 'Fruits' | 'Bakery' | 'Frozen' | 'Other';

export interface PantryItem {
  id: string;
  name: string;
  category: PantryCategory;
  quantity: string;
  expirationDate: Date | null; // null if no expiration
}

const CATEGORIES_WITH_EMOJIS: Array<{ key: PantryCategory | 'All'; label: string }> = [
  { key: 'All', label: 'All' },
  { key: 'Dairy', label: '🥛 Dairy' },
  { key: 'Vegetables', label: '🥦 Vegetables' },
  { key: 'Meat & Seafood', label: '🥩 Meat' },
  { key: 'Fruits', label: '🍎 Fruits' },
  { key: 'Bakery', label: '🍞 Bakery' },
  { key: 'Frozen', label: '🧊 Frozen' },
  { key: 'Other', label: '📦 Other' }
];

const INITIAL_PANTRY_ITEMS: PantryItem[] = [
  // Dairy
  { id: 'p1', name: 'Milk', category: 'Dairy', quantity: '2 L', expirationDate: new Date('2026-08-15') },
  { id: 'p2', name: 'Eggs', category: 'Dairy', quantity: '12 u', expirationDate: new Date('2026-07-20') },
  { id: 'p3', name: 'Cheese', category: 'Dairy', quantity: '150 g', expirationDate: new Date('2026-07-08') }, // CRITICAL (<3 days from July 7)
  
  // Vegetables
  { id: 'p4', name: 'Broccoli', category: 'Vegetables', quantity: '0.5 kg', expirationDate: new Date('2026-07-09') }, // WARNING (3-7 days or <3 days depending on calculation)
  { id: 'p5', name: 'Tomatoes', category: 'Vegetables', quantity: '3 u', expirationDate: null }, // No expiration
  { id: 'p6', name: 'Spinach', category: 'Vegetables', quantity: '1 bag', expirationDate: new Date('2026-07-07') }, // CRITICAL (<3 days)
  
  // Frozen (Pantry category)
  { id: 'p7', name: 'Chicken Breasts', category: 'Frozen', quantity: '1 kg', expirationDate: new Date('2026-09-30') },
  { id: 'p8', name: 'Mixed Veggies', category: 'Frozen', quantity: '500 g', expirationDate: new Date('2026-12-20') }
];

interface PantryScreenProps {
  navigation?: {
    goBack: () => void;
  };
  onBack?: () => void;
  onAddItemPress?: () => void;
  onEditItemPress?: (item: PantryItem) => void;
}

export const PantryScreen: React.FC<PantryScreenProps> = ({
  navigation,
  onBack,
  onAddItemPress,
  onEditItemPress,
}) => {
  const [items, setItems] = useState<PantryItem[]>(INITIAL_PANTRY_ITEMS);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PantryCategory | 'All'>('All');
  const [filterExpiringOnly, setFilterExpiringOnly] = useState(false);

  // Current simulation date is July 7, 2026
  const TODAY = useMemo(() => new Date('2026-07-07'), []);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation) {
      navigation.goBack();
    }
  };

  // Delete item handler
  const handleDeleteItem = (id: string) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to remove this item from your pantry?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setItems(prev => prev.filter(item => item.id !== id));
          } 
        }
      ]
    );
  };

  // Edit item handler
  const handleEditItem = (item: PantryItem) => {
    if (onEditItemPress) {
      onEditItemPress(item);
    } else {
      Alert.alert('Edit Item', \`Editing \${item.name}\`);
    }
  };

  // Helper to get days left
  const getDaysLeft = (expirationDate: Date | null) => {
    if (!expirationDate) return null;
    const diffTime = expirationDate.getTime() - TODAY.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Expiration badge info
  const getExpirationInfo = (expirationDate: Date | null) => {
    if (!expirationDate) return { text: 'No Exp', style: styles.expFine, colorClass: '#636366' };
    
    const daysLeft = getDaysLeft(expirationDate);
    const dateStr = expirationDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    if (daysLeft === null) {
      return { text: \`Exp: \${dateStr}\`, style: styles.expFine, colorClass: '#636366' };
    }

    if (daysLeft < 3) {
      return { text: \`Exp: \${dateStr} 🔴\`, style: styles.expCritical, colorClass: '#FF3B30' };
    } else if (daysLeft <= 7) {
      return { text: \`Exp: \${dateStr} ⚠️\`, style: styles.expWarning, colorClass: '#FF9500' };
    } else {
      return { text: \`Exp: \${dateStr}\`, style: styles.expFine, colorClass: '#636366' };
    }
  };

  // Compute Stats
  const stats = useMemo(() => {
    const totalItems = items.length;
    const categoriesCount = new Set(items.map(it => it.category)).size;
    const expiringCount = items.filter(it => {
      const days = getDaysLeft(it.expirationDate);
      return days !== null && days <= 7;
    }).length;

    return { totalItems, categoriesCount, expiringCount };
  }, [items, TODAY]);

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchText.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      
      let matchesExpiring = true;
      if (filterExpiringOnly) {
        const days = getDaysLeft(item.expirationDate);
        matchesExpiring = days !== null && days <= 7;
      }

      return matchesSearch && matchesCategory && matchesExpiring;
    });
  }, [items, searchText, selectedCategory, filterExpiringOnly, TODAY]);

  // Section data grouped by Category
  const sectionData = useMemo(() => {
    const groups: Record<PantryCategory, PantryItem[]> = {
      Dairy: [],
      Vegetables: [],
      'Meat & Seafood': [],
      Fruits: [],
      Bakery: [],
      Frozen: [],
      Other: []
    };

    filteredItems.forEach(item => {
      if (groups[item.category]) {
        groups[item.category].push(item);
      } else {
        groups.Other.push(item);
      }
    });

    const categoryEmojis: Record<PantryCategory, string> = {
      Dairy: '🥛',
      Vegetables: '🥦',
      'Meat & Seafood': '🥩',
      Fruits: '🍎',
      Bakery: '🍞',
      Frozen: '🧊',
      Other: '📦'
    };

    return (Object.keys(groups) as PantryCategory[])
      .filter(cat => groups[cat].length > 0)
      .map(cat => ({
        title: cat.toUpperCase(),
        emoji: categoryEmojis[cat],
        data: groups[cat]
      }));
  }, [filteredItems]);

  // Swipe Action Renderers
  const renderLeftActions = (item: PantryItem) => {
    // Reveal edit option when swiping right (left action)
    return (
      <TouchableOpacity 
        style={styles.editAction} 
        onPress={() => handleEditItem(item)}
        activeOpacity={0.8}
      >
        <PencilSimple size={20} color="#FFFFFF" weight="bold" />
        <Text style={styles.actionText}>Edit</Text>
      </TouchableOpacity>
    );
  };

  const renderRightActions = (id: string) => {
    // Reveal delete option when swiping left (right action)
    return (
      <TouchableOpacity 
        style={styles.deleteAction} 
        onPress={() => handleDeleteItem(id)}
        activeOpacity={0.8}
      >
        <Trash size={20} color="#FFFFFF" weight="bold" />
        <Text style={styles.actionText}>Delete</Text>
      </TouchableOpacity>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7}>
            <CaretLeft size={24} color="#1C1C1E" weight="bold" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pantry 🥗</Text>
          <TouchableOpacity 
            style={styles.plusButton} 
            onPress={onAddItemPress} 
            activeOpacity={0.7}
          >
            <Plus size={20} color="#2D6A4F" weight="bold" />
          </TouchableOpacity>
        </View>

        {/* EXPIRING BANNER */}
        {stats.expiringCount > 0 && (
          <View style={styles.bannerContainer}>
            <TouchableOpacity 
              style={[
                styles.bannerCard, 
                filterExpiringOnly && styles.bannerCardActive
              ]}
              onPress={() => setFilterExpiringOnly(!filterExpiringOnly)}
              activeOpacity={0.8}
            >
              <View style={styles.bannerRow}>
                <WarningCircle size={20} color="#FF9500" weight="fill" />
                <Text style={styles.bannerTitle}>
                  {stats.expiringCount} {stats.expiringCount === 1 ? 'item' : 'items'} expiring soon
                </Text>
              </View>
              <Text style={styles.bannerActionText}>
                {filterExpiringOnly ? 'Show All →' : 'View →'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* STATS ROW */}
        <View style={styles.statsRow}>
          <View style={styles.statPill}>
            <Text style={styles.statPillText}>{stats.totalItems} items</Text>
          </View>
          <View style={styles.statPill}>
            <Text style={styles.statPillText}>{stats.categoriesCount} categories</Text>
          </View>
          <View style={[styles.statPill, stats.expiringCount > 0 && styles.statPillExpiring]}>
            <Text style={[styles.statPillText, stats.expiringCount > 0 && styles.statPillTextExpiring]}>
              {stats.expiringCount} expiring
            </Text>
          </View>
        </View>

        {/* SEARCH & FILTER BAR */}
        <View style={styles.searchFilterContainer}>
          <View style={styles.searchBar}>
            <MagnifyingGlass size={18} color="#8E8E93" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search pantry items..."
              placeholderTextColor="#8E8E93"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsScrollContent}
            style={styles.categoryScroll}
          >
            {CATEGORIES_WITH_EMOJIS.map((cat) => {
              const isSelected = selectedCategory === cat.key;
              return (
                <TouchableOpacity
                  key={cat.key}
                  style={[styles.categoryChip, isSelected ? styles.chipSelected : styles.chipUnselected]}
                  onPress={() => setSelectedCategory(cat.key)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.chipText, isSelected ? styles.chipTextSelected : styles.chipTextUnselected]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* SECTIONLIST / CONTENT */}
        {filteredItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Box size={56} color="#AEAEB2" weight="light" style={styles.emptyIcon} />
            <Text style={styles.emptyTitle}>Your pantry is empty</Text>
            <Text style={styles.emptySubtitle}>
              Add items from your shopping list or tap below to add manually.
            </Text>
            <TouchableOpacity 
              style={styles.emptyButton} 
              onPress={onAddItemPress}
              activeOpacity={0.8}
            >
              <Text style={styles.emptyButtonText}>Add Manually</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <SectionList
            sections={sectionData}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderSectionHeader={({ section: { title, emoji } }) => (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>{emoji} {title}</Text>
              </View>
            )}
            renderItem={({ item }) => {
              const expInfo = getExpirationInfo(item.expirationDate);
              const categoryEmojis: Record<PantryCategory, string> = {
                Dairy: '🥛',
                Vegetables: '🥦',
                'Meat & Seafood': '🥩',
                Fruits: '🍎',
                Bakery: '🍞',
                Frozen: '🧊',
                Other: '📦'
              };
              const emoji = categoryEmojis[item.category] || '📦';

              return (
                <Swipeable
                  renderLeftActions={() => renderLeftActions(item)}
                  renderRightActions={() => renderRightActions(item.id)}
                  friction={2}
                >
                  <View style={styles.itemRow}>
                    <View style={styles.itemRowLeft}>
                      <View style={styles.emojiCircle}>
                        <Text style={styles.emojiText}>{emoji}</Text>
                      </View>
                      <View style={styles.itemMeta}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemQty}>{item.quantity}</Text>
                      </View>
                    </View>
                    <View style={styles.itemRowRight}>
                      <Text style={[styles.expText, expInfo.style]}>
                        {expInfo.text}
                      </Text>
                    </View>
                  </View>
                </Swipeable>
              );
            }}
          />
        )}

        {/* FAB (Floating Action Button) */}
        <TouchableOpacity 
          style={styles.fab} 
          onPress={onAddItemPress}
          activeOpacity={0.8}
        >
          <Plus size={24} color="#FFFFFF" weight="bold" />
        </TouchableOpacity>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  plusButton: {
    padding: 4,
  },
  bannerContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  bannerCard: {
    backgroundColor: '#FFF3CD',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  bannerCardActive: {
    backgroundColor: '#FFE8A3',
    borderWidth: 1,
    borderColor: '#FF9500',
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9E6B00',
  },
  bannerActionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9E6B00',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  statPill: {
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statPillExpiring: {
    backgroundColor: '#FFE5E5',
  },
  statPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  statPillTextExpiring: {
    color: '#D11A2A',
  },
  searchFilterContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: '#1C1C1E',
  },
  categoryScroll: {
    marginVertical: 4,
  },
  chipsScrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  chipSelected: {
    backgroundColor: '#D8F3DC',
  },
  chipUnselected: {
    backgroundColor: '#F2F2F7',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextSelected: {
    color: '#2D6A4F',
  },
  chipTextUnselected: {
    color: '#636366',
  },
  listContent: {
    paddingBottom: 100,
  },
  sectionHeader: {
    backgroundColor: '#E5E5EA',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  sectionHeaderText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#48484A',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    height: 64,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  itemRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  emojiCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  emojiText: {
    fontSize: 18,
  },
  itemMeta: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  itemQty: {
    fontSize: 13,
    color: '#636366',
    marginTop: 2,
    fontWeight: '500',
  },
  itemRowRight: {
    alignItems: 'flex-end',
  },
  expText: {
    fontSize: 13,
    fontWeight: '500',
  },
  expCritical: {
    color: '#FF3B30',
    fontWeight: '700',
  },
  expWarning: {
    color: '#FF9500',
    fontWeight: '600',
  },
  expFine: {
    color: '#636366',
  },
  editAction: {
    backgroundColor: '#34C759',
    width: 75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteAction: {
    backgroundColor: '#FF3B30',
    width: 75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 80,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#636366',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#2D6A4F',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    zIndex: 99,
  },
});`
  },
  {
    path: 'components/AddPantryItemModal.tsx',
    name: 'AddPantryItemModal.tsx',
    language: 'typescript',
    code: `/**
 * FreshCart - Add Pantry Item Bottom Sheet Modal
 * File: components/AddPantryItemModal.tsx
 * 
 * Elegant slide-up bottom sheet to add items to the pantry with expiration tracking.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  Switch,
  Modal
} from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import { X, MagnifyingGlass, CalendarBlank } from 'phosphor-react-native';
import { PantryCategory, PantryItem } from '../screens/PantryScreen';

const { height: screenHeight } = Dimensions.get('window');

interface AddPantryItemModalProps {
  visible: boolean;
  onClose: () => void;
  onAddItem: (item: Omit<PantryItem, 'id'>) => void;
  isDarkMode?: boolean;
}

const CATEGORIES_WITH_EMOJIS: Array<{ key: PantryCategory; label: string }> = [
  { key: 'Dairy', label: '🥛 Dairy' },
  { key: 'Vegetables', label: '🥦 Vegetables' },
  { key: 'Meat & Seafood', label: '🥩 Meat' },
  { key: 'Fruits', label: '🍎 Fruits' },
  { key: 'Bakery', label: '🍞 Bakery' },
  { key: 'Frozen', label: '🧊 Frozen' },
  { key: 'Other', label: '📦 Other' },
];

const UNITS = ['units', 'kg', 'g', 'lb', 'L', 'ml', 'pack'];

const autoDetectCategory = (name: string): PantryCategory => {
  const lower = name.toLowerCase();
  if (lower.includes('milk') || lower.includes('cheese') || lower.includes('yogurt') || lower.includes('butter') || lower.includes('cream') || lower.includes('dairy')) {
    return 'Dairy';
  }
  if (lower.includes('apple') || lower.includes('banana') || lower.includes('berry') || lower.includes('orange') || lower.includes('lemon') || lower.includes('grape') || lower.includes('fruit') || lower.includes('peach') || lower.includes('strawberry')) {
    return 'Fruits';
  }
  if (lower.includes('broccoli') || lower.includes('tomato') || lower.includes('lettuce') || lower.includes('carrot') || lower.includes('onion') || lower.includes('potato') || lower.includes('garlic') || lower.includes('spinach') || lower.includes('cucumber') || lower.includes('salad') || lower.includes('vegetable')) {
    return 'Vegetables';
  }
  if (lower.includes('bread') || lower.includes('loaf') || lower.includes('croissant') || lower.includes('bun') || lower.includes('bagel') || lower.includes('cake') || lower.includes('muffin') || lower.includes('bakery')) {
    return 'Bakery';
  }
  if (lower.includes('chicken') || lower.includes('beef') || lower.includes('pork') || lower.includes('steak') || lower.includes('fish') || lower.includes('salmon') || lower.includes('shrimp') || lower.includes('meat') || lower.includes('seafood') || lower.includes('turkey')) {
    return 'Meat & Seafood';
  }
  if (lower.includes('frozen') || lower.includes('ice') || lower.includes('pizza') || lower.includes('mixed veggies') || lower.includes('nuggets')) {
    return 'Frozen';
  }
  return 'Other';
};

export const AddPantryItemModal: React.FC<AddPantryItemModalProps> = ({
  visible,
  onClose,
  onAddItem,
  isDarkMode = false,
}) => {
  // Current date July 7, 2026
  const TODAY = new Date('2026-07-07');

  // Form State
  const [selectedCategory, setSelectedCategory] = useState<PantryCategory>('Other');
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState('units');
  const [hasExpiration, setHasExpiration] = useState(false);
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);
  
  // Custom picker modal state
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Animation values
  const translateY = useRef(new Animated.Value(screenHeight)).current;
  const expandAnim = useRef(new Animated.Value(0)).current;

  // Slide modal sheet up and down
  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: screenHeight,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  // Expand / collapse expiration section
  useEffect(() => {
    Animated.timing(expandAnim, {
      toValue: hasExpiration ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();

    if (hasExpiration && !expirationDate) {
      // Set default expiration: 1 week from today
      const oneWeek = new Date(TODAY);
      oneWeek.setDate(TODAY.getDate() + 7);
      setExpirationDate(oneWeek);
    } else if (!hasExpiration) {
      setExpirationDate(null);
    }
  }, [hasExpiration]);

  // Auto-detect category
  useEffect(() => {
    if (name.trim()) {
      const detected = autoDetectCategory(name);
      setSelectedCategory(detected);
    }
  }, [name]);

  const handleClose = () => {
    Animated.timing(translateY, {
      toValue: screenHeight,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert('Please enter an item name.');
      return;
    }

    onAddItem({
      name: name.trim(),
      category: selectedCategory,
      quantity: \`\${quantity} \${unit}\`,
      expirationDate: hasExpiration ? expirationDate : null
    });

    // Reset states
    setName('');
    setSelectedCategory('Other');
    setQuantity('1');
    setUnit('units');
    setHasExpiration(false);
    setExpirationDate(null);

    handleClose();
  };

  // Quick date helper
  const setQuickRelativeDate = (days: number) => {
    const newDate = new Date(TODAY);
    newDate.setDate(TODAY.getDate() + days);
    setExpirationDate(newDate);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Tap to set date';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Render simulated date options for custom date picker
  const renderSimulatedDatePickerModal = () => {
    const options = [
      { label: 'Today (Jul 7)', days: 0 },
      { label: 'Tomorrow (Jul 8)', days: 1 },
      { label: 'In 3 Days (Jul 10)', days: 3 },
      { label: 'In 5 Days (Jul 12)', days: 5 },
      { label: 'In 1 Week (Jul 14)', days: 7 },
      { label: 'In 2 Weeks (Jul 21)', days: 14 },
      { label: 'In 1 Month (Aug 7)', days: 30 },
      { label: 'In 2 Months (Sep 7)', days: 60 },
    ];

    return (
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <Pressable style={styles.pickerOverlay} onPress={() => setShowDatePicker(false)}>
          <View style={styles.pickerCard}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Select Expiration Date</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                <X size={18} color="#1C1C1E" weight="bold" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.pickerList}>
              {options.map((opt, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.pickerItem}
                  onPress={() => {
                    setQuickRelativeDate(opt.days);
                    setShowDatePicker(false);
                  }}
                >
                  <Text style={styles.pickerItemText}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    );
  };

  if (!visible) return null;

  const safeAreaBottom = Platform.OS === 'ios' ? 34 : 16;

  // Max height of expanded expiration panel is around 120
  const expHeight = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 120]
  });

  const expOpacity = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
  });

  return (
    <View style={StyleSheet.absoluteFillObject}>
      {/* Backdrop */}
      <Pressable style={styles.overlay} onPress={handleClose} />

      {/* Sheet */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <Animated.View style={[
          styles.sheet,
          isDarkMode && styles.sheetDark,
          { transform: [{ translateY }], paddingBottom: safeAreaBottom + 16 }
        ]}>
          <View style={styles.dragHandle} />

          {/* Title bar */}
          <View style={styles.titleRow}>
            <Text style={[styles.title, isDarkMode && styles.textWhite]}>Add to Pantry</Text>
            <TouchableOpacity
              style={[styles.closeBtn, isDarkMode && styles.closeBtnDark]}
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <X size={16} color={isDarkMode ? '#FFFFFF' : '#1C1C1E'} weight="bold" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Search filter input lookalike */}
            <View style={[styles.searchContainer, isDarkMode && styles.searchContainerDark]}>
              <MagnifyingGlass size={16} color="#8E8E93" style={styles.searchIcon} />
              <TextInput
                style={[styles.searchInput, isDarkMode && styles.textWhite]}
                placeholder="Search or type item name"
                placeholderTextColor="#8E8E93"
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Categories */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionLabel}>Category</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipsRow}
              >
                {CATEGORIES_WITH_EMOJIS.map((cat) => {
                  const isSelected = selectedCategory === cat.key;
                  return (
                    <TouchableOpacity
                      key={cat.key}
                      style={[
                        styles.categoryChip,
                        isDarkMode && styles.categoryChipDark,
                        isSelected && styles.categoryChipSelected,
                      ]}
                      onPress={() => setSelectedCategory(cat.key)}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.categoryChipText,
                        isDarkMode && styles.textWhite,
                        isSelected && styles.categoryChipTextSelected
                      ]}>
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Item Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Item name *</Text>
              <TextInput
                style={[styles.fullInput, isDarkMode && styles.fullInputDark, isDarkMode && styles.textWhite]}
                placeholder="e.g. Cheddar Cheese"
                placeholderTextColor="#AEAEB2"
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Qty & Unit */}
            <View style={styles.rowContainer}>
              <View style={styles.qtyContainer}>
                <Text style={styles.inputLabel}>Qty</Text>
                <TextInput
                  style={[styles.fullInput, isDarkMode && styles.fullInputDark, isDarkMode && styles.textWhite, { textAlign: 'center' }]}
                  placeholder="1"
                  placeholderTextColor="#AEAEB2"
                  value={quantity}
                  keyboardType="numeric"
                  onChangeText={setQuantity}
                />
              </View>

              <View style={styles.unitContainer}>
                <Text style={styles.inputLabel}>Unit</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.chipsRow}
                >
                  {UNITS.map((u) => {
                    const isSelected = unit === u;
                    return (
                      <TouchableOpacity
                        key={u}
                        style={[
                          styles.unitChip,
                          isDarkMode && styles.unitChipDark,
                          isSelected && styles.unitChipSelected,
                        ]}
                        onPress={() => setUnit(u)}
                        activeOpacity={0.7}
                      >
                        <Text style={[
                          styles.unitChipText,
                          isDarkMode && styles.textWhite,
                          isSelected && styles.unitChipTextSelected
                        ]}>
                          {u}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            </View>

            {/* EXPIRATION DATE SECTION */}
            <View style={styles.expirationSection}>
              <View style={styles.expLabelRow}>
                <Text style={styles.expLabel}>Track Expiration Date</Text>
                <Switch
                  value={hasExpiration}
                  onValueChange={setHasExpiration}
                  trackColor={{ false: '#767577', true: '#2D6A4F' }}
                  thumbColor={hasExpiration ? '#F4F3F4' : '#F4F3F4'}
                />
              </View>

              {/* Animated Expand Panel */}
              <Animated.View style={[
                styles.expExpandPanel,
                { height: expHeight, opacity: expOpacity, overflow: 'hidden' }
              ]}>
                <TouchableOpacity
                  style={styles.datePickerButton}
                  onPress={() => setShowDatePicker(true)}
                  activeOpacity={0.7}
                >
                  <CalendarBlank size={20} color="#636366" weight="regular" />
                  <Text style={styles.datePickerText}>
                    {formatDate(expirationDate)}
                  </Text>
                </TouchableOpacity>

                {/* Quick select chips */}
                <View style={styles.quickSelectContainer}>
                  <Text style={styles.quickSelectLabel}>Quick relative options:</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.quickChipsScroll}
                  >
                    <TouchableOpacity
                      style={styles.quickChip}
                      onPress={() => setQuickRelativeDate(7)}
                    >
                      <Text style={styles.quickChipText}>1 week</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.quickChip}
                      onPress={() => setQuickRelativeDate(14)}
                    >
                      <Text style={styles.quickChipText}>2 weeks</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.quickChip}
                      onPress={() => setQuickRelativeDate(30)}
                    >
                      <Text style={styles.quickChipText}>1 month</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.quickChip}
                      onPress={() => setQuickRelativeDate(90)}
                    >
                      <Text style={styles.quickChipText}>3 months</Text>
                    </TouchableOpacity>
                  </ScrollView>
                </View>
              </Animated.View>
            </View>

            {/* Add to Pantry Button */}
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleSave}
              activeOpacity={0.8}
            >
              <Text style={styles.addButtonText}>Add to Pantry</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>

      {/* Date Picker Modal */}
      {renderSimulatedDatePickerModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 10,
  },
  keyboardContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    zIndex: 20,
  },
  sheet: {
    height: '85%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 16,
  },
  sheetDark: {
    backgroundColor: '#1C1C1E',
  },
  dragHandle: {
    width: 36,
    height: 4,
    backgroundColor: '#C7C7CC',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  textWhite: {
    color: '#FFFFFF',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnDark: {
    backgroundColor: '#2C2C2E',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    height: 44,
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 10,
  },
  searchContainerDark: {
    backgroundColor: '#2C2C2E',
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
  sectionContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#636366',
    marginBottom: 6,
  },
  chipsRow: {
    gap: 8,
    paddingVertical: 2,
  },
  categoryChip: {
    backgroundColor: '#F2F2F7',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  categoryChipDark: {
    backgroundColor: '#2C2C2E',
  },
  categoryChipSelected: {
    backgroundColor: '#D8F3DC',
  },
  categoryChipText: {
    fontSize: 13,
    color: '#636366',
    fontWeight: '500',
  },
  categoryChipTextSelected: {
    color: '#2D6A4F',
    fontWeight: '600',
  },
  inputContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#636366',
    marginBottom: 6,
  },
  fullInput: {
    height: 44,
    borderColor: '#C7C7CC',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#1C1C1E',
    backgroundColor: '#FFFFFF',
  },
  fullInputDark: {
    backgroundColor: '#1C1C1E',
    borderColor: '#3A3A3C',
  },
  rowContainer: {
    flexDirection: 'row',
    marginTop: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  qtyContainer: {
    width: 88,
  },
  unitContainer: {
    flex: 1,
  },
  unitChip: {
    backgroundColor: '#F2F2F7',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  unitChipDark: {
    backgroundColor: '#2C2C2E',
  },
  unitChipSelected: {
    backgroundColor: '#D8F3DC',
  },
  unitChipText: {
    fontSize: 12,
    color: '#636366',
    fontWeight: '500',
  },
  unitChipTextSelected: {
    color: '#2D6A4F',
    fontWeight: '600',
  },
  expirationSection: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  expLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#636366',
  },
  expExpandPanel: {
    marginTop: 8,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    paddingHorizontal: 12,
    gap: 8,
  },
  datePickerText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  quickSelectContainer: {
    marginTop: 8,
  },
  quickSelectLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 4,
  },
  quickChipsScroll: {
    gap: 8,
  },
  quickChip: {
    backgroundColor: '#E5E5EA',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  quickChipText: {
    fontSize: 12,
    color: '#1C1C1E',
    fontWeight: '500',
  },
  addButton: {
    height: 52,
    backgroundColor: '#2D6A4F',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '80%',
    maxHeight: '60%',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    paddingBottom: 8,
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  pickerList: {
    flexGrow: 0,
  },
  pickerItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  pickerItemText: {
    fontSize: 14,
    color: '#1C1C1E',
    fontWeight: '500',
  },
});`
  },
  {
    path: 'tests/grocery.test.ts',
    name: 'grocery.test.ts',
    language: 'typescript',
    code: `/**
 * FreshCart - Business Rule Unit Tests
 * File: tests/grocery.test.ts
 */

import { useGroceryStore } from '../store';

describe('FreshCart - Business Rules & Calculations', () => {
  beforeEach(() => {
    useGroceryStore.getState().clearAllData();
  });

  test('Rule 1 & 2: New items start with quantity = 0 and price = \$0.00', () => {
    const store = useGroceryStore.getState();
    store.addItem('Organic Honey', 'Pantry');

    const updatedStore = useGroceryStore.getState();
    expect(updatedStore.items).toHaveLength(1);
    
    const addedItem = updatedStore.items[0];
    expect(addedItem.quantity).toBe(0); // Starts at 0
    expect(addedItem.price).toBe(0.00); // Starts at $0.00
  });

  test('Rule 3: Total is calculated correctly as quantity x price', () => {
    const store = useGroceryStore.getState();
    store.addItem('Organic Avocados', 'Fruits');
    
    let state = useGroceryStore.getState();
    const itemId = state.items[0].id;
    
    store.updateQuantity(itemId, 3);
    store.updatePrice(itemId, 1.50);
    
    state = useGroceryStore.getState();
    const updatedItem = state.items[0];
    expect(updatedItem.quantity * updatedItem.price).toBe(4.50);
  });

  test('Rule 4 & 5: Finish Shopping saves purchased and keeps quantity 0 items', async () => {
    const store = useGroceryStore.getState();
    
    store.addItem('Whole Milk', 'Dairy');
    store.addItem('Sourdough Bread', 'Bakery');
    store.addItem('Fresh Spinach', 'Vegetables');

    let state = useGroceryStore.getState();
    const idA = state.items[0].id;
    const idB = state.items[1].id;

    // Item A: Purchased (qty > 0, purchased = true)
    store.updateQuantity(idA, 2);
    store.updatePrice(idA, 3.49);
    store.togglePurchased(idA);

    // Item B: qty > 0, but purchased = false
    store.updateQuantity(idB, 1);
    store.updatePrice(idB, 4.50);

    // Item C remains qty = 0, purchased = false

    await store.finishShopping();

    const finalState = useGroceryStore.getState();

    // Only item A is archived in history
    expect(finalState.history).toHaveLength(1);
    expect(finalState.history[0].items[0].name).toBe('Whole Milk');

    // Unpurchased B and zero quantity C remain in list
    expect(finalState.items).toHaveLength(2);
    const names = finalState.items.map(i => i.name);
    expect(names).toContain('Sourdough Bread');
    expect(names).toContain('Fresh Spinach');
  });
});`
  },
  {
    path: 'screens/RecipeDetailScreen.tsx',
    name: 'RecipeDetailScreen.tsx',
    language: 'typescript',
    code: `/**
 * FreshCart - Recipe Detail Screen
 * File: screens/RecipeDetailScreen.tsx
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { 
  CaretLeft, 
  DotsThree, 
  Timer, 
  FireSimple, 
  Users, 
  Heart, 
  ListPlus, 
  Sparkle 
} from 'phosphor-react-native';

const { width } = Dimensions.get('window');
const safeArea = { top: 44, bottom: 34 };

export const RecipeDetailScreen: React.FC<any> = ({ navigation, route }) => {
  const [selectedTab, setSelectedTab] = useState<'Ingredients' | 'Steps' | 'Info'>('Ingredients');
  const [servings, setServings] = useState(4);
  const [isSaved, setIsSaved] = useState(false);

  // Core recipe content to display
  const recipe = {
    title: "Honey Sesame Chicken & Broccoli",
    prepTime: "15m",
    cookTime: "30m",
    totalTime: "45 min",
    servingsDefault: 4,
    calories: "380 kcal",
    difficulty: "Medium",
    tags: ["⏱ 45 min", "👥 4 servings", "🌿 Healthy"],
    source: "✨ AI Generated",
    description: "A delicious, sweet, and savory skillet recipe combining tender chicken breast, crisp broccoli florets, and a luscious honey-sesame glaze. Perfect for quick weeknight dinners!",
    ingredients: [
      { baseQty: 2, unit: "tbsp", name: "Sesame Oil" },
      { baseQty: 500, unit: "g", name: "Chicken Breast" },
      { baseQty: 1, unit: "head", name: "Broccoli" },
      { baseQty: 3, unit: "tbsp", name: "Soy Sauce" },
      { baseQty: 2, unit: "tbsp", name: "Honey" },
      { baseQty: 3, unit: "cloves", name: "Garlic" }
    ],
    steps: [
      "Cut the chicken breast into bite-sized cubes and season lightly with salt and pepper.",
      "Heat 1 tbsp of sesame oil in a large skillet over medium-high heat. Add chicken and sear until golden and cooked through (6-8 minutes). Transfer chicken to a plate.",
      "Add the remaining sesame oil to the skillet. Toss in the broccoli florets and minced garlic. Sauté for 3-4 minutes until the broccoli is bright green and tender-crisp.",
      "In a small bowl, whisk together the soy sauce, honey, and 1 tbsp of water to create the glaze.",
      "Return the cooked chicken cubes to the skillet with the broccoli.",
      "Pour the glaze mixture over the top and toss everything together to coat uniformly.",
      "Simmer for 2 minutes until the sauce bubbles and thickens. Garnish with toasted sesame seeds and serve warm."
    ],
    dateSaved: "July 7, 2026"
  };

  // Adjust ingredient quantity based on serving ratio
  const getScaledQty = (baseQty: number) => {
    const ratio = servings / recipe.servingsDefault;
    const scaled = baseQty * ratio;
    return Number(scaled.toFixed(1)).toString();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Scrollable Container */}
      <ScrollView 
        bounces={false} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HERO HEADER */}
        <View style={styles.heroContainer}>
          {/* Simulated LinearGradient Background (#40916C -> #1B4332) */}
          <View style={styles.gradientMock}>
            <View style={styles.overlayGradient} />
          </View>

          {/* OVER HERO TEXT & PILLS */}
          <View style={styles.heroContent}>
            <View style={styles.tagsRow}>
              {recipe.tags.map((tag, idx) => (
                <View key={idx} style={styles.tagPill}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.heroTitle}>{recipe.title}</Text>
            <Text style={styles.heroSource}>{recipe.source}</Text>
          </View>
        </View>

        {/* WHITE CONTENT LAYER */}
        <View style={styles.whiteCard}>
          {/* STATS ROW */}
          <View style={styles.statsRow}>
            <View style={styles.statCol}>
              <Timer size={22} color="#2D6A4F" weight="bold" />
              <Text style={styles.statVal}>{recipe.prepTime}</Text>
              <Text style={styles.statLbl}>Prep</Text>
            </View>
            <View style={styles.statCol}>
              <FireSimple size={22} color="#2D6A4F" weight="bold" />
              <Text style={styles.statVal}>{recipe.cookTime}</Text>
              <Text style={styles.statLbl}>Cook</Text>
            </View>
            <View style={styles.statCol}>
              <Users size={22} color="#2D6A4F" weight="bold" />
              <Text style={styles.statVal}>{servings}</Text>
              <Text style={styles.statLbl}>Serves</Text>
            </View>
            <View style={styles.statCol}>
              <Heart size={22} color="#2D6A4F" weight={isSaved ? "fill" : "bold"} />
              <Text style={styles.statVal}>{isSaved ? "Saved" : "Save"}</Text>
              <Text style={styles.statLbl}>Status</Text>
            </View>
          </View>

          {/* ACTION BUTTONS ROW */}
          <View style={styles.actionRow}>
            <TouchableOpacity 
              style={[styles.actionBtn, isSaved && styles.actionBtnActive]} 
              activeOpacity={0.7}
              onPress={() => setIsSaved(!isSaved)}
            >
              <Heart size={16} color={isSaved ? "#2D6A4F" : "#1C1C1E"} weight={isSaved ? "fill" : "regular"} />
              <Text style={[styles.actionBtnTxt, isSaved && styles.actionBtnTxtActive]}>
                {isSaved ? "Saved" : "Save"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
              <ListPlus size={16} color="#1C1C1E" />
              <Text style={styles.actionBtnTxt}>Add to List</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
              <Sparkle size={16} color="#1C1C1E" />
              <Text style={styles.actionBtnTxt}>Edit with AI</Text>
            </TouchableOpacity>
          </View>

          {/* TAB BAR */}
          <View style={styles.tabsContainer}>
            {(['Ingredients', 'Steps', 'Info'] as const).map((tab) => {
              const active = selectedTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  style={[styles.tabButton, active && styles.tabButtonActive]}
                  activeOpacity={0.8}
                  onPress={() => setSelectedTab(tab)}
                >
                  <Text style={[styles.tabText, active && styles.tabTextActive]}>{tab}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* TAB CONTENT PANEL */}
          <View style={styles.tabContentPanel}>
            {selectedTab === 'Ingredients' && (
              <View>
                {/* Servings Adjuster */}
                <View style={styles.servingAdjuster}>
                  <Text style={styles.servingTitle}>Servings</Text>
                  <View style={styles.stepperContainer}>
                    <TouchableOpacity 
                      style={styles.stepBtn} 
                      onPress={() => setServings(Math.max(1, servings - 1))}
                    >
                      <Text style={styles.stepBtnTxt}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.servingsCount}>{servings}</Text>
                    <TouchableOpacity 
                      style={styles.stepBtn} 
                      onPress={() => setServings(servings + 1)}
                    >
                      <Text style={styles.stepBtnTxt}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Ingredient List */}
                <View style={styles.ingredientsList}>
                  {recipe.ingredients.map((ing, idx) => (
                    <View key={idx} style={styles.ingredientRow}>
                      <Text style={styles.bulletPoint}>•</Text>
                      <Text style={styles.ingredientText}>
                        <Text style={styles.ingredientQty}>{getScaledQty(ing.baseQty)} </Text>
                        <Text style={styles.ingredientUnit}>{ing.unit} </Text>
                        <Text style={styles.ingredientName}>{ing.name}</Text>
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {selectedTab === 'Steps' && (
              <View style={styles.stepsPanel}>
                {recipe.steps.map((step, idx) => (
                  <View key={idx} style={styles.stepRow}>
                    <View style={styles.stepCircle}>
                      <Text style={styles.stepNumber}>{idx + 1}</Text>
                    </View>
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                ))}
              </View>
            )}

            {selectedTab === 'Info' && (
              <View style={styles.infoPanel}>
                <View style={styles.infoField}>
                  <Text style={styles.infoLabel}>Description</Text>
                  <Text style={styles.infoValue}>{recipe.description}</Text>
                </View>
                <View style={styles.infoField}>
                  <Text style={styles.infoLabel}>Difficulty</Text>
                  <Text style={styles.infoValue}>{recipe.difficulty}</Text>
                </View>
                <View style={styles.infoField}>
                  <Text style={styles.infoLabel}>Calories</Text>
                  <Text style={styles.infoValue}>{recipe.calories}</Text>
                </View>
                <View style={styles.infoField}>
                  <Text style={styles.infoLabel}>Source</Text>
                  <Text style={styles.infoValue}>{recipe.source}</Text>
                </View>
                <View style={styles.infoField}>
                  <Text style={styles.infoLabel}>Date Saved</Text>
                  <Text style={styles.infoValue}>{recipe.dateSaved}</Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* TRANSPARENT OVERLAID HEADER BUTTONS */}
      <View style={[styles.headerFloating, { top: safeArea.top }]}>
        <TouchableOpacity style={styles.headerCircBtn} activeOpacity={0.8}>
          <CaretLeft size={20} color="#1C1C1E" weight="bold" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerCircBtn} activeOpacity={0.8}>
          <DotsThree size={24} color="#1C1C1E" weight="bold" />
        </TouchableOpacity>
      </View>

      {/* STICKY BOTTOM */}
      <View style={[styles.stickyBottom, { paddingBottom: safeArea.bottom }]}>
        <TouchableOpacity style={styles.cookCta} activeOpacity={0.85}>
          <FireSimple size={18} color="#FFFFFF" weight="fill" style={styles.cookIcon} />
          <Text style={styles.cookCtaTxt}>Cook Recipe →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollContent: {
    paddingBottom: 110,
  },
  heroContainer: {
    height: 280,
    position: 'relative',
    width: width,
  },
  gradientMock: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1B4332',
  },
  overlayGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 140,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  heroContent: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 8,
    letterSpacing: -0.5,
  },
  heroSource: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    marginTop: 4,
    fontWeight: '600',
  },
  headerFloating: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  headerCircBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  whiteCard: {
    marginTop: -20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#FFFFFF',
    paddingTop: 12,
    minHeight: 500,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  statCol: {
    alignItems: 'center',
    flex: 1,
  },
  statVal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1C1E',
    marginTop: 4,
  },
  statLbl: {
    fontSize: 10,
    color: '#636366',
    marginTop: 1,
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
  },
  actionBtnActive: {
    backgroundColor: '#D8F3DC',
    borderColor: '#2D6A4F',
  },
  actionBtnTxt: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  actionBtnTxtActive: {
    color: '#2D6A4F',
  },
  tabsContainer: {
    flexDirection: 'row',
    height: 44,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingHorizontal: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: '#2D6A4F',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#636366',
  },
  tabTextActive: {
    color: '#2D6A4F',
    fontWeight: '800',
  },
  tabContentPanel: {
    paddingVertical: 8,
  },
  servingAdjuster: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8F9FA',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
  },
  servingTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E5E5EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnTxt: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D6A4F',
  },
  servingsCount: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1C1C1E',
    minWidth: 20,
    textAlign: 'center',
  },
  ingredientsList: {
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 10,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bulletPoint: {
    color: '#2D6A4F',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 6,
    lineHeight: 18,
  },
  ingredientText: {
    fontSize: 13,
    color: '#1C1C1E',
    flex: 1,
    lineHeight: 18,
  },
  ingredientQty: {
    fontWeight: '700',
    color: '#2D6A4F',
  },
  ingredientUnit: {
    fontWeight: '600',
    color: '#52B788',
  },
  ingredientName: {
    color: '#1C1C1E',
  },
  stepsPanel: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2D6A4F',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumber: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  stepText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: '#1C1C1E',
  },
  infoPanel: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 14,
  },
  infoField: {
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
    paddingBottom: 8,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#636366',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 13,
    color: '#1C1C1E',
    lineHeight: 18,
  },
  stickyBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  cookCta: {
    backgroundColor: '#2D6A4F',
    height: 52,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cookIcon: {
    marginRight: 6,
  },
  cookCtaTxt: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});`
  },
  {
    path: 'screens/EditRecipeScreen.tsx',
    name: 'EditRecipeScreen.tsx',
    language: 'typescript',
    code: `/**
 * FreshCart - Edit Recipe Screen
 * File: screens/EditRecipeScreen.tsx
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from 'react-native';
import { 
  Sparkle, 
  Trash, 
  DotsSixVertical, 
  Minus, 
  Plus 
} from 'phosphor-react-native';

export const EditRecipeScreen: React.FC<any> = ({ navigation }) => {
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponded, setAiResponded] = useState(false);
  const [recipeTitle, setRecipeTitle] = useState("Honey Sesame Chicken & Broccoli");
  const [description, setDescription] = useState(
    "A delicious, sweet, and savory skillet recipe combining tender chicken breast, crisp broccoli florets, and a luscious honey-sesame glaze."
  );
  const [servings, setServings] = useState(4);
  const [prepTime, setPrepTime] = useState("15");
  const [cookTime, setCookTime] = useState("30");

  const [ingredients, setIngredients] = useState([
    { id: '1', name: "Sesame Oil", quantity: "2", unit: "tbsp" },
    { id: '2', name: "Chicken Breast", quantity: "500", unit: "g" },
    { id: '3', name: "Broccoli", quantity: "1", unit: "head" },
    { id: '4', name: "Soy Sauce", quantity: "3", unit: "tbsp" },
    { id: '5', name: "Honey", quantity: "2", unit: "tbsp" },
    { id: '6', name: "Garlic", quantity: "3", unit: "cloves" }
  ]);

  const [steps, setSteps] = useState([
    "Cut the chicken breast into bite-sized cubes and season lightly.",
    "Heat 1 tbsp of sesame oil in a large skillet. Add chicken and cook until brown.",
    "Sauté the broccoli florets and garlic in the skillet with remaining sesame oil.",
    "Whisk soy sauce, honey, and water in a small bowl for the glaze.",
    "Return chicken cubes to the skillet with the broccoli.",
    "Pour glaze over the ingredients and toss evenly to coat.",
    "Simmer for 2 minutes to thicken sauce. Garnish and serve hot."
  ]);

  const handleApplyAIChanges = () => {
    if (!aiPrompt.trim()) return;
    setAiResponded(true);
  };

  const handleApplyAllAIProposal = () => {
    setIngredients(prev => 
      prev.map(it => it.name === "Soy Sauce" ? { ...it, name: "Tamari (gluten-free)" } : it)
    );
    setAiPrompt('');
    setAiResponded(false);
  };

  const addIngredientRow = () => {
    setIngredients(prev => [
      ...prev,
      { id: Math.random().toString(), name: '', quantity: '1', unit: 'units' }
    ]);
  };

  const removeIngredientRow = (id: string) => {
    setIngredients(prev => prev.filter(it => it.id !== id));
  };

  const updateIngredientField = (id: string, field: 'name' | 'quantity' | 'unit', value: string) => {
    setIngredients(prev => prev.map(it => it.id === id ? { ...it, [field]: value } : it));
  };

  const addStepRow = () => {
    setSteps(prev => [...prev, '']);
  };

  const removeStepRow = (index: number) => {
    setSteps(prev => prev.filter((_, i) => i !== index));
  };

  const updateStepText = (index: number, text: string) => {
    setSteps(prev => prev.map((s, i) => i === index ? text : s));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* HEADER BAR */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn}>
          <Text style={styles.headerCancelTxt}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Recipe</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <Text style={styles.headerSaveTxt}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* AI EDIT CARD */}
        <View style={styles.aiEditCard}>
          <View style={styles.aiRowTop}>
            <Sparkle size={20} color="#2D6A4F" weight="fill" />
            <Text style={styles.aiCardTitle}>Edit with AI</Text>
          </View>
          <Text style={styles.aiCardSub}>Describe what you want to change</Text>

          <TextInput
            multiline
            style={styles.aiInput}
            value={aiPrompt}
            onChangeText={setAiPrompt}
            placeholder="e.g. Make this gluten-free, Reduce to 2 servings, Add more spice"
            placeholderTextColor="#8E8E93"
          />

          <TouchableOpacity 
            style={styles.aiApplyBtn} 
            activeOpacity={0.8}
            onPress={handleApplyAIChanges}
          >
            <Text style={styles.aiApplyBtnTxt}>Apply AI Changes</Text>
          </TouchableOpacity>

          {aiResponded && (
            <View style={styles.aiProposalCard}>
              <Text style={styles.aiProposalHeading}>✨ Proposed changes:</Text>
              <Text style={styles.proposalItem}>• Soy Sauce → Tamari (gluten-free)</Text>
              <Text style={styles.proposalItem}>• Flour → Rice Flour</Text>
              <View style={styles.proposalActions}>
                <TouchableOpacity 
                  style={styles.proposalBtnAll}
                  onPress={handleApplyAllAIProposal}
                >
                  <Text style={styles.proposalBtnAllTxt}>Apply All ✓</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.proposalBtnDiscard}
                  onPress={() => setAiResponded(false)}
                >
                  <Text style={styles.proposalBtnDiscardTxt}>Discard ✗</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* OR DIVIDER */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or edit manually</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* SECTION: BASIC INFO */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Basic Info</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Recipe Title</Text>
            <TextInput
              style={styles.textInput}
              value={recipeTitle}
              onChangeText={setRecipeTitle}
              placeholder="e.g. Honey Sesame Chicken"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              multiline
              numberOfLines={4}
              style={[styles.textInput, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="A short story or background for your recipe..."
            />
          </View>
        </View>

        {/* SECTION: DETAILS */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Details</Text>
          
          <View style={styles.detailsRow}>
            {/* Servings Stepper */}
            <View style={styles.detailCol}>
              <Text style={styles.inputLabel}>Servings</Text>
              <View style={styles.detailsStepper}>
                <TouchableOpacity 
                  style={styles.stepperSubBtn} 
                  onPress={() => setServings(Math.max(1, servings - 1))}
                >
                  <Minus size={14} color="#2D6A4F" weight="bold" />
                </TouchableOpacity>
                <Text style={styles.stepperVal}>{servings}</Text>
                <TouchableOpacity 
                  style={styles.stepperSubBtn} 
                  onPress={() => setServings(servings + 1)}
                >
                  <Plus size={14} color="#2D6A4F" weight="bold" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Prep Time */}
            <View style={styles.detailCol}>
              <Text style={styles.inputLabel}>Prep (min)</Text>
              <View style={styles.detailsTimeInputRow}>
                <TextInput
                  style={styles.timeInput}
                  value={prepTime}
                  onChangeText={setPrepTime}
                  keyboardType="number-pad"
                />
                <Text style={styles.timeUnit}>min</Text>
              </View>
            </View>

            {/* Cook Time */}
            <View style={styles.detailCol}>
              <Text style={styles.inputLabel}>Cook (min)</Text>
              <View style={styles.detailsTimeInputRow}>
                <TextInput
                  style={styles.timeInput}
                  value={cookTime}
                  onChangeText={setCookTime}
                  keyboardType="number-pad"
                />
                <Text style={styles.timeUnit}>min</Text>
              </View>
            </View>
          </View>
        </View>

        {/* SECTION: INGREDIENTS */}
        <View style={styles.section}>
          <View style={styles.sectionLabelRow}>
            <Text style={styles.sectionHeading}>Ingredients ({ingredients.length})</Text>
            <TouchableOpacity onPress={addIngredientRow}>
              <Text style={styles.addBtnText}>+ Add</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.ingredientList}>
            {ingredients.map((ing) => (
              <View key={ing.id} style={styles.ingRow}>
                <DotsSixVertical size={16} color="#C7C7CC" style={styles.dragHandle} />
                
                <TextInput
                  style={[styles.ingInput, styles.flexFill]}
                  value={ing.name}
                  onChangeText={(val) => updateIngredientField(ing.id, 'name', val)}
                  placeholder="Ingredient"
                />

                <TextInput
                  style={[styles.ingInput, styles.qtyInput]}
                  value={ing.quantity}
                  onChangeText={(val) => updateIngredientField(ing.id, 'quantity', val)}
                  placeholder="Qty"
                  keyboardType="numeric"
                />

                <TextInput
                  style={[styles.ingInput, styles.unitInput]}
                  value={ing.unit}
                  onChangeText={(val) => updateIngredientField(ing.id, 'unit', val)}
                  placeholder="Unit"
                />

                <TouchableOpacity 
                  onPress={() => removeIngredientRow(ing.id)}
                  style={styles.trashBtn}
                >
                  <Trash size={16} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* SECTION: STEPS */}
        <View style={styles.section}>
          <View style={styles.sectionLabelRow}>
            <Text style={styles.sectionHeading}>Steps ({steps.length})</Text>
            <TouchableOpacity onPress={addStepRow}>
              <Text style={styles.addBtnText}>+ Add Step</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.stepsList}>
            {steps.map((step, idx) => (
              <View key={idx} style={styles.stepRow}>
                <View style={styles.stepCircle}>
                  <Text style={styles.stepNum}>{idx + 1}</Text>
                </View>

                <TextInput
                  multiline
                  style={[styles.stepInput, styles.flexFill]}
                  value={step}
                  onChangeText={(val) => updateStepText(idx, val)}
                  placeholder="Describe this instruction step..."
                />

                <TouchableOpacity 
                  onPress={() => removeStepRow(idx)}
                  style={styles.trashBtn}
                >
                  <Trash size={16} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* SAVE BUTTON */}
        <TouchableOpacity style={styles.saveCta} activeOpacity={0.85}>
          <Text style={styles.saveCtaTxt}>Save Recipe</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1C1C1E',
  },
  headerBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  headerCancelTxt: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '600',
  },
  headerSaveTxt: {
    fontSize: 14,
    color: '#2D6A4F',
    fontWeight: '800',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 60,
  },
  aiEditCard: {
    backgroundColor: '#D8F3DC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  aiRowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  aiCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1C1C1E',
  },
  aiCardSub: {
    fontSize: 11,
    color: '#636366',
    marginTop: 2,
    fontWeight: '500',
  },
  aiInput: {
    marginTop: 12,
    height: 80,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 12,
    color: '#1C1C1E',
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: 'rgba(45, 106, 79, 0.1)',
  },
  aiApplyBtn: {
    borderWidth: 1.5,
    borderColor: '#2D6A4F',
    backgroundColor: 'transparent',
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  aiApplyBtnTxt: {
    color: '#2D6A4F',
    fontSize: 12,
    fontWeight: '800',
  },
  aiProposalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
    borderWidth: 1.5,
    borderColor: '#2D6A4F',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  aiProposalHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2D6A4F',
    marginBottom: 4,
  },
  proposalItem: {
    fontSize: 11,
    color: '#1C1C1E',
    marginTop: 4,
    fontWeight: '600',
  },
  proposalActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  proposalBtnAll: {
    flex: 1,
    height: 36,
    backgroundColor: '#2D6A4F',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proposalBtnAllTxt: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  proposalBtnDiscard: {
    flex: 1,
    height: 36,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proposalBtnDiscardTxt: {
    color: '#FF3B30',
    fontSize: 11,
    fontWeight: '700',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E5EA',
  },
  dividerText: {
    fontSize: 11,
    color: '#8E8E93',
    fontWeight: '600',
  },
  section: {
    marginTop: 20,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1C1C1E',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 8,
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#636366',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    height: 44,
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#1C1C1E',
  },
  textArea: {
    height: 96,
    paddingVertical: 12,
    textAlignVertical: 'top',
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  detailCol: {
    flex: 1,
  },
  detailsStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    height: 44,
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  stepperSubBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1C1C1E',
  },
  detailsTimeInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    height: 44,
    paddingHorizontal: 10,
  },
  timeInput: {
    flex: 1,
    fontSize: 13,
    color: '#1C1C1E',
    textAlign: 'center',
    fontWeight: '700',
    height: '100%',
  },
  timeUnit: {
    fontSize: 11,
    color: '#636366',
    fontWeight: '600',
    marginLeft: 4,
  },
  sectionLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 8,
    marginBottom: 12,
  },
  addBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2D6A4F',
  },
  ingredientList: {
    gap: 10,
  },
  ingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
    paddingBottom: 8,
    gap: 6,
  },
  dragHandle: {
    marginRight: 2,
  },
  ingInput: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    height: 38,
    paddingHorizontal: 10,
    fontSize: 12,
    color: '#1C1C1E',
  },
  flexFill: {
    flex: 1,
  },
  qtyInput: {
    width: 58,
    textAlign: 'center',
    fontWeight: '700',
  },
  unitInput: {
    width: 68,
    textAlign: 'center',
  },
  trashBtn: {
    width: 30,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepsList: {
    gap: 12,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
    paddingBottom: 10,
    gap: 8,
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2D6A4F',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  stepNum: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  stepInput: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 12,
    color: '#1C1C1E',
    minHeight: 52,
    textAlignVertical: 'top',
  },
  saveCta: {
    backgroundColor: '#2D6A4F',
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    marginBottom: 40,
  },
  saveCtaTxt: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});`
  },
  {
    path: 'screens/CookModeScreen.tsx',
    name: 'CookModeScreen.tsx',
    language: 'typescript',
    code: `/**
 * FreshCart - Cook Mode Full Screen
 * File: screens/CookModeScreen.tsx
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { 
  X, 
  Pause, 
  Play, 
  ArrowClockwise, 
  ArrowLeft, 
  ArrowRight,
} from 'phosphor-react-native';

const safeArea = { top: 44, bottom: 34 };

export const CookModeScreen: React.FC<any> = ({ navigation }) => {
  const steps = [
    "Cut the chicken breast into bite-sized cubes and season lightly with salt and pepper.",
    "Heat 1 tbsp of sesame oil in a large skillet over medium-high heat. Add chicken and sear until cooked through (8 minutes).",
    "Sauté the broccoli florets and minced garlic in the skillet with the remaining sesame oil. (Set timer for 4 minutes)",
    "In a small bowl, whisk together the soy sauce, honey, and water to create the glaze.",
    "Return the cooked chicken cubes to the skillet with the broccoli.",
    "Pour glaze over the ingredients and toss evenly to coat uniformly.",
    "Simmer for 2 minutes to thicken sauce. Garnish with toasted sesame seeds and serve warm."
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(240);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning]);

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return \`\${mins.toString().padStart(2, '0')}:\${secs.toString().padStart(2, '0')}\`;
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      if (currentStep + 1 === 2) {
        setTimerSeconds(240);
      } else if (currentStep + 1 === 6) {
        setTimerSeconds(120);
      } else {
        setTimerSeconds(0);
      }
      setTimerRunning(false);
    } else {
      Alert.alert(
        "Done Cooking! 🎉",
        "Would you like to update your pantry to account for the used ingredients?",
        [
          { text: "Update Pantry", onPress: () => navigation.goBack() },
          { text: "Not now", onPress: () => navigation.goBack() }
        ]
      );
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setTimerRunning(false);
    }
  };

  const hasTimer = currentStep === 2 || currentStep === 6;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* TOP HEADER */}
      <View style={[styles.headerRow, { paddingTop: safeArea.top + 8 }]}>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle} numberOfLines={1}>Honey Sesame Chicken</Text>
        </View>
        <TouchableOpacity style={styles.closeBtn} activeOpacity={0.8}>
          <X size={20} color="#FFFFFF" weight="bold" />
        </TouchableOpacity>
      </View>

      {/* PROGRESS TRACKER */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressLabel}>Step {currentStep + 1} of {steps.length}</Text>
        <View style={styles.progressSegmentsRow}>
          {steps.map((_, index) => {
            const completed = index <= currentStep;
            return (
              <View 
                key={index} 
                style={[
                  styles.progressSegment, 
                  completed ? styles.segmentCompleted : styles.segmentUpcoming
                ]} 
              />
            );
          })}
        </View>
      </View>

      {/* CENTER SECTION */}
      <View style={styles.centerSection}>
        <View style={styles.stepNumCircle}>
          <Text style={styles.stepCircleTxt}>{currentStep + 1}</Text>
        </View>

        <ScrollView style={styles.stepScroll} contentContainerStyle={styles.stepScrollContent}>
          <Text style={styles.stepText}>{steps[currentStep]}</Text>
        </ScrollView>

        {hasTimer && timerSeconds > 0 && (
          <View style={styles.timerSection}>
            <View style={styles.timerWrapper}>
              <Text style={styles.countdownText}>{formatTime(timerSeconds)}</Text>
            </View>
            <View style={styles.timerControlRow}>
              <TouchableOpacity 
                style={styles.timerControlBtn}
                onPress={() => setTimerRunning(!timerRunning)}
              >
                {timerRunning ? (
                  <Pause size={18} color="#FFFFFF" weight="fill" />
                ) : (
                  <Play size={18} color="#FFFFFF" weight="fill" />
                )}
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.timerControlBtn}
                onPress={() => {
                  setTimerSeconds(currentStep === 2 ? 240 : 120);
                  setTimerRunning(false);
                }}
              >
                <ArrowClockwise size={18} color="#FFFFFF" weight="bold" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* BOTTOM BUTTONS BAR */}
      <View style={[styles.bottomBar, { paddingBottom: safeArea.bottom + 16 }]}>
        <TouchableOpacity 
          style={[styles.navBtn, styles.navBtnPrev, currentStep === 0 && styles.navBtnDisabled]}
          disabled={currentStep === 0}
          onPress={handlePrev}
          activeOpacity={0.7}
        >
          <ArrowLeft size={16} color="#FFFFFF" weight="bold" style={styles.navBtnIcon} />
          <Text style={styles.navBtnPrevText}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navBtn, styles.navBtnNext]}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.navBtnNextText}>
            {currentStep === steps.length - 1 ? "Done Cooking! 🎉" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerTitleWrap: {
    flex: 1,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  progressLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'right',
  },
  progressSegmentsRow: {
    flexDirection: 'row',
    height: 4,
    marginTop: 6,
    gap: 4,
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  segmentCompleted: {
    backgroundColor: '#52B788',
  },
  segmentUpcoming: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    marginTop: 16,
  },
  stepNumCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#52B788',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleTxt: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
  },
  stepScroll: {
    flexMaxHeight: 120,
    marginTop: 24,
    width: '100%',
  },
  stepScrollContent: {
    alignItems: 'center',
  },
  stepText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    fontWeight: '500',
  },
  timerSection: {
    alignItems: 'center',
    marginTop: 24,
  },
  timerWrapper: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: 'rgba(82, 183, 136, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  countdownText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  timerControlRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 16,
  },
  timerControlBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  navBtn: {
    height: 52,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBtnPrev: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'transparent',
  },
  navBtnDisabled: {
    opacity: 0.3,
  },
  navBtnPrevText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  navBtnIcon: {
    marginRight: 6,
  },
  navBtnNext: {
    flex: 2,
    backgroundColor: '#2D6A4F',
  },
  navBtnNextText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});`
  },
  {
    path: 'screens/AddRecipeScreen.tsx',
    name: 'AddRecipeScreen.tsx',
    language: 'typescript',
    code: `/**
 * FreshCart - Add Recipe Screen
 * File: screens/AddRecipeScreen.tsx
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { 
  Camera, 
  Trash, 
  Minus, 
  Plus, 
  X 
} from 'phosphor-react-native';

export const AddRecipeScreen: React.FC<any> = ({ navigation }) => {
  const [photoSelected, setPhotoSelected] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [servings, setServings] = useState(2);
  const [prepTime, setPrepTime] = useState('15');
  const [cookTime, setCookTime] = useState('30');
  
  const [tagInput, setTagInput] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(["Quick", "Healthy"]);
  
  const [ingredients, setIngredients] = useState([
    { id: '1', name: '', quantity: '', unit: 'units' },
    { id: '2', name: '', quantity: '', unit: 'units' },
    { id: '3', name: '', quantity: '', unit: 'units' }
  ]);

  const [steps, setSteps] = useState([
    "Describe step 1..."
  ]);

  const tagSuggestions = ["Vegetarian", "Quick", "Healthy", "Breakfast", "Italian"];

  const handleSelectPhoto = () => {
    setPhotoSelected(true);
  };

  const handleAddTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !selectedTags.includes(trimmed)) {
      setSelectedTags([...selectedTags, trimmed]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  const addIngredientRow = () => {
    setIngredients([
      ...ingredients,
      { id: Math.random().toString(), name: '', quantity: '', unit: 'units' }
    ]);
  };

  const removeIngredientRow = (id: string) => {
    setIngredients(ingredients.filter(it => it.id !== id));
  };

  const cycleUnit = (index: number) => {
    const units = ['units', 'g', 'kg', 'ml', 'L', 'tbsp', 'tsp', 'cups'];
    setIngredients(prev => prev.map((it, i) => {
      if (i === index) {
        const currentIdx = units.indexOf(it.unit);
        const nextIdx = (currentIdx + 1) % units.length;
        return { ...it, unit: units[nextIdx] };
      }
      return it;
    }));
  };

  const updateIngredientField = (id: string, field: 'name' | 'quantity', value: string) => {
    setIngredients(prev => prev.map(it => it.id === id ? { ...it, [field]: value } : it));
  };

  const addStepRow = () => {
    setSteps([...steps, ""]);
  };

  const removeStepRow = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const updateStepText = (index: number, text: string) => {
    setSteps(prev => prev.map((s, i) => i === index ? text : s));
  };

  const isSaveDisabled = !title.trim();

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* HEADER BAR */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn}>
          <Text style={styles.headerCancelTxt}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Recipe</Text>
        <TouchableOpacity 
          style={styles.headerBtn}
          disabled={isSaveDisabled}
        >
          <Text style={[styles.headerSaveTxt, isSaveDisabled && styles.headerSaveDisabled]}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* PHOTO AREA */}
        <TouchableOpacity 
          style={[styles.photoArea, photoSelected && styles.photoAreaSelected]} 
          onPress={handleSelectPhoto}
          activeOpacity={0.8}
        >
          {photoSelected ? (
            <View style={styles.photoContainer}>
              <View style={styles.photoPlaceholderFill}>
                <Text style={styles.photoLabelActive}>🍯 Honey Sesame Chicken Mock Image</Text>
              </View>
              <View style={styles.photoChangeOverlay}>
                <Text style={styles.photoChangeText}>Change</Text>
              </View>
            </View>
          ) : (
            <View style={styles.photoPlaceholder}>
              <Camera size={36} color="#C7C7CC" />
              <Text style={styles.photoTitle}>Add Photo</Text>
              <Text style={styles.photoSubtitle}>Optional</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* BASIC INFO */}
        <View style={styles.section}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Recipe Title *</Text>
            <TextInput
              style={styles.textInput}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Chocolate Chip Cookies"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              multiline
              numberOfLines={3}
              style={[styles.textInput, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="A brief description of the dish..."
            />
          </View>
        </View>

        {/* DETAILS ROW */}
        <View style={styles.detailsRow}>
          <View style={styles.detailCol}>
            <Text style={styles.inputLabel}>Servings</Text>
            <View style={styles.stepperRow}>
              <TouchableOpacity 
                style={styles.stepperBtn}
                onPress={() => setServings(Math.max(1, servings - 1))}
              >
                <Minus size={12} color="#2D6A4F" weight="bold" />
              </TouchableOpacity>
              <Text style={styles.stepperVal}>{servings}</Text>
              <TouchableOpacity 
                style={styles.stepperBtn}
                onPress={() => setServings(servings + 1)}
              >
                <Plus size={12} color="#2D6A4F" weight="bold" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.detailCol}>
            <Text style={styles.inputLabel}>Prep (min)</Text>
            <TextInput
              style={styles.textInput}
              value={prepTime}
              onChangeText={setPrepTime}
              keyboardType="number-pad"
              placeholder="15"
            />
          </View>

          <View style={styles.detailCol}>
            <Text style={styles.inputLabel}>Cook (min)</Text>
            <TextInput
              style={styles.textInput}
              value={cookTime}
              onChangeText={setCookTime}
              keyboardType="number-pad"
              placeholder="30"
            />
          </View>
        </View>

        {/* TAGS */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Tags</Text>
          
          <View style={styles.chipsRow}>
            {selectedTags.map(tag => (
              <View key={tag} style={styles.chipPill}>
                <Text style={styles.chipText}>{tag}</Text>
                <TouchableOpacity onPress={() => handleRemoveTag(tag)} style={styles.chipCloseBtn}>
                  <X size={10} color="#FFFFFF" weight="bold" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <TextInput
            style={styles.textInput}
            value={tagInput}
            onChangeText={setTagInput}
            onSubmitEditing={() => handleAddTag(tagInput)}
            placeholder="Type tag & press enter"
          />

          <View style={styles.tagSuggestionsRow}>
            {tagSuggestions.map(tag => (
              <TouchableOpacity 
                key={tag} 
                style={styles.suggestionPill}
                onPress={() => handleAddTag(tag)}
              >
                <Text style={styles.suggestionText}>{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* INGREDIENTS */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeading}>Ingredients</Text>
            <TouchableOpacity onPress={addIngredientRow}>
              <Text style={styles.sectionAddText}>+ Add</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.listContainer}>
            {ingredients.map((ing, idx) => (
              <View key={ing.id} style={styles.listItemRow}>
                <TextInput
                  style={[styles.itemInput, styles.flexFill]}
                  value={ing.name}
                  onChangeText={(val) => updateIngredientField(ing.id, 'name', val)}
                  placeholder="Ingredient"
                />

                <TextInput
                  style={[styles.itemInput, styles.qtyInput]}
                  value={ing.quantity}
                  onChangeText={(val) => updateIngredientField(ing.id, 'quantity', val)}
                  placeholder="1"
                  keyboardType="numeric"
                />

                <TouchableOpacity 
                  onPress={() => cycleUnit(idx)}
                  style={styles.unitBtn}
                >
                  <Text style={styles.unitBtnTxt}>{ing.unit}</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={() => removeIngredientRow(ing.id)}
                  style={styles.trashBtn}
                >
                  <Trash size={16} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
          
          <TouchableOpacity onPress={addIngredientRow} style={styles.addSecondaryBtn}>
            <Text style={styles.addSecondaryBtnTxt}>+ Add Ingredient</Text>
          </TouchableOpacity>
        </View>

        {/* STEPS */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeading}>Steps</Text>
            <TouchableOpacity onPress={addStepRow}>
              <Text style={styles.sectionAddText}>+ Add Step</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.listContainer}>
            {steps.map((step, idx) => (
              <View key={idx} style={styles.stepRow}>
                <View style={styles.stepCircle}>
                  <Text style={styles.stepCircleText}>{idx + 1}</Text>
                </View>

                <TextInput
                  multiline
                  style={[styles.stepInput, styles.flexFill]}
                  value={step}
                  onChangeText={(val) => updateStepText(idx, val)}
                  placeholder="Describe this step..."
                />

                <TouchableOpacity 
                  onPress={() => removeStepRow(idx)}
                  style={styles.trashBtn}
                >
                  <Trash size={16} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* SAVE CTA BUTTON */}
        <TouchableOpacity 
          style={[styles.saveBtnCta, isSaveDisabled && styles.saveBtnCtaDisabled]}
          disabled={isSaveDisabled}
          activeOpacity={0.85}
        >
          <Text style={styles.saveBtnCtaTxt}>Save Recipe</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1C1C1E',
  },
  headerBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  headerCancelTxt: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '600',
  },
  headerSaveTxt: {
    fontSize: 14,
    color: '#2D6A4F',
    fontWeight: '800',
  },
  headerSaveDisabled: {
    color: '#C7C7CC',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 60,
  },
  photoArea: {
    height: 200,
    borderWidth: 1.5,
    borderColor: '#C7C7CC',
    borderStyle: 'dashed',
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    overflow: 'hidden',
  },
  photoAreaSelected: {
    borderStyle: 'solid',
    borderColor: '#2D6A4F',
  },
  photoPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8E8E93',
    marginTop: 8,
  },
  photoSubtitle: {
    fontSize: 11,
    color: '#C7C7CC',
    marginTop: 2,
    fontWeight: '600',
  },
  photoContainer: {
    flex: 1,
    position: 'relative',
  },
  photoPlaceholderFill: {
    flex: 1,
    backgroundColor: '#1B4332',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoLabelActive: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  photoChangeOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  photoChangeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  section: {
    marginTop: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1C1C1E',
  },
  sectionAddText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2D6A4F',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#636366',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    height: 44,
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#1C1C1E',
  },
  textArea: {
    height: 80,
    paddingVertical: 12,
    textAlignVertical: 'top',
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  detailCol: {
    flex: 1,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    height: 44,
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  stepperBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1C1C1E',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  chipPill: {
    backgroundColor: '#2D6A4F',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 6,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  chipText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  chipCloseBtn: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagSuggestionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  suggestionPill: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  suggestionText: {
    color: '#52B788',
    fontSize: 11,
    fontWeight: '600',
  },
  listContainer: {
    gap: 8,
  },
  listItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  itemInput: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    height: 38,
    paddingHorizontal: 10,
    fontSize: 12,
    color: '#1C1C1E',
  },
  qtyInput: {
    width: 50,
    textAlign: 'center',
    fontWeight: '700',
  },
  unitBtn: {
    width: 50,
    height: 38,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unitBtnTxt: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2D6A4F',
  },
  trashBtn: {
    width: 30,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addSecondaryBtn: {
    marginTop: 10,
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  addSecondaryBtnTxt: {
    color: '#2D6A4F',
    fontSize: 12,
    fontWeight: '800',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2D6A4F',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  stepCircleText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  stepInput: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 12,
    color: '#1C1C1E',
    minHeight: 52,
    textAlignVertical: 'top',
  },
  saveBtnCta: {
    backgroundColor: '#2D6A4F',
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    marginBottom: 48,
  },
  saveBtnCtaDisabled: {
    backgroundColor: '#E5E5EA',
  },
  saveBtnCtaTxt: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});`
  }
];
