import { memo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { ParkingFacility } from '@/types/domain';
import { getAvailabilityStatus } from '@/utils/parking-formatters';
import { colors, radius, shadows, typography } from '@/theme/tokens';

export const ParkingMarker = memo(function ParkingMarker({ facility, selected, onSelect, position }: { facility: ParkingFacility; selected: boolean; onSelect: (facility: ParkingFacility) => void; position: { left: `${number}%`; top: `${number}%` } }) {
  const status = getAvailabilityStatus(facility);
  const backgroundColor = status === 'available' ? colors.primary : status === 'limited' ? colors.warning : colors.textTertiary;
  return <Pressable accessibilityRole="button" accessibilityLabel={`${facility.name}, ₹${facility.pricePerHour} per hour, ${status}${selected ? ', selected' : ''}`} accessibilityState={{ selected }} onPress={() => onSelect(facility)} style={[styles.marker, position, { backgroundColor }, selected && styles.selected]}><Text style={styles.label}>₹{facility.pricePerHour}</Text></Pressable>;
});
const styles = StyleSheet.create({ marker: { position: 'absolute', minWidth: 47, height: 32, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, borderRadius: radius.full, borderWidth: 2, borderColor: colors.surface, ...shadows.floating }, selected: { transform: [{ scale: 1.13 }], borderColor: colors.textPrimary }, label: { ...typography.captionStrong, color: colors.textOnPrimary } });
