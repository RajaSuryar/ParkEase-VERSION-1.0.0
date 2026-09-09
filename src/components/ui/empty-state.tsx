import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '@/components/ui/primary-button';
import { colors, radius, spacing, typography } from '@/theme/tokens';

type EmptyStateProps = { icon: keyof typeof Ionicons.glyphMap; title: string; description: string; actionLabel?: string; onAction?: () => void };
export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) { return <View style={styles.container}><View style={styles.icon}><Ionicons name={icon} size={30} color={colors.primary} /></View><Text style={styles.title}>{title}</Text><Text style={styles.description}>{description}</Text>{actionLabel && onAction ? <PrimaryButton label={actionLabel} variant="secondary" onPress={onAction} style={styles.action} /> : null}</View>; }
const styles = StyleSheet.create({ container: { flex: 1, minHeight: 260, justifyContent: 'center', alignItems: 'center', paddingHorizontal: spacing.xxl }, icon: { width: 70, height: 70, justifyContent: 'center', alignItems: 'center', borderRadius: radius.full, backgroundColor: colors.primarySoft, marginBottom: spacing.lg }, title: { ...typography.title3, color: colors.textPrimary, textAlign: 'center' }, description: { ...typography.bodySmall, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm, maxWidth: 280 }, action: { alignSelf: 'center', minWidth: 164, marginTop: spacing.lg } });
