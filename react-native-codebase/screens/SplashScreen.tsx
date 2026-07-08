/**
 * FreshCart - Splash Screen Component
 * File: screens/SplashScreen.tsx
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, StatusBar } from 'react-native';
import { auth } from '../services/firebase';

// Simple navigation typing for Stack Navigation
interface SplashScreenProps {
  navigation: {
    replace: (screenName: string) => void;
  };
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  useEffect(() => {
    let isMounted = true;

    const checkAuthState = async () => {
      // Hold splash screen for ~1.8 seconds to display brand assets
      await new Promise((resolve) => setTimeout(resolve, 1800));

      if (!isMounted) return;

      try {
        // Retrieve current authenticated session state from Firebase Auth
        const user = auth.currentUser;
        
        // Direct transition routing - replace to prevent going back to splash
        navigation.replace(user ? 'Main' : 'Login');
      } catch (error) {
        console.error('Failed to resolve authentication state:', error);
        // Fallback safety transition
        navigation.replace('Login');
      }
    };

    checkAuthState();

    return () => {
      isMounted = false;
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Configure StatusBar to be light-content over the brand primary color */}
      <StatusBar barStyle="light-content" backgroundColor="#2D6A4F" />

      {/* Main Branding Stack */}
      <View style={styles.brandStack}>
        {/* App Icon: Shopping Cart Emoji */}
        <Text style={styles.appIcon} accessibilityRole="image" accessibilityLabel="Shopping Cart Icon">
          🛒
        </Text>

        {/* App Name */}
        <Text style={styles.appName}>FreshCart</Text>

        {/* Tagline */}
        <Text style={styles.tagline}>Shop smart. Cook smarter.</Text>
      </View>

      {/* Loading Indicator pinned to the bottom area */}
      <View style={styles.indicatorContainer}>
        <ActivityIndicator size="small" color="#FFFFFF" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D6A4F', // Brand primary green
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandStack: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  appIcon: {
    fontSize: 72,
  },
  appName: {
    fontSize: 34,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 16,
  },
  tagline: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.75)', // White with 0.75 opacity
    marginTop: 8,
    textAlign: 'center',
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 60,
  },
});

export default SplashScreen;
