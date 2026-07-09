/**
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
  KeyboardAvoidingView,
  Pressable
} from 'react-native';
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
                Total: <Text style={styles.liveTotalVal}>${calculatedTotal}</Text>
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
});
