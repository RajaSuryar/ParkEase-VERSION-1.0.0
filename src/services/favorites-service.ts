import { mockParkingFacilities } from '@/mock/parking';
import { storageService } from '@/services/storage-service';

let cachedFavoriteIds: string[] | null = null;
async function readFavoriteIds() { if (cachedFavoriteIds) return cachedFavoriteIds; cachedFavoriteIds = (await storageService.readJson<string[]>(storageService.keys.favorites)) ?? []; return cachedFavoriteIds; }
export const favoritesService = {
  async getFavoriteIds() { return readFavoriteIds(); },
  async getFavorites() { const ids = await readFavoriteIds(); return mockParkingFacilities.filter((item) => ids.includes(item.id)); },
  async isFavorite(id: string) { return (await readFavoriteIds()).includes(id); },
  async toggleFavorite(id: string) { const ids = await readFavoriteIds(); const next = ids.includes(id) ? ids.filter((item) => item !== id) : [id, ...ids]; cachedFavoriteIds = next; await storageService.writeJson(storageService.keys.favorites, next); return next.includes(id); },
  clearCache() { cachedFavoriteIds = null; },
};
