/**
 * FreshCart - Register Screen Component
 * File: screens/RegisterScreen.tsx
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
import { CaretLeft, Eye, EyeSlash } from 'phosphor-react-native';

interface RegisterScreenProps {
  navigation?: {
    goBack: () => void;
    navigate: (screenName: string) => void;
    replace: (screenName: string) => void;
  };
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validate = (): boolean => {
    const tempErrors: typeof errors = {};
    let isValid = true;

    // Name: required, length >= 2
    if (!name.trim()) {
      tempErrors.name = 'Full name is required.';
      isValid = false;
    } else if (name.trim().length < 2) {
      tempErrors.name = 'Name must be at least 2 characters.';
      isValid = false;
    }

    // Email: valid format
    if (!email.trim()) {
      tempErrors.email = 'Email address is required.';
      isValid = false;
    } else if (!email.includes('@') || !email.includes('.')) {
      tempErrors.email = 'Please enter a valid email address.';
      isValid = false;
    }

    // Password: length >= 8
    if (!password) {
      tempErrors.password = 'Password is required.';
      isValid = false;
    } else if (password.length < 8) {
      tempErrors.password = 'Password must be at least 8 characters.';
      isValid = false;
    }

    // Confirm: must match password exactly
    if (!confirmPassword) {
      tempErrors.confirmPassword = 'Please confirm your password.';
      isValid = false;
    } else if (confirmPassword !== password) {
      tempErrors.confirmPassword = 'Passwords do not match.';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleRegister = () => {
    if (!validate()) return;

    setIsLoading(true);

    // Mock registration with realistic delay
    setTimeout(() => {
      setIsLoading(false);
      // Navigate or login successfully (e.g. replaced with Main Dashboard or back to Login)
      if (navigation) {
        navigation.replace('Main');
      }
    }, 1500);
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
          onPress={() => navigation?.goBack()}
          activeOpacity={0.7}
        >
          <CaretLeft size={24} color="#2D6A4F" weight="bold" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Account</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* HERO TITLE SECTION */}
        <Text style={styles.headlineLg}>Create Account</Text>
        <Text style={styles.bodyMd}>Join FreshCart today</Text>

        {/* FULL NAME INPUT */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Full Name</Text>
          <View style={[styles.inputWrapper, errors.name ? styles.inputErrorBorder : null]}>
            <TextInput
              style={styles.textInput}
              placeholder="Gabriel Torres"
              placeholderTextColor="#A0A0A0"
              autoCapitalize="words"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
              }}
            />
          </View>
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        {/* EMAIL INPUT */}
        <View style={[styles.inputGroup, { marginTop: 16 }]}>
          <Text style={styles.inputLabel}>Email</Text>
          <View style={[styles.inputWrapper, errors.email ? styles.inputErrorBorder : null]}>
            <TextInput
              style={styles.textInput}
              placeholder="you@example.com"
              placeholderTextColor="#A0A0A0"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
              }}
            />
          </View>
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        {/* PASSWORD INPUT */}
        <View style={[styles.inputGroup, { marginTop: 16 }]}>
          <Text style={styles.inputLabel}>Password</Text>
          <View style={[styles.inputWrapper, errors.password ? styles.inputErrorBorder : null]}>
            <TextInput
              style={styles.textInput}
              placeholder="••••••••"
              placeholderTextColor="#A0A0A0"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
              }}
            />
            <TouchableOpacity 
              style={styles.eyeButton} 
              onPress={() => setShowPassword(!showPassword)}
              activeOpacity={0.7}
            >
              {showPassword ? (
                <EyeSlash size={20} color="#636366" />
              ) : (
                <Eye size={20} color="#636366" />
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.helperText}>At least 8 characters</Text>
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
        </View>

        {/* CONFIRM PASSWORD INPUT */}
        <View style={[styles.inputGroup, { marginTop: 16 }]}>
          <Text style={styles.inputLabel}>Confirm Password</Text>
          <View style={[styles.inputWrapper, errors.confirmPassword ? styles.inputErrorBorder : null]}>
            <TextInput
              style={styles.textInput}
              placeholder="••••••••"
              placeholderTextColor="#A0A0A0"
              secureTextEntry={!showConfirm}
              autoCapitalize="none"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: undefined }));
              }}
            />
            <TouchableOpacity 
              style={styles.eyeButton} 
              onPress={() => setShowConfirm(!showConfirm)}
              activeOpacity={0.7}
            >
              {showConfirm ? (
                <EyeSlash size={20} color="#636366" />
              ) : (
                <Eye size={20} color="#636366" />
              )}
            </TouchableOpacity>
          </View>
          {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
        </View>

        {/* CREATE ACCOUNT BUTTON */}
        <TouchableOpacity 
          style={styles.createButton} 
          onPress={handleRegister}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.createButtonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        {/* DIVIDER */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>— or —</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* GOOGLE SIGN IN BUTTON */}
        <TouchableOpacity style={styles.googleButton} activeOpacity={0.8}>
          <View style={styles.googleContent}>
            <Text style={styles.googleLogo}>G</Text>
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </View>
        </TouchableOpacity>

        {/* FOOTER */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity 
            activeOpacity={0.7}
            onPress={() => navigation?.navigate('Login')}
          >
            <Text style={styles.signInLinkText}>Sign In</Text>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 40,
    backgroundColor: '#FFFFFF',
  },
  headlineLg: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1C1E',
    marginTop: 8,
  },
  bodyMd: {
    fontSize: 15,
    color: '#636366',
    marginTop: 4,
    marginBottom: 32,
  },
  inputGroup: {
    width: '100%',
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
  eyeButton: {
    padding: 8,
    marginRight: -8,
  },
  helperText: {
    color: '#636366',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '400',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  createButton: {
    backgroundColor: '#2D6A4F',
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    shadowColor: '#2D6A4F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E5EA',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '500',
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#C7C7CC',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  googleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  googleLogo: {
    color: '#4285F4',
    fontSize: 18,
    fontWeight: '900',
  },
  googleButtonText: {
    color: '#1C1C1E',
    fontSize: 15,
    fontWeight: '600',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  footerText: {
    color: '#636366',
    fontSize: 14,
  },
  signInLinkText: {
    color: '#2D6A4F',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default RegisterScreen;
