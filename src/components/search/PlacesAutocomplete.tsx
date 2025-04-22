
import React, { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { toast } from 'sonner';

interface PlacesAutocompleteProps {
  locationInput: string;
  setLocationInput: (value: string) => void;
  isSearching: boolean;
  onPlaceSelect: (lat: number, lng: number, description?: string) => void;
}

const PlacesAutocomplete: React.FC<PlacesAutocompleteProps> = ({
  locationInput,
  setLocationInput,
  isSearching,
  onPlaceSelect
}) => {
  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [autocompleteService, setAutocompleteService] = useState<google.maps.places.AutocompleteService | null>(null);
  const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Initialize Google Places services
    if (window.google && !autocompleteService) {
      try {
        setAutocompleteService(new google.maps.places.AutocompleteService());
        // We need a HTML element to create PlacesService
        const attributionsElement = document.createElement('div');
        setPlacesService(new google.maps.places.PlacesService(attributionsElement));
      } catch (error) {
        console.error('Error initializing Google Places services:', error);
        toast.error('Error initializing location search');
      }
    }
  }, []);

  useEffect(() => {
    if (!locationInput || !autocompleteService) {
      setPredictions([]);
      return;
    }

    const getPredictions = async () => {
      try {
        const response = await autocompleteService.getPlacePredictions({
          input: locationInput,
          types: ['geocode', 'establishment'],
        });
        setPredictions(response.predictions);
        setShowDropdown(true);
      } catch (error) {
        console.error('Error fetching predictions:', error);
        toast.error('Error fetching location suggestions');
      }
    };

    const timeoutId = setTimeout(() => {
      getPredictions();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [locationInput, autocompleteService]);

  const handlePlaceSelect = async (placeId: string, description: string) => {
    if (!placesService) {
      toast.error('Location search service not available');
      return;
    }

    try {
      const request = {
        placeId: placeId,
        fields: ['geometry', 'name', 'formatted_address']
      };

      placesService.getDetails(request, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          
          // Pass description as well to update the input field
          onPlaceSelect(lat, lng, description);
        } else {
          toast.error('Error getting place details');
        }
      });
    } catch (error) {
      console.error('Error getting place details:', error);
      toast.error('Error getting place details');
    }

    setShowDropdown(false);
  };
  
  const clearInput = () => {
    setLocationInput('');
    setPredictions([]);
    setShowDropdown(false);
  };

  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
      <input
        type="text"
        placeholder="Enter a location (e.g., New York, Chicago)"
        className="search-input pl-10"
        value={locationInput}
        onChange={e => setLocationInput(e.target.value)}
        disabled={isSearching}
        onFocus={() => locationInput && setShowDropdown(true)}
      />
      {locationInput && (
        <button
          type="button"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          onClick={clearInput}
        >
          <X size={16} />
        </button>
      )}

      {showDropdown && predictions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-border">
          {predictions.map((prediction) => (
            <button
              key={prediction.place_id}
              className="w-full px-4 py-2 text-left hover:bg-secondary/50 transition-colors first:rounded-t-lg last:rounded-b-lg"
              onClick={() => handlePlaceSelect(prediction.place_id, prediction.description)}
            >
              <span className="block text-sm truncate">{prediction.description}</span>
              <span className="block text-xs text-muted-foreground truncate">
                {prediction.structured_formatting.secondary_text}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlacesAutocomplete;
