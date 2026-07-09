/**
 * FreshCart - Magic Recipe Results Screen
 * File: screens/MagicResultsScreen.tsx
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import {
  CaretLeft,
  Clock,
  Users,
  Heart,
  Sparkle,
} from 'phosphor-react-native';
import { useLanguage } from '../lib/LanguageContext';

interface RecipeResult {
  id: string;
  title: string;
  prep: number;
  cook: number;
  servings: number;
  have: number;
  total: number;
  missing: string[];
  gradientColor: string;
  category: string;
}

interface MagicResultsScreenProps {
  inputParams: {
    ingredients: string[];
    budget: string;
    servings: string;
    diet: string;
    time: string;
  };
  onBack: () => void;
  onViewRecipe: (recipeId: string, title: string) => void;
  isDarkMode?: boolean;
}

export const MagicResultsScreen: React.FC<MagicResultsScreenProps> = ({
  inputParams,
  onBack,
  onViewRecipe,
  isDarkMode = false,
}) => {
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<RecipeResult[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Setup dynamic recipes and check against user's entered ingredients to compute matching count
      const enteredIngsLower = inputParams.ingredients.map(ing => {
        // Strip emojis
        return ing.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '').trim().toLowerCase();
      });

      const initialRecipes: RecipeResult[] = [
        {
          id: 'mr1',
          title: language === 'es' ? 'Tostadas Francesas con Compota' : 'French Toast with Berry Compote',
          prep: 10,
          cook: 15,
          servings: 2,
          have: 5,
          total: 6,
          missing: [language === 'es' ? 'Jarabe de Maple' : 'Maple Syrup'],
          gradientColor: '#F5A623', // Amber/Orange
          category: language === 'es' ? 'Desayuno' : 'Breakfast'
        },
        {
          id: 'mr2',
          title: language === 'es' ? 'Huevos Revueltos y Tostadas' : 'Scrambled Eggs & Toast',
          prep: 5,
          cook: 8,
          servings: 2,
          have: 4,
          total: 4,
          missing: [],
          gradientColor: '#2D6A4F', // Green/Teal
          category: language === 'es' ? 'Desayuno' : 'Breakfast'
        },
        {
          id: 'mr3',
          title: language === 'es' ? 'Pasta a la Mantequilla con Queso' : 'Butter Pasta with Cheese',
          prep: 5,
          cook: 15,
          servings: 2,
          have: 3,
          total: 5,
          missing: [language === 'es' ? 'Pasta' : 'Pasta', language === 'es' ? 'Queso Parmesano' : 'Parmesan'],
          gradientColor: '#E05A47', // Red/Pink
          category: language === 'es' ? 'Cena' : 'Dinner'
        }
      ];

      // Dynamically calculate matching elements based on input
      const computedRecipes = initialRecipes.map(rec => {
        let matchedCount = 0;
        const missingIngs: string[] = [];

        // Define ingredient components for mock recipes
        const recIngredients: Record<string, string[]> = {
          'mr1': ['eggs', 'butter', 'bread', 'milk', 'cheese', 'mixed berries', 'vanilla', 'huevos', 'mantequilla', 'pan', 'leche', 'queso'],
          'mr2': ['eggs', 'butter', 'bread', 'milk', 'huevos', 'mantequilla', 'pan', 'leche'],
          'mr3': ['butter', 'pasta', 'cheese', 'parmesan', 'garlic', 'mantequilla', 'queso', 'ajo']
        };

        const targetList = recIngredients[rec.id] || [];
        targetList.forEach(targetIng => {
          const hasIt = enteredIngsLower.some(entered => entered.includes(targetIng) || targetIng.includes(entered));
          if (hasIt) {
            matchedCount++;
          } else {
            missingIngs.push(targetIng.charAt(0).toUpperCase() + targetIng.slice(1));
          }
        });

        // Ensure we fit the prompt's structure if input matches default preloaded chips
        if (enteredIngsLower.length <= 4) {
          return rec;
        }

        return {
          ...rec,
          have: Math.min(matchedCount, targetList.length),
          total: targetList.length,
          missing: missingIngs.slice(0, 3) // Cap missing items
        };
      });

      // Sort by least missing ingredients first
      computedRecipes.sort((a, b) => a.missing.length - b.missing.length);

      setRecipes(computedRecipes);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [inputParams, language]);

  const toggleSave = (id: string) => {
    setSavedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* HEADER */}
      <View style={[styles.header, isDarkMode && styles.headerDark]}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <CaretLeft size={24} color={isDarkMode ? '#FFFFFF' : '#1C1C1E'} weight="bold" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDarkMode && styles.textDark]}>
          {language === 'es' ? '✨ Resultados' : '✨ Results'}
        </Text>
        <View style={styles.backButtonPlaceholder} />
      </View>

      {/* SKELETON LOADING STATE */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>
            {language === 'es' ? 'Buscando las mejores recetas para ti...' : 'Finding the best recipes for you...'}
          </Text>
          <View style={styles.skeletonContainer}>
            {[1, 2].map(idx => (
              <View key={idx} style={[styles.skeletonCard, isDarkMode && styles.skeletonCardDark]}>
                <View style={styles.skeletonHero} />
                <View style={styles.skeletonContent}>
                  <View style={styles.skeletonTitle} />
                  <View style={styles.skeletonSubtitle} />
                  <View style={styles.skeletonBar} />
                </View>
              </View>
            ))}
          </View>
        </View>
      ) : (
        /* LOADED STATE */
        <View style={styles.content}>
          {/* SUBTITLE BAR */}
          <View style={[styles.subtitleBar, isDarkMode && styles.subtitleBarDark]}>
            <Text style={[styles.subtitleText, isDarkMode && styles.textDark]}>
              {language === 'es' ? `${recipes.length} recetas encontradas` : `${recipes.length} recipes found`}
            </Text>
            <Text style={styles.subtitleSubtext}>
              {language === 'es' ? 'menos faltantes primero' : 'least missing first'}
            </Text>
          </View>

          {/* RECIPES LIST */}
          <ScrollView style={styles.listScroll} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
            {recipes.map(recipe => {
              const isSaved = savedIds.includes(recipe.id);
              return (
                <TouchableOpacity
                  key={recipe.id}
                  style={[styles.recipeCard, isDarkMode && styles.recipeCardDark]}
                  onPress={() => onViewRecipe(recipe.id, recipe.title)}
                  activeOpacity={0.9}
                >
                  {/* HERO IMAGE AREA WITH BACKGROUND COLOR */}
                  <View style={[styles.recipeHero, { backgroundColor: recipe.gradientColor }]}>
                    <View style={styles.darkOverlay} />
                    {/* AI Badge */}
                    <View style={styles.aiBadge}>
                      <Sparkle size={10} color="#FFD700" weight="fill" />
                      <Text style={styles.aiBadgeText}>{language === 'es' ? 'Chef IA' : 'AI Chef'}</Text>
                    </View>

                    {/* Title Overlay */}
                    <View style={styles.heroTextContainer}>
                      <Text style={styles.recipeCategory}>{recipe.category.toUpperCase()}</Text>
                      <Text style={styles.recipeTitle}>{recipe.title}</Text>
                    </View>
                  </View>

                  {/* DETAILS BODY */}
                  <View style={styles.cardDetails}>
                    {/* Meta row */}
                    <View style={styles.metaRow}>
                      <View style={styles.metaItem}>
                        <Clock size={14} color="#8E8E93" />
                        <Text style={styles.metaText}>{recipe.prep + recipe.cook} min</Text>
                      </View>
                      <Text style={styles.metaDivider}>•</Text>
                      <View style={styles.metaItem}>
                        <Users size={14} color="#8E8E93" />
                        <Text style={styles.metaText}>
                          {recipe.servings} {language === 'es' ? 'Porciones' : 'Servings'}
                        </Text>
                      </View>
                    </View>

                    {/* Match Bar */}
                    <View style={styles.progressSection}>
                      <View style={styles.progressTextRow}>
                        <Text style={styles.progressLabel}>
                          {language === 'es'
                            ? `Tienes ${recipe.have} de ${recipe.total} ingredientes`
                            : `You have ${recipe.have} of ${recipe.total} ingredients`}
                        </Text>
                        <Text style={styles.progressFraction}>{recipe.have}/{recipe.total}</Text>
                      </View>
                      <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: `${(recipe.have / recipe.total) * 100}%` }]} />
                      </View>
                    </View>

                    {/* Missing Ingredients Warning */}
                    {recipe.missing.length > 0 ? (
                      <View style={styles.warningBox}>
                        <Text style={styles.warningText} numberOfLines={1}>
                          {language === 'es' ? 'Faltan: ' : 'Missing: '}{recipe.missing.join(', ')}
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.successBox}>
                        <Text style={styles.successText}>
                          {language === 'es' ? '¡Coincidencia perfecta!' : 'Perfect match!'}
                        </Text>
                      </View>
                    )}

                    {/* Action Row */}
                    <View style={[styles.cardFooter, isDarkMode && styles.cardFooterDark]}>
                      <Text style={styles.viewRecipeBtn}>
                        {language === 'es' ? 'Ver Receta' : 'View Recipe'} →
                      </Text>

                      <TouchableOpacity
                        style={[styles.saveBtn, isSaved && styles.saveBtnActive]}
                        onPress={() => toggleSave(recipe.id)}
                      >
                        <Heart size={16} color={isSaved ? '#FFFFFF' : '#FF3B30'} weight={isSaved ? 'fill' : 'bold'} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  containerDark: { backgroundColor: '#1C1C1E' },
  header: { height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderColor: '#E5E5EA' },
  headerDark: { backgroundColor: '#121212', borderColor: '#2C2C2E' },
  backButton: { padding: 4 },
  backButtonPlaceholder: { width: 32 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#1C1C1E' },
  textDark: { color: '#FFFFFF' },
  loadingContainer: { flex: 1, padding: 16, alignItems: 'center', justifyContent: 'center' },
  loadingText: { fontSize: 13, fontWeight: '700', color: '#2D6A4F', marginBottom: 20 },
  skeletonContainer: { width: '100%', gap: 16 },
  skeletonCard: { backgroundColor: '#FFFFFF', borderRadius: 16, height: 260, overflow: 'hidden' },
  skeletonCardDark: { backgroundColor: '#121212' },
  skeletonHero: { height: 140, backgroundColor: '#E5E5EA' },
  skeletonContent: { padding: 16, gap: 8 },
  skeletonTitle: { height: 16, width: '70%', backgroundColor: '#E5E5EA', borderRadius: 4 },
  skeletonSubtitle: { height: 12, width: '40%', backgroundColor: '#F2F2F7', borderRadius: 4 },
  skeletonBar: { height: 6, width: '100%', backgroundColor: '#F2F2F7', borderRadius: 3, marginTop: 8 },
  content: { flex: 1 },
  subtitleBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderColor: '#F2F2F7' },
  subtitleBarDark: { backgroundColor: '#121212', borderColor: '#2C2C2E' },
  subtitleText: { fontSize: 12, fontWeight: '700', color: '#1C1C1E' },
  subtitleSubtext: { fontSize: 10, color: '#8E8E93', fontWeight: '600', textTransform: 'uppercase' },
  listScroll: { flex: 1 },
  listContent: { padding: 16, paddingBottom: 32, gap: 16 },
  recipeCard: { backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  recipeCardDark: { backgroundColor: '#121212' },
  recipeHero: { height: 130, position: 'relative', overflow: 'hidden', justifyContent: 'flex-end' },
  darkOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
  aiBadge: { position: 'absolute', top: 12, right: 12, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(45,106,79,0.95)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  aiBadgeText: { color: '#FFFFFF', fontSize: 9, fontWeight: '800' },
  heroTextContainer: { padding: 16, zIndex: 1 },
  recipeCategory: { fontSize: 8, fontWeight: '800', color: '#D8F3DC', letterSpacing: 1 },
  recipeTitle: { fontSize: 15, fontWeight: '800', color: '#FFFFFF', marginTop: 2 },
  cardDetails: { padding: 16, gap: 12 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 11, fontWeight: '600', color: '#8E8E93' },
  metaDivider: { color: '#8E8E93', fontSize: 11 },
  progressSection: { gap: 6 },
  progressTextRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressLabel: { fontSize: 11, fontWeight: '600', color: '#8E8E93' },
  progressFraction: { fontSize: 12, fontWeight: '800', color: '#2D6A4F' },
  progressBarBg: { height: 6, backgroundColor: '#F2F2F7', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#2D6A4F', borderRadius: 3 },
  warningBox: { padding: 8, backgroundColor: '#FFF9E6', borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,149,0,0.1)' },
  warningText: { fontSize: 10, color: '#D97706', fontStyle: 'italic', fontWeight: '500' },
  successBox: { padding: 8, backgroundColor: '#E8F5E9', borderRadius: 8 },
  successText: { fontSize: 10, color: '#2D6A4F', fontStyle: 'italic', fontWeight: '600' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderColor: '#F2F2F7', paddingTop: 12, marginTop: 4 },
  cardFooterDark: { borderColor: '#2C2C2E' },
  viewRecipeBtn: { fontSize: 12, fontWeight: '700', color: '#2D6A4F' },
  saveBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#FFF0F0', borderWidth: 1, borderColor: '#FFD1D1', alignItems: 'center', justifyContent: 'center' },
  saveBtnActive: { backgroundColor: '#FF3B30', borderColor: '#FF3B30' },
});
