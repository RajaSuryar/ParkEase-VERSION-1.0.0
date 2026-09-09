import { ParkingPricing } from '@/types/domain';

export function calculateParkingPrice(pricing: ParkingPricing | undefined, fallbackHourlyRate: number, durationMinutes: number) { const base = pricing?.firstHourRate ?? fallbackHourlyRate; const additional = pricing?.additionalHourRate ?? base; const hours = Math.max(1, Math.ceil(durationMinutes / 30) / 2); const amount = hours <= 1 ? base : base + (hours - 1) * additional; return Math.min(pricing?.dailyRate ?? Number.POSITIVE_INFINITY, Math.round(amount)); }
