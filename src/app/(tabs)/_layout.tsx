import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { colors, radius, shadows, spacing, typography } from '@/theme/tokens';

const tabIcons: Record<string, keyof typeof Ionicons.glyphMap> = { home: 'home-outline', bookings: 'calendar-outline', activity: 'car-sport-outline', wallet: 'wallet-outline', profile: 'person-outline' };
export default function TabLayout() {
  return <Tabs screenOptions={({ route }) => ({ headerShown: false, tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.textTertiary, tabBarLabelStyle: { ...typography.captionStrong, marginTop: 1 }, tabBarStyle: { height: 72, paddingTop: spacing.sm, paddingBottom: spacing.sm, backgroundColor: colors.surface, borderTopColor: colors.borderSubtle, borderTopWidth: 1, ...shadows.tabBar }, tabBarItemStyle: { borderRadius: radius.md }, tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? tabIcons[route.name].replace('-outline', '') as keyof typeof Ionicons.glyphMap : tabIcons[route.name]} color={color} size={22} /> })}><Tabs.Screen name="home" options={{ title: 'Home' }} /><Tabs.Screen name="bookings" options={{ title: 'Bookings' }} /><Tabs.Screen name="activity" options={{ title: 'Parking' }} /><Tabs.Screen name="wallet" options={{ title: 'Wallet' }} /><Tabs.Screen name="profile" options={{ title: 'Profile' }} /></Tabs>;
}
