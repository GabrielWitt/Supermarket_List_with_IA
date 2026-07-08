/**
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

interface ProfileScreenProps {
  navigation?: {
    navigate: (screenName: string) => void;
    replace: (screenName: string) => void;
  };
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
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
                  <Text style={styles.statValue}>$245</Text>
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
            <TouchableOpacity 
              style={styles.navRow} 
              activeOpacity={0.7}
              onPress={() => navigation?.navigate('Settings')}
            >
              <View style={styles.navRowLeft}>
                <Gear size={20} color="#636366" />
                <Text style={styles.navRowLabel}>Settings</Text>
              </View>
              <CaretRight size={16} color="#C7C7CC" weight="bold" />
            </TouchableOpacity>

            {/* Row 2: Notifications */}
            <TouchableOpacity 
              style={styles.navRow} 
              activeOpacity={0.7}
              onPress={() => navigation?.navigate('NotificationSettings')}
            >
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
            <TouchableOpacity 
              style={styles.dangerRow} 
              activeOpacity={0.7}
              onPress={() => navigation?.replace('Login')}
            >
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
    paddingBottom: 100, // Bottom padding for navigation bar spacing
  },
  cardContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#F2F2F7',
    marginTop: -24, // Elegant overlap over green header background
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

export default ProfileScreen;
