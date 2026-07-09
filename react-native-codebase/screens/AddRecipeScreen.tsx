/**
 * FreshCart - Add Recipe Screen
 * File: screens/AddRecipeScreen.tsx
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { 
  Camera, 
  Trash, 
  Minus, 
  Plus, 
  X 
} from 'phosphor-react-native';

export const AddRecipeScreen: React.FC<any> = ({ navigation }) => {
  const [photoSelected, setPhotoSelected] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [servings, setServings] = useState(2);
  const [prepTime, setPrepTime] = useState('15');
  const [cookTime, setCookTime] = useState('30');
  
  const [tagInput, setTagInput] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(["Quick", "Healthy"]);
  
  const [ingredients, setIngredients] = useState([
    { id: '1', name: '', quantity: '', unit: 'units' },
    { id: '2', name: '', quantity: '', unit: 'units' },
    { id: '3', name: '', quantity: '', unit: 'units' }
  ]);

  const [steps, setSteps] = useState([
    "Describe step 1..."
  ]);

  const tagSuggestions = ["Vegetarian", "Quick", "Healthy", "Breakfast", "Italian"];

  const handleSelectPhoto = () => {
    setPhotoSelected(true);
  };

  const handleAddTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !selectedTags.includes(trimmed)) {
      setSelectedTags([...selectedTags, trimmed]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  const addIngredientRow = () => {
    setIngredients([
      ...ingredients,
      { id: Math.random().toString(), name: '', quantity: '', unit: 'units' }
    ]);
  };

  const removeIngredientRow = (id: string) => {
    setIngredients(ingredients.filter(it => it.id !== id));
  };

  const cycleUnit = (index: number) => {
    const units = ['units', 'g', 'kg', 'ml', 'L', 'tbsp', 'tsp', 'cups'];
    setIngredients(prev => prev.map((it, i) => {
      if (i === index) {
        const currentIdx = units.indexOf(it.unit);
        const nextIdx = (currentIdx + 1) % units.length;
        return { ...it, unit: units[nextIdx] };
      }
      return it;
    }));
  };

  const updateIngredientField = (id: string, field: 'name' | 'quantity', value: string) => {
    setIngredients(prev => prev.map(it => it.id === id ? { ...it, [field]: value } : it));
  };

  const addStepRow = () => {
    setSteps([...steps, ""]);
  };

  const removeStepRow = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const updateStepText = (index: number, text: string) => {
    setSteps(prev => prev.map((s, i) => i === index ? text : s));
  };

  const isSaveDisabled = !title.trim();

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* HEADER BAR */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation?.goBack()}>
          <Text style={styles.headerCancelTxt}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Recipe</Text>
        <TouchableOpacity 
          style={styles.headerBtn}
          disabled={isSaveDisabled}
          onPress={() => navigation?.goBack()}
        >
          <Text style={[styles.headerSaveTxt, isSaveDisabled && styles.headerSaveDisabled]}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* PHOTO AREA */}
        <TouchableOpacity 
          style={[styles.photoArea, photoSelected && styles.photoAreaSelected]} 
          onPress={handleSelectPhoto}
          activeOpacity={0.8}
        >
          {photoSelected ? (
            <View style={styles.photoContainer}>
              <View style={styles.photoPlaceholderFill}>
                <Text style={styles.photoLabelActive}>🍯 Honey Sesame Chicken Mock Image</Text>
              </View>
              <View style={styles.photoChangeOverlay}>
                <Text style={styles.photoChangeText}>Change</Text>
              </View>
            </View>
          ) : (
            <View style={styles.photoPlaceholder}>
              <Camera size={36} color="#C7C7CC" />
              <Text style={styles.photoTitle}>Add Photo</Text>
              <Text style={styles.photoSubtitle}>Optional</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* BASIC INFO */}
        <View style={styles.section}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Recipe Title *</Text>
            <TextInput
              style={styles.textInput}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Chocolate Chip Cookies"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              multiline
              numberOfLines={3}
              style={[styles.textInput, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="A brief description of the dish..."
            />
          </View>
        </View>

        {/* DETAILS ROW */}
        <View style={styles.detailsRow}>
          <View style={styles.detailCol}>
            <Text style={styles.inputLabel}>Servings</Text>
            <View style={styles.stepperRow}>
              <TouchableOpacity 
                style={styles.stepperBtn}
                onPress={() => setServings(Math.max(1, servings - 1))}
              >
                <Minus size={12} color="#2D6A4F" weight="bold" />
              </TouchableOpacity>
              <Text style={styles.stepperVal}>{servings}</Text>
              <TouchableOpacity 
                style={styles.stepperBtn}
                onPress={() => setServings(servings + 1)}
              >
                <Plus size={12} color="#2D6A4F" weight="bold" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.detailCol}>
            <Text style={styles.inputLabel}>Prep (min)</Text>
            <TextInput
              style={styles.textInput}
              value={prepTime}
              onChangeText={setPrepTime}
              keyboardType="number-pad"
              placeholder="15"
            />
          </View>

          <View style={styles.detailCol}>
            <Text style={styles.inputLabel}>Cook (min)</Text>
            <TextInput
              style={styles.textInput}
              value={cookTime}
              onChangeText={setCookTime}
              keyboardType="number-pad"
              placeholder="30"
            />
          </View>
        </View>

        {/* TAGS */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Tags</Text>
          
          <View style={styles.chipsRow}>
            {selectedTags.map(tag => (
              <View key={tag} style={styles.chipPill}>
                <Text style={styles.chipText}>{tag}</Text>
                <TouchableOpacity onPress={() => handleRemoveTag(tag)} style={styles.chipCloseBtn}>
                  <X size={10} color="#FFFFFF" weight="bold" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <TextInput
            style={styles.textInput}
            value={tagInput}
            onChangeText={setTagInput}
            onSubmitEditing={() => handleAddTag(tagInput)}
            placeholder="Type tag & press enter"
          />

          <View style={styles.tagSuggestionsRow}>
            {tagSuggestions.map(tag => (
              <TouchableOpacity 
                key={tag} 
                style={styles.suggestionPill}
                onPress={() => handleAddTag(tag)}
              >
                <Text style={styles.suggestionText}>{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* INGREDIENTS */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeading}>Ingredients</Text>
            <TouchableOpacity onPress={addIngredientRow}>
              <Text style={styles.sectionAddText}>+ Add</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.listContainer}>
            {ingredients.map((ing, idx) => (
              <View key={ing.id} style={styles.listItemRow}>
                <TextInput
                  style={[styles.itemInput, styles.flexFill]}
                  value={ing.name}
                  onChangeText={(val) => updateIngredientField(ing.id, 'name', val)}
                  placeholder="Ingredient"
                />

                <TextInput
                  style={[styles.itemInput, styles.qtyInput]}
                  value={ing.quantity}
                  onChangeText={(val) => updateIngredientField(ing.id, 'quantity', val)}
                  placeholder="1"
                  keyboardType="numeric"
                />

                <TouchableOpacity 
                  onPress={() => cycleUnit(idx)}
                  style={styles.unitBtn}
                >
                  <Text style={styles.unitBtnTxt}>{ing.unit}</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={() => removeIngredientRow(ing.id)}
                  style={styles.trashBtn}
                >
                  <Trash size={16} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
          
          <TouchableOpacity onPress={addIngredientRow} style={styles.addSecondaryBtn}>
            <Text style={styles.addSecondaryBtnTxt}>+ Add Ingredient</Text>
          </TouchableOpacity>
        </View>

        {/* STEPS */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeading}>Steps</Text>
            <TouchableOpacity onPress={addStepRow}>
              <Text style={styles.sectionAddText}>+ Add Step</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.listContainer}>
            {steps.map((step, idx) => (
              <View key={idx} style={styles.stepRow}>
                <View style={styles.stepCircle}>
                  <Text style={styles.stepCircleText}>{idx + 1}</Text>
                </View>

                <TextInput
                  multiline
                  style={[styles.stepInput, styles.flexFill]}
                  value={step}
                  onChangeText={(val) => updateStepText(idx, val)}
                  placeholder="Describe this step..."
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

        {/* SAVE CTA BUTTON */}
        <TouchableOpacity 
          style={[styles.saveBtnCta, isSaveDisabled && styles.saveBtnCtaDisabled]}
          disabled={isSaveDisabled}
          activeOpacity={0.85}
          onPress={() => navigation?.goBack()}
        >
          <Text style={styles.saveBtnCtaTxt}>Save Recipe</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
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
  headerSaveDisabled: {
    color: '#C7C7CC',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 60,
  },
  photoArea: {
    height: 200,
    borderWidth: 1.5,
    borderColor: '#C7C7CC',
    borderStyle: 'dashed',
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    overflow: 'hidden',
  },
  photoAreaSelected: {
    borderStyle: 'solid',
    borderColor: '#2D6A4F',
  },
  photoPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8E8E93',
    marginTop: 8,
  },
  photoSubtitle: {
    fontSize: 11,
    color: '#C7C7CC',
    marginTop: 2,
    fontWeight: '600',
  },
  photoContainer: {
    flex: 1,
    position: 'relative',
  },
  photoPlaceholderFill: {
    flex: 1,
    backgroundColor: '#1B4332',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoLabelActive: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  photoChangeOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  photoChangeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  section: {
    marginTop: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1C1C1E',
  },
  sectionAddText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2D6A4F',
  },
  inputGroup: {
    marginBottom: 16,
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
    height: 80,
    paddingVertical: 12,
    textAlignVertical: 'top',
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  detailCol: {
    flex: 1,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    height: 44,
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  stepperBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1C1C1E',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  chipPill: {
    backgroundColor: '#2D6A4F',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 6,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  chipText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  chipCloseBtn: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagSuggestionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  suggestionPill: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  suggestionText: {
    color: '#52B788',
    fontSize: 11,
    fontWeight: '600',
  },
  listContainer: {
    gap: 8,
  },
  listItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  itemInput: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    height: 38,
    paddingHorizontal: 10,
    fontSize: 12,
    color: '#1C1C1E',
  },
  qtyInput: {
    width: 50,
    textAlign: 'center',
    fontWeight: '700',
  },
  unitBtn: {
    width: 50,
    height: 38,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unitBtnTxt: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2D6A4F',
  },
  trashBtn: {
    width: 30,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addSecondaryBtn: {
    marginTop: 10,
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  addSecondaryBtnTxt: {
    color: '#2D6A4F',
    fontSize: 12,
    fontWeight: '800',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2D6A4F',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  stepCircleText: {
    color: '#FFFFFF',
    fontSize: 12,
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
  saveBtnCta: {
    backgroundColor: '#2D6A4F',
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    marginBottom: 48,
  },
  saveBtnCtaDisabled: {
    backgroundColor: '#E5E5EA',
  },
  saveBtnCtaTxt: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
