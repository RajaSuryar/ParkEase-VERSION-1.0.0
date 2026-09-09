import { User } from '@/types/domain';

export interface AuthSession {
  token: string;
  user: User;
  createdAt: string;
}

export interface OtpVerificationResult {
  requiresProfileSetup: boolean;
  session?: AuthSession;
}

export type LocationPermissionStatus = 'undetermined' | 'granted' | 'denied' | 'unavailable';

export interface AuthState {
  onboardingCompleted: boolean;
  locationIntroHandled: boolean;
  session: AuthSession | null;
  isInitializing: boolean;
  locationPermission: LocationPermissionStatus;
}
