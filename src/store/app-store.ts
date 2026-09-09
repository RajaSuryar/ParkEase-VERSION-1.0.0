import { create } from 'zustand';
import { authService } from '@/services/auth-service';
import { locationService } from '@/services/location-service';
import { storageService } from '@/services/storage-service';
import { AuthSession, AuthState, LocationPermissionStatus } from '@/types/auth';
import { BookingDraft, ParkingFilters, ParkingSortOption, SearchLocation } from '@/types/domain';

export const defaultParkingFilters: ParkingFilters = { distanceKm: null, priceRange: null, availability: null, minimumRating: null, features: [], parkingTypes: [] };
export const emptyBookingDraft: BookingDraft = { parkingId: '', vehicleId: null, arrivalDateTime: null, durationMinutes: 120, exitDateTime: null, selectedSlotId: null, slotPreference: null, estimatedParkingAmount: 0 };

interface AppStore extends AuthState {
  initialize: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  setSession: (session: AuthSession) => void;
  setLocationPermission: (status: LocationPermissionStatus) => void;
  completeLocationIntro: () => Promise<void>;
  logout: () => Promise<void>;
  destination: SearchLocation | null;
  setDestination: (destination: SearchLocation | null) => void;
  parkingFilters: ParkingFilters;
  parkingSortOption: ParkingSortOption;
  setParkingFilters: (filters: ParkingFilters) => void;
  clearParkingFilters: () => void;
  setParkingSortOption: (sortOption: ParkingSortOption) => void;
  bookingDraft: BookingDraft;
  beginBooking: (parkingId: string) => void;
  updateBookingDraft: (draft: Partial<BookingDraft>) => void;
  resetBookingDraft: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  onboardingCompleted: false,
  locationIntroHandled: false,
  session: null,
  isInitializing: true,
  locationPermission: 'undetermined',
  destination: null,
  parkingFilters: defaultParkingFilters,
  parkingSortOption: 'recommended',
  bookingDraft: emptyBookingDraft,
  async initialize() {
    const [onboardingCompleted, locationIntroHandled, session, locationPermission] = await Promise.all([
      storageService.readBoolean(storageService.keys.onboardingCompleted),
      storageService.readBoolean(storageService.keys.locationIntroHandled),
      authService.getSession(),
      locationService.getPermissionStatus(),
    ]);
    set({ onboardingCompleted, locationIntroHandled, session, locationPermission, isInitializing: false });
  },
  async completeOnboarding() {
    await storageService.writeBoolean(storageService.keys.onboardingCompleted, true);
    set({ onboardingCompleted: true });
  },
  setSession(session) { set({ session }); },
  setLocationPermission(locationPermission) { set({ locationPermission }); },
  async completeLocationIntro() {
    await storageService.writeBoolean(storageService.keys.locationIntroHandled, true);
    set({ locationIntroHandled: true });
  },
  async logout() {
    await authService.logout();
    set({ session: null });
  },
  setDestination(destination) { set({ destination }); },
  setParkingFilters(parkingFilters) { set({ parkingFilters }); },
  clearParkingFilters() { set({ parkingFilters: defaultParkingFilters }); },
  setParkingSortOption(parkingSortOption) { set({ parkingSortOption }); },
  beginBooking(parkingId) { set({ bookingDraft: { ...emptyBookingDraft, parkingId } }); },
  updateBookingDraft(draft) { set((state) => ({ bookingDraft: { ...state.bookingDraft, ...draft } })); },
  resetBookingDraft() { set({ bookingDraft: emptyBookingDraft }); },
}));
