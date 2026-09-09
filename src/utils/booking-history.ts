import { cancellationPolicy } from '@/config/cancellation';
import { Booking, BookingCategory, BookingTimelineEvent, BookingCancellation, BookingExtension, CancellationRefundBreakdown, Payment, Refund } from '@/types/domain';
import { getBookingTemporalStatus } from '@/utils/booking-lifecycle';

export function categorizeBooking(booking: Booking, now = new Date()): BookingCategory {
  if (booking.status === 'cancelled') return 'cancelled';
  if (booking.status === 'completed') return 'completed';
  const temporal = getBookingTemporalStatus(booking, now);
  if (temporal === 'upcoming') return 'upcoming';
  if (temporal === 'active' || temporal === 'endingSoon') return 'active';
  return 'completed';
}

export function minutesUntilEntry(booking: Pick<Booking, 'entryTime'>, now = new Date()) {
  return Math.floor((new Date(booking.entryTime).getTime() - now.getTime()) / 60_000);
}

export function canCancelBooking(booking: Booking, now = new Date()) {
  if (booking.status === 'cancelled' || booking.status === 'completed') return false;
  return minutesUntilEntry(booking, now) >= cancellationPolicy.noCancellationWithinMinutes;
}

export function getCancellationIneligibilityMessage(booking: Booking, now = new Date()) {
  if (booking.status === 'cancelled') return 'This booking has already been cancelled.';
  if (booking.status === 'completed' || new Date(booking.exitTime) <= now) return 'Completed parking sessions cannot be cancelled.';
  if (new Date(booking.entryTime) <= now) return 'Active parking cannot be cancelled. Early checkout is not available yet.';
  return `Cancellation is available until ${cancellationPolicy.noCancellationWithinMinutes} minutes before entry.`;
}

export function calculateCancellationRefund(booking: Booking, now = new Date()): CancellationRefundBreakdown {
  const minutes = minutesUntilEntry(booking, now);
  const percentage = minutes >= cancellationPolicy.freeCancellationBeforeMinutes ? 100 : minutes >= cancellationPolicy.partialRefundBeforeMinutes ? cancellationPolicy.partialRefundPercentage : 0;
  const paid = Math.max(0, booking.totalAmount);
  const parkingPaid = Math.max(0, booking.priceBreakdown.parkingCharge - booking.priceBreakdown.discountAmount);
  const refundableParkingAmount = Math.min(paid, Math.round(parkingPaid * percentage) / 100);
  const refundAmount = Math.max(0, Math.min(paid, refundableParkingAmount));
  return { originalPaidAmount: paid, refundableParkingAmount, nonRefundableFees: Math.max(0, paid - refundAmount), cancellationFee: 0, refundAmount, refundPercentage: percentage, currency: 'INR' };
}

export function buildBookingTimeline(booking: Booking, payments: Payment[], extensions: BookingExtension[], cancellation: BookingCancellation | null, refund: Refund | null, now = new Date()): BookingTimelineEvent[] {
  const events: BookingTimelineEvent[] = [{ id: `confirmed-${booking.id}`, type: 'confirmed', title: 'Booking confirmed', timestamp: booking.createdAt }, ...payments.filter((payment) => payment.status === 'success').map((payment) => ({ id: `payment-${payment.id}`, type: 'payment' as const, title: 'Payment completed', timestamp: payment.createdAt }))];
  if (new Date(booking.entryTime) <= now && booking.status !== 'cancelled') events.push({ id: `started-${booking.id}`, type: 'started', title: 'Parking started', timestamp: booking.entryTime });
  extensions.forEach((extension) => events.push({ id: `extension-${extension.id}`, type: 'extended', title: 'Parking extended', timestamp: extension.createdAt, description: `Extended by ${extension.addedMinutes} minutes` }));
  if (new Date(booking.exitTime) <= now && booking.status !== 'cancelled') events.push({ id: `ended-${booking.id}`, type: 'ended', title: 'Parking ended', timestamp: booking.exitTime });
  if (cancellation) events.push({ id: `cancelled-${cancellation.id}`, type: 'cancelled', title: 'Booking cancelled', timestamp: cancellation.cancelledAt });
  if (refund) events.push({ id: `refund-${refund.id}`, type: 'refund', title: refund.status === 'refunded' ? 'Refund processed' : 'Refund needs attention', timestamp: refund.completedAt ?? refund.createdAt });
  return events.sort((first, second) => new Date(second.timestamp).getTime() - new Date(first.timestamp).getTime());
}
