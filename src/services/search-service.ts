import { mockSearchLocations } from '@/mock/locations';
import { storageService } from '@/services/storage-service';
import { SearchLocation } from '@/types/domain';

const maxRecentSearches = 5;
export const searchService = {
  async searchLocations(query: string): Promise<SearchLocation[]> { const normalized = query.trim().toLowerCase(); if (!normalized) return mockSearchLocations; return mockSearchLocations.filter((location) => `${location.name} ${location.subtitle}`.toLowerCase().includes(normalized)); },
  async getRecentSearches(): Promise<SearchLocation[]> { return (await storageService.readJson<SearchLocation[]>(storageService.keys.recentSearches)) ?? []; },
  async addRecentSearch(location: SearchLocation): Promise<void> { const current = await this.getRecentSearches(); const next = [{ ...location, category: 'recent' as const }, ...current.filter((item) => item.id !== location.id)].slice(0, maxRecentSearches); await storageService.writeJson(storageService.keys.recentSearches, next); },
  async clearRecentSearches(): Promise<void> { await storageService.remove(storageService.keys.recentSearches); },
};
