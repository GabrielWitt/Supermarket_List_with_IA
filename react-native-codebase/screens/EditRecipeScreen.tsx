/**
 * FreshCart - Edit Recipe Screen
 * File: screens/EditRecipeScreen.tsx
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from 'react-native';
import { 
  Sparkle, 
  Trash, 
  DotsSixVertical, 
  Minus, 
  Plus 
} from 'phosphor-react-native';

export const EditRecipeScreen: React.FC<any> = ({ navigation }) => {
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponded, setAiResponded] = useState(false);
  const [recipeTitle, setRecipeTitle] = useState("Honey Sesame Chicken & Broccoli");
  const [description, setDescription] = useState(
    "A delicious, sweet, and savory skillet recipe combining tender chicken breast, crisp broccoli florets, and a luscious honey-sesame glaze."
  );
  const [servings, setServings] = useState(4);
  const [prepTime, setPrepTime] = useState("15");
  const [cookTime, setCookTime] = useState("30");

  const [ingredients, setIngredients] = useState([
    { id: '1', name: "Sesame Oil", quantity: "2", unit: "tbsp" },
    { id: '2', name: "Chicken Breast", quantity: "500", unit: "g" },
    { id: '3', name: "Broccoli", quantity: "1", unit: "head" },
    { id: '4', name: "Soy Sauce", quantity: "3", unit: "tbsp" },
    { id: '5', name: "Honey", quantity: "2", unit: "tbsp" },
    { id: '6', name: "Garlic", quantity: "3", unit: "cloves" }
  ]);

  const [steps, setSteps] = useState([
    "Cut the chicken breast into bite-sized cubes and season lightly.",
    "Heat 1 tbsp of sesame oil in a large skillet. Add chicken and cook until brown.",
    "Sauté the broccoli florets and garlic in the skillet with remaining sesame oil.",
    "Whisk soy sauce, honey, and water in a small bowl for the glaze.",
    "Return chicken cubes to the skillet with the broccoli.",
    "Pour glaze over the ingredients and toss evenly to coat.",
    "Simmer for 2 minutes to thicken sauce. Garnish and serve hot."
  ]);

  const handleApplyAIChanges = () => {
    if (!aiPrompt.trim()) return;
    setAiResponded(true);
  };

  const handleApplyAllAIProposal = () => {
    setIngredients(prev => 
      prev.map(it => it.name === "Soy Sauce" ? { ...it, name: "Tamari (gluten-free)" } : it)
    );
    setAiPrompt('');
    setAiResponded(false);
  };

  const addIngredientRow = () => {
    setIngredients(prev => [
      ...prev,
      { id: Math.random().toString(), name: '', quantity: '1', unit: 'units' }
    ]);
  };

  const removeIngredientRow = (id: string) => {
    setIngredients(prev => prev.filter(it => it.id !== id));
  };

  const updateIngredientField = (id: string, field: 'name' | 'quantity' | 'unit', value: string) => {
    setIngredients(prev => prev.map(it => it.id === id ? { ...it, [field]: value } : it));
  };

  const addStepRow = () => {
    setSteps(prev => [...prev, '']);
  };

  const removeStepRow = (index: number) => {
    setSteps(prev => prev.filter((_, i) => i !== index));
  };

  const updateStepText = (index: number, text: string) => {
    setSteps(prev => prev.map((s, i) => i === index ? text : s));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* HEADER BAR */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation?.goBack()}>
          <Text style={styles.headerCancelTxt}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Recipe</Text>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation?.goBack()}>
          <Text style={styles.headerSaveTxt}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* AI EDIT CARD */}
        <View style={styles.aiEditCard}>
          <View style={styles.aiRowTop}>
            <Sparkle size={20} color="#2D6A4F" weight="fill" />
            <Text style={styles.aiCardTitle}>Edit with AI</Text>
          </View>
          <Text style={styles.aiCardSub}>Describe what you want to change</Text>

          <TextInput
            multiline
            style={styles.aiInput}
            value={aiPrompt}
            onChangeText={setAiPrompt}
            placeholder="e.g. Make this gluten-free, Reduce to 2 servings, Add more spice"
            placeholderTextColor="#8E8E93"
          />

          <TouchableOpacity 
            style={styles.aiApplyBtn} 
            activeOpacity={0.8}
            onPress={handleApplyAIChanges}
          >
            <Text style={styles.aiApplyBtnTxt}>Apply AI Changes</Text>
          </TouchableOpacity>

          {aiResponded && (
            <View style={styles.aiProposalCard}>
              <Text style={styles.aiProposalHeading}>✨ Proposed changes:</Text>
              <Text style={styles.proposalItem}>• Soy Sauce → Tamari (gluten-free)</Text>
              <Text style={styles.proposalItem}>• Flour → Rice Flour</Text>
              <View style={styles.proposalActions}>
                <TouchableOpacity 
                  style={styles.proposalBtnAll}
                  onPress={handleApplyAllAIProposal}
                >
                  <Text style={styles.proposalBtnAllTxt}>Apply All ✓</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.proposalBtnDiscard}
                  onPress={() => setAiResponded(false)}
                >
                  <Text style={styles.proposalBtnDiscardTxt}>Discard ✗</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* OR DIVIDER */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or edit manually</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* SECTION: BASIC INFO */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Basic Info</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Recipe Title</Text>
            <TextInput
              style={styles.textInput}
              value={recipeTitle}
              onChangeText={setRecipeTitle}
              placeholder="e.g. Honey Sesame Chicken"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              multiline
              numberOfLines={4}
              style={[styles.textInput, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="A short story or background for your recipe..."
            />
          </View>
        </View>

        {/* SECTION: DETAILS */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Details</Text>
          
          <View style={styles.detailsRow}>
            {/* Servings Stepper */}
            <View style={styles.detailCol}>
              <Text style={styles.inputLabel}>Servings</Text>
              <View style={styles.detailsStepper}>
                <TouchableOpacity 
                  style={styles.stepperSubBtn} 
                  onPress={() => setServings(Math.max(1, servings - 1))}
                >
                  <Minus size={14} color="#2D6A4F" weight="bold" />
                </TouchableOpacity>
                <Text style={styles.stepperVal}>{servings}</Text>
                <TouchableOpacity 
                  style={styles.stepperSubBtn} 
                  onPress={() => setServings(servings + 1)}
                >
                  <Plus size={14} color="#2D6A4F" weight="bold" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Prep Time */}
            <View style={styles.detailCol}>
              <Text style={styles.inputLabel}>Prep (min)</Text>
              <View style={styles.detailsTimeInputRow}>
                <TextInput
                  style={styles.timeInput}
                  value={prepTime}
                  onChangeText={setPrepTime}
                  keyboardType="number-pad"
                />
                <Text style={styles.timeUnit}>min</Text>
              </View>
            </View>

            {/* Cook Time */}
            <View style={styles.detailCol}>
              <Text style={styles.inputLabel}>Cook (min)</Text>
              <View style={styles.detailsTimeInputRow}>
                <TextInput
                  style={styles.timeInput}
                  value={cookTime}
                  onChangeText={setCookTime}
                  keyboardType="number-pad"
                />
                <Text style={styles.timeUnit}>min</Text>
              </View>
            </View>
          </View>
        </View>

        {/* SECTION: INGREDIENTS */}
        <View style={styles.section}>
          <View style={styles.sectionLabelRow}>
            <Text style={styles.sectionHeading}>Ingredients ({ingredients.length})</Text>
            <TouchableOpacity onPress={addIngredientRow}>
              <Text style={styles.addBtnText}>+ Add</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.ingredientList}>
            {ingredients.map((ing) => (
              <View key={ing.id} style={styles.ingRow}>
                <DotsSixVertical size={16} color="#C7C7CC" style={styles.dragHandle} />
                
                <TextInput
                  style={[styles.ingInput, styles.flexFill]}
                  value={ing.name}
                  onChangeText={(val) => updateIngredientField(ing.id, 'name', val)}
                  placeholder="Ingredient"
                />

                <TextInput
                  style={[styles.ingInput, styles.qtyInput]}
                  value={ing.quantity}
                  onChangeText={(val) => updateIngredientField(ing.id, 'quantity', val)}
                  placeholder="Qty"
                  keyboardType="numeric"
                />

                <TextInput
                  style={[styles.ingInput, styles.unitInput]}
                  value={ing.unit}
                  onChangeText={(val) => updateIngredientField(ing.id, 'unit', val)}
                  placeholder="Unit"
                />

                <TouchableOpacity 
                  onPress={() => removeIngredientRow(ing.id)}
                  style={styles.trashBtn}
                >
                  <Trash size={16} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* SECTION: STEPS */}
        <View style={styles.section}>
          <View style={styles.sectionLabelRow}>
            <Text style={styles.sectionHeading}>Steps ({steps.length})</Text>
            <TouchableOpacity onPress={addStepRow}>
              <Text style={styles.addBtnText}>+ Add Step</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.stepsList}>
            {steps.map((step, idx) => (
              <View key={idx} style={styles.stepRow}>
                <View style={styles.stepCircle}>
                  <Text style={styles.stepNum}>{idx + 1}</Text>
                </View>

                <TextInput
                  multiline
                  style={[styles.stepInput, styles.flexFill]}
                  value={step}
                  onChangeText={(val) => updateStepText(idx, val)}
                  placeholder="Describe this instruction step..."
                />

                <TouchableOpacity 
                  onPress={() => removeStepRow(idx)}
                  style={styles.trashBtn}
                >
                  <Trash size={16} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* SAVE BUTTON */}
        <TouchableOpacity style={styles.saveCta} activeOpacity={0.85} onPress={() => navigation?.goBack()}>
          <Text style={styles.saveCtaTxt}>Save Recipe</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1C1C1E',
  },
  headerBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  headerCancelTxt: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '600',
  },
  headerSaveTxt: {
    fontSize: 14,
    color: '#2D6A4F',
    fontWeight: '800',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 60,
  },
  aiEditCard: {
    backgroundColor: '#D8F3DC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  aiRowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  aiCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1C1C1E',
  },
  aiCardSub: {
    fontSize: 11,
    color: '#636366',
    marginTop: 2,
    fontWeight: '500',
  },
  aiInput: {
    marginTop: 12,
    height: 80,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 12,
    color: '#1C1C1E',
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: 'rgba(45, 106, 79, 0.1)',
  },
  aiApplyBtn: {
    borderWidth: 1.5,
    borderColor: '#2D6A4F',
    backgroundColor: 'transparent',
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  aiApplyBtnTxt: {
    color: '#2D6A4F',
    fontSize: 12,
    fontWeight: '800',
  },
  aiProposalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
    borderWidth: 1.5,
    borderColor: '#2D6A4F',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  aiProposalHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2D6A4F',
    marginBottom: 4,
  },
  proposalItem: {
    fontSize: 11,
    color: '#1C1C1E',
    marginTop: 4,
    fontWeight: '600',
  },
  proposalActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  proposalBtnAll: {
    flex: 1,
    height: 36,
    backgroundColor: '#2D6A4F',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proposalBtnAllTxt: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  proposalBtnDiscard: {
    flex: 1,
    height: 36,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proposalBtnDiscardTxt: {
    color: '#FF3B30',
    fontSize: 11,
    fontWeight: '700',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E5EA',
  },
  dividerText: {
    fontSize: 11,
    color: '#8E8E93',
    fontWeight: '600',
  },
  section: {
    marginTop: 20,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1C1C1E',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 8,
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#636366',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    height: 44,
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#1C1C1E',
  },
  textArea: {
    height: 96,
    paddingVertical: 12,
    textAlignVertical: 'top',
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  detailCol: {
    flex: 1,
  },
  detailsStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    height: 44,
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  stepperSubBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1C1C1E',
  },
  detailsTimeInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    height: 44,
    paddingHorizontal: 10,
  },
  timeInput: {
    flex: 1,
    fontSize: 13,
    color: '#1C1C1E',
    textAlign: 'center',
    fontWeight: '700',
    height: '100%',
  },
  timeUnit: {
    fontSize: 11,
    color: '#636366',
    fontWeight: '600',
    marginLeft: 4,
  },
  sectionLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 8,
    marginBottom: 12,
  },
  addBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2D6A4F',
  },
  ingredientList: {
    gap: 10,
  },
  ingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
    paddingBottom: 8,
    gap: 6,
  },
  dragHandle: {
    marginRight: 2,
  },
  ingInput: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    height: 38,
    paddingHorizontal: 10,
    fontSize: 12,
    color: '#1C1C1E',
  },
  flexFill: {
    flex: 1,
  },
  qtyInput: {
    width: 58,
    textAlign: 'center',
    fontWeight: '700',
  },
  unitInput: {
    width: 68,
    textAlign: 'center',
  },
  trashBtn: {
    width: 30,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepsList: {
    gap: 12,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
    paddingBottom: 10,
    gap: 8,
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2D6A4F',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  stepNum: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  stepInput: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 12,
    color: '#1C1C1E',
    minHeight: 52,
    textAlignVertical: 'top',
  },
  saveCta: {
    backgroundColor: '#2D6A4F',
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    marginBottom: 40,
  },
  saveCtaTxt: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
