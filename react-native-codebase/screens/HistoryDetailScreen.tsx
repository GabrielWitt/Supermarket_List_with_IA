/**
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

// 3 sections, 8 items total
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
      alert(`Re-adding ${trip.items} items from ${trip.store} to your active list!`);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7}>
          <CaretLeft size={24} color="#1C1C1E" weight="bold" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{trip.date}</Text>
        <TouchableOpacity style={styles.useAgainButton} onPress={handleUseAgain} activeOpacity={0.7}>
          <Text style={styles.useAgainText}>Use Again</Text>
        </TouchableOpacity>
      </View>

      {/* SECTION LIST */}
      <SectionList
        sections={PURCHASED_ITEMS_DATA}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.scrollContent}
        ListHeaderComponent={
          /* SUMMARY CARD */
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>
              {trip.store} — {trip.date}
            </Text>

            {/* STATS GRID (2x2) */}
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
                    ${trip.total.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Duration row */}
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
              <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
              <CheckCircle size={18} color="#34C759" weight="fill" style={styles.checkIcon} />
            </View>
          </View>
        )}
        renderSectionFooter={() => <View style={styles.sectionFooterSpacer} />}
        ListFooterComponent={<View style={styles.listFooterSpacer} />}
      />

      {/* FIXED FOOTER */}
      <View style={styles.footer}>
        <Text style={styles.footerTotal}>Total: ${trip.total.toFixed(2)}</Text>
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
});
