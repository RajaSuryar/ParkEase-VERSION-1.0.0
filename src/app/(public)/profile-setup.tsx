import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AuthScreen } from '@/components/layout/auth-screen';
import { AppLogo } from '@/components/brand/app-logo';
import { FormTextInput } from '@/components/ui/form-text-input';
import { PrimaryButton } from '@/components/ui/primary-button';
import { authService } from '@/services/auth-service';
import { useAppStore } from '@/store/app-store';
import { colors, spacing, typography } from '@/theme/tokens';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export default function ProfileSetupScreen() {
  const params = useLocalSearchParams<{ phone?: string }>();
  const phone = typeof params.phone === 'string' ? params.phone : '';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const setSession = useAppStore((state) => state.setSession);
  const submit = async () => { const normalizedName = name.trim(); const normalizedEmail = email.trim(); const nextNameError = normalizedName ? '' : 'Enter your full name.'; const nextEmailError = normalizedEmail && !emailPattern.test(normalizedEmail) ? 'Enter a valid email address.' : ''; setNameError(nextNameError); setEmailError(nextEmailError); if (nextNameError || nextEmailError) return; setIsLoading(true); try { const session = await authService.completeProfile(phone, normalizedName, normalizedEmail); setSession(session); router.replace('/'); } catch { setNameError('We could not save your profile. Please try again.'); } finally { setIsLoading(false); } };
  return <AuthScreen><View style={styles.content}><View style={styles.intro}><AppLogo size={60} /><Text style={styles.title}>A few quick details</Text><Text style={styles.description}>This helps us personalise your ParkEase experience.</Text></View><View style={styles.form}><FormTextInput label="Full name" placeholder="Your name" autoCapitalize="words" value={name} onChangeText={(value) => { setName(value); setNameError(''); }} error={nameError} returnKeyType="next" /><FormTextInput label="Email address (optional)" placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" autoComplete="email" value={email} onChangeText={(value) => { setEmail(value); setEmailError(''); }} error={emailError} /><PrimaryButton label="Continue" icon="arrow-forward" isLoading={isLoading} onPress={() => void submit()} /></View></View></AuthScreen>;
}
const styles = StyleSheet.create({ content: { flex: 1, justifyContent: 'space-between', paddingVertical: spacing.xl }, intro: { gap: spacing.md, marginTop: spacing.xxxl }, title: { ...typography.title1, color: colors.textPrimary, marginTop: spacing.md }, description: { ...typography.body, color: colors.textSecondary, maxWidth: 300 }, form: { gap: spacing.lg } });
