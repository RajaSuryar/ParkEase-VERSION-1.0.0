import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { FlatList, ListRenderItemInfo, NativeScrollEvent, NativeSyntheticEvent, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Href, router } from 'expo-router';
import { AppLogo } from '@/components/brand/app-logo';
import { PrimaryButton } from '@/components/ui/primary-button';
import { useAppStore } from '@/store/app-store';
import { colors, radius, spacing, typography } from '@/theme/tokens';

type OnboardingSlide = { title: string; description: string; icon: keyof typeof Ionicons.glyphMap; accent: string };
const slides: OnboardingSlide[] = [
  { title: 'Find Parking Faster', description: 'Discover available parking spaces around you and spend less time searching.', icon: 'navigate', accent: '#DBEAFE' },
  { title: 'Reserve Before You Arrive', description: 'Secure your parking space before reaching your destination.', icon: 'calendar', accent: '#E0E7FF' },
  { title: 'Park. Pay. Go.', description: 'Enjoy a simple parking experience with seamless digital payments.', icon: 'card', accent: '#DCFCE7' },
];

export default function OnboardingScreen() {
  const [page, setPage] = useState(0);
  const { width } = useWindowDimensions();
  const listRef = useRef<FlatList<OnboardingSlide>>(null);
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);
  const isFinalPage = page === slides.length - 1;

  const finish = async () => { await completeOnboarding(); router.replace('/welcome' as Href); };
  const next = () => { if (isFinalPage) { void finish(); return; } listRef.current?.scrollToIndex({ index: page + 1, animated: true }); };
  const onScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => setPage(Math.round(event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width));
  const renderSlide = ({ item }: ListRenderItemInfo<OnboardingSlide>) => <View style={[styles.slide, { width }]}><View style={[styles.illustration, { backgroundColor: item.accent }]}><View style={styles.orbitOne} /><View style={styles.orbitTwo} /><View style={styles.illustrationCore}><Ionicons name={item.icon} size={56} color={colors.primary} /></View><View style={styles.logoFloating}><AppLogo size={38} /></View></View><View style={styles.copy}><Text style={styles.title}>{item.title}</Text><Text style={styles.description}>{item.description}</Text></View></View>;

  return <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}><View style={styles.header}><AppLogo size={42} /><Pressable accessibilityRole="button" accessibilityLabel="Skip onboarding" onPress={() => void finish()} hitSlop={spacing.sm}><Text style={styles.skip}>Skip</Text></Pressable></View><FlatList ref={listRef} data={slides} renderItem={renderSlide} keyExtractor={(item) => item.title} horizontal pagingEnabled showsHorizontalScrollIndicator={false} onMomentumScrollEnd={onScrollEnd} bounces={false} /><View style={styles.bottom}><View accessibilityLabel={`Onboarding step ${page + 1} of ${slides.length}`} style={styles.indicators}>{slides.map((slide, index) => <View key={slide.title} style={[styles.indicator, page === index && styles.indicatorActive]} />)}</View><PrimaryButton label={isFinalPage ? 'Get Started' : 'Next'} icon={isFinalPage ? 'arrow-forward' : undefined} onPress={next} /></View></SafeAreaView>;
}
const styles = StyleSheet.create({ safeArea: { flex: 1, backgroundColor: colors.background }, header: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, skip: { ...typography.bodyStrong, color: colors.textSecondary }, slide: { flex: 1, paddingHorizontal: spacing.xl, justifyContent: 'center', gap: spacing.xxxl }, illustration: { height: 280, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', borderRadius: radius.xl }, illustrationCore: { width: 124, height: 124, alignItems: 'center', justifyContent: 'center', borderRadius: radius.full, backgroundColor: colors.surface }, logoFloating: { position: 'absolute', right: 34, bottom: 33 }, orbitOne: { position: 'absolute', width: 230, height: 230, borderRadius: radius.full, borderWidth: 1, borderColor: 'rgba(37, 99, 235, 0.16)' }, orbitTwo: { position: 'absolute', width: 340, height: 340, borderRadius: radius.full, borderWidth: 1, borderColor: 'rgba(37, 99, 235, 0.12)' }, copy: { alignItems: 'center' }, title: { ...typography.title1, color: colors.textPrimary, textAlign: 'center' }, description: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.md, maxWidth: 340 }, bottom: { padding: spacing.lg, gap: spacing.lg }, indicators: { height: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm }, indicator: { width: 8, height: 8, borderRadius: radius.full, backgroundColor: colors.border }, indicatorActive: { width: 26, backgroundColor: colors.primary } });
