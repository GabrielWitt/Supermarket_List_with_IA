/**
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
              <Text style={styles.pillText}>${estimatedTotal.toFixed(2)} estimated</Text>
            </View>
          </View>

          {/* Progress Bar Container */}
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${completionPercentage}%` }]} />
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
              <Text style={styles.statNumber}>$245</Text>
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

export default HomeScreen;
