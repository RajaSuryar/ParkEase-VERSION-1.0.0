import { ParkingFacility } from '@/types/domain';

export const durationOptions = [30, 60, 120, 180, 240, 360];
export function addMinutes(date: Date, minutes: number) { return new Date(date.getTime() + minutes * 60_000); }
export function formatBookingDateTime(value: string | Date) { return new Intl.DateTimeFormat('en-IN', { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }).format(new Date(value)); }
export function formatTime(value: string | Date) { return new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit' }).format(new Date(value)); }
export function formatDuration(minutes: number) { return minutes < 60 ? `${minutes} min` : `${minutes / 60} hr${minutes === 60 ? '' : 's'}`; }
export function isFutureDateTime(value: Date) { return value.getTime() > Date.now() + 60_000; }
function toMinutes(value: string) { const [hours, minutes] = value.split(':').map(Number); return hours * 60 + minutes; }
export function isWithinParkingHours(facility: ParkingFacility, arrival: Date, exit: Date) { if (facility.operatingHours?.isTwentyFourHours || facility.features.includes('twentyFourHours')) return true; const start = toMinutes(facility.openTime); const end = toMinutes(facility.closeTime); const arrivalMinute = arrival.getHours() * 60 + arrival.getMinutes(); const exitMinute = exit.getHours() * 60 + exit.getMinutes(); return arrival.toDateString() === exit.toDateString() && arrivalMinute >= start && exitMinute <= end; }
export function getTimeValidation(facility: ParkingFacility, arrival: Date, durationMinutes: number) { const exit = addMinutes(arrival, durationMinutes); if (!isFutureDateTime(arrival)) return 'Choose a future arrival time.'; if (!isWithinParkingHours(facility, arrival, exit)) return facility.operatingHours?.isTwentyFourHours ? null : `Choose a time within ${facility.openTime}–${facility.closeTime}.`; return null; }
