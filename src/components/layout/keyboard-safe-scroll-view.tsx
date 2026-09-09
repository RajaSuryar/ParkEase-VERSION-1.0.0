import { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, ScrollViewProps, StyleProp, StyleSheet, ViewStyle } from 'react-native';

type KeyboardSafeScrollViewProps = ScrollViewProps & { children: ReactNode; contentContainerStyle?: StyleProp<ViewStyle> };
export function KeyboardSafeScrollView({ children, contentContainerStyle, ...props }: KeyboardSafeScrollViewProps) {
  return <KeyboardAvoidingView style={styles.flex} behavior={Platform.select({ ios: 'padding', default: undefined })}><ScrollView {...props} contentContainerStyle={[styles.content, contentContainerStyle]} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" showsVerticalScrollIndicator={false}>{children}</ScrollView></KeyboardAvoidingView>;
}
const styles = StyleSheet.create({ flex: { flex: 1 }, content: { flexGrow: 1 } });
