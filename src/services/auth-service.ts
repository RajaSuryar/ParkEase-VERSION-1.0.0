import { AuthSession, OtpVerificationResult } from '@/types/auth';
import { User } from '@/types/domain';
import { storageService } from '@/services/storage-service';
import { favoritesService } from '@/services/favorites-service';

const mockOtp = '123456';
const networkDelayMs = 450;

function wait(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, networkDelayMs));
}

function createSession(user: User): AuthSession {
  return { token: `mock-session-${user.id}`, user, createdAt: new Date().toISOString() };
}

export const authService = {
  async sendOtp(phoneNumber: string): Promise<void> {
    await wait();
    if (!/^\d{10}$/.test(phoneNumber)) throw new Error('Enter a valid 10-digit mobile number.');
  },
  async verifyOtp(phoneNumber: string, otp: string): Promise<OtpVerificationResult> {
    await wait();
    if (otp !== mockOtp) throw new Error("That code doesn't look right. Please try again.");

    const savedUser = await storageService.readJson<User>(storageService.keys.userProfile);
    if (!savedUser || savedUser.phone !== `+91${phoneNumber}`) return { requiresProfileSetup: true };

    const session = createSession(savedUser);
    await storageService.writeJson(storageService.keys.authSession, session);
    return { requiresProfileSetup: false, session };
  },
  async completeProfile(phoneNumber: string, name: string, email?: string): Promise<AuthSession> {
    await wait();
    const user: User = { id: `user-${phoneNumber}`, name, phone: `+91${phoneNumber}`, email: email || undefined };
    const session = createSession(user);
    await storageService.writeJson(storageService.keys.userProfile, user);
    await storageService.writeJson(storageService.keys.authSession, session);
    return session;
  },
  async getSession(): Promise<AuthSession | null> {
    return storageService.readJson<AuthSession>(storageService.keys.authSession);
  },
  async updateProfile(name: string, email?: string): Promise<AuthSession> { const current = await this.getSession(); if (!current || !name.trim()) throw new Error('Enter your name.'); if (email && !/^\S+@\S+\.\S+$/.test(email)) throw new Error('Enter a valid email address.'); const user = { ...current.user, name: name.trim(), email: email?.trim() || undefined }; const session = { ...current, user }; await Promise.all([storageService.writeJson(storageService.keys.userProfile, user), storageService.writeJson(storageService.keys.authSession, session)]); return session; },
  async logout(): Promise<void> {
    await storageService.remove(storageService.keys.authSession);
  },
  async deleteLocalAccount(): Promise<void> { await Promise.all([storageService.remove(storageService.keys.authSession), storageService.remove(storageService.keys.userProfile), storageService.remove(storageService.keys.vehicles), storageService.remove(storageService.keys.bookings), storageService.remove(storageService.keys.payments), storageService.remove(storageService.keys.bookingExtensions), storageService.remove(storageService.keys.bookingCancellations), storageService.remove(storageService.keys.refunds), storageService.remove(storageService.keys.wallet), storageService.remove(storageService.keys.walletTransactions), storageService.remove(storageService.keys.favorites), storageService.remove(storageService.keys.savedPlaces), storageService.remove(storageService.keys.notifications), storageService.remove(storageService.keys.supportTickets)]); favoritesService.clearCache(); },
};

export const mockAuthDetails = { otp: mockOtp };
