import { storageService } from '@/services/storage-service';
export type Appearance = 'system' | 'light' | 'dark'; export type Language = 'en' | 'ta'; export type AppSettings = { appearance: Appearance; language: Language };
const defaults: AppSettings = { appearance: 'system', language: 'en' };
export const settingsService = { async getSettings() { return (await storageService.readJson<AppSettings>(storageService.keys.appSettings)) ?? defaults; }, async update(settings: Partial<AppSettings>) { const next = { ...(await this.getSettings()), ...settings }; await storageService.writeJson(storageService.keys.appSettings, next); return next; } };
