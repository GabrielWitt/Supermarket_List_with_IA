/**
 * FreshCart - Quantity Editor Modal
 * File: components/QuantityModal.tsx
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput } from 'react-native';
import { Plus, Minus, X } from 'phosphor-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GroceryItem } from '../types';

interface QuantityModalProps {
  visible: boolean;
  item: GroceryItem | null;
  onClose: () => void;
  onSave: (id: string, quantity: number) => void;
  isDarkMode?: boolean;
}

export const QuantityModal: React.FC<QuantityModalProps> = ({
  visible,
  item,
  onClose,
  onSave,
  isDarkMode = false
}) => {
  const insets = useSafeAreaInsets();
  const [qty, setQty] = useState<number>(0);

  useEffect(() => {
    if (item) {
      setQty(item.quantity);
    }
  }, [item, visible]);

  const handleSave = () => {
    if (item) {
      onSave(item.id, qty);
      onClose();
    }
  };

  if (!item) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.content, isDarkMode && styles.contentDark, { paddingBottom: Math.max(24, insets.bottom) }]}>
          <View style={styles.header}>
            <Text style={[styles.title, isDarkMode && styles.textDark]}>Set Quantity</Text>
            <TouchableOpacity onPress={onClose} style={[styles.closeBtn, isDarkMode && styles.closeBtnDark]}>
              <X size={18} color={isDarkMode ? '#FFFFFF' : '#1C1C1E'} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.subtitle, isDarkMode && styles.textDarkVariant]}>{item.name}</Text>

          <View style={styles.editorRow}>
            <TouchableOpacity 
              style={[styles.mathBtn, isDarkMode && styles.mathBtnDark]} 
              onPress={() => setQty(q => Math.max(0, q - 1))}
            >
              <Minus size={22} color="#2D6A4F" weight="bold" />
            </TouchableOpacity>

            <TextInput
              style={[styles.input, isDarkMode && styles.inputDark]}
              keyboardType="number-pad"
              value={String(qty)}
              onChangeText={(txt) => {
                const parsed = parseInt(txt) || 0;
                setQty(Math.max(0, parsed));
              }}
            />

            <TouchableOpacity 
              style={[styles.mathBtn, isDarkMode && styles.mathBtnDark]} 
              onPress={() => setQty(q => q + 1)}
            >
              <Plus size={22} color="#2D6A4F" weight="bold" />
            </TouchableOpacity>
          </View>

          <View style={styles.presetRow}>
            {[1, 2, 3, 5, 10].map(val => (
              <TouchableOpacity 
                key={val} 
                style={[styles.presetBtn, isDarkMode && styles.presetBtnDark, qty === val && styles.presetBtnActive]}
                onPress={() => setQty(val)}
              >
                <Text style={[styles.presetText, qty === val && styles.presetTextActive]}>+{val}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Save Quantity</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  content: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  contentDark: { backgroundColor: '#1C1C1E' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  title: { fontSize: 20, fontWeight: '700', color: '#1C1C1E' },
  subtitle: { fontSize: 15, color: '#636366', marginBottom: 24 },
  textDark: { color: '#FFFFFF' },
  textDarkVariant: { color: '#8E8E93' },
  closeBtn: { padding: 8, borderRadius: 99, backgroundColor: '#F2F2F7' },
  closeBtnDark: { backgroundColor: '#2C2C2E' },
  editorRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 16 },
  mathBtn: { width: 54, height: 54, borderRadius: 27, borderWidth: 2, borderColor: '#2D6A4F', alignItems: 'center', justifyContent: 'center', backgroundColor: '#D8F3DC' },
  mathBtnDark: { backgroundColor: '#1B4332', borderColor: '#2D6A4F' },
  input: { fontSize: 28, fontWeight: '700', color: '#1C1C1E', textAlign: 'center', width: 100, marginHorizontal: 16, borderBottomWidth: 2, borderBottomColor: '#2D6A4F', paddingBottom: 4 },
  inputDark: { color: '#FFFFFF' },
  presetRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 16 },
  presetBtn: { flex: 1, marginHorizontal: 4, paddingVertical: 8, borderRadius: 8, backgroundColor: '#F2F2F7', alignItems: 'center' },
  presetBtnDark: { backgroundColor: '#2C2C2E' },
  presetBtnActive: { backgroundColor: '#2D6A4F' },
  presetText: { fontSize: 13, fontWeight: '600', color: '#1C1C1E' },
  presetTextActive: { color: '#FFFFFF' },
  saveBtn: { backgroundColor: '#2D6A4F', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  saveBtnText: { color: '#FFFFFF', fontSize: 17, fontWeight: '600' }
});
