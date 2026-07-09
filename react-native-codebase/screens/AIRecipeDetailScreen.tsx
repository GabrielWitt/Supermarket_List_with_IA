/**
 * FreshCart - AI Recipe Detail Screen
 * File: screens/AIRecipeDetailScreen.tsx
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import {
  CaretLeft,
  Clock,
  Flame,
  Award,
  Sparkle,
  ChefHat,
  Info,
  Heart,
  Check,
  Minus,
  Plus,
} from 'phosphor-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '../lib/LanguageContext';

export interface Recipe {
  id: string;
  name: string;
  description: string;
  prepTime: string;
  cookTime: string;
  difficulty: string;
  calories: string;
  ingredients: Array<{ name: string; amount: string }>;
  steps: string[];
  chefTips?: string;
  category?: string;
}

interface AIRecipeDetailScreenProps {
  recipeId: string;
  recipeTitle: string;
  onClose: () => void;
  onSaveToMyRecipes: (recipe: Recipe) => void;
  onCookNow: (recipe: Recipe) => void;
  isDarkMode?: boolean;
}

// Detailed realistic recipe data matching the schema
const AI_RECIPES_DATA: Record<string, Omit<Recipe, 'id'>> = {
  mr1: {
    name: 'French Toast with Berry Compote',
    description: 'Fluffy, classic brioche slices dipped in cinnamon vanilla custard, toasted in golden butter, and crowned with a warm, tangy mixed berry compote.',
    prepTime: '10 min',
    cookTime: '15 min',
    difficulty: 'Easy',
    calories: '380 kcal',
    ingredients: [
      { name: 'Eggs', amount: '2 pieces' },
      { name: 'Milk', amount: '0.5 cup' },
      { name: 'Butter', amount: '2 tbsp' },
      { name: 'Bread slices', amount: '4 pieces' },
      { name: 'Vanilla extract', amount: '1 tsp' },
      { name: 'Mixed Berries', amount: '0.5 cup' },
    ],
    steps: [
      'Whisk eggs, milk, and vanilla extract in a wide, shallow bowl until smooth.',
      'Melt butter in a large skillet or non-stick frying pan over medium heat.',
      'Dip each slice of bread in the egg mixture for 5-10 seconds per side until fully saturated but not soggy.',
      'Place bread slices in the skillet and cook 2–3 minutes per side until beautifully golden brown.',
      'Top with warm mixed berries or berry compote and serve immediately.',
    ],
    chefTips: 'For the absolute best texture, use stale bread or challah sliced thick. It absorbs the custard beautifully without falling apart!',
  },
  mr2: {
    name: 'Scrambled Eggs & Toast',
    description: 'Creamy, slowly-scrambled soft eggs cooked with butter, served over rustic toasted artisan sourdough bread.',
    prepTime: '5 min',
    cookTime: '8 min',
    difficulty: 'Easy',
    calories: '280 kcal',
    ingredients: [
      { name: 'Fresh Eggs', amount: '3 pieces' },
      { name: 'Butter', amount: '1 tbsp' },
      { name: 'Bread slices', amount: '2 pieces' },
      { name: 'Milk', amount: '2 tbsp' },
    ],
    steps: [
      'Whisk eggs, milk, and a tiny pinch of salt in a bowl until pale yellow and bubbly.',
      'Melt butter in a small non-stick pan over medium-low heat. Do not let the butter brown.',
      'Pour in the egg mixture and let it set for 15 seconds. Using a silicone spatula, stir slowly, pulling the curds from the edges.',
      'Remove from heat while the eggs are still slightly wet—they will continue cooking on the hot plate.',
      'Toast your bread slices, heap the fluffy eggs on top, and season with fresh cracked pepper.',
    ],
    chefTips: 'Low and slow is the secret to rich, diner-style scrambled eggs. Keep the heat gentle and remove the pan from heat just before they look done!',
  },
  mr3: {
    name: 'Butter Pasta with Cheese',
    description: 'Quick comforting pasta tossed in velvety garlic-infused melted butter and loaded with savory grated parmesan and soft cheese.',
    prepTime: '5 min',
    cookTime: '15 min',
    difficulty: 'Easy',
    calories: '490 kcal',
    ingredients: [
      { name: 'Pasta', amount: '200 g' },
      { name: 'Butter', amount: '2 tbsp' },
      { name: 'Grated Cheese', amount: '0.5 cup' },
      { name: 'Parmesan Cheese', amount: '2 tbsp' },
      { name: 'Garlic cloves', amount: '2 pieces' },
    ],
    steps: [
      'Bring a large pot of heavily salted water to a rolling boil. Cook pasta according to package directions until al dente.',
      'While pasta cooks, melt butter in a large skillet over medium-low heat. Add finely minced garlic and sauté for 1-2 minutes until fragrant.',
      'Drain the pasta, reserving 1/4 cup of the starchy cooking water.',
      'Toss hot pasta directly into the garlic butter skillet. Add the grated cheese and splash of pasta water, tossing vigorously until a glossy sauce forms.',
      'Serve warm topped with plenty of grated parmesan cheese and black pepper.',
    ],
    chefTips: 'Reserving pasta water is the ultimate restaurant secret! The starch helps emulsify the melted butter and cheese into a rich, creamy sauce.',
  },
};

export const AIRecipeDetailScreen: React.FC<AIRecipeDetailScreenProps> = ({
  recipeId,
  recipeTitle,
  onClose,
  onSaveToMyRecipes,
  onCookNow,
  isDarkMode = false,
}) => {
  const insets = useSafeAreaInsets();
  const { language, t } = useLanguage();
  const [servingsCount, setServingsCount] = useState(2);
  const [activeTab, setActiveTab] = useState<'Ingredients' | 'Steps' | 'Info'>('Ingredients');
  const [isSaved, setIsSaved] = useState(false);

  const rawRecipe = AI_RECIPES_DATA[recipeId] || {
    name: recipeTitle || 'AI Culinary Creation',
    description: t('aiDetail.banner'),
    prepTime: '10 min',
    cookTime: '15 min',
    difficulty: 'Easy',
    calories: '350 kcal',
    ingredients: [],
    steps: [],
    chefTips: '',
  };

  const recipe: Recipe = {
    ...rawRecipe,
    id: recipeId,
  };

  const getTranslatedDifficulty = (diff: string) => {
    if (language !== 'es') return diff;
    if (diff === 'Easy') return 'Fácil';
    if (diff === 'Medium') return 'Medio';
    if (diff === 'Hard') return 'Difícil';
    return diff;
  };

  const parseAmountAndScale = (amountStr: string) => {
    // scale factor based on baseline of 2 servings
    const scaleFactor = servingsCount / 2;
    const match = amountStr.match(/^([0-9.]+)\s*(.*)$/);
    if (!match) return amountStr;

    const num = parseFloat(match[1]);
    const rest = match[2];
    if (isNaN(num)) return amountStr;

    const scaledNum = Math.round((num * scaleFactor) * 100) / 100;
    return `${scaledNum} ${rest}`;
  };

  const handleSave = () => {
    setIsSaved(true);
    onSaveToMyRecipes(recipe);
    Alert.alert(
      language === 'es' ? 'Receta Guardada' : 'Recipe Saved',
      language === 'es' 
        ? `"${recipe.name}" ha sido agregada a tus recetas.` 
        : `"${recipe.name}" has been added to your collections.`
    );
  };

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* Hero Header Area */}
      <View style={styles.heroContainer}>
        <View style={[styles.headerOverlay, { paddingTop: Math.max(16, insets.top) }]}>
          <TouchableOpacity onPress={onClose} style={styles.backBtn} activeOpacity={0.7}>
            <CaretLeft size={22} color="#1C1C1E" weight="bold" />
          </TouchableOpacity>
          <View style={styles.heroTags}>
            <View style={styles.heroTag}>
              <Text style={styles.heroTagText}>⏱ {recipe.prepTime}</Text>
            </View>
            <View style={styles.heroTag}>
              <Text style={styles.heroTagText}>👥 {servingsCount} {language === 'es' ? 'porciones' : 'servings'}</Text>
            </View>
          </View>
          <Text style={styles.heroTitle} numberOfLines={2}>{recipe.name}</Text>
          <View style={styles.sparkleRow}>
            <Sparkle size={12} color="#FFD700" weight="fill" />
            <Text style={styles.sparkleText}>
              {language === 'es' ? 'Delicia Culinaria Recomendada por IA' : 'AI Recommended Culinary Delight'}
            </Text>
          </View>
        </View>
      </View>

      {/* Content Area */}
      <View style={[styles.body, isDarkMode && styles.bodyDark]}>
        {/* Stats Grid */}
        <View style={[styles.statsRow, isDarkMode && styles.statsRowDark]}>
          <View style={styles.statCol}>
            <Text style={styles.statLabel}>{language === 'es' ? 'Prep.' : 'Prep Time'}</Text>
            <View style={styles.statValRow}>
              <Clock size={14} color="#636366" />
              <Text style={[styles.statValue, isDarkMode && styles.textDark]}>{recipe.prepTime}</Text>
            </View>
          </View>
          <View style={styles.statCol}>
            <Text style={styles.statLabel}>{language === 'es' ? 'Calorías' : 'Calories'}</Text>
            <View style={styles.statValRow}>
              <Flame size={14} color="#FF9500" weight="fill" />
              <Text style={[styles.statValue, isDarkMode && styles.textDark]}>{recipe.calories}</Text>
            </View>
          </View>
          <View style={styles.statCol}>
            <Text style={styles.statLabel}>{language === 'es' ? 'Dificultad' : 'Difficulty'}</Text>
            <View style={styles.statValRow}>
              <Award size={14} color="#2D6A4F" weight="fill" />
              <Text style={[styles.statValue, isDarkMode && styles.textDark]}>
                {getTranslatedDifficulty(recipe.difficulty)}
              </Text>
            </View>
          </View>
        </View>

        {/* Tab Controls */}
        <View style={styles.tabsRow}>
          {(['Ingredients', 'Steps', 'Info'] as const).map(tab => {
            const isActive = activeTab === tab;
            const labelMap = {
              Ingredients: language === 'es' ? 'Ingredientes' : 'Ingredients',
              Steps: language === 'es' ? 'Pasos' : 'Steps',
              Info: language === 'es' ? 'Info / Tips' : 'Info / Tips',
            };
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tabBtn, isActive && styles.tabBtnActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {labelMap[tab]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <ScrollView style={styles.tabContentScroll} showsVerticalScrollIndicator={false}>
          {/* TAB 1: INGREDIENTS */}
          {activeTab === 'Ingredients' && (
            <View style={styles.panel}>
              {/* Portion Adjuster */}
              <View style={[styles.adjustCard, isDarkMode && styles.adjustCardDark]}>
                <View>
                  <Text style={[styles.adjustTitle, isDarkMode && styles.textDark]}>
                    {t('aiDetail.adjust')}
                  </Text>
                  <Text style={styles.adjustSubtitle}>{t('aiDetail.scale')}</Text>
                </View>
                <View style={styles.adjustControls}>
                  <TouchableOpacity
                    style={styles.mathBtn}
                    onPress={() => setServingsCount(s => Math.max(1, s - 1))}
                  >
                    <Minus size={16} color="#2D6A4F" weight="bold" />
                  </TouchableOpacity>
                  <Text style={[styles.portionsVal, isDarkMode && styles.textDark]}>
                    {servingsCount}
                  </Text>
                  <TouchableOpacity style={styles.mathBtn} onPress={() => setServingsCount(s => s + 1)}>
                    <Plus size={16} color="#2D6A4F" weight="bold" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Ingredients List */}
              <View style={styles.ingredientsList}>
                {recipe.ingredients.map((ing, idx) => (
                  <View key={idx} style={[styles.ingredientRow, isDarkMode && styles.borderDark]}>
                    <View style={styles.bulletPoint} />
                    <Text style={[styles.ingredientName, isDarkMode && styles.textDark]}>
                      {ing.name}
                    </Text>
                    <Text style={styles.ingredientAmount}>{parseAmountAndScale(ing.amount)}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* TAB 2: STEPS */}
          {activeTab === 'Steps' && (
            <View style={styles.panel}>
              {recipe.steps.map((step, idx) => (
                <View key={idx} style={styles.stepCard}>
                  <View style={styles.stepBadge}>
                    <Text style={styles.stepBadgeText}>{idx + 1}</Text>
                  </View>
                  <Text style={[styles.stepText, isDarkMode && styles.textDark]}>{step}</Text>
                </View>
              ))}
            </View>
          )}

          {/* TAB 3: INFO & TIPS */}
          {activeTab === 'Info' && (
            <View style={styles.panel}>
              <View style={[styles.tipCard, isDarkMode && styles.tipCardDark]}>
                <View style={styles.tipHeader}>
                  <ChefHat size={18} color="#2D6A4F" weight="fill" />
                  <Text style={[styles.tipTitle, isDarkMode && styles.textDark]}>
                    {t('aiDetail.tip')}
                  </Text>
                </View>
                <Text style={styles.tipDescription}>{recipe.chefTips || 'Enjoy!'}</Text>
              </View>

              <View style={[styles.infoBanner, isDarkMode && styles.infoBannerDark]}>
                <Info size={16} color="#2D6A4F" />
                <Text style={styles.infoBannerText}>{t('aiDetail.banner')}</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Footer Actions */}
        <View style={[styles.footerRow, { paddingBottom: Math.max(16, insets.bottom) }]}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.saveBtn, isSaved && styles.saveBtnSaved]}
            onPress={handleSave}
            disabled={isSaved}
          >
            {isSaved ? (
              <Check size={18} color="#8E8E93" />
            ) : (
              <Heart size={18} color="#FF3B30" weight="fill" />
            )}
            <Text style={[styles.btnText, isSaved && styles.saveBtnTextSaved]}>
              {isSaved ? t('aiDetail.saved') : t('aiDetail.save')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionBtn, styles.cookBtn]} onPress={() => onCookNow(recipe)}>
            <Text style={styles.cookBtnText}>{t('aiDetail.cook')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  containerDark: { backgroundColor: '#1C1C1E' },
  heroContainer: {
    height: 190,
    backgroundColor: '#2D6A4F',
    justifyContent: 'flex-end',
  },
  headerOverlay: {
    padding: 16,
    flex: 1,
    justifyContent: 'flex-end',
  },
  backBtn: {
    position: 'absolute',
    top: 10,
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTags: { flexDirection: 'row', gap: 6, marginBottom: 6 },
  heroTag: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 },
  heroTagText: { fontSize: 10, fontWeight: '600', color: '#FFFFFF' },
  heroTitle: { fontSize: 20, fontWeight: '800', color: '#FFFFFF' },
  sparkleRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  sparkleText: { fontSize: 10, color: '#FFD700', fontWeight: '500' },
  body: { flex: 1, backgroundColor: '#FFFFFF', borderTopLeftRadius: 16, borderTopRightRadius: 16, marginTop: -12, paddingHorizontal: 16, paddingTop: 16 },
  bodyDark: { backgroundColor: '#121212' },
  statsRow: { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1, borderColor: '#F2F2F7', marginBottom: 12 },
  statsRowDark: { borderColor: '#2C2C2E' },
  statCol: { flex: 1, alignItems: 'center' },
  statLabel: { fontSize: 9, textTransform: 'uppercase', color: '#8E8E93', fontWeight: '700', marginBottom: 2 },
  statValRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statValue: { fontSize: 12, fontWeight: '700', color: '#1C1C1E' },
  textDark: { color: '#FFFFFF' },
  borderDark: { borderColor: '#2C2C2E' },
  tabsRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  tabBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8, backgroundColor: '#F2F2F7' },
  tabBtnActive: { backgroundColor: '#2D6A4F' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#1C1C1E' },
  tabTextActive: { color: '#FFFFFF' },
  tabContentScroll: { flex: 1 },
  panel: { paddingBottom: 16 },
  adjustCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderRadius: 12, backgroundColor: '#F8F9FA', marginBottom: 16 },
  adjustCardDark: { backgroundColor: '#1C1C1E' },
  adjustTitle: { fontSize: 14, fontWeight: '700', color: '#1C1C1E' },
  adjustSubtitle: { fontSize: 10, color: '#8E8E93', marginTop: 1 },
  adjustControls: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  mathBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#D8F3DC', alignItems: 'center', justifyContent: 'center' },
  portionsVal: { fontSize: 15, fontWeight: '700', color: '#1C1C1E', minWidth: 20, textAlign: 'center' },
  ingredientsList: { gap: 10 },
  ingredientRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#F2F2F7' },
  bulletPoint: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#2D6A4F', marginRight: 10 },
  ingredientName: { flex: 1, fontSize: 14, color: '#1C1C1E', fontWeight: '500' },
  ingredientAmount: { fontSize: 13, color: '#2D6A4F', fontWeight: '600' },
  stepCard: { flexDirection: 'row', gap: 12, marginBottom: 12, alignItems: 'flex-start' },
  stepBadge: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#E8F5E9', alignItems: 'center', justifyContent: 'center' },
  stepBadgeText: { fontSize: 12, fontWeight: '700', color: '#2D6A4F' },
  stepText: { flex: 1, fontSize: 14, color: '#3A3A3C', lineHeight: 20 },
  tipCard: { padding: 14, borderRadius: 12, backgroundColor: '#E8F5E9', marginBottom: 16 },
  tipCardDark: { backgroundColor: '#1B4332' },
  tipHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  tipTitle: { fontSize: 14, fontWeight: '700', color: '#1C1C1E' },
  tipDescription: { fontSize: 13, color: '#2D6A4F', lineHeight: 18, fontStyle: 'italic' },
  infoBanner: { flexDirection: 'row', gap: 8, padding: 12, borderRadius: 12, backgroundColor: '#F2F2F7', alignItems: 'center' },
  infoBannerDark: { backgroundColor: '#1C1C1E' },
  infoBannerText: { flex: 1, fontSize: 11, color: '#636366', lineHeight: 15 },
  footerRow: { flexDirection: 'row', gap: 10, paddingTop: 12, borderTopWidth: 1, borderColor: '#F2F2F7', marginTop: 8 },
  actionBtn: { height: 48, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  saveBtn: { flex: 1.1, backgroundColor: '#FFF0F0', borderWidth: 1, borderColor: '#FFD1D1' },
  saveBtnSaved: { backgroundColor: '#F2F2F7', borderColor: '#E5E5EA' },
  btnText: { fontSize: 13, fontWeight: '700', color: '#FF3B30' },
  saveBtnTextSaved: { color: '#8E8E93' },
  cookBtn: { flex: 1, backgroundColor: '#2D6A4F' },
  cookBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});
