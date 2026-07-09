/**
 * FreshCart - Cook Mode Full Screen
 * File: screens/CookModeScreen.tsx
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  StatusBar,
  ScrollView,
} from 'react-native';
import { 
  X, 
  Pause, 
  Play, 
  ArrowClockwise, 
  ArrowLeft, 
  ArrowRight,
} from 'phosphor-react-native';

const safeArea = { top: 44, bottom: 34 };

export const CookModeScreen: React.FC<any> = ({ navigation }) => {
  const steps = [
    "Cut the chicken breast into bite-sized cubes and season lightly with salt and pepper.",
    "Heat 1 tbsp of sesame oil in a large skillet over medium-high heat. Add chicken and sear until cooked through (8 minutes).",
    "Sauté the broccoli florets and minced garlic in the skillet with the remaining sesame oil. (Set timer for 4 minutes)",
    "In a small bowl, whisk together the soy sauce, honey, and water to create the glaze.",
    "Return the cooked chicken cubes to the skillet with the broccoli.",
    "Pour glaze over the ingredients and toss evenly to coat uniformly.",
    "Simmer for 2 minutes to thicken sauce. Garnish with toasted sesame seeds and serve warm."
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(240);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning]);

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      if (currentStep + 1 === 2) {
        setTimerSeconds(240);
      } else if (currentStep + 1 === 6) {
        setTimerSeconds(120);
      } else {
        setTimerSeconds(0);
      }
      setTimerRunning(false);
    } else {
      Alert.alert(
        "Done Cooking! 🎉",
        "Would you like to update your pantry to account for the used ingredients?",
        [
          { text: "Update Pantry", onPress: () => navigation?.goBack() },
          { text: "Not now", onPress: () => navigation?.goBack() }
        ]
      );
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setTimerRunning(false);
    }
  };

  const hasTimer = currentStep === 2 || currentStep === 6;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* TOP HEADER */}
      <View style={[styles.headerRow, { paddingTop: safeArea.top + 8 }]}>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle} numberOfLines={1}>Honey Sesame Chicken</Text>
        </View>
        <TouchableOpacity style={styles.closeBtn} activeOpacity={0.8} onPress={() => navigation?.goBack()}>
          <X size={20} color="#FFFFFF" weight="bold" />
        </TouchableOpacity>
      </View>

      {/* PROGRESS TRACKER */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressLabel}>Step {currentStep + 1} of {steps.length}</Text>
        <View style={styles.progressSegmentsRow}>
          {steps.map((_, index) => {
            const completed = index <= currentStep;
            return (
              <View 
                key={index} 
                style={[
                  styles.progressSegment, 
                  completed ? styles.segmentCompleted : styles.segmentUpcoming
                ]} 
              />
            );
          })}
        </View>
      </View>

      {/* CENTER SECTION */}
      <View style={styles.centerSection}>
        <View style={styles.stepNumCircle}>
          <Text style={styles.stepCircleTxt}>{currentStep + 1}</Text>
        </View>

        <ScrollView style={styles.stepScroll} contentContainerStyle={styles.stepScrollContent}>
          <Text style={styles.stepText}>{steps[currentStep]}</Text>
        </ScrollView>

        {hasTimer && timerSeconds > 0 && (
          <View style={styles.timerSection}>
            <View style={styles.timerWrapper}>
              <Text style={styles.countdownText}>{formatTime(timerSeconds)}</Text>
            </View>
            <View style={styles.timerControlRow}>
              <TouchableOpacity 
                style={styles.timerControlBtn}
                onPress={() => setTimerRunning(!timerRunning)}
              >
                {timerRunning ? (
                  <Pause size={18} color="#FFFFFF" weight="fill" />
                ) : (
                  <Play size={18} color="#FFFFFF" weight="fill" />
                )}
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.timerControlBtn}
                onPress={() => {
                  setTimerSeconds(currentStep === 2 ? 240 : 120);
                  setTimerRunning(false);
                }}
              >
                <ArrowClockwise size={18} color="#FFFFFF" weight="bold" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* BOTTOM BUTTONS BAR */}
      <View style={[styles.bottomBar, { paddingBottom: safeArea.bottom + 16 }]}>
        <TouchableOpacity 
          style={[styles.navBtn, styles.navBtnPrev, currentStep === 0 && styles.navBtnDisabled]}
          disabled={currentStep === 0}
          onPress={handlePrev}
          activeOpacity={0.7}
        >
          <ArrowLeft size={16} color="#FFFFFF" weight="bold" style={styles.navBtnIcon} />
          <Text style={styles.navBtnPrevText}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navBtn, styles.navBtnNext]}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.navBtnNextText}>
            {currentStep === steps.length - 1 ? "Done Cooking! 🎉" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerTitleWrap: {
    flex: 1,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  progressLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'right',
  },
  progressSegmentsRow: {
    flexDirection: 'row',
    height: 4,
    marginTop: 6,
    gap: 4,
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  segmentCompleted: {
    backgroundColor: '#52B788',
  },
  segmentUpcoming: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    marginTop: 16,
  },
  stepNumCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#52B788',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleTxt: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
  },
  stepScroll: {
    maxHeight: 120,
    marginTop: 24,
    width: '100%',
  },
  stepScrollContent: {
    alignItems: 'center',
  },
  stepText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    fontWeight: '500',
  },
  timerSection: {
    alignItems: 'center',
    marginTop: 24,
  },
  timerWrapper: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: 'rgba(82, 183, 136, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  countdownText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  timerControlRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 16,
  },
  timerControlBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  navBtn: {
    height: 52,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBtnPrev: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'transparent',
  },
  navBtnDisabled: {
    opacity: 0.3,
  },
  navBtnPrevText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  navBtnIcon: {
    marginRight: 6,
  },
  navBtnNext: {
    flex: 2,
    backgroundColor: '#2D6A4F',
  },
  navBtnNextText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
