/**
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
import { CaretLeft, Sparkle, Plus } from 'phosphor-react-native';

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
    Alert.alert('Added Bundle', `Added Milk, Eggs, and Bread to your shopping list!`);
  };

  const handleAddSingle = (item: RecentItemData | FrequentItemData) => {
    if (onAddItemsToList) {
      onAddItemsToList([{ name: item.name, category: item.category }]);
    }
    setAddedItems(prev => ({ ...prev, [item.id]: true }));
    Alert.alert('Item Added', `"${item.name}" has been added to your shopping list!`);
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

    Alert.alert('Success', `Added ${allItems.length} suggestions to your shopping list!`);
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
});
