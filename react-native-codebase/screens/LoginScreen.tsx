/**
 * FreshCart - Login Screen Component
 * File: screens/LoginScreen.tsx
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
import { Eye, EyeSlash } from 'phosphor-react-native';

interface LoginScreenProps {
  navigation: {
    replace: (screenName: string) => void;
    navigate?: (screenName: string) => void;
  };
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = (): boolean => {
    const tempErrors: { email?: string; password?: string } = {};
    let isValid = true;

    if (!email) {
      tempErrors.email = 'Email address is required.';
      isValid = false;
    } else if (!email.includes('@') || !email.includes('.')) {
      tempErrors.email = 'Please enter a valid email address.';
      isValid = false;
    }

    if (!password) {
      tempErrors.password = 'Password is required.';
      isValid = false;
    } else if (password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters.';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSignIn = () => {
    if (!validate()) return;

    setIsLoading(true);

    // Mock authentication with a realistic delay
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to Main Dashboard on successful login
      navigation.replace('Main');
    }, 1500);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#2D6A4F" />
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* TOP HEADER SECTION */}
        <View style={styles.topSection}>
          <Text style={styles.appIcon} accessibilityRole="image" accessibilityLabel="Shopping Cart">
            🛒
          </Text>
          <Text style={styles.appName}>FreshCart</Text>
          <Text style={styles.appTagline}>Your smart kitchen companion</Text>
        </View>

        {/* FORM SECTION OVERLAPPING THE TOP SECTION */}
        <View style={styles.formSection}>
          <Text style={styles.welcomeTitle}>Welcome back</Text>
          <Text style={styles.welcomeSubtitle}>Sign in to your account</Text>

          {/* EMAIL INPUT */}
          <View style={styles.inputGroup}>
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
          <View style={styles.inputGroup}>
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
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          {/* FORGOT PASSWORD */}
          <TouchableOpacity 
            style={styles.forgotPasswordButton} 
            activeOpacity={0.7}
            onPress={() => navigation.navigate?.('ForgotPassword')}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* SIGN IN BUTTON */}
          <TouchableOpacity 
            style={styles.signInButton} 
            onPress={handleSignIn}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.signInButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          {/* OR DIVIDER */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* GOOGLE SIGN IN BUTTON */}
          <TouchableOpacity style={styles.googleButton} activeOpacity={0.8}>
            <View style={styles.googleContent}>
              <Text style={styles.googleLogo}>G</Text>
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </View>
          </TouchableOpacity>

          {/* FOOTER REGISTER LINK */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity 
              activeOpacity={0.7}
              onPress={() => navigation.navigate?.('Register')}
            >
              <Text style={styles.registerLinkText}>Register</Text>
            </TouchableOpacity>
          </View>
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
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#F2F2F7', // Aligns with overall system background
  },
  topSection: {
    height: 220,
    backgroundColor: '#2D6A4F', // Brand primary green
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20, // Leave padding for the card overlap
  },
  appIcon: {
    fontSize: 48,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 8,
  },
  appTagline: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  formSection: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -20, // Elegant card overlap look
    padding: 28,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: '#636366',
    marginTop: 4,
    marginBottom: 28,
  },
  inputGroup: {
    marginBottom: 16,
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
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  forgotPasswordText: {
    color: '#2D6A4F',
    fontSize: 14,
    fontWeight: '600',
  },
  signInButton: {
    backgroundColor: '#2D6A4F',
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
    shadowColor: '#2D6A4F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  signInButtonText: {
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
  registerLinkText: {
    color: '#2D6A4F',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default LoginScreen;
