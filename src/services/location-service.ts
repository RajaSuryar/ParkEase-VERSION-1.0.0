import * as Location from 'expo-location';
import { Linking } from 'react-native';
import { LocationPermissionStatus } from '@/types/auth';
import { MapCoordinate } from '@/types/domain';

function normalize(status: Location.PermissionStatus): LocationPermissionStatus {
  if (status === Location.PermissionStatus.GRANTED) return 'granted';
  if (status === Location.PermissionStatus.DENIED) return 'denied';
  return 'undetermined';
}

export const locationService = {
  async getPermissionStatus(): Promise<LocationPermissionStatus> {
    try {
      const result = await Location.getForegroundPermissionsAsync();
      return normalize(result.status);
    } catch {
      return 'unavailable';
    }
  },
  async requestPermission(): Promise<LocationPermissionStatus> {
    try {
      const result = await Location.requestForegroundPermissionsAsync();
      return normalize(result.status);
    } catch {
      return 'unavailable';
    }
  },
  async openSettings(): Promise<void> {
    await Linking.openSettings();
  },
  async getCurrentCoordinate(): Promise<MapCoordinate | null> {
    try {
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      return { latitude: location.coords.latitude, longitude: location.coords.longitude };
    } catch {
      return null;
    }
  },
  async getCurrentLocationLabel(): Promise<string | null> {
    const coordinate = await this.getCurrentCoordinate();
    if (!coordinate) return null;
    try {
      const [address] = await Location.reverseGeocodeAsync(coordinate);
      return [address.district, address.city].filter(Boolean).join(', ') || 'Current Location';
    } catch {
      return 'Current Location';
    }
  },
};
