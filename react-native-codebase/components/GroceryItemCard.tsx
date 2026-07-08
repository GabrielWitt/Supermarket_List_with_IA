/**
 * FreshCart - Grocery Item Component
 * File: components/GroceryItemCard.tsx
 * 
 * Styled grocery list item card conforming strictly to the FreshCart Design System.
 * Supports:
 * - Direct click to change quantity (Modal trigger)
 * - Direct click to change unit price (Modal trigger)
 * - Checked state for items successfully purchased
 * - Swipe-to-delete gesture configuration
 * - Custom category-specific typography & badge coloring
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Check, Plus, Minus, Trash, PencilSimple } from 'phosphor-react-native';
import { GroceryItem } from '../types';

interface GroceryItemCardProps {
  item: GroceryItem;
  onPressQuantity: (item: GroceryItem) => void;
  onPressPrice: (item: GroceryItem) => void;
  onTogglePurchased: (id: string) => void;
  onDelete: (id: string) => void;
  isDarkMode?: boolean;
}

// Category Badge Color Palette
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
  isDarkMode = false,
}) => {
  const categoryColor = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.Other;
  const isPurchased = item.purchased && item.quantity > 0;
  const totalCost = (item.quantity * item.price).toFixed(2);

  return (
    <View style={[
      styles.card, 
      isDarkMode && styles.cardDark,
      isPurchased && styles.cardPurchased
    ]}>
      {/* Circle Checkbox */}
      <TouchableOpacity 
        style={[
          styles.checkbox,
          isPurchased && styles.checkboxChecked,
          isDarkMode && styles.checkboxDark,
        ]} 
        onPress={() => onTogglePurchased(item.id)}
        activeOpacity={0.7}
      >
        {isPurchased && <Check size={14} color="#FFFFFF" weight="bold" />}
      </TouchableOpacity>

      {/* Item Info */}
      <View style={styles.infoContainer}>
        <View style={styles.nameRow}>
          <Text style={[
            styles.itemName, 
            isDarkMode && styles.textDark,
            isPurchased && styles.textLineThrough
          ]} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={[styles.badge, { backgroundColor: categoryColor.bg }]}>
            <Text style={[styles.badgeText, { color: categoryColor.text }]}>
              {item.category}
            </Text>
          </View>
        </View>

        {/* Pricing and Quantity Interactive Rows */}
        <View style={styles.interactiveRow}>
          {/* Quantity Pill */}
          <TouchableOpacity 
            style={[styles.pill, isDarkMode && styles.pillDark]}
            onPress={() => onPressQuantity(item)}
            activeOpacity={0.8}
          >
            <Text style={[styles.pillLabel, isDarkMode && styles.textDarkVariant]}>Qty:</Text>
            <Text style={[styles.pillValue, isDarkMode && styles.textDark, item.quantity > 0 && styles.qtyHighlighted]}>
              {item.quantity}
            </Text>
            <PencilSimple size={12} color={isDarkMode ? '#A1A1AA' : '#636366'} style={styles.pillIcon} />
          </TouchableOpacity>

          {/* Price Pill */}
          <TouchableOpacity 
            style={[styles.pill, isDarkMode && styles.pillDark]}
            onPress={() => onPressPrice(item)}
            activeOpacity={0.8}
          >
            <Text style={[styles.pillLabel, isDarkMode && styles.textDarkVariant]}>Price:</Text>
            <Text style={[styles.pillValue, isDarkMode && styles.textDark]}>
              ${item.price.toFixed(2)}
            </Text>
            <PencilSimple size={12} color={isDarkMode ? '#A1A1AA' : '#636366'} style={styles.pillIcon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Total Aggregated price */}
      <View style={styles.totalContainer}>
        <Text style={[styles.totalLabel, isDarkMode && styles.textDarkVariant]}>Total</Text>
        <Text style={[styles.totalValue, isDarkMode && styles.textDark, isPurchased && styles.textLineThrough]}>
          ${totalCost}
        </Text>
      </View>

      {/* Delete Trigger */}
      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={() => onDelete(item.id)}
        activeOpacity={0.7}
      >
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
    // shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 3, elevation: 2
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  cardDark: {
    backgroundColor: '#1C1C1E',
    borderColor: '#2C2C2E',
  },
  cardPurchased: {
    backgroundColor: '#F2F9F4',
    borderColor: '#C2E7D1',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#C7C7CC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#2D6A4F',
    borderColor: '#2D6A4F',
  },
  checkboxDark: {
    borderColor: '#48484A',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginRight: 8,
    maxWidth: 130,
  },
  textLineThrough: {
    textDecorationLine: 'line-through',
    color: '#8E8E93',
  },
  textDark: {
    color: '#FFFFFF',
  },
  textDarkVariant: {
    color: '#8E8E93',
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  interactiveRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  pillDark: {
    backgroundColor: '#2C2C2E',
  },
  pillLabel: {
    fontSize: 11,
    color: '#636366',
    marginRight: 4,
  },
  pillValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  qtyHighlighted: {
    color: '#2D6A4F',
    fontWeight: '700',
  },
  pillIcon: {
    marginLeft: 4,
  },
  totalContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 8,
    borderLeftWidth: 1,
    borderLeftColor: '#E5E5EA',
    minWidth: 70,
  },
  totalLabel: {
    fontSize: 10,
    color: '#8E8E93',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 4,
  },
});
