/**
 * FreshCart - Firebase Sync Service
 * File: services/firebase.ts
 * 
 * Firebase Configuration, Firestore integration for persistent multi-device sync,
 * and user Auth bindings for secure cloud storage.
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  writeBatch
} from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { GroceryItem, PurchaseHistoryItem, UserStats } from '../types';

// Firebase configuration using environment variables or fallback values
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "YOUR_EXPO_PUBLIC_FIREBASE_API_KEY",
  authDomain: "gen-lang-client-0931318243.firebaseapp.com",
  projectId: "gen-lang-client-0931318243",
  storageBucket: "gen-lang-client-0931318243.firebasestorage.app",
  messagingSenderId: "642248019805",
  appId: "1:642248019805:web:577a1877d7755547a3a2b4"
};

// Initialize Firebase App gracefully
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);

/**
 * Sync active grocery list items to Firestore
 */
export async function syncGroceryItemsToCloud(userId: string, items: GroceryItem[]): Promise<void> {
  try {
    const userListRef = doc(db, 'users', userId, 'config', 'groceryList');
    await setDoc(userListRef, {
      items,
      lastSync: Date.now()
    }, { merge: true });
  } catch (error) {
    console.error('Firebase: Failed to sync grocery items to cloud', error);
    throw error;
  }
}

/**
 * Save a completed purchase to Firestore history
 */
export async function savePurchaseToCloudHistory(userId: string, historyItem: PurchaseHistoryItem): Promise<void> {
  try {
    // Write new purchase history item
    const historyDocRef = doc(db, 'users', userId, 'history', historyItem.id);
    await setDoc(historyDocRef, historyItem);
    
    // Also update aggregated user stats
    const statsDocRef = doc(db, 'users', userId, 'config', 'stats');
    await setDoc(statsDocRef, {
      lastUpdated: Date.now()
    }, { merge: true });
  } catch (error) {
    console.error('Firebase: Failed to archive purchase history to cloud', error);
    throw error;
  }
}

/**
 * Fetch grocery items from Firestore
 */
export async function fetchGroceryItemsFromCloud(userId: string): Promise<GroceryItem[]> {
  try {
    const listDoc = doc(db, 'users', userId, 'config', 'groceryList');
    // Implement standard fetching
    return [];
  } catch (error) {
    console.error('Firebase: Failed to load grocery list from cloud', error);
    return [];
  }
}
