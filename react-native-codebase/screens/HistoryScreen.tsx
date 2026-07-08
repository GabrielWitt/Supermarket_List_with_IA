/**
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
import { CaretLeft, CaretRight, MagnifyingGlass, Calendar } from 'phosphor-react-native';

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

  // Helper to parse dates for filtering
  const filteredTrips = useMemo(() => {
    return HISTORIC_TRIPS.filter(trip => {
      // 1. Search Query filter (matches store name or date)
      const matchesSearch = 
        trip.store.toLowerCase().includes(searchText.toLowerCase()) ||
        trip.date.toLowerCase().includes(searchText.toLowerCase());
      
      if (!matchesSearch) return false;

      // 2. Chip filters
      if (selectedFilter === 'All') return true;
      if (selectedFilter === 'This Week') {
        // July 3 is within the current week of July 6, 2026
        return trip.date.includes('July');
      }
      if (selectedFilter === 'This Month') {
        return trip.date.includes('July') || trip.date.includes('June');
      }
      if (selectedFilter === 'By Store') {
        // Prioritize Walmart and other stores
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
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7}>
          <CaretLeft size={24} color="#1C1C1E" weight="bold" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shopping History</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      {/* SEARCH BAR */}
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

      {/* FILTER CHIPS */}
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

      {/* SUMMARY BAR */}
      <View style={styles.summaryBar}>
        <Text style={styles.summaryTripsText}>
          {filteredTrips.length} shopping {filteredTrips.length === 1 ? 'trip' : 'trips'}
        </Text>
        <Text style={styles.summaryTotalText}>
          Total: ${totalSpent.toFixed(2)}
        </Text>
      </View>

      {/* LIST OF TRIPS */}
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
                    <Text style={styles.cardTotal}>${item.total.toFixed(2)}</Text>
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
});
