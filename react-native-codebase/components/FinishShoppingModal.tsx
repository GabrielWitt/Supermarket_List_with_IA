/**
 * FreshCart - Finish Shopping Confirmation Modal
 * File: components/FinishShoppingModal.tsx
 * 
 * Centered confirmation dialog before finishing shopping.
 * Offers options to record store name, see summary, and automatically move items to the pantry.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  Switch,
  Dimensions,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableWithoutFeedback
} from 'react-native';
import { ShoppingCartSimple } from 'phosphor-react-native';

const { width: screenWidth } = Dimensions.get('window');

interface FinishShoppingModalProps {
  visible: boolean;
  itemsPurchasedCount: number;
  totalCost: number;
  timeSpentMinutes: number;
  defaultStore?: string;
  onClose: () => void;
  onConfirm: (storeName: string, moveToPantry: boolean) => Promise<void> | void;
  isDarkMode?: boolean;
}

export const FinishShoppingModal: React.FC<FinishShoppingModalProps> = ({
  visible,
  itemsPurchasedCount,
  totalCost,
  timeSpentMinutes,
  defaultStore = 'Walmart',
  onClose,
  onConfirm,
  isDarkMode = false,
}) => {
  const [storeName, setStoreName] = useState(defaultStore);
  const [moveToPantry, setMoveToPantry] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Sync with defaultStore prop when modal becomes visible
  useEffect(() => {
    if (visible) {
      setStoreName(defaultStore);
      setMoveToPantry(true);
      setIsLoading(false);
    }
  }, [visible, defaultStore]);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm(storeName, moveToPantry);
    } catch (error) {
      console.error('Error finishing shopping:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.keyboardContainer}
            >
              <View style={[
                styles.card,
                isDarkMode && styles.cardDark
              ]}>
                {/* ICON (centered) */}
                <View style={styles.iconContainer}>
                  <ShoppingCartSimple size={28} color="#2D6A4F" weight="bold" />
                </View>

                {/* TITLE */}
                <Text style={[styles.title, isDarkMode && styles.textWhite]}>
                  Finish Shopping?
                </Text>

                {/* SUMMARY ROWS */}
                <View style={styles.summaryContainer}>
                  <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, isDarkMode && styles.textGrayLighter]}>
                      Items purchased
                    </Text>
                    <Text style={styles.summaryValueHighlighted}>
                      {itemsPurchasedCount} items
                    </Text>
                  </View>

                  <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, isDarkMode && styles.textGrayLighter]}>
                      List total
                    </Text>
                    <Text style={styles.summaryValueHighlighted}>
                      ${totalCost.toFixed(2)}
                    </Text>
                  </View>

                  <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, isDarkMode && styles.textGrayLighter]}>
                      Time spent
                    </Text>
                    <Text style={[styles.summaryValue, isDarkMode && styles.textWhite]}>
                      {timeSpentMinutes} minutes
                    </Text>
                  </View>
                </View>

                {/* STORE INPUT */}
                <View style={styles.inputContainer}>
                  <Text style={[styles.inputLabel, isDarkMode && styles.textGrayLighter]}>
                    Store name (optional)
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      isDarkMode && styles.inputDark
                    ]}
                    placeholder="e.g. Walmart"
                    placeholderTextColor="#AEAEB2"
                    value={storeName}
                    onChangeText={setStoreName}
                  />
                </View>

                {/* DIVIDER */}
                <View style={[styles.divider, isDarkMode && styles.dividerDark]} />

                {/* PANTRY TOGGLE ROW */}
                <View style={styles.pantryRow}>
                  <View style={styles.pantryTextContainer}>
                    <Text style={[styles.pantryTitle, isDarkMode && styles.textWhite]}>
                      Move to Pantry?
                    </Text>
                    <Text style={styles.pantrySubtitle}>
                      Add purchased items to your pantry
                    </Text>
                  </View>
                  <Switch
                    value={moveToPantry}
                    onValueChange={setMoveToPantry}
                    thumbColor={Platform.OS === 'android' ? '#FFFFFF' : undefined}
                    trackColor={{ false: '#C7C7CC', true: '#2D6A4F' }}
                  />
                </View>

                {/* BUTTONS */}
                <View style={styles.buttonsContainer}>
                  <TouchableOpacity
                    style={[
                      styles.btnCancel,
                      isDarkMode && styles.btnCancelDark
                    ]}
                    onPress={onClose}
                    disabled={isLoading}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.btnCancelText, isDarkMode && styles.textWhite]}>
                      Cancel
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.btnConfirm}
                    onPress={handleConfirm}
                    disabled={isLoading}
                    activeOpacity={0.8}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.btnConfirmText}>
                        Finish Shopping ✓
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: screenWidth * 0.9,
    maxWidth: 380,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 3,
  },
  cardDark: {
    backgroundColor: '#1C1C1E',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#D8F3DC',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
    textAlign: 'center',
    marginTop: 16,
  },
  textWhite: {
    color: '#FFFFFF',
  },
  textGrayLighter: {
    color: '#AEAEB2',
  },
  summaryContainer: {
    marginTop: 16,
    gap: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#636366',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 14,
    color: '#1C1C1E',
    fontWeight: '600',
  },
  summaryValueHighlighted: {
    fontSize: 14,
    color: '#2D6A4F',
    fontWeight: '700',
  },
  inputContainer: {
    marginTop: 16,
  },
  inputLabel: {
    fontSize: 13,
    color: '#636366',
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 48,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#1C1C1E',
  },
  inputDark: {
    backgroundColor: '#2C2C2E',
    color: '#FFFFFF',
  },
  divider: {
    height: 1,
    backgroundColor: '#F2F2F7',
    marginTop: 16,
    width: '100%',
  },
  dividerDark: {
    backgroundColor: '#2C2C2E',
  },
  pantryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  pantryTextContainer: {
    flex: 1,
    paddingRight: 16,
  },
  pantryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  pantrySubtitle: {
    fontSize: 12,
    color: '#636366',
    marginTop: 2,
    fontWeight: '500',
  },
  buttonsContainer: {
    marginTop: 20,
    gap: 12,
  },
  btnCancel: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCancelDark: {
    backgroundColor: '#2C2C2E',
  },
  btnCancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#636366',
  },
  btnConfirm: {
    width: '100%',
    height: 52,
    borderRadius: 12,
    backgroundColor: '#2D6A4F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnConfirmText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
