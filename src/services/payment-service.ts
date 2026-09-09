import { Payment, PaymentMethod, PaymentStatus, Refund } from '@/types/domain';

let forcedOutcome: 'success' | 'failed' | null = null;
let forcedRefundOutcome: 'success' | 'failed' | null = null;
const wait = () => new Promise<void>((resolve) => setTimeout(resolve, 1150));
export const paymentService = {
  setMockOutcomeForDevelopment(outcome: 'success' | 'failed' | null) { forcedOutcome = outcome; },
  setMockRefundOutcomeForDevelopment(outcome: 'success' | 'failed' | null) { forcedRefundOutcome = outcome; },
  async processMockPayment(method: PaymentMethod, amount: number): Promise<Pick<Payment, 'id' | 'status' | 'method' | 'amount' | 'currency' | 'transactionReference' | 'createdAt'>> { await wait(); const status: PaymentStatus = forcedOutcome ?? 'success'; return { id: `pay-${Date.now()}`, status, method, amount, currency: 'INR', transactionReference: `TXN${Date.now().toString().slice(-8)}`, createdAt: new Date().toISOString() }; },
  async processMockRefund(payment: Pick<Payment, 'id' | 'bookingId'>, amount: number): Promise<Refund> {
    await wait();
    const success = (forcedRefundOutcome ?? 'success') === 'success';
    const createdAt = new Date().toISOString();
    return { id: `refund-${Date.now()}`, bookingId: payment.bookingId, paymentId: payment.id, amount: Math.max(0, amount), currency: 'INR', status: success ? 'refunded' : 'failed', transactionReference: `RF-${Date.now().toString().slice(-8)}`, createdAt, completedAt: success ? new Date().toISOString() : undefined };
  },
};
