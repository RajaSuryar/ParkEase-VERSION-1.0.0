import { Href, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AuthScreen } from '@/components/layout/auth-screen';
import { OtpInput } from '@/components/auth/otp-input';
import { IconButton } from '@/components/ui/icon-button';
import { PrimaryButton } from '@/components/ui/primary-button';
import { authService, mockAuthDetails } from '@/services/auth-service';
import { useAppStore } from '@/store/app-store';
import { colors, spacing, typography } from '@/theme/tokens';

const formatPhone = (phone: string) => `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;
export default function OtpScreen() {
  const params = useLocalSearchParams<{ phone?: string }>();
  const phone = typeof params.phone === 'string' ? params.phone : '';
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(30);
  const setSession = useAppStore((state) => state.setSession);
  useEffect(() => { if (secondsRemaining === 0) return; const timer = setTimeout(() => setSecondsRemaining((value) => value - 1), 1000); return () => clearTimeout(timer); }, [secondsRemaining]);
  const verify = async () => { if (otp.length !== 6) { setError('Enter the complete 6-digit code.'); return; } setError(''); setIsLoading(true); try { const result = await authService.verifyOtp(phone, otp); if (result.requiresProfileSetup) router.replace(`/profile-setup?phone=${phone}` as Href); else if (result.session) { setSession(result.session); router.replace('/'); } } catch (verificationError) { setError(verificationError instanceof Error ? verificationError.message : 'We could not verify that code. Please try again.'); } finally { setIsLoading(false); } };
  const resend = async () => { setError(''); setIsLoading(true); try { await authService.sendOtp(phone); setSecondsRemaining(30); } catch { setError('We could not resend the code. Please try again.'); } finally { setIsLoading(false); } };
  return <AuthScreen><View style={styles.content}><View><IconButton icon="arrow-back" label="Change mobile number" onPress={() => router.back()} /><Text style={styles.title}>Verify your number</Text><Text style={styles.description}>Enter the 6-digit code sent to{`\n`}<Text style={styles.phone}>{formatPhone(phone)}</Text></Text></View><View style={styles.form}><OtpInput value={otp} onChange={(value) => { setOtp(value); setError(''); }} hasError={Boolean(error)} />{error ? <Text accessibilityLiveRegion="polite" style={styles.error}>{error}</Text> : null}<PrimaryButton label="Verify" icon="checkmark" disabled={otp.length !== 6} isLoading={isLoading} onPress={() => void verify()} />{__DEV__ ? <Text style={styles.devHint}>Development OTP: {mockAuthDetails.otp}</Text> : null}</View><View style={styles.resend}>{secondsRemaining > 0 ? <Text style={styles.resendText}>Resend code in {secondsRemaining}s</Text> : <Pressable accessibilityRole="button" onPress={() => void resend()}><Text style={styles.resendLink}>Resend OTP</Text></Pressable>}<Pressable accessibilityRole="button" onPress={() => router.back()}><Text style={styles.changeNumber}>Change number</Text></Pressable></View></View></AuthScreen>;
}
const styles = StyleSheet.create({ content: { flex: 1, justifyContent: 'space-between', paddingVertical: spacing.md }, title: { ...typography.title1, color: colors.textPrimary, marginTop: spacing.xxxl }, description: { ...typography.body, color: colors.textSecondary, marginTop: spacing.sm }, phone: { color: colors.textPrimary, fontWeight: '700' }, form: { gap: spacing.lg }, error: { ...typography.bodySmall, color: colors.error, textAlign: 'center' }, devHint: { ...typography.caption, color: colors.textTertiary, textAlign: 'center' }, resend: { alignItems: 'center', gap: spacing.lg, marginBottom: spacing.md }, resendText: { ...typography.bodySmall, color: colors.textSecondary }, resendLink: { ...typography.bodyStrong, color: colors.primary }, changeNumber: { ...typography.bodySmall, color: colors.primary, fontWeight: '700' } });
