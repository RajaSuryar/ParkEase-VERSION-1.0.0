import { Href, router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AuthScreen } from '@/components/layout/auth-screen';
import { IconButton } from '@/components/ui/icon-button';
import { FormTextInput } from '@/components/ui/form-text-input';
import { PrimaryButton } from '@/components/ui/primary-button';
import { authService } from '@/services/auth-service';
import { colors, spacing, typography } from '@/theme/tokens';

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const valid = /^\d{10}$/.test(phoneNumber);
  const submit = async () => { if (!valid) { setError('Enter a valid 10-digit mobile number.'); return; } setError(''); setIsLoading(true); try { await authService.sendOtp(phoneNumber); router.push(`/otp?phone=${phoneNumber}` as Href); } catch (requestError) { setError(requestError instanceof Error ? requestError.message : 'We could not send a code. Please try again.'); } finally { setIsLoading(false); } };
  return <AuthScreen><View style={styles.content}><View><IconButton icon="arrow-back" label="Back" onPress={() => router.back()} /><Text style={styles.title}>Enter your mobile number</Text><Text style={styles.description}>We’ll send you a verification code.</Text></View><View style={styles.form}><FormTextInput label="Mobile number" prefix="+91" placeholder="10-digit mobile number" keyboardType="phone-pad" textContentType="telephoneNumber" maxLength={10} value={phoneNumber} onChangeText={(text) => { setPhoneNumber(text.replace(/\D/g, '')); setError(''); }} error={error} /><PrimaryButton label="Continue" icon="arrow-forward" disabled={!valid} isLoading={isLoading} onPress={() => void submit()} /></View><Text style={styles.helper}>We use your number only to secure your account and parking bookings.</Text></View></AuthScreen>;
}
const styles = StyleSheet.create({ content: { flex: 1, justifyContent: 'space-between', paddingVertical: spacing.md }, title: { ...typography.title1, color: colors.textPrimary, marginTop: spacing.xxxl }, description: { ...typography.body, color: colors.textSecondary, marginTop: spacing.sm }, form: { gap: spacing.xl }, helper: { ...typography.caption, color: colors.textTertiary, textAlign: 'center', marginBottom: spacing.md } });
