/**
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
  { id: 'p4', name: 'Broccoli', category: 'Vegetables', quantity: '0.5 kg', expirationDate: new Date('2026-07-09') }, // WARNING (3-7 days or <3 days depending on calculation. Let's make it Jul 10/11 for WARNING)
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
      Alert.alert('Edit Item', `Editing ${item.name}`);
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
      return { text: `Exp: ${dateStr}`, style: styles.expFine, colorClass: '#636366' };
    }

    if (daysLeft < 3) {
      return { text: `Exp: ${dateStr} 🔴`, style: styles.expCritical, colorClass: '#FF3B30' };
    } else if (daysLeft <= 7) {
      return { text: `Exp: ${dateStr} ⚠️`, style: styles.expWarning, colorClass: '#FF9500' };
    } else {
      return { text: `Exp: ${dateStr}`, style: styles.expFine, colorClass: '#636366' };
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
});
