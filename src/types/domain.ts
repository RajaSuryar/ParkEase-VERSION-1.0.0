export type BookingStatus = 'upcoming' | 'confirmed' | 'active' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'processing' | 'success' | 'failed' | 'refunded';
export type PaymentMethod = 'upi' | 'card' | 'wallet';
export type BookingTemporalStatus = 'upcoming' | 'active' | 'endingSoon' | 'expired';
export type BookingCategory = 'upcoming' | 'active' | 'completed' | 'cancelled';
export type RefundStatus = 'notRequired' | 'pending' | 'processing' | 'refunded' | 'failed';
export type CancellationReason = 'plansChanged' | 'anotherParking' | 'bookedByMistake' | 'vehicleIssue' | 'locationIssue' | 'other';
export type ParkingFeature = 'covered' | 'cctv' | 'security' | 'evCharging' | 'accessible' | 'valet' | 'carWash' | 'allDayAccess' | 'twentyFourHours';
export type ParkingAvailabilityStatus = 'available' | 'limited' | 'full';
export type ParkingType = 'mall' | 'street' | 'airport' | 'commercial' | 'hospital' | 'metro';
export type ParkingSortOption = 'recommended' | 'nearest' | 'lowestPrice' | 'highestRated' | 'mostAvailable';
export type ParkingPriceRange = 'under30' | '30to50' | '50to100' | '100plus';
export type ParkingAvailabilityFilter = 'availableNow' | 'notFull';
export type VehicleType = 'car' | 'suv' | 'motorcycle' | 'bike';
export type SlotPreference = 'any' | 'specific';
export interface ParkingFilters { distanceKm: number | null; priceRange: ParkingPriceRange | null; availability: ParkingAvailabilityFilter | null; minimumRating: number | null; features: ParkingFeature[]; parkingTypes: ParkingType[]; }
export interface ParkingPricing { firstHourRate: number; additionalHourRate?: number; dailyRate?: number; monthlyRate?: number; overnightRate?: number; currency: 'INR'; }
export interface OperatingHours { label: string; isTwentyFourHours?: boolean; openingNote?: string; }
export interface ParkingReviewSummary { location: number; security: number; easeOfEntry: number; highlight: string; }
export interface MapCoordinate { latitude: number; longitude: number; }
export interface SearchLocation extends MapCoordinate { id: string; name: string; subtitle: string; category: 'recent' | 'saved' | 'popular' | 'suggested'; }
export interface User { id: string; name: string; phone: string; email?: string; avatarUrl?: string; }
export interface Vehicle { id: string; type: VehicleType; registrationNumber: string; brand: string; model: string; color: string; isDefault: boolean; }
export type ParkingSlotStatus = 'available' | 'reserved' | 'occupied' | 'unavailable';
export type ParkingSlotType = 'standard' | 'accessible' | 'ev' | 'premium';
export interface ParkingSlot { id: string; label: string; section: string; status: ParkingSlotStatus; type: ParkingSlotType; level: string; }
export interface BookingDraft { parkingId: string; vehicleId: string | null; arrivalDateTime: string | null; durationMinutes: number; exitDateTime: string | null; selectedSlotId: string | null; slotPreference: SlotPreference | null; estimatedParkingAmount: number; couponCode?: string | null; }
export interface ParkingAvailability { totalSlots: number; availableSlots: number; updatedAt: string; }
export interface ParkingFacility extends MapCoordinate { id: string; name: string; description: string; address: string; distanceKm: number; walkingMinutes: number; availableSlots: number; totalSlots: number; pricePerHour: number; rating: number; reviewCount: number; isOpen: boolean; openTime: string; closeTime: string; parkingType: ParkingType; features: ParkingFeature[]; image?: string; images?: string[]; pricing?: ParkingPricing; operatingHours?: OperatingHours; vehicleTypes?: VehicleType[]; heightRestriction?: string; entryInstructions?: string; policies?: string[]; reviewSummary?: ParkingReviewSummary; specificSlotSelection?: boolean; }
export interface BookingPriceBreakdown { parkingCharge: number; convenienceFee: number; taxAmount: number; discountAmount: number; walletAmount: number; totalAmount: number; currency: 'INR'; }
export interface ExtensionPriceBreakdown { additionalParkingCharge: number; extensionFee: number; taxAmount: number; discountAmount: number; totalAmount: number; currency: 'INR'; }
export interface Booking { id: string; bookingReference: string; userId: string; facilityId: string; vehicleId: string; status: BookingStatus; entryTime: string; exitTime: string; durationMinutes: number; slotId: string | null; slotPreference: SlotPreference; totalAmount: number; priceBreakdown: BookingPriceBreakdown; paymentId: string; paymentStatus: PaymentStatus; createdAt: string; parkingName: string; parkingAddress: string; vehicleRegistration: string; }
export interface Payment { id: string; bookingId: string; amount: number; currency: 'INR'; status: PaymentStatus; method: PaymentMethod; transactionReference: string; createdAt: string; }
export interface BookingExtension { id: string; bookingId: string; previousExitDateTime: string; newExitDateTime: string; addedMinutes: number; amount: number; paymentId: string; createdAt: string; }
export interface CancellationRefundBreakdown { originalPaidAmount: number; refundableParkingAmount: number; nonRefundableFees: number; cancellationFee: number; refundAmount: number; refundPercentage: number; currency: 'INR'; }
export interface BookingCancellation { id: string; bookingId: string; cancelledAt: string; reason: CancellationReason; reasonDetails?: string; cancellationFee: number; refundAmount: number; refundStatus: RefundStatus; refundId?: string; }
export interface Refund { id: string; bookingId: string; paymentId: string; amount: number; currency: 'INR'; status: Exclude<RefundStatus, 'notRequired'>; transactionReference: string; createdAt: string; completedAt?: string; }
export interface BookingTimelineEvent { id: string; type: 'confirmed' | 'payment' | 'started' | 'extended' | 'ended' | 'cancelled' | 'refund'; title: string; timestamp: string; description?: string; }
export interface Wallet { balance: number; currency: 'INR'; updatedAt: string; }
export interface WalletTransaction { id: string; type: 'parkingPayment' | 'extensionPayment' | 'refund' | 'topUp' | 'promoCredit'; amount: number; currency: 'INR'; direction: 'credit' | 'debit'; status: 'success' | 'failed'; title: string; description: string; bookingId?: string; paymentId?: string; refundId?: string; createdAt: string; }
export interface Coupon { id: string; code: string; title: string; description: string; discountType: 'percentage' | 'fixed'; discountValue: number; maximumDiscount: number; minimumBookingAmount: number; isActive: boolean; }
export type NotificationType = 'bookingConfirmed' | 'parkingStartingSoon' | 'parkingEndingSoon' | 'parkingExtended' | 'paymentSuccessful' | 'paymentFailed' | 'refundProcessed' | 'refundFailed' | 'offer' | 'general';
export interface AppNotification { id: string; type: NotificationType; title: string; body: string; isRead: boolean; createdAt: string; bookingId?: string; parkingId?: string; eventKey: string; }
export interface NotificationPreferences { bookingUpdates: boolean; parkingReminders: boolean; paymentUpdates: boolean; offers: boolean; }
export interface SupportTicket { id: string; reference: string; category: 'booking' | 'payment' | 'refund' | 'parking' | 'vehicle' | 'account' | 'other'; bookingId?: string; subject: string; description: string; status: 'submitted' | 'inReview' | 'resolved'; createdAt: string; }
export interface SavedPlace { id: string; label: string; address: string; latitude: number; longitude: number; type?: 'home' | 'work' | 'custom'; }
