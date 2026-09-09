import { StyleSheet, Text, View } from 'react-native';
import { colors, shadows, typography } from '@/theme/tokens';

export function AppLogo({ size = 72 }: { size?: number }) {
  return <View style={[styles.logo, { width: size, height: size, borderRadius: size * 0.3 }]} accessibilityLabel="ParkEase"><Text style={[styles.mark, { fontSize: size * 0.48 }]}>P</Text><View style={[styles.dot, { width: size * 0.15, height: size * 0.15, borderRadius: size }]} /></View>;
}
const styles = StyleSheet.create({ logo: { alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary, ...shadows.elevated }, mark: { ...typography.title1, color: colors.textOnPrimary, fontWeight: '800' }, dot: { position: 'absolute', right: '18%', bottom: '19%', backgroundColor: '#93C5FD', borderWidth: 2, borderColor: colors.primary } });
