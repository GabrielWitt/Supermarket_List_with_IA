/**
 * FreshCart - Recipe Detail Screen
 * File: screens/RecipeDetailScreen.tsx
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { 
  CaretLeft, 
  DotsThree, 
  Timer, 
  FireSimple, 
  Users, 
  Heart, 
  ListPlus, 
  Sparkle 
} from 'phosphor-react-native';

const { width } = Dimensions.get('window');
const safeArea = { top: 44, bottom: 34 };

export const RecipeDetailScreen: React.FC<any> = ({ navigation, route }) => {
  const [selectedTab, setSelectedTab] = useState<'Ingredients' | 'Steps' | 'Info'>('Ingredients');
  const [servings, setServings] = useState(4);
  const [isSaved, setIsSaved] = useState(false);

  // Core recipe content to display
  const recipe = {
    title: "Honey Sesame Chicken & Broccoli",
    prepTime: "15m",
    cookTime: "30m",
    totalTime: "45 min",
    servingsDefault: 4,
    calories: "380 kcal",
    difficulty: "Medium",
    tags: ["⏱ 45 min", "👥 4 servings", "🌿 Healthy"],
    source: "✨ AI Generated",
    description: "A delicious, sweet, and savory skillet recipe combining tender chicken breast, crisp broccoli florets, and a luscious honey-sesame glaze. Perfect for quick weeknight dinners!",
    ingredients: [
      { baseQty: 2, unit: "tbsp", name: "Sesame Oil" },
      { baseQty: 500, unit: "g", name: "Chicken Breast" },
      { baseQty: 1, unit: "head", name: "Broccoli" },
      { baseQty: 3, unit: "tbsp", name: "Soy Sauce" },
      { baseQty: 2, unit: "tbsp", name: "Honey" },
      { baseQty: 3, unit: "cloves", name: "Garlic" }
    ],
    steps: [
      "Cut the chicken breast into bite-sized cubes and season lightly with salt and pepper.",
      "Heat 1 tbsp of sesame oil in a large skillet over medium-high heat. Add chicken and sear until golden and cooked through (6-8 minutes). Transfer chicken to a plate.",
      "Add the remaining sesame oil to the skillet. Toss in the broccoli florets and minced garlic. Sauté for 3-4 minutes until the broccoli is bright green and tender-crisp.",
      "In a small bowl, whisk together the soy sauce, honey, and 1 tbsp of water to create the glaze.",
      "Return the cooked chicken cubes to the skillet with the broccoli.",
      "Pour the glaze mixture over the top and toss everything together to coat uniformly.",
      "Simmer for 2 minutes until the sauce bubbles and thickens. Garnish with toasted sesame seeds and serve warm."
    ],
    dateSaved: "July 7, 2026"
  };

  // Adjust ingredient quantity based on serving ratio
  const getScaledQty = (baseQty: number) => {
    const ratio = servings / recipe.servingsDefault;
    const scaled = baseQty * ratio;
    return Number(scaled.toFixed(1)).toString();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Scrollable Container */}
      <ScrollView 
        bounces={false} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HERO HEADER */}
        <View style={styles.heroContainer}>
          {/* Simulated LinearGradient Background (#40916C -> #1B4332) */}
          <View style={styles.gradientMock}>
            <View style={styles.overlayGradient} />
          </View>

          {/* OVER HERO TEXT & PILLS */}
          <View style={styles.heroContent}>
            <View style={styles.tagsRow}>
              {recipe.tags.map((tag, idx) => (
                <View key={idx} style={styles.tagPill}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.heroTitle}>{recipe.title}</Text>
            <Text style={styles.heroSource}>{recipe.source}</Text>
          </View>
        </View>

        {/* WHITE CONTENT LAYER */}
        <View style={styles.whiteCard}>
          {/* STATS ROW */}
          <View style={styles.statsRow}>
            <View style={styles.statCol}>
              <Timer size={22} color="#2D6A4F" weight="bold" />
              <Text style={styles.statVal}>{recipe.prepTime}</Text>
              <Text style={styles.statLbl}>Prep</Text>
            </View>
            <View style={styles.statCol}>
              <FireSimple size={22} color="#2D6A4F" weight="bold" />
              <Text style={styles.statVal}>{recipe.cookTime}</Text>
              <Text style={styles.statLbl}>Cook</Text>
            </View>
            <View style={styles.statCol}>
              <Users size={22} color="#2D6A4F" weight="bold" />
              <Text style={styles.statVal}>{servings}</Text>
              <Text style={styles.statLbl}>Serves</Text>
            </View>
            <View style={styles.statCol}>
              <Heart size={22} color="#2D6A4F" weight={isSaved ? "fill" : "bold"} />
              <Text style={styles.statVal}>{isSaved ? "Saved" : "Save"}</Text>
              <Text style={styles.statLbl}>Status</Text>
            </View>
          </View>

          {/* ACTION BUTTONS ROW */}
          <View style={styles.actionRow}>
            <TouchableOpacity 
              style={[styles.actionBtn, isSaved && styles.actionBtnActive]} 
              activeOpacity={0.7}
              onPress={() => setIsSaved(!isSaved)}
            >
              <Heart size={16} color={isSaved ? "#2D6A4F" : "#1C1C1E"} weight={isSaved ? "fill" : "regular"} />
              <Text style={[styles.actionBtnTxt, isSaved && styles.actionBtnTxtActive]}>
                {isSaved ? "Saved" : "Save"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
              <ListPlus size={16} color="#1C1C1E" />
              <Text style={styles.actionBtnTxt}>Add to List</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
              <Sparkle size={16} color="#1C1C1E" />
              <Text style={styles.actionBtnTxt}>Edit with AI</Text>
            </TouchableOpacity>
          </View>

          {/* TAB BAR */}
          <View style={styles.tabsContainer}>
            {(['Ingredients', 'Steps', 'Info'] as const).map((tab) => {
              const active = selectedTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  style={[styles.tabButton, active && styles.tabButtonActive]}
                  activeOpacity={0.8}
                  onPress={() => setSelectedTab(tab)}
                >
                  <Text style={[styles.tabText, active && styles.tabTextActive]}>{tab}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* TAB CONTENT PANEL */}
          <View style={styles.tabContentPanel}>
            {selectedTab === 'Ingredients' && (
              <View>
                {/* Servings Adjuster */}
                <View style={styles.servingAdjuster}>
                  <Text style={styles.servingTitle}>Servings</Text>
                  <View style={styles.stepperContainer}>
                    <TouchableOpacity 
                      style={styles.stepBtn} 
                      onPress={() => setServings(Math.max(1, servings - 1))}
                    >
                      <Text style={styles.stepBtnTxt}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.servingsCount}>{servings}</Text>
                    <TouchableOpacity 
                      style={styles.stepBtn} 
                      onPress={() => setServings(servings + 1)}
                    >
                      <Text style={styles.stepBtnTxt}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Ingredient List */}
                <View style={styles.ingredientsList}>
                  {recipe.ingredients.map((ing, idx) => (
                    <View key={idx} style={styles.ingredientRow}>
                      <Text style={styles.bulletPoint}>•</Text>
                      <Text style={styles.ingredientText}>
                        <Text style={styles.ingredientQty}>{getScaledQty(ing.baseQty)} </Text>
                        <Text style={styles.ingredientUnit}>{ing.unit} </Text>
                        <Text style={styles.ingredientName}>{ing.name}</Text>
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {selectedTab === 'Steps' && (
              <View style={styles.stepsPanel}>
                {recipe.steps.map((step, idx) => (
                  <View key={idx} style={styles.stepRow}>
                    <View style={styles.stepCircle}>
                      <Text style={styles.stepNumber}>{idx + 1}</Text>
                    </View>
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                ))}
              </View>
            )}

            {selectedTab === 'Info' && (
              <View style={styles.infoPanel}>
                <View style={styles.infoField}>
                  <Text style={styles.infoLabel}>Description</Text>
                  <Text style={styles.infoValue}>{recipe.description}</Text>
                </View>
                <View style={styles.infoField}>
                  <Text style={styles.infoLabel}>Difficulty</Text>
                  <Text style={styles.infoValue}>{recipe.difficulty}</Text>
                </View>
                <View style={styles.infoField}>
                  <Text style={styles.infoLabel}>Calories</Text>
                  <Text style={styles.infoValue}>{recipe.calories}</Text>
                </View>
                <View style={styles.infoField}>
                  <Text style={styles.infoLabel}>Source</Text>
                  <Text style={styles.infoValue}>{recipe.source}</Text>
                </View>
                <View style={styles.infoField}>
                  <Text style={styles.infoLabel}>Date Saved</Text>
                  <Text style={styles.infoValue}>{recipe.dateSaved}</Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* TRANSPARENT OVERLAID HEADER BUTTONS */}
      <View style={[styles.headerFloating, { top: safeArea.top }]}>
        <TouchableOpacity style={styles.headerCircBtn} activeOpacity={0.8} onPress={() => navigation?.goBack()}>
          <CaretLeft size={20} color="#1C1C1E" weight="bold" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerCircBtn} activeOpacity={0.8}>
          <DotsThree size={24} color="#1C1C1E" weight="bold" />
        </TouchableOpacity>
      </View>

      {/* STICKY BOTTOM */}
      <View style={[styles.stickyBottom, { paddingBottom: safeArea.bottom }]}>
        <TouchableOpacity style={styles.cookCta} activeOpacity={0.85} onPress={() => navigation?.navigate('CookMode')}>
          <FireSimple size={18} color="#FFFFFF" weight="fill" style={styles.cookIcon} />
          <Text style={styles.cookCtaTxt}>Cook Recipe →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollContent: {
    paddingBottom: 110,
  },
  heroContainer: {
    height: 280,
    position: 'relative',
    width: width,
  },
  gradientMock: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1B4332',
  },
  overlayGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 140,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  heroContent: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 8,
    letterSpacing: -0.5,
  },
  heroSource: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    marginTop: 4,
    fontWeight: '600',
  },
  headerFloating: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  headerCircBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  whiteCard: {
    marginTop: -20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#FFFFFF',
    paddingTop: 12,
    minHeight: 500,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  statCol: {
    alignItems: 'center',
    flex: 1,
  },
  statVal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1C1E',
    marginTop: 4,
  },
  statLbl: {
    fontSize: 10,
    color: '#636366',
    marginTop: 1,
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
  },
  actionBtnActive: {
    backgroundColor: '#D8F3DC',
    borderColor: '#2D6A4F',
  },
  actionBtnTxt: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  actionBtnTxtActive: {
    color: '#2D6A4F',
  },
  tabsContainer: {
    flexDirection: 'row',
    height: 44,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingHorizontal: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: '#2D6A4F',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#636366',
  },
  tabTextActive: {
    color: '#2D6A4F',
    fontWeight: '800',
  },
  tabContentPanel: {
    paddingVertical: 8,
  },
  servingAdjuster: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8F9FA',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
  },
  servingTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E5E5EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnTxt: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D6A4F',
  },
  servingsCount: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1C1C1E',
    minWidth: 20,
    textAlign: 'center',
  },
  ingredientsList: {
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 10,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bulletPoint: {
    color: '#2D6A4F',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 6,
    lineHeight: 18,
  },
  ingredientText: {
    fontSize: 13,
    color: '#1C1C1E',
    flex: 1,
    lineHeight: 18,
  },
  ingredientQty: {
    fontWeight: '700',
    color: '#2D6A4F',
  },
  ingredientUnit: {
    fontWeight: '600',
    color: '#52B788',
  },
  ingredientName: {
    color: '#1C1C1E',
  },
  stepsPanel: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2D6A4F',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumber: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  stepText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: '#1C1C1E',
  },
  infoPanel: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 14,
  },
  infoField: {
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
    paddingBottom: 8,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#636366',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 13,
    color: '#1C1C1E',
    lineHeight: 18,
  },
  stickyBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  cookCta: {
    backgroundColor: '#2D6A4F',
    height: 52,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cookIcon: {
    marginRight: 6,
  },
  cookCtaTxt: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
