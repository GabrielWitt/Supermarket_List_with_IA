/**
 * FreshCart - Notification Settings Screen
 * File: screens/NotificationSettingsScreen.tsx
 */

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Switch,
  StatusBar,
  Alert
} from 'react-native';
import { 
  Bell, 
  ShoppingCart, 
  Clock, 
  WarningCircle, 
  Sparkle, 
  BookOpen, 
  CaretRight, 
  CaretLeft 
} from 'phosphor-react-native';

const safeArea = { top: 44 };

interface NotificationSettingsScreenProps {
  navigation?: {
    goBack: () => void;
  };
}

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export const NotificationSettingsScreen: React.FC<NotificationSettingsScreenProps> = ({ navigation }) => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [shoppingReminders, setShoppingReminders] = useState(true);
  const [selectedDays, setSelectedDays] = useState<string[]>(['SUN', 'WED']);
  const [reminderTime, setReminderTime] = useState('10:00 AM');
  const [expirationAlerts, setExpirationAlerts] = useState(true);
  const [alertDays, setAlertDays] = useState(3);
  const [aiSuggestions, setAiSuggestions] = useState(false);
  const [recipeIdeas, setRecipeIdeas] = useState(false);

  // Picker modal states (simulated via alerts or simple state)
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [isDaysPickerOpen, setIsDaysPickerOpen] = useState(false);

  const handleToggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(prev => prev.filter(d => d !== day));
    } else {
      setSelectedDays(prev => [...prev, day]);
    }
  };

  const handleRequestPermission = () => {
    // Request permission mock
    setPermissionGranted(true);
    Alert.alert('Notifications Enabled', 'FreshCart will now send you smart alerts!');
  };

  const handleSelectTime = () => {
    const times = ['08:00 AM', '10:00 AM', '12:00 PM', '04:00 PM', '06:00 PM', '08:00 PM'];
    Alert.alert(
      'Select Reminder Time',
      'Choose a time to receive lists alerts:',
      times.map(t => ({
        text: t,
        onPress: () => setReminderTime(t)
      })),
      { cancelable: true }
    );
  };

  const handleSelectDaysBefore = () => {
    const options = [1, 2, 3, 5, 7];
    Alert.alert(
      'Expiration Alerts',
      'Alert how many days before expiration?',
      options.map(opt => ({
        text: `${opt} days before`,
        onPress: () => setAlertDays(opt)
      })),
      { cancelable: true }
    );
  };

  const handleSavePreferences = () => {
    Alert.alert('Settings Saved', 'Your notification preferences have been successfully updated.');
    navigation?.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F2F2F7" />

      {/* CUSTOM HEADER */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation?.goBack()}
          activeOpacity={0.7}
        >
          <CaretLeft size={24} color="#1C1C1E" weight="bold" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* PERMISSION BANNER (Amber color if not granted) */}
        {!permissionGranted && (
          <View style={styles.bannerCard}>
            <View style={styles.bannerHeader}>
              <Bell size={20} color="#FF9500" weight="bold" />
              <Text style={styles.bannerText}>
                Enable notifications to get alerts and reminders
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.bannerButton}
              onPress={handleRequestPermission}
              activeOpacity={0.8}
            >
              <Text style={styles.bannerButtonText}>Enable Notifications</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* SECTION: SHOPPING REMINDERS */}
        <Text style={styles.sectionLabel}>Shopping Reminders</Text>
        <View style={styles.sectionCard}>
          <View style={styles.rowContainer}>
            <View style={styles.rowLeft}>
              <ShoppingCart size={20} color="#636366" />
              <Text style={styles.rowLabel}>Shopping Reminders</Text>
            </View>
            <Switch
              value={shoppingReminders}
              onValueChange={setShoppingReminders}
              trackColor={{ false: '#767577', true: '#2D6A4F' }}
              thumbColor={shoppingReminders ? '#FFFFFF' : '#F2F2F7'}
            />
          </View>

          {/* Expanded Configuration Section when shoppingReminders toggle is true */}
          {shoppingReminders && (
            <View style={styles.expandedContent}>
              <Text style={styles.expandedSectionSubtitle}>Remind me on:</Text>
              
              {/* Day chips list */}
              <View style={styles.daysContainer}>
                {DAYS.map(day => {
                  const isSelected = selectedDays.includes(day);
                  return (
                    <TouchableOpacity
                      key={day}
                      style={[styles.dayChip, isSelected && styles.dayChipSelected]}
                      onPress={() => handleToggleDay(day)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.dayChipText, isSelected && styles.dayChipTextSelected]}>
                        {day}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Time Selection Sub-Row */}
              <TouchableOpacity 
                style={styles.subRowClickable}
                onPress={handleSelectTime}
                activeOpacity={0.7}
              >
                <View style={styles.subRowLeft}>
                  <Clock size={16} color="#636366" />
                  <Text style={styles.subRowLabel}>Time</Text>
                </View>
                <View style={styles.subRowRight}>
                  <Text style={styles.subRowValue}>{reminderTime}</Text>
                  <CaretRight size={14} color="#C7C7CC" weight="bold" />
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* SECTION: PANTRY */}
        <Text style={styles.sectionLabel}>Pantry</Text>
        <View style={styles.sectionCard}>
          <View style={styles.rowContainer}>
            <View style={styles.rowLeft}>
              <WarningCircle size={20} color="#636366" />
              <Text style={styles.rowLabel}>Expiration Alerts</Text>
            </View>
            <Switch
              value={expirationAlerts}
              onValueChange={setExpirationAlerts}
              trackColor={{ false: '#767577', true: '#2D6A4F' }}
              thumbColor={expirationAlerts ? '#FFFFFF' : '#F2F2F7'}
            />
          </View>

          {expirationAlerts && (
            <TouchableOpacity 
              style={[styles.rowContainer, styles.rowSubBorder]}
              onPress={handleSelectDaysBefore}
              activeOpacity={0.7}
            >
              <Text style={styles.subRowDescriptionLabel}>Alert how many days before?</Text>
              <View style={styles.subRowRight}>
                <Text style={styles.subRowValue}>{alertDays} days</Text>
                <CaretRight size={14} color="#C7C7CC" weight="bold" />
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* SECTION: RECIPES & AI */}
        <Text style={styles.sectionLabel}>Recipes & AI</Text>
        <View style={styles.sectionCard}>
          {/* Row 1: Weekly AI Suggestions */}
          <View style={styles.rowContainerNoBorder}>
            <View style={styles.rowLeft}>
              <Sparkle size={20} color="#636366" />
              <View style={styles.columnLabel}>
                <Text style={styles.rowLabel}>Weekly AI Suggestions</Text>
                <Text style={styles.rowDescription}>
                  Personalized recipe ideas every Sunday
                </Text>
              </View>
            </View>
            <Switch
              value={aiSuggestions}
              onValueChange={setAiSuggestions}
              trackColor={{ false: '#767577', true: '#2D6A4F' }}
              thumbColor={aiSuggestions ? '#FFFFFF' : '#F2F2F7'}
            />
          </View>

          {/* Row 2: New Recipe Ideas */}
          <View style={[styles.rowContainer, styles.rowTopBorder]}>
            <View style={styles.rowLeft}>
              <BookOpen size={20} color="#636366" />
              <Text style={styles.rowLabel}>New Recipe Ideas</Text>
            </View>
            <Switch
              value={recipeIdeas}
              onValueChange={setRecipeIdeas}
              trackColor={{ false: '#767577', true: '#2D6A4F' }}
              thumbColor={recipeIdeas ? '#FFFFFF' : '#F2F2F7'}
            />
          </View>
        </View>

        {/* SAVE PREFERENCES BUTTON */}
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSavePreferences}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>Save Preferences</Text>
        </TouchableOpacity>

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
    height: 96,
    backgroundColor: '#F2F2F7',
    paddingTop: safeArea.top,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  headerSpacer: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  bannerCard: {
    backgroundColor: '#FFF3CD',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FFEBAA',
  },
  bannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bannerText: {
    flex: 1,
    fontSize: 14,
    color: '#856404',
    fontWeight: '500',
    lineHeight: 18,
  },
  bannerButton: {
    backgroundColor: '#2D6A4F',
    borderRadius: 8,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  bannerButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#636366',
    letterSpacing: 1.5,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
    textTransform: 'uppercase',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  rowContainer: {
    height: 52,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowContainerNoBorder: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowTopBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E5EA',
  },
  rowSubBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E5EA',
    paddingLeft: 44,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  columnLabel: {
    flex: 1,
    flexDirection: 'column',
    gap: 2,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  rowDescription: {
    fontSize: 12,
    color: '#636366',
    lineHeight: 16,
  },
  expandedContent: {
    paddingLeft: 44,
    paddingRight: 16,
    paddingBottom: 16,
  },
  expandedSectionSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#636366',
    marginBottom: 8,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  dayChip: {
    backgroundColor: '#F2F2F7',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  dayChipSelected: {
    backgroundColor: '#2D6A4F',
  },
  dayChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#636366',
  },
  dayChipTextSelected: {
    color: '#FFFFFF',
  },
  subRowClickable: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    paddingVertical: 8,
  },
  subRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  subRowLabel: {
    fontSize: 14,
    color: '#636366',
    fontWeight: '500',
  },
  subRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  subRowValue: {
    fontSize: 14,
    color: '#2D6A4F',
    fontWeight: '600',
  },
  subRowDescriptionLabel: {
    fontSize: 14,
    color: '#636366',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#2D6A4F',
    height: 52,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2D6A4F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default NotificationSettingsScreen;
