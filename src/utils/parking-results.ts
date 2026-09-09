import { ParkingFacility, ParkingFilters, ParkingPriceRange, ParkingSortOption } from '@/types/domain';
import { getAvailabilityStatus } from '@/utils/parking-formatters';

export const sortLabels: Record<ParkingSortOption, string> = { recommended: 'Recommended', nearest: 'Nearest', lowestPrice: 'Lowest price', highestRated: 'Highest rated', mostAvailable: 'Most available' };
export const priceRangeLabels: Record<ParkingPriceRange, string> = { under30: 'Under ₹30/hr', '30to50': '₹30–₹50/hr', '50to100': '₹50–₹100/hr', '100plus': '₹100+/hr' };
const matchesPrice = (price: number, range: ParkingPriceRange) => range === 'under30' ? price < 30 : range === '30to50' ? price >= 30 && price <= 50 : range === '50to100' ? price > 50 && price <= 100 : price > 100;

export function filterParkingFacilities(facilities: ParkingFacility[], filters: ParkingFilters) {
  return facilities.filter((facility) => {
    const status = getAvailabilityStatus(facility);
    return (!filters.distanceKm || facility.distanceKm <= filters.distanceKm)
      && (!filters.priceRange || matchesPrice(facility.pricePerHour, filters.priceRange))
      && (!filters.minimumRating || facility.rating >= filters.minimumRating)
      && (!filters.availability || (filters.availability === 'availableNow' ? status === 'available' : status !== 'full'))
      && filters.features.every((feature) => facility.features.includes(feature))
      && (!filters.parkingTypes.length || filters.parkingTypes.includes(facility.parkingType));
  });
}

export function sortParkingFacilities(facilities: ParkingFacility[], sort: ParkingSortOption) {
  return [...facilities].sort((a, b) => {
    if (sort === 'nearest') return a.distanceKm - b.distanceKm;
    if (sort === 'lowestPrice') return a.pricePerHour - b.pricePerHour;
    if (sort === 'highestRated') return b.rating - a.rating;
    if (sort === 'mostAvailable') return b.availableSlots - a.availableSlots;
    const score = (facility: ParkingFacility) => facility.rating * 18 + (facility.availableSlots / facility.totalSlots) * 22 - facility.distanceKm * 3 - facility.pricePerHour * 0.08;
    return score(b) - score(a);
  });
}

export function getParkingResults(facilities: ParkingFacility[], filters: ParkingFilters, sort: ParkingSortOption) { return sortParkingFacilities(filterParkingFacilities(facilities, filters), sort); }
export function getActiveFilterLabels(filters: ParkingFilters) {
  return [filters.distanceKm ? `Within ${filters.distanceKm} km` : null, filters.priceRange ? priceRangeLabels[filters.priceRange] : null, filters.availability === 'availableNow' ? 'Available now' : filters.availability === 'notFull' ? 'Not full' : null, filters.minimumRating ? `${filters.minimumRating.toFixed(1)}+ rated` : null, ...filters.features.map((feature) => ({ evCharging: 'EV charging', covered: 'Covered', cctv: 'CCTV', security: 'Security', accessible: 'Accessible', valet: 'Valet', carWash: 'Car wash', allDayAccess: 'All-day access', twentyFourHours: '24 hours' })[feature]), ...filters.parkingTypes.map((type) => type[0].toUpperCase() + type.slice(1))].filter((label): label is string => Boolean(label));
}
