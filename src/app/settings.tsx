import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { locationService } from '@/services/location-service';
import { notificationService } from '@/services/notification-service';
import { AppSettings, settingsService } from '@/services/settings-service';
import { NotificationPreferences } from '@/types/domain';
import { colors, radius, spacing, typography } from '@/theme/tokens';

const notificationLabels: Record<keyof NotificationPreferences, string> = {
  bookingUpdates: 'Booking Updates', parkingReminders: 'Parking Reminders', paymentUpdates: 'Payment Updates', offers: 'Offers & Promotions',
};

export default function SettingsScreen() {
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [location, setLocation] = useState('Checking…');
  useEffect(() => {
    void notificationService.getPreferences().then(setPreferences);
    void settingsService.getSettings().then(setSettings);
    void locationService.getPermissionStatus().then(setLocation);
  }, []);
  const toggle = async (key: keyof NotificationPreferences) => {
    if (preferences) setPreferences(await notificationService.updatePreferences({ [key]: !preferences[key] }));
  };
  const choose = async (key: keyof AppSettings, value: AppSettings[typeof key]) => {
    setSettings(await settingsService.update({ [key]: value }));
  };
  return <SafeAreaView style={styles.screen}><ScrollView contentContainerStyle={styles.content}>
    <Text style={styles.title}>Settings</Text>
    <Section title="Notifications"><View style={styles.card}>{preferences &&
      (Object.entries(preferences) as [keyof NotificationPreferences, boolean][]).map(([key, value], index) =>
        <Pressable key={key} accessibilityRole="switch" accessibilityState={{ checked: value }} onPress={() => void toggle(key)} style={[styles.row, index < Object.keys(preferences).length - 1 && styles.divider]}>
          <Text style={styles.rowText}>{notificationLabels[key]}</Text>
          <Switch value={value} pointerEvents="none" trackColor={{ false: colors.border, true: colors.primary }} thumbColor={colors.surface} />
        </Pressable>)}</View></Section>
    <Section title="Location"><View style={styles.card}><Pressable onPress={() => void locationService.openSettings()} style={styles.row}>
      <View style={styles.flex}><Text style={styles.rowText}>Location Access</Text><Text style={styles.subText}>Used for nearby parking and distance</Text></View>
      <Text style={styles.value}>{location}</Text><Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
    </Pressable></View></Section>
    <Section title="Appearance"><View style={styles.card}>{(['system', 'light', 'dark'] as const).map((option, index) =>
      <Pressable key={option} accessibilityRole="radio" accessibilityState={{ selected: settings?.appearance === option }} onPress={() => void choose('appearance', option)} style={[styles.row, index < 2 && styles.divider]}>
        <Text style={styles.rowText}>{option === 'system' ? 'System Default' : option[0].toUpperCase() + option.slice(1)}</Text>
        <Ionicons name={settings?.appearance === option ? 'radio-button-on' : 'radio-button-off'} size={20} color={settings?.appearance === option ? colors.primary : colors.textTertiary} />
      </Pressable>)}</View></Section>
    <Section title="Language"><View style={styles.card}>
      <Pressable onPress={() => void choose('language', 'en')} style={[styles.row, styles.divider]}><View style={styles.flex}><Text style={styles.rowText}>English</Text><Text style={styles.subText}>Available now</Text></View><Ionicons name={settings?.language === 'en' ? 'radio-button-on' : 'radio-button-off'} size={20} color={settings?.language === 'en' ? colors.primary : colors.textTertiary} /></Pressable>
      <Pressable onPress={() => void choose('language', 'ta')} style={styles.row}><View style={styles.flex}><Text style={styles.rowText}>Tamil</Text><Text style={styles.subText}>Coming soon</Text></View><Ionicons name={settings?.language === 'ta' ? 'radio-button-on' : 'radio-button-off'} size={20} color={settings?.language === 'ta' ? colors.primary : colors.textTertiary} /></Pressable>
    </View></Section>
    <Section title="Privacy & Security"><View style={styles.card}><Pressable accessibilityRole="button" onPress={() => router.push('/privacy-security' as never)} style={styles.row}><Text style={styles.rowText}>Privacy & Security</Text><Ionicons name="chevron-forward" size={18} color={colors.textTertiary} /></Pressable></View></Section>
  </ScrollView></SafeAreaView>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <View><Text style={styles.heading}>{title.toUpperCase()}</Text>{children}</View>;
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background }, content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxxl }, title: { ...typography.title1, color: colors.textPrimary }, heading: { ...typography.captionStrong, color: colors.textTertiary, marginBottom: spacing.sm, letterSpacing: 0.5 }, card: { borderWidth: 1, borderColor: colors.borderSubtle, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: colors.surface }, row: { minHeight: 58, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.md }, divider: { borderBottomWidth: 1, borderBottomColor: colors.borderSubtle }, flex: { flex: 1 }, rowText: { ...typography.bodyStrong, color: colors.textPrimary }, subText: { ...typography.caption, color: colors.textSecondary, marginTop: 2 }, value: { ...typography.bodySmall, color: colors.textSecondary },
});
