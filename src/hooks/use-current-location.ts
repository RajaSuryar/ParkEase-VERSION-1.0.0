import { useCallback, useEffect, useState } from 'react';
import { fallbackLocationLabel } from '@/config/location';
import { locationService } from '@/services/location-service';
import { useAppStore } from '@/store/app-store';

export function useCurrentLocation() {
  const permission = useAppStore((state) => state.locationPermission);
  const [label, setLabel] = useState(permission === 'granted' ? 'Current Location' : fallbackLocationLabel);
  const refresh = useCallback(async () => { if (permission !== 'granted') { setLabel(fallbackLocationLabel); return; } setLabel((await locationService.getCurrentLocationLabel()) ?? 'Current Location'); }, [permission]);
  useEffect(() => { if (permission !== 'granted') return; let isActive = true; void locationService.getCurrentLocationLabel().then((nextLabel) => { if (isActive) setLabel(nextLabel ?? 'Current Location'); }); return () => { isActive = false; }; }, [permission]);
  return { label, hasLocation: permission === 'granted', refresh };
}
