/**
 * FreshCart - Settings Screen
 * File: screens/SettingsScreen.tsx
 */

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Switch,
  StatusBar
} from 'react-native';
import { 
  User, 
  Envelope, 
  LockSimple, 
  Moon, 
  CurrencyDollar, 
  Storefront, 
  Bell, 
  WarningCircle, 
  Sparkle, 
  FileText, 
  ShieldCheck, 
  Star, 
  Info, 
  Trash, 
  CaretRight, 
  CaretLeft 
} from 'phosphor-react-native';

const safeArea = { top: 44 };

interface SettingsScreenProps {
  navigation?: {
    goBack: () => void;
  };
}

interface SettingsRowProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  hasSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (val: boolean) => void;
  hasChevron?: boolean;
  onPress?: () => void;
  isLast?: boolean;
  isDanger?: boolean;
}

const SettingsRow: React.FC<SettingsRowProps> = ({
  icon,
  label,
  value,
  hasSwitch,
  switchValue,
  onSwitchChange,
  hasChevron = true,
  onPress,
  isLast = false,
  isDanger = false,
}) => {
  const content = (
    <View style={[styles.rowContainer, isLast ? null : styles.rowBorder]}>
      <View style={styles.rowLeft}>
        {icon}
        <Text style={[styles.rowLabel, isDanger ? styles.dangerText : null]}>
          {label}
        </Text>
      </View>
      <View style={styles.rowRight}>
        {value ? (
          <Text style={[styles.rowValue, isDanger ? styles.dangerText : null]}>{value}</Text>
        ) : null}
        {hasSwitch ? (
          <Switch
            value={switchValue}
            onValueChange={onSwitchChange}
            trackColor={{ false: '#767577', true: '#2D6A4F' }}
            thumbColor={switchValue ? '#FFFFFF' : '#F2F2F7'}
          />
        ) : null}
        {hasChevron && !hasSwitch ? (
          <CaretRight size={16} color="#C7C7CC" weight="bold" />
        ) : null}
      </View>
    </View>
  );

  if (hasSwitch) {
    return <View style={styles.rowWrapper}>{content}</View>;
  }

  return (
    <TouchableOpacity 
      style={styles.rowWrapper} 
      onPress={onPress} 
      activeOpacity={0.7}
      disabled={!onPress}
    >
      {content}
    </TouchableOpacity>
  );
};

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [expirationAlerts, setExpirationAlerts] = useState(true);
  const [smartSuggestions, setSmartSuggestions] = useState(false);

  const handleRowPress = (label: string) => {
    // Action placeholder
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F2F2F7" />

      {/* HEADER SECTION */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation?.goBack()}
          activeOpacity={0.7}
        >
          <CaretLeft size={24} color="#1C1C1E" weight="bold" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ACCOUNT SECTION */}
        <Text style={styles.sectionLabel}>Account</Text>
        <View style={styles.sectionCard}>
          <SettingsRow 
            icon={<User size={20} color="#636366" />}
            label="Name"
            value="Gabriel Torres"
            onPress={() => handleRowPress('Name')}
          />
          <SettingsRow 
            icon={<Envelope size={20} color="#636366" />}
            label="Email"
            value="gabriel@email.com"
            onPress={() => handleRowPress('Email')}
          />
          <SettingsRow 
            icon={<LockSimple size={20} color="#636366" />}
            label="Change Password"
            isLast={true}
            onPress={() => handleRowPress('Change Password')}
          />
        </View>

        {/* PREFERENCES SECTION */}
        <Text style={styles.sectionLabel}>Preferences</Text>
        <View style={styles.sectionCard}>
          <SettingsRow 
            icon={<Moon size={20} color="#636366" />}
            label="Dark Mode"
            hasSwitch={true}
            switchValue={darkMode}
            onSwitchChange={setDarkMode}
          />
          <SettingsRow 
            icon={<CurrencyDollar size={20} color="#636366" />}
            label="Currency"
            value="USD $"
            onPress={() => handleRowPress('Currency')}
          />
          <SettingsRow 
            icon={<Storefront size={20} color="#636366" />}
            label="Default Store"
            value="Walmart"
            isLast={true}
            onPress={() => handleRowPress('Default Store')}
          />
        </View>

        {/* NOTIFICATIONS SECTION */}
        <Text style={styles.sectionLabel}>Notifications</Text>
        <View style={styles.sectionCard}>
          <SettingsRow 
            icon={<Bell size={20} color="#636366" />}
            label="Push Notifications"
            hasSwitch={true}
            switchValue={pushNotifications}
            onSwitchChange={setPushNotifications}
          />
          <SettingsRow 
            icon={<WarningCircle size={20} color="#636366" />}
            label="Expiration Alerts"
            hasSwitch={true}
            switchValue={expirationAlerts}
            onSwitchChange={setExpirationAlerts}
          />
          <SettingsRow 
            icon={<Sparkle size={20} color="#636366" />}
            label="Smart Suggestions"
            hasSwitch={true}
            switchValue={smartSuggestions}
            onSwitchChange={setSmartSuggestions}
            isLast={true}
          />
        </View>

        {/* ABOUT SECTION */}
        <Text style={styles.sectionLabel}>About</Text>
        <View style={styles.sectionCard}>
          <SettingsRow 
            icon={<FileText size={20} color="#636366" />}
            label="Terms of Service"
            onPress={() => handleRowPress('Terms of Service')}
          />
          <SettingsRow 
            icon={<ShieldCheck size={20} color="#636366" />}
            label="Privacy Policy"
            onPress={() => handleRowPress('Privacy Policy')}
          />
          <SettingsRow 
            icon={<Star size={20} color="#636366" />}
            label="Rate FreshCart"
            onPress={() => handleRowPress('Rate FreshCart')}
          />
          <SettingsRow 
            icon={<Info size={20} color="#636366" />}
            label="Version"
            value="1.0.0"
            hasChevron={false}
            isLast={true}
          />
        </View>

        {/* DANGER SECTION */}
        <View style={[styles.sectionCard, styles.dangerSection]}>
          <SettingsRow 
            icon={<Trash size={20} color="#FF3B30" />}
            label="Delete Account"
            hasChevron={false}
            isLast={true}
            isDanger={true}
            onPress={() => handleRowPress('Delete Account')}
          />
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
  rowWrapper: {
    backgroundColor: '#FFFFFF',
  },
  rowContainer: {
    height: 52,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E5EA',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rowLabel: {
    fontSize: 15,
    color: '#1C1C1E',
    marginLeft: 12,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowValue: {
    fontSize: 14,
    color: '#636366',
  },
  dangerText: {
    color: '#FF3B30',
    fontWeight: '600',
  },
  dangerSection: {
    marginTop: 24,
    marginBottom: 40,
  }
});

export default SettingsScreen;
