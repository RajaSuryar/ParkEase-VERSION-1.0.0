import { Href, Redirect } from 'expo-router';
import { useEffect } from 'react';
import { AppSplash } from '@/components/feedback/app-splash';
import { useAppStore } from '@/store/app-store';

export default function Index() {
  const { initialize, isInitializing, onboardingCompleted, session, locationIntroHandled } = useAppStore();
  useEffect(() => { void initialize(); }, [initialize]);

  if (isInitializing) return <AppSplash />;
  if (!onboardingCompleted) return <Redirect href={'/onboarding' as Href} />;
  if (!session) return <Redirect href={'/welcome' as Href} />;
  if (!locationIntroHandled) return <Redirect href={'/location-permission' as Href} />;
  return <Redirect href="/(tabs)/home" />;
}
