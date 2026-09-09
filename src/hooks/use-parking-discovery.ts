import { useCallback, useEffect, useState } from 'react';
import { parkingService } from '@/services/parking-service';
import { ParkingFacility } from '@/types/domain';

export type DiscoveryState = 'loading' | 'ready' | 'error';
export function useParkingDiscovery() {
  const [facilities, setFacilities] = useState<ParkingFacility[]>([]);
  const [state, setState] = useState<DiscoveryState>('loading');
  const refresh = useCallback(async () => { setState('loading'); try { setFacilities(await parkingService.getNearbyParking()); setState('ready'); } catch { setState('error'); } }, []);
  useEffect(() => { let isActive = true; void parkingService.getNearbyParking().then((nextFacilities) => { if (isActive) { setFacilities(nextFacilities); setState('ready'); } }).catch(() => { if (isActive) setState('error'); }); return () => { isActive = false; }; }, []);
  return { facilities, state, refresh };
}
