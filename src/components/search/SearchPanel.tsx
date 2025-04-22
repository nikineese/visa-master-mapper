
import React, { useState, useEffect } from 'react';
import { SearchParams } from '@/utils/api';
import { cn } from '@/lib/utils';
import { Sliders } from 'lucide-react';
import { toast } from 'sonner';
import { SearchPanelProps } from './types';
import PlacesAutocomplete from './PlacesAutocomplete';
import FilterPills from './FilterPills';
import FiltersPanel from './FiltersPanel';
import SearchButton from './SearchButton';
import { simulateGeolocation, getCurrentLocation } from './LocationUtils';

const SearchPanel: React.FC<SearchPanelProps> = ({ 
  onSearch, 
  isSearching,
  userLocation,
  setUserLocation
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [networks, setNetworks] = useState<('VISA' | 'MASTERCARD')[]>(['VISA', 'MASTERCARD']);
  const [radius, setRadius] = useState(5);
  const [locationInput, setLocationInput] = useState('');
  const [services, setServices] = useState<string[]>([]);
  const [availableCash, setAvailableCash] = useState<string[]>([]);
  
  const toggleService = (service: string) => {
    setServices(services.includes(service) 
      ? services.filter(s => s !== service)
      : [...services, service]
    );
  };
  
  const toggleCashDenomination = (denomination: string) => {
    setAvailableCash(availableCash.includes(denomination)
      ? availableCash.filter(d => d !== denomination)
      : [...availableCash, denomination]
    );
  };
  
  const toggleNetwork = (network: 'VISA' | 'MASTERCARD') => {
    if (networks.includes(network)) {
      // Don't remove if it's the only one selected
      if (networks.length > 1) {
        setNetworks(networks.filter(n => n !== network));
      }
    } else {
      setNetworks([...networks, network]);
    }
  };
  
  const handlePlaceSelect = (lat: number, lng: number, description?: string) => {
    const coords: [number, number] = [lat, lng];
    setUserLocation(coords);
    
    if (description) {
      setLocationInput(description);
    }
    
    // Trigger search immediately after setting the location
    onSearch({
      latitude: lat,
      longitude: lng,
      radius,
      networks,
      services: services.length > 0 ? services : undefined,
      availableCash: availableCash.length > 0 ? availableCash : undefined
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (userLocation) {
      onSearch({
        latitude: userLocation[0],
        longitude: userLocation[1],
        radius,
        networks,
        services: services.length > 0 ? services : undefined,
        availableCash: availableCash.length > 0 ? availableCash : undefined
      });
    } else if (locationInput) {
      // If we have a location input but no coordinates, try to use a simulated location
      const simulatedLocation = simulateGeolocation(locationInput);
      setUserLocation(simulatedLocation);
      
      toast.info('Using approximate location for search');
      
      onSearch({
        latitude: simulatedLocation[0],
        longitude: simulatedLocation[1],
        radius,
        networks,
        services: services.length > 0 ? services : undefined,
        availableCash: availableCash.length > 0 ? availableCash : undefined
      });
    } else {
      toast.error('Please select a location from the suggestions');
    }
  };
  
  useEffect(() => {
    if (navigator.geolocation && !userLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([
            position.coords.latitude,
            position.coords.longitude
          ]);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, [userLocation, setUserLocation]);
  
  return (
    <div className="w-full max-w-md glassmorphism rounded-xl overflow-hidden card-shadow">
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <PlacesAutocomplete 
            locationInput={locationInput}
            setLocationInput={setLocationInput}
            isSearching={isSearching}
            onPlaceSelect={handlePlaceSelect}
          />
          
          <button
            type="button"
            className={cn(
              "p-2 rounded-full border border-border bg-white/70 backdrop-blur-md hover:bg-white/90 transition-colors",
              showFilters && "bg-primary/10 border-primary/30"
            )}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Sliders size={20} className={cn(showFilters && "text-primary")} />
          </button>
        </div>
        
        <FilterPills 
          networks={networks}
          toggleNetwork={toggleNetwork}
          isSearching={isSearching}
          setUserLocation={setUserLocation}
          setLocationInput={setLocationInput}
        />
        
        <FiltersPanel 
          showFilters={showFilters}
          networks={networks}
          toggleNetwork={toggleNetwork}
          radius={radius}
          setRadius={setRadius}
          services={services}
          toggleService={toggleService}
          availableCash={availableCash}
          toggleCashDenomination={toggleCashDenomination}
          isSearching={isSearching}
        />
        
        <SearchButton isSearching={isSearching} />
      </form>
    </div>
  );
};

export default SearchPanel;
