/**
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
});
