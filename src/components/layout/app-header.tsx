import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '@/theme/tokens';

type AppHeaderProps = { eyebrow: string; title: string; right?: ReactNode };
export function AppHeader({ eyebrow, title, right }: AppHeaderProps) {
  return <SafeAreaView edges={['top']}><View style={styles.container}><View><Text style={styles.eyebrow}>{eyebrow}</Text><Text style={styles.title}>{title}</Text></View>{right}</View></SafeAreaView>;
}
const styles = StyleSheet.create({ container: { minHeight: 86, paddingVertical: spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, eyebrow: { ...typography.bodySmall, color: colors.textSecondary }, title: { ...typography.title1, color: colors.textPrimary, marginTop: 2 } });
