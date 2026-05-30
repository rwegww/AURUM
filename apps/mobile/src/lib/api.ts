import Constants from 'expo-constants';
import { createAurumApiClient, DEFAULT_API_URL } from '@aurum/shared/api';

const configuredUrl =
  process.env.EXPO_PUBLIC_API_URL ||
  (Constants.expoConfig?.extra?.apiUrl as string | undefined) ||
  DEFAULT_API_URL;

export const api = createAurumApiClient(configuredUrl);
export const apiBaseUrl = api.baseUrl;
