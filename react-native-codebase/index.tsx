/**
 * FreshCart - Expo/React Native App Entry Point
 * File: react-native-codebase/index.tsx
 * 
 * Central coordinator and root file for the React Native/Expo application.
 * Manages global states (Auth, Active Tab, Sub-screens), Simulated Navigation,
 * and wraps everything in LanguageProvider, GestureHandlerRootView, and SafeAreaProvider.
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, StatusBar } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LanguageProvider, useLanguage } from './lib/LanguageContext';

// Import Phosphor Icons for Native Expo Look
import { House, ShoppingCart, BookOpen, Sparkle, Package, User } from 'phosphor-react-native';

// Import Screens from codebase
import { SplashScreen } from './screens/SplashScreen';
import { LoginScreen } from './screens/LoginScreen';
import { RegisterScreen } from './screens/RegisterScreen';
import { ForgotPasswordScreen } from './screens/ForgotPasswordScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ActiveListScreen } from './screens/ActiveListScreen';
import { PantryScreen } from './screens/PantryScreen';
import { SuggestionsScreen } from './screens/SuggestionsScreen';
import { RecipeDetailScreen } from './screens/RecipeDetailScreen';
import { EditRecipeScreen } from './screens/EditRecipeScreen';
import { CookModeScreen } from './screens/CookModeScreen';
import { AddRecipeScreen } from './screens/AddRecipeScreen';
import { MagicInputScreen } from './screens/MagicInputScreen';
import { MagicResultsScreen } from './screens/MagicResultsScreen';
import { AIRecipeDetailScreen } from './screens/AIRecipeDetailScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { NotificationSettingsScreen } from './screens/NotificationSettingsScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { HistoryDetailScreen } from './screens/HistoryDetailScreen';

// Core Application Shell
const AppShell: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { t, language } = useLanguage();

  // Navigation & View States
  const [showSplash, setShowSplash] = useState(true);
  const [activeScreen, setActiveScreen] = useState<'Login' | 'Register' | 'ForgotPassword' | 'App' | 'Settings' | 'Notifications' | 'HistoryDetail' | 'History' | 'CookMode' | 'AddRecipe' | 'EditRecipe' | 'RecipeDetail' | 'Suggestions' | 'MagicResults' | 'AIRecipeDetail'>('Login');
  const [activeTab, setActiveTab] = useState<'Home' | 'Supermarket' | 'Pantry' | 'Recipes' | 'Magic' | 'Profile'>('Home');

  // Shared Parameters for Detailed Sub-Screens
  const [historyParams, setHistoryParams] = useState<any>(null);
  const [recipeDetailParams, setRecipeDetailParams] = useState<{ id: string; title: string } | null>(null);
  const [magicInputParams, setMagicInputParams] = useState<{
    ingredients: string[];
    budget: string;
    servings: string;
    diet: string;
    time: string;
  } | null>(null);

  // Simulated Navigation Handler
  const navigation = {
    navigate: (screenName: string, params?: any) => {
      if (screenName === 'Main') {
        setActiveScreen('App');
      } else if (screenName === 'Settings') {
        setActiveScreen('Settings');
      } else if (screenName === 'NotificationSettings') {
        setActiveScreen('Notifications');
      } else if (screenName === 'ForgotPassword') {
        setActiveScreen('ForgotPassword');
      } else if (screenName === 'Register') {
        setActiveScreen('Register');
      } else if (screenName === 'Login') {
        setActiveScreen('Login');
      } else if (screenName === 'HistoryDetail') {
        setHistoryParams(params?.trip || params);
        setActiveScreen('HistoryDetail');
      } else if (screenName === 'History') {
        setActiveScreen('History');
      } else if (screenName === 'CookMode') {
        setActiveScreen('CookMode');
      } else if (screenName === 'AddRecipe') {
        setActiveScreen('AddRecipe');
      } else if (screenName === 'EditRecipe') {
        setActiveScreen('EditRecipe');
      } else if (screenName === 'RecipeDetail') {
        setRecipeDetailParams(params);
        setActiveScreen('RecipeDetail');
      } else if (screenName === 'Suggestions') {
        setActiveScreen('Suggestions');
      } else {
        // Handle lower-case or exact tab match
        const matchedTab = ['Home', 'Supermarket', 'Pantry', 'Recipes', 'Magic', 'Profile'].find(
          (t) => t.toLowerCase() === screenName.toLowerCase()
        );
        if (matchedTab) {
          setActiveScreen('App');
          setActiveTab(matchedTab as any);
        }
      }
    },
    replace: (screenName: string) => {
      if (screenName === 'Main') {
        setActiveScreen('App');
      } else {
        navigation.navigate(screenName);
      }
    },
    goBack: () => {
      if (activeScreen === 'Settings' || activeScreen === 'Notifications' || activeScreen === 'History' || activeScreen === 'HistoryDetail') {
        setActiveScreen('App');
        setActiveTab('Profile');
      } else if (activeScreen === 'Suggestions' || activeScreen === 'RecipeDetail' || activeScreen === 'AddRecipe') {
        setActiveScreen('App');
        setActiveTab('Recipes');
      } else if (activeScreen === 'EditRecipe' || activeScreen === 'CookMode') {
        setActiveScreen('RecipeDetail');
      } else if (activeScreen === 'MagicResults') {
        setActiveScreen('App');
        setActiveTab('Magic');
      } else if (activeScreen === 'AIRecipeDetail') {
        setActiveScreen('MagicResults');
      } else if (activeScreen === 'Register' || activeScreen === 'ForgotPassword') {
        setActiveScreen('Login');
      } else {
        setActiveScreen('App');
      }
    },
  };

  // Mock route param for screens requiring it
  const routeMock = (params: any) => ({
    params,
  });

  // Splash screen timeout handler to match initial loading
  useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  if (showSplash) {
    return <SplashScreen navigation={navigation} />;
  }

  // SCREEN ROUTER
  const renderContent = () => {
    switch (activeScreen) {
      case 'Login':
        return <LoginScreen navigation={navigation} />;
      case 'Register':
        return <RegisterScreen navigation={navigation} />;
      case 'ForgotPassword':
        return <ForgotPasswordScreen navigation={navigation} />;
      case 'Settings':
        return <SettingsScreen navigation={navigation} />;
      case 'Notifications':
        return <NotificationSettingsScreen navigation={navigation} />;
      case 'History':
        return (
          <HistoryScreen
            navigation={navigation}
            onBack={navigation.goBack}
            onSelectTrip={(trip) => {
              setHistoryParams(trip);
              setActiveScreen('HistoryDetail');
            }}
          />
        );
      case 'HistoryDetail':
        return (
          <HistoryDetailScreen
            route={routeMock({ trip: historyParams })}
            navigation={navigation}
            onBack={navigation.goBack}
          />
        );
      case 'CookMode':
        return <CookModeScreen navigation={navigation} />;
      case 'AddRecipe':
        return <AddRecipeScreen navigation={navigation} />;
      case 'EditRecipe':
        return <EditRecipeScreen navigation={navigation} />;
      case 'RecipeDetail':
        return <RecipeDetailScreen navigation={navigation} route={routeMock(recipeDetailParams)} />;
      case 'Suggestions':
        return <SuggestionsScreen navigation={navigation} onBack={navigation.goBack} />;
      case 'MagicResults':
        return (
          <MagicResultsScreen
            inputParams={magicInputParams || { ingredients: [], budget: '', servings: '2', diet: '', time: '' }}
            onBack={() => setActiveScreen('App')}
            onViewRecipe={(id, title) => {
              setRecipeDetailParams({ id, title });
              setActiveScreen('AIRecipeDetail');
            }}
          />
        );
      case 'AIRecipeDetail':
        return (
          <AIRecipeDetailScreen
            recipeId={recipeDetailParams?.id || 'r1'}
            recipeTitle={recipeDetailParams?.title || 'Magic AI Recipe'}
            onClose={() => setActiveScreen('MagicResults')}
            onSaveToMyRecipes={(recipe) => console.log('Saved Magic Recipe:', recipe)}
            onCookNow={() => setActiveScreen('CookMode')}
          />
        );
      case 'App':
      default:
        // TAB ROUTER inside active app state
        return (
          <View style={styles.tabContainer}>
            <View style={styles.screenArea}>
              {activeTab === 'Home' && <HomeScreen />}
              {activeTab === 'Supermarket' && <ActiveListScreen />}
              {activeTab === 'Pantry' && <PantryScreen onBack={() => setActiveTab('Home')} />}
              {activeTab === 'Recipes' && (
                <SuggestionsScreen
                  navigation={navigation}
                  onBack={() => setActiveTab('Home')}
                />
              )}
              {activeTab === 'Magic' && (
                <MagicInputScreen
                  onFindRecipes={(params) => {
                    setMagicInputParams(params);
                    setActiveScreen('MagicResults');
                  }}
                />
              )}
              {activeTab === 'Profile' && <ProfileScreen navigation={navigation} />}
            </View>

            {/* Custom Interactive Tab Bar */}
            <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
              {[
                { id: 'Home', label: t('tab.home'), icon: House },
                { id: 'Supermarket', label: t('tab.supermarket'), icon: ShoppingCart },
                { id: 'Recipes', label: t('tab.recipes'), icon: BookOpen },
                { id: 'Magic', label: t('tab.magic'), icon: Sparkle },
                { id: 'Pantry', label: t('tab.pantry'), icon: Package },
                { id: 'Profile', label: t('tab.profile'), icon: User },
              ].map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <TouchableOpacity
                    key={tab.id}
                    onPress={() => setActiveTab(tab.id as any)}
                    style={styles.tabItem}
                    activeOpacity={0.7}
                  >
                    <IconComponent
                      size={22}
                      color={isActive ? '#2D6A4F' : '#8E8E93'}
                      weight={isActive ? 'fill' : 'regular'}
                    />
                    <Text style={[styles.tabLabel, { color: isActive ? '#2D6A4F' : '#8E8E93', fontWeight: isActive ? '700' : '500' }]}>
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {renderContent()}
    </View>
  );
};

// Root Export wrapped with App contexts
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <LanguageProvider>
          <AppShell />
        </LanguageProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  tabContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  screenArea: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
    paddingTop: 10,
    paddingHorizontal: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 8,
  },
  tabItem: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minWidth: 55,
  },
  tabLabel: {
    fontSize: 10,
    letterSpacing: -0.1,
  },
});
