import { toast } from 'sonner';

// Function to simulate geolocation based on search input
export const simulateGeolocation = (locationInput?: string): [number, number] => {
  // Default coordinates (New York City)
  let defaultLat = 40.7128;
  let defaultLng = -74.0060;
  
  // Map of cities to their approximate coordinates
  const cityCoordinates: Record<string, [number, number]> = {
    'kyiv': [50.4501, 30.5234],
    'new york': [40.7128, -74.0060],
    'london': [51.5074, -0.1278],
    'paris': [48.8566, 2.3522],
    'tokyo': [35.6762, 139.6503],
    'berlin': [52.5200, 13.4050],
    'rome': [41.9028, 12.4964],
    'madrid': [40.4168, -3.7038],
    'sydney': [-33.8688, 151.2093],
    'chicago': [41.8781, -87.6298],
  };
  
  if (locationInput) {
    const normalizedInput = locationInput.toLowerCase().trim();
    const coordinates = cityCoordinates[normalizedInput];
    
    if (coordinates) {
      return coordinates;
    } else {
      // If city not found in our map, create deterministic coordinates
      const sum = normalizedInput.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      
      // Create variation based on input string
      const latVariation = (sum % 180) - 90; // Range: -90 to 90
      const lngVariation = (sum % 360) - 180; // Range: -180 to 180
      
      return [
        Math.min(Math.max(latVariation, -85), 85), // Clamp between -85 and 85
        lngVariation
      ];
    }
  }
  
  return [defaultLat, defaultLng];
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
