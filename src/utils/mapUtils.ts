
import { ATM } from './api';

export function calculateBounds(atms: ATM[]) {
  if (atms.length === 0) return null;
  
  let minLat = atms[0].coordinates.latitude;
  let maxLat = atms[0].coordinates.latitude;
  let minLng = atms[0].coordinates.longitude;
  let maxLng = atms[0].coordinates.longitude;
  
  atms.forEach(atm => {
    minLat = Math.min(minLat, atm.coordinates.latitude);
    maxLat = Math.max(maxLat, atm.coordinates.latitude);
    minLng = Math.min(minLng, atm.coordinates.longitude);
    maxLng = Math.max(maxLng, atm.coordinates.longitude);
  });
  
  // Add some padding
  const latPadding = (maxLat - minLat) * 0.1;
  const lngPadding = (maxLng - minLng) * 0.1;
  
  return [
    [minLat - latPadding, minLng - lngPadding],
    [maxLat + latPadding, maxLng + lngPadding]
  ];
}

export function getGoogleMapsUrl(atm: ATM) {
  const { latitude, longitude } = atm.coordinates;
  const address = encodeURIComponent(
    `${atm.name}, ${atm.address}, ${atm.city}, ${atm.state} ${atm.postalCode}`
  );
  
  return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&destination_place_id=${address}`;
}

export function getUserLocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
    } else {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
    }
  });
}

export function formatDistance(distance: number | undefined) {
  if (distance === undefined) return 'Unknown distance';
  
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  }
  
  return `${distance.toFixed(1)} km`;
}
