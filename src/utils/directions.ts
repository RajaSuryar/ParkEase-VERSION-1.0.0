import { Linking, Share } from 'react-native';
import { ParkingFacility } from '@/types/domain';

export async function openParkingDirections(facility: ParkingFacility) {
  const query = encodeURIComponent(`${facility.latitude},${facility.longitude}`);
  await Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${query}`);
}

export async function shareParking(facility: ParkingFacility) {
  await Share.share({ message: `${facility.name}\n${facility.address}\n${formatParkingDirectionsUrl(facility)}` });
}

function formatParkingDirectionsUrl(facility: ParkingFacility) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${facility.latitude},${facility.longitude}`)}`;
}
