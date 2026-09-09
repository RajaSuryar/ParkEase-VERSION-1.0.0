import { ParkingFacility } from '@/types/domain';

const facilities: ParkingFacility[] = [
  { id: 'phoenix-mall', name: 'Phoenix Mall Parking', description: 'Covered mall parking with EV bays.', address: 'Phoenix Marketcity, Velachery, Chennai', latitude: 12.995, longitude: 80.217, distanceKm: 1.2, walkingMinutes: 4, availableSlots: 18, totalSlots: 120, pricePerHour: 40, rating: 4.5, reviewCount: 328, isOpen: true, openTime: '06:00', closeTime: '23:30', parkingType: 'mall', features: ['covered', 'cctv', 'evCharging'] },
  { id: 'guindy-metro', name: 'Guindy Metro Parking', description: 'Quick access parking beside the metro.', address: 'GST Road, Guindy, Chennai', latitude: 13.0108, longitude: 80.213, distanceKm: 1.8, walkingMinutes: 6, availableSlots: 7, totalSlots: 75, pricePerHour: 30, rating: 4.2, reviewCount: 174, isOpen: true, openTime: '05:00', closeTime: '23:00', parkingType: 'metro', features: ['security', 'allDayAccess'] },
  { id: 't-nagar-plaza', name: 'T Nagar Plaza Parking', description: 'Secure multilevel parking in the shopping district.', address: 'Pondy Bazaar, T Nagar, Chennai', latitude: 13.0418, longitude: 80.2341, distanceKm: 2.4, walkingMinutes: 8, availableSlots: 4, totalSlots: 62, pricePerHour: 45, rating: 4.6, reviewCount: 221, isOpen: true, openTime: '08:00', closeTime: '22:30', parkingType: 'commercial', features: ['covered', 'valet', 'accessible'] },
  { id: 'airport-premium', name: 'Chennai Airport Premium', description: 'Long-stay airport parking with round-the-clock access.', address: 'Chennai International Airport, Tirusulam', latitude: 12.9941, longitude: 80.1709, distanceKm: 3.1, walkingMinutes: 10, availableSlots: 36, totalSlots: 180, pricePerHour: 60, rating: 4.4, reviewCount: 412, isOpen: true, openTime: '00:00', closeTime: '23:59', parkingType: 'airport', features: ['covered', 'cctv', 'twentyFourHours'] },
  { id: 'adyar-square', name: 'Adyar Square Parking', description: 'Convenient covered parking near Adyar shops.', address: 'LB Road, Adyar, Chennai', latitude: 13.0067, longitude: 80.2574, distanceKm: 3.6, walkingMinutes: 11, availableSlots: 0, totalSlots: 48, pricePerHour: 35, rating: 4.1, reviewCount: 96, isOpen: true, openTime: '08:00', closeTime: '22:00', parkingType: 'commercial', features: ['covered', 'security'] },
  { id: 'anna-nagar-tower', name: 'Anna Nagar Tower Park', description: 'Open-air parking close to Tower Park.', address: '2nd Avenue, Anna Nagar, Chennai', latitude: 13.086, longitude: 80.2101, distanceKm: 4.2, walkingMinutes: 13, availableSlots: 22, totalSlots: 90, pricePerHour: 25, rating: 4.3, reviewCount: 144, isOpen: true, openTime: '06:00', closeTime: '22:00', parkingType: 'street', features: ['security', 'accessible'] },
  { id: 'omr-hub', name: 'OMR Tech Hub Parking', description: 'Business district parking with EV charging.', address: 'Rajiv Gandhi Salai, OMR, Chennai', latitude: 12.9692, longitude: 80.2443, distanceKm: 5.1, walkingMinutes: 16, availableSlots: 15, totalSlots: 110, pricePerHour: 50, rating: 4.5, reviewCount: 287, isOpen: true, openTime: '07:00', closeTime: '22:00', parkingType: 'commercial', features: ['covered', 'evCharging', 'cctv'] },
  { id: 'velachery-central', name: 'Velachery Central Parking', description: 'Well-lit parking for shopping and dining.', address: '100 Feet Road, Velachery, Chennai', latitude: 12.9815, longitude: 80.218, distanceKm: 5.7, walkingMinutes: 18, availableSlots: 3, totalSlots: 40, pricePerHour: 40, rating: 4.0, reviewCount: 82, isOpen: true, openTime: '09:00', closeTime: '23:00', parkingType: 'mall', features: ['covered', 'cctv'] },
  { id: 'apollo-greams', name: 'Greams Road Care Parking', description: 'Visitor parking near the medical district.', address: 'Greams Road, Chennai', latitude: 13.0587, longitude: 80.2533, distanceKm: 6.2, walkingMinutes: 19, availableSlots: 9, totalSlots: 55, pricePerHour: 30, rating: 4.3, reviewCount: 108, isOpen: true, openTime: '00:00', closeTime: '23:59', parkingType: 'hospital', features: ['accessible', 'security', 'twentyFourHours'] },
  { id: 'marina-bay', name: 'Marina Bay Parking', description: 'Evening parking near the Marina promenade.', address: 'Kamarajar Salai, Chennai', latitude: 13.0505, longitude: 80.2824, distanceKm: 7.1, walkingMinutes: 22, availableSlots: 28, totalSlots: 105, pricePerHour: 35, rating: 4.2, reviewCount: 155, isOpen: true, openTime: '06:00', closeTime: '23:00', parkingType: 'street', features: ['security', 'cctv'] },
];

export const mockParkingFacilities: ParkingFacility[] = facilities.map((facility, index) => ({
  ...facility,
  images: [`parking-${facility.id}-front`, `parking-${facility.id}-entry`, `parking-${facility.id}-bays`],
  pricing: {
    currency: 'INR',
    firstHourRate: facility.pricePerHour,
    additionalHourRate: Math.max(15, facility.pricePerHour - 8),
    dailyRate: facility.pricePerHour * 8,
    monthlyRate: facility.pricePerHour * 8 * 22,
    overnightRate: facility.features.includes('twentyFourHours') ? facility.pricePerHour * 5 : undefined,
  },
  operatingHours: {
    label: facility.features.includes('twentyFourHours') ? 'Open 24 hours, every day' : `Open daily · ${facility.openTime}–${facility.closeTime}`,
    isTwentyFourHours: facility.features.includes('twentyFourHours'),
    openingNote: facility.isOpen ? 'Open now' : 'Currently closed',
  },
  vehicleTypes: index % 3 === 0 ? ['car', 'bike'] : ['car'],
  heightRestriction: facility.parkingType === 'airport' ? '2.2 m maximum vehicle height' : '2.0 m maximum vehicle height',
  entryInstructions: facility.parkingType === 'mall' ? 'Use the main parking entrance and show your booking at the barrier.' : 'Follow the ParkEase signage at the entry and scan your reservation when you arrive.',
  policies: ['Free cancellation until your scheduled entry time.', 'Entry is subject to available reserved bays.', 'Keep your booking confirmation ready at the gate.'],
  reviewSummary: { location: Math.min(5, facility.rating + 0.1), security: Math.min(5, facility.rating + 0.2), easeOfEntry: Math.max(3.8, facility.rating - 0.1), highlight: index % 2 === 0 ? 'Easy to find, bright and well managed.' : 'A dependable choice for a quick city visit.' },
  specificSlotSelection: index % 3 !== 1,
}));
