import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '@/theme/tokens';

type QuickDestinationProps = { label: string; icon: keyof typeof Ionicons.glyphMap; onPress: () => void };
export function QuickDestination({ label, icon, onPress }: QuickDestinationProps) { return <Pressable accessibilityRole="button" accessibilityLabel={`Search parking near ${label}`} onPress={onPress} style={({ pressed }) => [styles.button, pressed && styles.pressed]}><View style={styles.icon}><Ionicons name={icon} size={18} color={colors.primary} /></View><Text numberOfLines={1} style={styles.label}>{label}</Text></Pressable>; }
const styles = StyleSheet.create({ button: { width: 64, minHeight: 78, alignItems: 'center', justifyContent: 'center', gap: spacing.sm }, pressed: { opacity: 0.78 }, icon: { width: 52, height: 52, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primarySoft, borderRadius: radius.lg }, label: { ...typography.caption, color: colors.textSecondary, textAlign: 'center' } });
