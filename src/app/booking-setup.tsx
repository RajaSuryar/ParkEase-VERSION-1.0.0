import { Href, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookingHeader } from '@/components/booking/booking-header';
import { VehicleCard } from '@/components/booking/vehicle-card';
import { EmptyState } from '@/components/ui/empty-state';
import { PrimaryButton } from '@/components/ui/primary-button';
import { parkingService } from '@/services/parking-service';
import { vehicleService } from '@/services/vehicle-service';
import { useAppStore } from '@/store/app-store';
import { ParkingFacility, Vehicle } from '@/types/domain';
import { colors, spacing, typography } from '@/theme/tokens';

export default function BookingSetupScreen() {
  const { bookingDraft, updateBookingDraft } = useAppStore();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [facility, setFacility] = useState<ParkingFacility | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(bookingDraft.vehicleId);
  const [loading, setLoading] = useState(true);
  useEffect(() => { let active = true; void Promise.all([vehicleService.getVehicles(), parkingService.getParkingById(bookingDraft.parkingId)]).then(([savedVehicles, selectedParking]) => { if (active) { setVehicles(savedVehicles); setFacility(selectedParking); setSelectedId((current) => current ?? savedVehicles.find((vehicle) => vehicle.isDefault)?.id ?? null); setLoading(false); } }); return () => { active = false; }; }, [bookingDraft.parkingId]);
  const continueFlow = () => { if (!selectedId) return; updateBookingDraft({ vehicleId: selectedId }); router.push('/booking-time' as Href); };
  if (!facility && !loading) return <SafeAreaView style={styles.screen} edges={['top']}><EmptyState icon="car-outline" title="Start from a parking space" description="Choose a parking facility before starting a reservation." /></SafeAreaView>;
  return <SafeAreaView style={styles.screen} edges={['top']}><BookingHeader title="Select vehicle" subtitle="Choose the vehicle you’ll be parking." step={1} /><View style={styles.body}>{vehicles.length === 0 && !loading ? <EmptyState icon="car-outline" title="No vehicles added yet" description="Add a vehicle to start your reservation." actionLabel="Add your first vehicle" onAction={() => router.push('/vehicle-form?returnTo=booking' as Href)} /> : <><FlatList data={vehicles} keyExtractor={(item) => item.id} renderItem={({ item }) => <VehicleCard vehicle={item} selected={selectedId === item.id} onPress={() => setSelectedId(item.id)} onEdit={() => router.push(`/vehicle-form?id=${item.id}&returnTo=booking` as Href)} />} contentContainerStyle={styles.list} ListHeaderComponent={facility ? <Text style={styles.parkingName}>{facility.name}</Text> : null} /><PrimaryButton label="Add vehicle" icon="add-circle-outline" style={styles.add} onPress={() => router.push('/vehicle-form?returnTo=booking' as Href)} /></>}</View>{vehicles.length ? <View style={styles.cta}><PrimaryButton label="Continue" icon="arrow-forward" disabled={!selectedId} onPress={continueFlow} /></View> : null}</SafeAreaView>;
}
const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: colors.background }, body: { flex: 1, paddingHorizontal: spacing.lg }, parkingName: { ...typography.captionStrong, color: colors.textSecondary, paddingTop: spacing.lg }, list: { gap: spacing.sm, paddingTop: spacing.sm, paddingBottom: spacing.md }, add: { marginBottom: spacing.md }, cta: { padding: spacing.lg, backgroundColor: colors.surface } });
