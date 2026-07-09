/**
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
  Modal,
  Pressable
} from 'react-native';
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
      quantity: `${quantity} ${unit}`,
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
});
