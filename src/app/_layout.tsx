import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from '@/theme/tokens';

export default function RootLayout() {
  return <SafeAreaProvider><StatusBar style="dark" /><Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background }, animation: 'fade' }}><Stack.Screen name="(public)" /><Stack.Screen name="(tabs)" /><Stack.Screen name="search" /><Stack.Screen name="results" /><Stack.Screen name="map" /><Stack.Screen name="parking/[id]" /><Stack.Screen name="booking-setup" /><Stack.Screen name="booking-time" /><Stack.Screen name="booking-slot" /><Stack.Screen name="vehicle-form" /><Stack.Screen name="vehicles" /><Stack.Screen name="checkout-placeholder" /><Stack.Screen name="booking-success" /><Stack.Screen name="booking-pass" /><Stack.Screen name="booking-details" /><Stack.Screen name="cancel-booking" /><Stack.Screen name="cancellation-success" /><Stack.Screen name="offers" /><Stack.Screen name="saved-parking" /><Stack.Screen name="notifications" /><Stack.Screen name="active-parking" /><Stack.Screen name="extend-parking" /></Stack></SafeAreaProvider>;
}
