import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '@/components/ui/primary-button';
import { colors, radius, spacing, typography } from '@/theme/tokens';

export function ErrorState({ title, description, onRetry }: { title: string; description: string; onRetry: () => void }) { return <View style={styles.container}><View style={styles.icon}><Ionicons name="cloud-offline-outline" size={28} color={colors.primary} /></View><Text style={styles.title}>{title}</Text><Text style={styles.description}>{description}</Text><PrimaryButton label="Try Again" icon="refresh-outline" onPress={onRetry} style={styles.button} /></View>; }
const styles = StyleSheet.create({ container: { alignItems: 'center', padding: spacing.xxl, borderRadius: radius.xl, backgroundColor: colors.surface }, icon: { width: 58, height: 58, alignItems: 'center', justifyContent: 'center', borderRadius: radius.full, backgroundColor: colors.primarySoft }, title: { ...typography.title3, color: colors.textPrimary, marginTop: spacing.md }, description: { ...typography.bodySmall, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm }, button: { alignSelf: 'stretch', marginTop: spacing.lg } });
