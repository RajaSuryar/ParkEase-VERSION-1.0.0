import { paymentConfig } from '@/config/payment';
import { BookingPriceBreakdown } from '@/types/domain';

export function calculateCheckoutTotal(parkingCharge: number, discountAmount = 0, walletAmount = 0): BookingPriceBreakdown { const convenienceFee = paymentConfig.convenienceFee; const taxAmount = paymentConfig.taxAmount; const totalAmount = Math.max(0, parkingCharge + convenienceFee + taxAmount - discountAmount - walletAmount); return { parkingCharge, convenienceFee, taxAmount, discountAmount, walletAmount, totalAmount, currency: paymentConfig.currency }; }
