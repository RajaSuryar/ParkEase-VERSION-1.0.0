import { mockParkingFacilities } from '@/mock/parking';
import { MapCoordinate, ParkingFacility } from '@/types/domain';

const mockDelayMs = 380;
function wait(): Promise<void> { return new Promise((resolve) => setTimeout(resolve, mockDelayMs)); }

export interface ParkingRepository {
  getNearbyParking(location?: MapCoordinate): Promise<ParkingFacility[]>;
  getParkingById(id: string): Promise<ParkingFacility | null>;
  searchParking(query: string): Promise<ParkingFacility[]>;
  getRecommendedParking(location?: MapCoordinate): Promise<ParkingFacility[]>;
}

export const parkingService: ParkingRepository = {
  async getNearbyParking() { await wait(); return [...mockParkingFacilities].sort((first, second) => first.distanceKm - second.distanceKm); },
  async getParkingById(id) { await wait(); return mockParkingFacilities.find((facility) => facility.id === id) ?? null; },
  async searchParking(query) { await wait(); const normalized = query.trim().toLowerCase(); if (!normalized) return mockParkingFacilities; return mockParkingFacilities.filter((facility) => `${facility.name} ${facility.address} ${facility.parkingType}`.toLowerCase().includes(normalized)); },
  async getRecommendedParking() { await wait(); return [...mockParkingFacilities].sort((first, second) => second.rating - first.rating).slice(0, 4); },
};
