import { storageService } from '@/services/storage-service';
import { Vehicle } from '@/types/domain';

export type VehicleInput = Omit<Vehicle, 'id' | 'isDefault'> & { isDefault?: boolean };
const initialVehicles: Vehicle[] = [
  { id: 'vehicle-i20', type: 'car', registrationNumber: 'TN 01 AB 1234', brand: 'Hyundai', model: 'i20', color: 'White', isDefault: true },
  { id: 'vehicle-city', type: 'car', registrationNumber: 'TN 10 MN 4567', brand: 'Honda', model: 'City', color: 'Silver', isDefault: false },
  { id: 'vehicle-royal', type: 'motorcycle', registrationNumber: 'TN 14 RK 2024', brand: 'Royal Enfield', model: 'Classic 350', color: 'Black', isDefault: false },
];
async function readVehicles() { const saved = await storageService.readJson<Vehicle[]>(storageService.keys.vehicles); if (saved) return saved; await storageService.writeJson(storageService.keys.vehicles, initialVehicles); return initialVehicles; }
async function save(vehicles: Vehicle[]) { await storageService.writeJson(storageService.keys.vehicles, vehicles); return vehicles; }
const normalizeDefaults = (vehicles: Vehicle[], defaultId?: string) => vehicles.map((vehicle, index) => ({ ...vehicle, isDefault: defaultId ? vehicle.id === defaultId : vehicle.isDefault && index === vehicles.findIndex((item) => item.isDefault) }));

export const vehicleService = {
  async getVehicles() { return (await readVehicles()).sort((a, b) => Number(b.isDefault) - Number(a.isDefault)); },
  async getVehicleById(id: string) { return (await readVehicles()).find((vehicle) => vehicle.id === id) ?? null; },
  async addVehicle(input: VehicleInput) { const vehicles = await readVehicles(); const id = `vehicle-${Date.now()}`; const isDefault = input.isDefault || vehicles.length === 0; const next = normalizeDefaults([...vehicles, { ...input, id, isDefault }], isDefault ? id : undefined); await save(next); return next.find((vehicle) => vehicle.id === id)!; },
  async updateVehicle(id: string, input: VehicleInput) { const vehicles = await readVehicles(); const existing = vehicles.find((vehicle) => vehicle.id === id); if (!existing) return null; const isDefault = input.isDefault ?? existing.isDefault; const next = normalizeDefaults(vehicles.map((vehicle) => vehicle.id === id ? { ...vehicle, ...input, id, isDefault } : vehicle), isDefault ? id : undefined); await save(next); return next.find((vehicle) => vehicle.id === id)!; },
  async deleteVehicle(id: string) { const vehicles = await readVehicles(); const wasDefault = vehicles.find((vehicle) => vehicle.id === id)?.isDefault; const remaining = vehicles.filter((vehicle) => vehicle.id !== id); await save(wasDefault && remaining.length ? normalizeDefaults(remaining, remaining[0].id) : remaining); return remaining; },
  async setDefaultVehicle(id: string) { const next = normalizeDefaults(await readVehicles(), id); await save(next); return next; },
};
