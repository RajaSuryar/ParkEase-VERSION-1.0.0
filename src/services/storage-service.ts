import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const storageKeys = {
  onboardingCompleted: 'parkease.onboarding.completed',
  authSession: 'parkease.auth.session',
  userProfile: 'parkease.user.profile',
  locationIntroHandled: 'parkease.location.intro.handled',
  recentSearches: 'parkease.search.recent',
  vehicles: 'parkease.vehicles',
  bookings: 'parkease.bookings',
  payments: 'parkease.payments',
  bookingExtensions: 'parkease.booking.extensions',
  bookingCancellations: 'parkease.booking.cancellations',
  refunds: 'parkease.refunds',
  wallet: 'parkease.wallet',
  walletTransactions: 'parkease.wallet.transactions',
  favorites: 'parkease.favorites',
  savedPlaces: 'parkease.saved.places',
  notifications: 'parkease.notifications',
  notificationPreferences: 'parkease.notification.preferences',
  supportTickets: 'parkease.support.tickets',
  appSettings: 'parkease.app.settings',
} as const;

const webFallback = new Map<string, string>();

function getWebStorage(): Storage | null {
  if (Platform.OS !== 'web' || typeof globalThis.localStorage === 'undefined') return null;
  return globalThis.localStorage;
}

async function readItem(key: string): Promise<string | null> {
  if (Platform.OS !== 'web') return SecureStore.getItemAsync(key);

  try {
    return getWebStorage()?.getItem(key) ?? webFallback.get(key) ?? null;
  } catch {
    return webFallback.get(key) ?? null;
  }
}

async function writeItem(key: string, value: string): Promise<void> {
  if (Platform.OS !== 'web') {
    await SecureStore.setItemAsync(key, value);
    return;
  }

  try {
    getWebStorage()?.setItem(key, value);
  } catch {
    webFallback.set(key, value);
  }
}

async function removeItem(key: string): Promise<void> {
  if (Platform.OS !== 'web') {
    await SecureStore.deleteItemAsync(key);
    return;
  }

  try {
    getWebStorage()?.removeItem(key);
  } finally {
    webFallback.delete(key);
  }
}

async function readJson<T>(key: string): Promise<T | null> {
  const value = await readItem(key);
  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

async function writeJson<T>(key: string, value: T): Promise<void> {
  await writeItem(key, JSON.stringify(value));
}

export const storageService = {
  keys: storageKeys,
  readJson,
  writeJson,
  async readBoolean(key: string): Promise<boolean> {
    return (await readItem(key)) === 'true';
  },
  async writeBoolean(key: string, value: boolean): Promise<void> {
    await writeItem(key, String(value));
  },
  async remove(key: string): Promise<void> {
    await removeItem(key);
  },
};
