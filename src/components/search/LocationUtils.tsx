
import { toast } from 'sonner';

// Function to simulate geolocation based on search input
export const simulateGeolocation = (locationInput?: string): [number, number] => {
  // For demo purposes, we'll use different base coordinates depending on the input
  // In a real app, this would be replaced with actual geocoding
  
  // Default coordinates (New York City)
  let defaultLat = 40.7128;
  let defaultLng = -74.0060;
  
  if (locationInput) {
    // Create "random" but deterministic coordinates based on the input string
    // This is just for demo purposes to make different locations appear in different places
    
    // Use the sum of character codes to create variation
    const sum = locationInput.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Use the sum to modify the base coordinates
    // This is not geographically accurate, just for demo
    const latVariation = (sum % 100) / 1000;
    const lngVariation = ((sum % 73) * 1.3) / 1000;
    
    defaultLat += latVariation;
    defaultLng += lngVariation;
  }
  
  // Add some slight randomization to the coordinates for variety
  const variation = (Math.random() - 0.5) * 0.02;
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
