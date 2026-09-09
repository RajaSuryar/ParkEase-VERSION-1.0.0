import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '@/theme/tokens';

type IconButtonProps = { icon: keyof typeof Ionicons.glyphMap; label: string; onPress?: () => void };
export function IconButton({ icon, label, onPress }: IconButtonProps) { return <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} hitSlop={spacing.sm} style={({ pressed }) => [styles.button, pressed && styles.pressed]}><Ionicons name={icon} size={21} color={colors.textPrimary} /></Pressable>; }
const styles = StyleSheet.create({ button: { width: 44, height: 44, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.borderSubtle, backgroundColor: colors.surface }, pressed: { backgroundColor: colors.surfaceMuted, opacity: 0.82 } });
