import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const canUseWebStorage = () =>
  Platform.OS === 'web' && typeof globalThis.localStorage !== 'undefined';

export async function getStoredItem(key) {
  if (canUseWebStorage()) return globalThis.localStorage.getItem(key);
  return SecureStore.getItemAsync(key);
}

export async function setStoredItem(key, value) {
  if (canUseWebStorage()) {
    globalThis.localStorage.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

export async function removeStoredItem(key) {
  if (canUseWebStorage()) {
    globalThis.localStorage.removeItem(key);
    return;
  }
  await SecureStore.deleteItemAsync(key);
}

