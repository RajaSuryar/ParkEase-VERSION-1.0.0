import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { QrPass } from '@/components/booking/qr-pass';
import { EmptyState } from '@/components/ui/empty-state';
import { bookingService } from '@/services/booking-service';
import { Booking, BookingExtension } from '@/types/domain';
import { getBookingTemporalStatus } from '@/utils/booking-lifecycle';
import { formatBookingDateTime } from '@/utils/booking-time';
import { formatCurrency } from '@/utils/parking-formatters';
import { colors, radius, shadows, spacing, typography } from '@/theme/tokens';

export default function BookingPassScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();
  const qrSize = Math.max(160, Math.min(220, width - spacing.lg * 2 - spacing.xl * 2 - 24));
  const [booking, setBooking] = useState<Booking | null>(null);
  const [extensions, setExtensions] = useState<BookingExtension[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    void Promise.all([bookingService.getBookingById(id), bookingService.getExtensions(id)]).then(([savedBooking, savedExtensions]) => {
      if (!active) return;
      setBooking(savedBooking);
      setExtensions(savedExtensions);
      setLoaded(true);
    });
    return () => { active = false; };
  }, [id]);

  if (!loaded) return <SafeAreaView style={styles.screen} />;
  if (!booking) return <SafeAreaView style={styles.screen}><EmptyState icon="ticket-outline" title="Parking pass unavailable" description="This booking may have been removed. Return to your bookings to choose another pass." actionLabel="My bookings" onAction={() => router.replace('/bookings')} /></SafeAreaView>;

  const temporal = getBookingTemporalStatus(booking);
  const isCancelled = booking.status === 'cancelled';
  const passStatus = isCancelled ? 'CANCELLED' : temporal === 'active' || temporal === 'endingSoon' ? 'ACTIVE' : temporal === 'upcoming' ? 'CONFIRMED' : 'EXPIRED';
  const receiptRows = [['Parking charge', booking.priceBreakdown.parkingCharge], ['Convenience fee', booking.priceBreakdown.convenienceFee], ['Taxes', booking.priceBreakdown.taxAmount], ['Discount', -booking.priceBreakdown.discountAmount], ['Paid', booking.totalAmount]];

  return <SafeAreaView style={styles.screen} edges={['top']}><View style={styles.header}><Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={() => router.back()} style={styles.back}><Ionicons name="arrow-back" size={20} color={colors.textPrimary} /></Pressable><Text style={styles.title}>Parking pass</Text></View><ScrollView contentContainerStyle={styles.content}><View style={[styles.pass, isCancelled && styles.cancelledPass]}><Text style={[styles.status, isCancelled && styles.cancelledStatus]}>{passStatus}</Text><Text numberOfLines={2} style={[styles.name, isCancelled && styles.cancelledName]}>{booking.parkingName}</Text><Text numberOfLines={2} style={[styles.address, isCancelled && styles.cancelledAddress]}>{booking.parkingAddress}</Text>{isCancelled ? <Text style={styles.cancelledMessage}>This QR pass is no longer valid for entry.</Text> : <View style={styles.qr}><QrPass value={booking.bookingReference} size={qrSize} /></View>}<Text style={[styles.reference, isCancelled && styles.cancelledName]}>{booking.bookingReference}</Text><Text style={[styles.entry, isCancelled && styles.cancelledAddress]}>Entry: {formatBookingDateTime(booking.entryTime)}</Text><View style={styles.passRow}><Text style={[styles.passLabel, isCancelled && styles.cancelledAddress]}>Vehicle</Text><Text numberOfLines={1} style={[styles.passValue, isCancelled && styles.cancelledName]}>{booking.vehicleRegistration}</Text></View><View style={styles.passRow}><Text style={[styles.passLabel, isCancelled && styles.cancelledAddress]}>Slot</Text><Text numberOfLines={1} style={[styles.passValue, isCancelled && styles.cancelledName]}>{booking.slotPreference === 'any' ? 'Assigned on arrival' : booking.slotId?.split('-').at(-1)}</Text></View></View><Text style={styles.receiptTitle}>Receipt</Text><View style={styles.receipt}>{receiptRows.map(([label, amount]) => <View key={label} style={styles.receiptRow}><Text style={styles.receiptLabel}>{label}</Text><Text style={styles.receiptValue}>{Number(amount) < 0 ? '-' : ''}{formatCurrency(Math.abs(Number(amount)))}</Text></View>)}</View>{extensions.length ? <><Text style={styles.receiptTitle}>Extensions</Text><View style={styles.receipt}>{extensions.map((extension) => <View key={extension.id} style={styles.receiptRow}><View><Text style={styles.receiptLabel}>+{Math.round(extension.addedMinutes / 60 * 10) / 10} hr parking</Text><Text style={styles.extensionDate}>New exit: {formatBookingDateTime(extension.newExitDateTime)}</Text></View><Text style={styles.receiptValue}>{formatCurrency(extension.amount)}</Text></View>)}</View></> : null}</ScrollView></SafeAreaView>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background }, header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg }, back: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: radius.full, backgroundColor: colors.surface }, title: { ...typography.title2, color: colors.textPrimary }, content: { padding: spacing.lg, paddingTop: 0, gap: spacing.xl }, pass: { alignItems: 'center', padding: spacing.xl, borderRadius: radius.xl, backgroundColor: colors.primary, ...shadows.elevated }, cancelledPass: { backgroundColor: colors.errorSoft, shadowOpacity: 0 }, status: { ...typography.captionStrong, color: colors.primaryTextSoft, letterSpacing: 1 }, cancelledStatus: { color: colors.error }, name: { ...typography.title2, color: colors.textOnPrimary, textAlign: 'center', marginTop: spacing.sm }, cancelledName: { color: colors.textPrimary }, address: { ...typography.bodySmall, color: colors.primaryTextSoft, textAlign: 'center', marginTop: spacing.xs }, cancelledAddress: { color: colors.textSecondary }, qr: { marginVertical: spacing.lg }, cancelledMessage: { ...typography.bodyStrong, color: colors.error, textAlign: 'center', marginVertical: spacing.lg }, reference: { ...typography.bodyStrong, color: colors.textOnPrimary }, entry: { ...typography.bodySmall, color: colors.primaryTextSoft, marginTop: spacing.sm }, passRow: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm }, passLabel: { ...typography.caption, color: colors.primaryTextSoft }, passValue: { ...typography.captionStrong, color: colors.textOnPrimary }, receiptTitle: { ...typography.title3, color: colors.textPrimary }, receipt: { gap: spacing.sm, padding: spacing.md, borderRadius: radius.lg, backgroundColor: colors.surface, ...shadows.card }, receiptRow: { flexDirection: 'row', justifyContent: 'space-between' }, receiptLabel: { ...typography.bodySmall, color: colors.textSecondary }, receiptValue: { ...typography.bodySmall, color: colors.textPrimary }, extensionDate: { ...typography.caption, color: colors.textTertiary, marginTop: 2 },
});
