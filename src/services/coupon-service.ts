import { Coupon } from '@/types/domain';

const coupons: Coupon[] = [
  { id: 'firstpark', code: 'FIRSTPARK', title: '20% off your first parking', description: 'Save up to ₹100 on bookings over ₹50.', discountType: 'percentage', discountValue: 20, maximumDiscount: 100, minimumBookingAmount: 50, isActive: true },
  { id: 'park50', code: 'PARK50', title: '₹50 off parking', description: 'Valid on bookings over ₹200.', discountType: 'fixed', discountValue: 50, maximumDiscount: 50, minimumBookingAmount: 200, isActive: true },
  { id: 'weekend10', code: 'WEEKEND10', title: '10% weekend saving', description: 'Save up to ₹75 on eligible bookings.', discountType: 'percentage', discountValue: 10, maximumDiscount: 75, minimumBookingAmount: 50, isActive: true },
];
export const couponService = {
  async getAvailableCoupons() { return coupons.filter((coupon) => coupon.isActive); },
  async applyCoupon(code: string, parkingAmount: number) { const coupon = coupons.find((item) => item.code === code.trim().toUpperCase()); if (!coupon || !coupon.isActive) return { coupon: null, discount: 0, message: "This coupon isn't valid." }; if (parkingAmount < coupon.minimumBookingAmount) return { coupon: null, discount: 0, message: `Minimum booking amount of ₹${coupon.minimumBookingAmount} required.` }; const raw = coupon.discountType === 'percentage' ? parkingAmount * coupon.discountValue / 100 : coupon.discountValue; const discount = Math.min(Math.round(raw), coupon.maximumDiscount, parkingAmount); return { coupon, discount, message: `Coupon applied. You saved ₹${discount}.` }; },
};
