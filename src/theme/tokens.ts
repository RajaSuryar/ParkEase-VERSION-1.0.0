import { Platform, TextStyle, ViewStyle } from 'react-native';

export const colors = {
  primary: '#2563EB', primaryPressed: '#1D4ED8', primarySoft: '#EAF1FF', primaryTextSoft: '#DCE8FF',
  background: '#F7F8FA', surface: '#FFFFFF', surfaceMuted: '#F3F4F6',
  textPrimary: '#111827', textSecondary: '#6B7280', textTertiary: '#9CA3AF', textOnPrimary: '#FFFFFF',
  border: '#E5E7EB', borderSubtle: '#EEF0F3', success: '#16A34A', successSoft: '#EAF7EE',
  warning: '#F59E0B', warningSoft: '#FFF7E5', error: '#DC2626', errorSoft: '#FEF0F0',
  mapBackground: '#E7EEF1', mapLine: '#C7D4D9',
} as const;

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32 } as const;
export const radius = { sm: 8, md: 12, lg: 16, xl: 24, full: 999 } as const;
const fontFamily = Platform.select({ ios: 'System', android: 'sans-serif', default: 'system-ui' });
export const typography: Record<string, TextStyle> = {
  display: { fontFamily, fontSize: 34, lineHeight: 41, fontWeight: '700', letterSpacing: -0.7 },
  title1: { fontFamily, fontSize: 28, lineHeight: 34, fontWeight: '700', letterSpacing: -0.5 },
  title2: { fontFamily, fontSize: 22, lineHeight: 28, fontWeight: '700', letterSpacing: -0.3 },
  title3: { fontFamily, fontSize: 18, lineHeight: 24, fontWeight: '700' },
  body: { fontFamily, fontSize: 16, lineHeight: 23, fontWeight: '400' },
  bodyStrong: { fontFamily, fontSize: 16, lineHeight: 23, fontWeight: '600' },
  bodySmall: { fontFamily, fontSize: 14, lineHeight: 20, fontWeight: '400' },
  caption: { fontFamily, fontSize: 12, lineHeight: 16, fontWeight: '500' },
  captionStrong: { fontFamily, fontSize: 12, lineHeight: 16, fontWeight: '700' },
};
export const shadows: Record<string, ViewStyle> = {
  card: { shadowColor: '#111827', shadowOpacity: 0.06, shadowRadius: 14, shadowOffset: { width: 0, height: 5 }, elevation: 2 },
  floating: { shadowColor: '#111827', shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 3 },
  elevated: { shadowColor: '#1D4ED8', shadowOpacity: 0.2, shadowRadius: 18, shadowOffset: { width: 0, height: 9 }, elevation: 5 },
  tabBar: { shadowColor: '#111827', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: -3 }, elevation: 12 },
};
