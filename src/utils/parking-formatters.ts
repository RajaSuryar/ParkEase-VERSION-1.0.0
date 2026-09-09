import { ParkingAvailabilityStatus, ParkingFacility } from '@/types/domain';

export function formatPricePerHour(price: number): string { return `₹${price}/hr`; }
export function formatCurrency(amount: number): string { return `₹${amount.toLocaleString('en-IN')}`; }
export function formatDistance(distanceKm: number): string { return distanceKm < 1 ? `${Math.round(distanceKm * 1000)} m` : `${distanceKm.toFixed(1)} km`; }
export function getAvailabilityStatus(facility: Pick<ParkingFacility, 'availableSlots' | 'totalSlots'>): ParkingAvailabilityStatus { if (facility.availableSlots === 0) return 'full'; if (facility.availableSlots <= Math.max(3, Math.ceil(facility.totalSlots * 0.1))) return 'limited'; return 'available'; }
export function formatAvailability(facility: Pick<ParkingFacility, 'availableSlots' | 'totalSlots'>): string { const status = getAvailabilityStatus(facility); if (status === 'full') return 'Full'; if (status === 'limited') return `${facility.availableSlots} spots left`; return `${facility.availableSlots} spots available`; }
