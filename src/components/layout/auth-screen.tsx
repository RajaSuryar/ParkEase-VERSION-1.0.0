import { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '@/theme/tokens';

export function AuthScreen({ children }: { children: ReactNode }) {
  return <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}><KeyboardAvoidingView style={styles.keyboard} behavior={Platform.select({ ios: 'padding', default: undefined })}><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" showsVerticalScrollIndicator={false}>{children}</ScrollView></KeyboardAvoidingView></SafeAreaView>;
}
const styles = StyleSheet.create({ safeArea: { flex: 1, backgroundColor: colors.background }, keyboard: { flex: 1 }, content: { flexGrow: 1, padding: spacing.lg, paddingBottom: spacing.xxxl } });
