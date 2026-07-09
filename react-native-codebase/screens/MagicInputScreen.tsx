/**
 * FreshCart - Magic Recipe Input Screen
 * File: screens/MagicInputScreen.tsx
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import {
  Sparkle,
  X,
  CurrencyDollar,
  Users,
  ForkKnife,
  Clock,
  ChefHat,
} from 'phosphor-react-native';
import { useLanguage } from '../lib/LanguageContext';

interface MagicInputScreenProps {
  onFindRecipes: (params: {
    ingredients: string[];
    budget: string;
    servings: string;
    diet: string;
    time: string;
  }) => void;
  pantryItems?: Array<{ name: string; emoji: string }>;
  isDarkMode?: boolean;
}

export const MagicInputScreen: React.FC<MagicInputScreenProps> = ({
  onFindRecipes,
  pantryItems = [
    { name: 'Eggs', emoji: '🥚' },
    { name: 'Milk', emoji: '🥛' },
    { name: 'Butter', emoji: '🧈' },
    { name: 'Bread', emoji: '🍞' },
    { name: 'Garlic', emoji: '🧄' },
  ],
  isDarkMode = false,
}) => {
  const { language, t } = useLanguage();
  const [ingredients, setIngredients] = useState<string[]>(['🥚 Eggs', '🥛 Milk', '🍞 Bread']);
  const [newIngredient, setNewIngredient] = useState('');
  const [budget, setBudget] = useState('15.00');
  const [servings, setServings] = useState<'1' | '2' | '4' | '6+'>('2');
  const [diet, setDiet] = useState('None');
  const [time, setTime] = useState('Any');

  const handleAddIngredient = () => {
    const trimmed = newIngredient.trim();
    if (!trimmed) return;

    if (ingredients.some(item => item.toLowerCase() === trimmed.toLowerCase() || item.toLowerCase().includes(trimmed.toLowerCase()))) {
      Alert.alert(
        language === 'es' ? 'Duplicado' : 'Duplicate',
        language === 'es' ? 'Este ingrediente ya ha sido agregado.' : 'This ingredient has already been added.'
      );
      return;
    }

    setIngredients(prev => [...prev, `🍳 ${trimmed}`]);
    setNewIngredient('');
  };

  const handleRemoveIngredient = (itemToRemove: string) => {
    setIngredients(prev => prev.filter(item => item !== itemToRemove));
  };

  const handleLoadFromPantry = () => {
    if (!pantryItems.length) {
      Alert.alert(
        language === 'es' ? 'Despensa Vacía' : 'Pantry Empty',
        language === 'es' ? 'No tienes artículos en tu despensa.' : 'You have no items in your pantry.'
      );
      return;
    }

    let addedCount = 0;
    const newItems: string[] = [];

    pantryItems.forEach(item => {
      const formatted = `${item.emoji} ${item.name}`;
      if (!ingredients.some(existing => existing.toLowerCase().includes(item.name.toLowerCase()))) {
        newItems.push(formatted);
        addedCount++;
      }
    });

    if (addedCount > 0) {
      setIngredients(prev => [...prev, ...newItems]);
      Alert.alert(
        language === 'es' ? 'Cargado' : 'Imported',
        language === 'es' 
          ? `Se importaron ${addedCount} artículos de tu despensa.` 
          : `Imported ${addedCount} items from your pantry.`
      );
    } else {
      Alert.alert(
        language === 'es' ? 'Completado' : 'Done',
        language === 'es' ? 'Todos los artículos ya estaban en la lista.' : 'All items were already in the list.'
      );
    }
  };

  const handleSubmit = () => {
    if (ingredients.length === 0) {
      Alert.alert(
        language === 'es' ? 'Sin ingredientes' : 'No ingredients',
        language === 'es' ? 'Agrega al menos un ingrediente para buscar.' : 'Add at least one ingredient to start searching.'
      );
      return;
    }

    onFindRecipes({
      ingredients,
      budget,
      servings,
      diet,
      time,
    });
  };

  return (
    <SafeAreaView style={[styles.safeArea, isDarkMode && styles.safeAreaDark]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* HEADER */}
      <View style={[styles.header, isDarkMode && styles.headerDark]}>
        <View style={styles.headerRow}>
          <Sparkle size={20} color="#2D6A4F" weight="fill" />
          <Text style={[styles.headerTitle, isDarkMode && styles.textDark]}>
            {language === 'es' ? '✨ Receta Mágica' : '✨ Magic Recipe'}
          </Text>
        </View>
        <Text style={styles.headerSubtitle}>
          {language === 'es' ? 'Encuentra recetas con lo que tienes' : 'Find recipes with what you have'}
        </Text>
      </View>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* INGREDIENTS CARD */}
        <View style={[styles.card, isDarkMode && styles.cardDark]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, isDarkMode && styles.textDark]}>
              {language === 'es' ? 'Tus Ingredientes' : 'Your Ingredients'}
            </Text>
            <TouchableOpacity style={styles.pantryBtn} onPress={handleLoadFromPantry}>
              <Text style={styles.pantryBtnText}>
                {language === 'es' ? 'De Alacena +' : 'From Pantry +'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* CHIPS AREA */}
          <View style={styles.chipsContainer}>
            {ingredients.length === 0 ? (
              <Text style={styles.emptyText}>
                {language === 'es' 
                  ? 'Aún no hay ingredientes agregados. ¡Agrega manualmente o importa de tu alacena!'
                  : 'No ingredients added yet. Add manually or import from your pantry!'}
              </Text>
            ) : (
              ingredients.map((item, index) => (
                <View key={index} style={styles.chip}>
                  <Text style={styles.chipText}>{item}</Text>
                  <TouchableOpacity onPress={() => handleRemoveIngredient(item)} style={styles.chipCloseBtn}>
                    <X size={12} color="#2D6A4F" weight="bold" />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>

          {/* ADD INPUT ROW */}
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, isDarkMode && styles.inputDark]}
              value={newIngredient}
              onChangeText={setNewIngredient}
              onSubmitEditing={handleAddIngredient}
              placeholder={language === 'es' ? '+ Agregar ingrediente...' : '+ Add ingredient...'}
              placeholderTextColor="#8E8E93"
            />
            <TouchableOpacity style={styles.addBtn} onPress={handleAddIngredient}>
              <Text style={styles.addBtnText}>
                {language === 'es' ? 'Agregar' : 'Add'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* PREFERENCES CARD */}
        <View style={[styles.card, isDarkMode && styles.cardDark]}>
          <Text style={[styles.cardTitle, isDarkMode && styles.textDark, styles.cardTitleBordered]}>
            {language === 'es' ? 'Preferencias' : 'Preferences'}
          </Text>

          {/* Budget row */}
          <View style={styles.preferenceRow}>
            <View style={styles.prefLabelContainer}>
              <CurrencyDollar size={18} color="#636366" />
              <Text style={styles.prefLabel}>
                {language === 'es' ? 'Presupuesto (opcional)' : 'Budget (optional)'}
              </Text>
            </View>
            <View style={styles.budgetInputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={[styles.budgetTextInput, isDarkMode && styles.textDark]}
                keyboardType="decimal-pad"
                value={budget}
                onChangeText={setBudget}
                placeholder="15.00"
                placeholderTextColor="#8E8E93"
              />
            </View>
          </View>

          {/* Servings row */}
          <View style={styles.preferenceBlock}>
            <View style={styles.prefLabelContainer}>
              <Users size={18} color="#636366" />
              <Text style={styles.prefLabel}>
                {language === 'es' ? 'Porciones' : 'Servings'}
              </Text>
            </View>
            <View style={styles.optionsRow}>
              {(['1', '2', '4', '6+'] as const).map(option => {
                const isActive = servings === option;
                return (
                  <TouchableOpacity
                    key={option}
                    style={[styles.optionBtn, isActive && styles.optionBtnActive]}
                    onPress={() => setServings(option)}
                  >
                    <Text style={[styles.optionText, isActive && styles.optionTextActive]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Dietary options row */}
          <View style={styles.preferenceBlock}>
            <View style={styles.prefLabelContainer}>
              <ForkKnife size={18} color="#636366" />
              <Text style={styles.prefLabel}>
                {language === 'es' ? 'Restricciones Alimentarias' : 'Dietary Restrictions'}
              </Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollOptionsContainer}>
              {['None', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free'].map(option => {
                const isActive = diet === option;
                const labelMap: Record<string, string> = {
                  'None': language === 'es' ? 'Ninguna' : 'None',
                  'Vegetarian': language === 'es' ? 'Vegetariana' : 'Vegetarian',
                  'Vegan': language === 'es' ? 'Vegana' : 'Vegan',
                  'Gluten-Free': language === 'es' ? 'Sin Gluten' : 'Gluten-Free',
                  'Dairy-Free': language === 'es' ? 'Sin Lácteos' : 'Dairy-Free',
                };
                return (
                  <TouchableOpacity
                    key={option}
                    style={[styles.pillBtn, isActive && styles.pillBtnActive]}
                    onPress={() => setDiet(option)}
                  >
                    <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                      {labelMap[option] || option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Time Limit row */}
          <View style={styles.preferenceBlock}>
            <View style={styles.prefLabelContainer}>
              <Clock size={18} color="#636366" />
              <Text style={styles.prefLabel}>
                {language === 'es' ? 'Tiempo de cocción máx.' : 'Max cooking time'}
              </Text>
            </View>
            <View style={styles.optionsRow}>
              {['Any', 'Quick (<30m)', 'Medium (<1h)'].map(option => {
                const isActive = time === option;
                const labelMap: Record<string, string> = {
                  'Any': language === 'es' ? 'Cualquiera' : 'Any',
                  'Quick (<30m)': language === 'es' ? 'Rápido (<30m)' : 'Quick (<30m)',
                  'Medium (<1h)': language === 'es' ? 'Medio (<1h)' : 'Medium (<1h)',
                };
                return (
                  <TouchableOpacity
                    key={option}
                    style={[styles.flexOptionBtn, isActive && styles.optionBtnActive]}
                    onPress={() => setTime(option)}
                  >
                    <Text style={[styles.optionText, isActive && styles.optionTextActive]}>
                      {labelMap[option] || option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* INGREDIENT COUNT BAR */}
        <View style={styles.countContainer}>
          <Text style={styles.countText}>
            {ingredients.length}{' '}
            {ingredients.length === 1
              ? (language === 'es' ? 'ingrediente agregado' : 'ingredient added')
              : (language === 'es' ? 'ingredientes agregados' : 'ingredients added')}
          </Text>
        </View>

        {/* SUBMIT BUTTON */}
        <TouchableOpacity
          style={[styles.submitBtn, ingredients.length === 0 && styles.submitBtnDisabled]}
          disabled={ingredients.length === 0}
          onPress={handleSubmit}
          activeOpacity={0.8}
        >
          <ChefHat size={20} color="#FFFFFF" weight="fill" />
          <Text style={styles.submitBtnText}>
            {language === 'es' ? 'Buscar Recetas ✨' : 'Find Recipes ✨'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F2F2F7' },
  safeAreaDark: { backgroundColor: '#1C1C1E' },
  scrollContainer: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  header: { paddingBottom: 16, borderBottomWidth: 1, borderColor: '#E5E5EA', marginBottom: 16 },
  headerDark: { borderColor: '#2C2C2E' },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#1C1C1E' },
  headerSubtitle: { fontSize: 12, color: '#8E8E93', marginTop: 4, fontWeight: '500' },
  textDark: { color: '#FFFFFF' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  cardDark: { backgroundColor: '#121212' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderColor: '#F2F2F7', paddingBottom: 10, marginBottom: 12 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#1C1C1E' },
  cardTitleBordered: { borderBottomWidth: 1, borderColor: '#F2F2F7', paddingBottom: 10, marginBottom: 16 },
  pantryBtn: { backgroundColor: '#D8F3DC', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  pantryBtnText: { fontSize: 11, fontWeight: '700', color: '#2D6A4F' },
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, minHeight: 60, alignItems: 'center', marginBottom: 12 },
  emptyText: { fontSize: 11, color: '#8E8E93', fontStyle: 'italic', lineHeight: 16 },
  chip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#D8F3DC', borderRadius: 20, paddingLeft: 12, paddingRight: 8, paddingVertical: 6, gap: 6 },
  chipText: { fontSize: 12, fontWeight: '600', color: '#1B4332' },
  chipCloseBtn: { padding: 2 },
  inputRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  input: { flex: 1, height: 44, backgroundColor: '#F2F2F7', borderRadius: 12, paddingHorizontal: 12, fontSize: 13, color: '#1C1C1E' },
  inputDark: { backgroundColor: '#1C1C1E', color: '#FFFFFF' },
  addBtn: { backgroundColor: '#2D6A4F', height: 44, paddingHorizontal: 20, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  addBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  preferenceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  preferenceBlock: { marginBottom: 16 },
  prefLabelContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  prefLabel: { fontSize: 13, fontWeight: '600', color: '#636366' },
  budgetInputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F2F2F7', borderRadius: 12, height: 36, paddingHorizontal: 10, width: 90 },
  currencySymbol: { fontSize: 13, fontWeight: '700', color: '#8E8E93', marginRight: 4 },
  budgetTextInput: { flex: 1, fontSize: 13, fontWeight: '700', textAlign: 'right', color: '#1C1C1E', padding: 0 },
  optionsRow: { flexDirection: 'row', gap: 8 },
  optionBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F2F2F7', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'transparent' },
  optionBtnActive: { backgroundColor: '#2D6A4F', borderColor: '#2D6A4F' },
  optionText: { fontSize: 13, fontWeight: '700', color: '#636366' },
  optionTextActive: { color: '#FFFFFF' },
  scrollOptionsContainer: { gap: 8, paddingVertical: 4 },
  pillBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, backgroundColor: '#F2F2F7', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'transparent' },
  pillBtnActive: { backgroundColor: '#2D6A4F', borderColor: '#2D6A4F' },
  pillText: { fontSize: 12, fontWeight: '700', color: '#636366' },
  pillTextActive: { color: '#FFFFFF' },
  flexOptionBtn: { flex: 1, height: 40, borderRadius: 12, backgroundColor: '#F2F2F7', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'transparent' },
  countContainer: { alignItems: 'center', marginVertical: 12 },
  countText: { fontSize: 10, fontWeight: '700', color: '#8E8E93', textTransform: 'uppercase', letterSpacing: 1 },
  submitBtn: { height: 52, backgroundColor: '#2D6A4F', borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, shadowColor: '#2D6A4F', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 6, elevation: 2, marginTop: 12 },
  submitBtnDisabled: { backgroundColor: '#C7C7CC', shadowOpacity: 0 },
  submitBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
});
