/**
 * FreshCart - Unit Price Editor Modal
 * File: components/PriceModal.tsx
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput } from 'react-native';
import { X } from 'phosphor-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GroceryItem } from '../types';

interface PriceModalProps {
  visible: boolean;
  item: GroceryItem | null;
  onClose: () => void;
  onSave: (id: string, price: number) => void;
  isDarkMode?: boolean;
}

export const PriceModal: React.FC<PriceModalProps> = ({
  visible,
  item,
  onClose,
  onSave,
  isDarkMode = false
}) => {
  const insets = useSafeAreaInsets();
  const [priceStr, setPriceStr] = useState<string>('0.00');

  useEffect(() => {
    if (item) {
      setPriceStr(item.price === 0 ? '' : item.price.toFixed(2));
    }
  }, [item, visible]);

  const handleSave = () => {
    if (item) {
      const parsedPrice = parseFloat(priceStr) || 0.00;
      onSave(item.id, parsedPrice);
      onClose();
    }
  };

  if (!item) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.content, isDarkMode && styles.contentDark, { paddingBottom: Math.max(24, insets.bottom) }]}>
          <View style={styles.header}>
            <Text style={[styles.title, isDarkMode && styles.textDark]}>Set Unit Price</Text>
            <TouchableOpacity onPress={onClose} style={[styles.closeBtn, isDarkMode && styles.closeBtnDark]}>
              <X size={18} color={isDarkMode ? '#FFFFFF' : '#1C1C1E'} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.subtitle, isDarkMode && styles.textDarkVariant]}>{item.name}</Text>

          <View style={styles.inputContainer}>
            <Text style={[styles.dollarSign, isDarkMode && styles.textDark]}>$</Text>
            <TextInput
              style={[styles.input, isDarkMode && styles.inputDark]}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor="#8E8E93"
              value={priceStr}
              onChangeText={(txt) => {
                // Filter characters to allow only numeric and single dot
                const filtered = txt.replace(/[^0-9.]/g, '');
                setPriceStr(filtered);
              }}
            />
          </View>

          <View style={styles.quickSelectRow}>
            {[0.99, 1.49, 2.99, 4.99, 9.99].map(val => (
              <TouchableOpacity 
                key={val} 
                style={[styles.quickBtn, isDarkMode && styles.quickBtnDark]}
                onPress={() => setPriceStr(val.toFixed(2))}
              >
                <Text style={styles.quickText}>${val.toFixed(2)}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Save Price</Text>
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
  inputContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderBottomWidth: 2, borderBottomColor: '#2D6A4F', paddingBottom: 8, marginVertical: 16 },
  dollarSign: { fontSize: 32, fontWeight: '700', color: '#1C1C1E', marginRight: 4 },
  input: { fontSize: 32, fontWeight: '700', color: '#1C1C1E', minWidth: 150, textAlign: 'left' },
  inputDark: { color: '#FFFFFF' },
  quickSelectRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginVertical: 16 },
  quickBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: '#F2F2F7', borderWidth: 1, borderColor: '#E5E5EA' },
  quickBtnDark: { backgroundColor: '#2C2C2E', borderColor: '#3A3A3C' },
  quickText: { fontSize: 13, fontWeight: '600', color: '#2D6A4F' },
  saveBtn: { backgroundColor: '#2D6A4F', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  saveBtnText: { color: '#FFFFFF', fontSize: 17, fontWeight: '600' }
});
