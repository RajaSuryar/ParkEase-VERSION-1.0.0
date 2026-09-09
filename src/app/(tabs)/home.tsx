import { Ionicons } from '@expo/vector-icons';
import { Href, router } from 'expo-router';
import { FlatList, Pressable, RefreshControl, ScrollView, StyleSheet, Text } from 'react-native';
import { AppHeader } from '@/components/layout/app-header';
import { QuickDestination } from '@/components/discovery/quick-destination';
import { MapPreviewCard } from '@/components/map/map-preview-card';
import { ParkingCard } from '@/components/parking/parking-card';
import { ParkingCardSkeleton } from '@/components/feedback/parking-card-skeleton';
import { ErrorState } from '@/components/ui/error-state';
import { EmptyState } from '@/components/ui/empty-state';
import { IconButton } from '@/components/ui/icon-button';
import { SearchBar } from '@/components/ui/search-bar';
import { SectionHeader } from '@/components/ui/section-header';
import { useCurrentLocation } from '@/hooks/use-current-location';
import { useParkingDiscovery } from '@/hooks/use-parking-discovery';
import { useAppStore } from '@/store/app-store';
import { savedPlaceService } from '@/services/saved-place-service';
import { getGreeting } from '@/utils/greeting';
import { colors, spacing, typography } from '@/theme/tokens';

const quickPlaces: { label: string; icon: keyof typeof Ionicons.glyphMap }[] = [{ label: 'Home', icon: 'home-outline' }, { label: 'Work', icon: 'briefcase-outline' }, { label: 'Mall', icon: 'bag-handle-outline' }, { label: 'Airport', icon: 'airplane-outline' }, { label: 'Hospital', icon: 'medkit-outline' }, { label: 'Add Place', icon: 'add-outline' }];
export default function HomeScreen() {
  const user = useAppStore((state) => state.session?.user); const setDestination = useAppStore((state) => state.setDestination);
  const { label: locationLabel, hasLocation, refresh: refreshLocation } = useCurrentLocation();
  const { facilities, state, refresh } = useParkingDiscovery();
  const onRefresh = async () => { await Promise.all([refresh(), refreshLocation()]); };
  const openSearch = () => router.push('/search' as Href);
  const openQuickPlace = async (label: string) => { const type = label.toLowerCase() as 'home' | 'work'; if (type !== 'home' && type !== 'work') { openSearch(); return; } const places = await savedPlaceService.getSavedPlaces(); const place = places.find((item) => item.type === type || item.label.toLowerCase() === type); if (!place) { router.push(`/saved-place-form?type=${type}` as Href); return; } setDestination({ id: place.id, name: place.label, subtitle: place.address, latitude: place.latitude, longitude: place.longitude, category: 'saved' }); router.push('/results' as Href); };
  return <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={state === 'loading' && facilities.length > 0} onRefresh={() => void onRefresh()} tintColor={colors.primary} />}>
    <AppHeader eyebrow={getGreeting()} title={user?.name || 'ParkEase'} right={<IconButton icon="person-outline" label="Open profile" onPress={() => router.push('/profile' as Href)} />} />
    <Pressable accessibilityRole="button" accessibilityLabel="Choose parking location" onPress={openSearch} style={styles.locationRow}><Ionicons name={hasLocation ? 'location' : 'location-outline'} size={17} color={colors.primary} /><Text numberOfLines={1} style={styles.locationText}>{locationLabel}</Text><Ionicons name="chevron-down" size={16} color={colors.textSecondary} /></Pressable>
    <SearchBar placeholder="Where do you want to park?" onPress={openSearch} />
    <SectionHeader title="Where are you going?" />
    <FlatList horizontal data={quickPlaces} keyExtractor={(item) => item.label} renderItem={({ item }) => <QuickDestination {...item} onPress={() => void openQuickPlace(item.label)} />} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickPlaces} />
    <SectionHeader title="Parking near you" actionLabel="View all" onAction={() => router.push('/results' as Href)} />
    {state === 'loading' && facilities.length === 0 ? <FlatList horizontal data={[1, 2, 3]} keyExtractor={String} renderItem={() => <ParkingCardSkeleton />} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardList} /> : null}
    {state === 'error' ? <ErrorState title="We couldn't load nearby parking" description="Please check your connection and try again." onRetry={() => void refresh()} /> : null}
    {state === 'ready' && facilities.length === 0 ? <EmptyState icon="car-outline" title="No parking found nearby" description="Try searching another area or expand your search." /> : null}
    {state === 'ready' && facilities.length > 0 ? <><Text style={styles.sectionHint}>Based on your current location</Text><FlatList horizontal data={facilities.slice(0, 6)} keyExtractor={(item) => item.id} renderItem={({ item }) => <ParkingCard facility={item} />} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardList} /></> : null}
    <MapPreviewCard />
  </ScrollView>;
}
const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: colors.background }, content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl, gap: spacing.lg }, locationRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: -spacing.md }, locationText: { ...typography.bodySmall, color: colors.textSecondary, flex: 1 }, quickPlaces: { gap: spacing.md, paddingRight: spacing.lg }, cardList: { gap: spacing.md, paddingRight: spacing.lg }, sectionHint: { ...typography.bodySmall, color: colors.textSecondary, marginTop: -spacing.md } });
