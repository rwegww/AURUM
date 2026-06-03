import * as SecureStore from "expo-secure-store";

const memoryStore = new Map();
let secureStoreAvailability;

const isSecureStoreAvailable = async () => {
  if (!secureStoreAvailability) {
    secureStoreAvailability = SecureStore.isAvailableAsync().catch(() => false);
  }
  return secureStoreAvailability;
};

export const sessionKeys = {
  token: "aurum.token",
  sessionId: "aurum.sessionId",
  userId: "aurum.userId",
  authType: "aurum.authType"
};

export const sessionStore = {
  async get(key) {
    if (await isSecureStoreAvailable()) {
      return SecureStore.getItemAsync(key);
    }
    return memoryStore.get(key) || null;
  },

  async set(key, value) {
    if (await isSecureStoreAvailable()) {
      await SecureStore.setItemAsync(key, String(value));
      return;
    }
    memoryStore.set(key, String(value));
  },

  async remove(key) {
    if (await isSecureStoreAvailable()) {
      await SecureStore.deleteItemAsync(key);
      return;
    }
    memoryStore.delete(key);
  }
};

export const createSessionId = () => {
  const random = Math.random().toString(36).slice(2);
  return `mobile-${Date.now().toString(36)}-${random}`;
};
