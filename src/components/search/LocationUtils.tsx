
import { toast } from 'sonner';

// Function to simulate geolocation based on search input
export const simulateGeolocation = (): [number, number] => {
  // For demo purposes, these coordinates are in New York City
  const defaultLat = 40.7128;
  const defaultLng = -74.0060;
  
  // Add some slight randomization to the coordinates
  const variation = (Math.random() - 0.5) * 0.05;
  const simulatedLat = defaultLat + variation;
  const simulatedLng = defaultLng + variation;
  
  return [simulatedLat, simulatedLng];
};

export const getCurrentLocation = (
  setUserLocation: (location: [number, number]) => void,
  setLocationInput?: (value: string) => void,
  onError?: () => void
): void => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([
          position.coords.latitude,
          position.coords.longitude
        ]);
        if (setLocationInput) {
          setLocationInput('');
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        if (onError) {
          onError();
        } else {
          toast.error('Could not get your location. Please enter a location manually.');
        }
      }
    );
  }
};
