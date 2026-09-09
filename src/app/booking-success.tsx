import { Ionicons } from '@expo/vector-icons';
import { Href, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { QrPass } from '@/components/booking/qr-pass';
import { EmptyState } from '@/components/ui/empty-state';
import { PrimaryButton } from '@/components/ui/primary-button';
import { bookingService } from '@/services/booking-service';
import { Booking } from '@/types/domain';
import { formatBookingDateTime } from '@/utils/booking-time';
import { formatCurrency } from '@/utils/parking-formatters';
import { colors, radius, shadows, spacing, typography } from '@/theme/tokens';

export default function BookingSuccessScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let active = true;
    void bookingService.getBookingById(id).then((saved) => { if (active) { setBooking(saved); setLoaded(true); } });
    return () => { active = false; };
  }, [id]);
  if (!loaded) return <SafeAreaView style={styles.screen}><View style={styles.loading} /></SafeAreaView>;
  if (!booking) return <SafeAreaView style={styles.screen}><EmptyState icon="checkmark-circle-outline" title="Booking unavailable" description="This confirmation is no longer available. You can view your current bookings instead." actionLabel="My bookings" onAction={() => router.replace('/bookings')} /></SafeAreaView>;
  return <SafeAreaView style={styles.screen} edges={['top', 'bottom']}><ScrollView contentContainerStyle={styles.content}><View style={styles.successIcon}><Ionicons name="checkmark" size={42} color={colors.textOnPrimary} /></View><Text style={styles.title}>Parking confirmed</Text><Text style={styles.subtitle}>Your parking space is ready.</Text><View style={styles.reference}><Text style={styles.referenceLabel}>BOOKING ID</Text><Text style={styles.referenceValue}>{booking.bookingReference}</Text></View><View style={styles.card}><Text style={styles.name}>{booking.parkingName}</Text><Text style={styles.address}>{booking.parkingAddress}</Text><View style={styles.row}><Text style={styles.label}>Vehicle</Text><Text style={styles.value}>{booking.vehicleRegistration}</Text></View><View style={styles.row}><Text style={styles.label}>Slot</Text><Text style={styles.value}>{booking.slotPreference === 'any' ? 'Assigned on arrival' : booking.slotId?.split('-').at(-1)}</Text></View><View style={styles.row}><Text style={styles.label}>Entry</Text><Text style={styles.value}>{formatBookingDateTime(booking.entryTime)}</Text></View><View style={styles.row}><Text style={styles.label}>Exit</Text><Text style={styles.value}>{formatBookingDateTime(booking.exitTime)}</Text></View><View style={styles.total}><Text style={styles.totalLabel}>Amount paid</Text><Text style={styles.totalValue}>{formatCurrency(booking.totalAmount)}</Text></View></View><QrPass value={booking.bookingReference} /><Text style={styles.qrCaption}>Show this QR pass at the parking entrance.</Text><PrimaryButton label="View booking pass" icon="qr-code-outline" onPress={() => router.push(`/booking-pass?id=${booking.id}` as Href)} /><Pressable accessibilityRole="button" onPress={() => router.replace('/home' as Href)} style={styles.home}><Text style={styles.homeText}>Back to home</Text></Pressable></ScrollView></SafeAreaView>;
}
const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: colors.background }, content: { alignItems: 'center', padding: spacing.lg, paddingTop: spacing.xxxl, paddingBottom: spacing.xxxl }, successIcon: { width: 84, height: 84, alignItems: 'center', justifyContent: 'center', borderRadius: radius.full, backgroundColor: colors.success, ...shadows.elevated }, title: { ...typography.title1, color: colors.textPrimary, marginTop: spacing.lg }, subtitle: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs }, reference: { alignItems: 'center', marginTop: spacing.xl }, referenceLabel: { ...typography.captionStrong, color: colors.textSecondary, letterSpacing: 1 }, referenceValue: { ...typography.title2, color: colors.primary, marginTop: spacing.xs }, card: { alignSelf: 'stretch', gap: spacing.sm, marginTop: spacing.xl, padding: spacing.lg, borderRadius: radius.lg, backgroundColor: colors.surface, ...shadows.card }, name: { ...typography.title3, color: colors.textPrimary }, address: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: spacing.sm }, row: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md }, label: { ...typography.bodySmall, color: colors.textSecondary }, value: { ...typography.bodySmall, color: colors.textPrimary, textAlign: 'right', flex: 1 }, total: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.borderSubtle }, totalLabel: { ...typography.bodyStrong, color: colors.textPrimary }, totalValue: { ...typography.bodyStrong, color: colors.textPrimary }, qrCaption: { ...typography.caption, color: colors.textSecondary, textAlign: 'center', marginVertical: spacing.md }, home: { padding: spacing.md }, homeText: { ...typography.bodyStrong, color: colors.primary }, loading: { width: 180, height: 180, alignSelf: 'center', marginTop: 160, borderRadius: radius.lg, backgroundColor: colors.surfaceMuted } });
