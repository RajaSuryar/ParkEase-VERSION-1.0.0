import { Href, router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ParkingCard } from '@/components/parking/parking-card';
import { EmptyState } from '@/components/ui/empty-state';
import { favoritesService } from '@/services/favorites-service';
import { ParkingFacility } from '@/types/domain';
import { colors, spacing, typography } from '@/theme/tokens';
export default function SavedParkingScreen() { const [items, setItems] = useState<ParkingFacility[]>([]); useFocusEffect(useCallback(() => { void favoritesService.getFavorites().then(setItems); }, [])); return <SafeAreaView style={styles.screen}><Text style={styles.title}>Saved Parking</Text><FlatList data={items} keyExtractor={(item) => item.id} contentContainerStyle={items.length ? styles.list : styles.empty} renderItem={({ item }) => <ParkingCard facility={item} variant="list" />} ListEmptyComponent={<EmptyState icon="heart-outline" title="No saved parking yet." description="Tap the heart on a parking location to save it here." actionLabel="Explore Parking" onAction={() => router.push('/results' as Href)} />} /></SafeAreaView>; }
const styles = StyleSheet.create({ screen: { flex: 1, padding: spacing.lg, backgroundColor: colors.background }, title: { ...typography.title1, color: colors.textPrimary, marginBottom: spacing.lg }, list: { gap: spacing.md, paddingBottom: spacing.xxxl }, empty: { flexGrow: 1 } });
