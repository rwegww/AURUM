import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const SECURE_KEYS = new Set(['token', 'sessionId', 'authType', 'userId']);

export const mobileStorage = {
  async getItem(key: string) {
    if (SECURE_KEYS.has(key)) return SecureStore.getItemAsync(key);
    return AsyncStorage.getItem(key);
  },
  async setItem(key: string, value: string) {
    if (SECURE_KEYS.has(key)) return SecureStore.setItemAsync(key, value);
    return AsyncStorage.setItem(key, value);
  },
  async removeItem(key: string) {
    if (SECURE_KEYS.has(key)) return SecureStore.deleteItemAsync(key);
    return AsyncStorage.removeItem(key);
  },
  async multiRemove(keys: string[]) {
    await Promise.all(keys.map((key) => mobileStorage.removeItem(key)));
  },
};

export const activityStorageKey = 'aurum_user_activity_history';
