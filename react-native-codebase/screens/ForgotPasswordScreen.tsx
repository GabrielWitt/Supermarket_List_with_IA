/**
 * FreshCart - Forgot Password Screen Component
 * File: screens/ForgotPasswordScreen.tsx
 */

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  ScrollView, 
  Platform,
  StatusBar
} from 'react-native';
import { CaretLeft, EnvelopeSimple, CheckCircle } from 'phosphor-react-native';

interface ForgotPasswordScreenProps {
  navigation?: {
    goBack: () => void;
    navigate: (screenName: string) => void;
    replace: (screenName: string) => void;
  };
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = (): boolean => {
    if (!email.trim()) {
      setError('Email address is required.');
      return false;
    } else if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSendLink = () => {
    if (!validate()) return;

    setIsLoading(true);

    // Mock sending reset link with delay
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  const handleResendEmail = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('Reset link resent successfully!');
    }, 1000);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* HEADER ROW */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => {
            if (submitted) {
              setSubmitted(false);
            } else {
              navigation?.goBack();
            }
          }}
          activeOpacity={0.7}
        >
          <CaretLeft size={24} color="#2D6A4F" weight="bold" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reset Password</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {!submitted ? (
          /* ==================== FORM STATE ==================== */
          <View style={styles.stateContainer}>
            {/* Centered Icon Area */}
            <View style={styles.iconContainerForm}>
              <EnvelopeSimple size={36} color="#2D6A4F" weight="regular" />
            </View>

            <Text style={styles.titleForm}>Reset Password</Text>
            <Text style={styles.subtitleForm}>
              Enter your email and we'll send you a link to reset your password.
            </Text>

            {/* EMAIL INPUT */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={[styles.inputWrapper, error ? styles.inputErrorBorder : null]}>
                <TextInput
                  style={styles.textInput}
                  placeholder="you@example.com"
                  placeholderTextColor="#A0A0A0"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (error) setError(null);
                  }}
                />
              </View>
              {error && <Text style={styles.errorText}>{error}</Text>}
            </View>

            {/* SEND BUTTON */}
            <TouchableOpacity 
              style={styles.sendButton} 
              onPress={handleSendLink}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.sendButtonText}>Send Reset Link</Text>
              )}
            </TouchableOpacity>

            {/* BACK TO LOGIN TEXT BUTTON */}
            <TouchableOpacity 
              style={styles.textButtonBack} 
              onPress={() => navigation?.navigate('Login')}
              activeOpacity={0.7}
            >
              <Text style={styles.textButtonBackLabel}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* ==================== SUCCESS STATE ==================== */
          <View style={styles.stateContainer}>
            {/* Centered Icon Area */}
            <View style={styles.iconContainerSuccess}>
              <CheckCircle size={40} color="#34C759" weight="fill" />
            </View>

            <Text style={styles.titleSuccess}>Check Your Email</Text>
            <Text style={styles.subtitleSuccess}>
              We've sent a reset link to{'\n'}
              <Text style={styles.emailHighlight}>{email}</Text>
            </Text>

            {/* BACK TO LOGIN PRIMARY BUTTON */}
            <TouchableOpacity 
              style={styles.backLoginButton} 
              onPress={() => navigation?.navigate('Login')}
              activeOpacity={0.8}
            >
              <Text style={styles.backLoginButtonText}>Back to Login</Text>
            </TouchableOpacity>

            {/* RESEND EMAIL TEXT BUTTON */}
            <TouchableOpacity 
              style={styles.resendButton} 
              onPress={handleResendEmail}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#636366" />
              ) : (
                <Text style={styles.resendButtonText}>Resend Email</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'between',
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1C1C1E',
    flex: 1,
    textAlign: 'center',
    marginRight: 24, // balance back button
  },
  headerPlaceholder: {
    width: 24,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
  },
  stateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: 40,
  },
  // Form State Styles
  iconContainerForm: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#D8F3DC',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  titleForm: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1C1C1E',
    textAlign: 'center',
    marginTop: 24,
  },
  subtitleForm: {
    fontSize: 15,
    color: '#636366',
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 300,
    lineHeight: 20,
  },
  inputGroup: {
    width: '100%',
    marginTop: 32,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#636366',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
    height: 52,
    paddingHorizontal: 16,
  },
  inputErrorBorder: {
    borderColor: '#FF3B30',
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#1C1C1E',
    height: '100%',
    padding: 0,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
    alignSelf: 'flex-start',
  },
  sendButton: {
    backgroundColor: '#2D6A4F',
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 24,
    shadowColor: '#2D6A4F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  textButtonBack: {
    marginTop: 24,
    padding: 8,
  },
  textButtonBackLabel: {
    color: '#2D6A4F',
    fontSize: 15,
    fontWeight: '600',
  },
  // Success State Styles
  iconContainerSuccess: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#E5F9EC',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
  },
  titleSuccess: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1C1C1E',
    textAlign: 'center',
    marginTop: 24,
  },
  subtitleSuccess: {
    fontSize: 15,
    color: '#636366',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  emailHighlight: {
    fontWeight: '600',
    color: '#1C1C1E',
  },
  backLoginButton: {
    backgroundColor: '#2D6A4F',
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 40,
    shadowColor: '#2D6A4F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  backLoginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  resendButton: {
    marginTop: 16,
    padding: 8,
  },
  resendButtonText: {
    color: '#636366',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default ForgotPasswordScreen;
