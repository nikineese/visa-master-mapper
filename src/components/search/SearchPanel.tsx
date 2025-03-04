
import React, { useState, useEffect } from 'react';
import { SearchParams } from '@/utils/api';
import { cn } from '@/lib/utils';
import { Sliders } from 'lucide-react';
import { toast } from 'sonner';
import { SearchPanelProps } from './types';
import SearchInput from './SearchInput';
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
  const [radius, setRadius] = useState(5); // 5 km default
  const [locationInput, setLocationInput] = useState('');
  const [services, setServices] = useState<string[]>([]);
  const [manualCoords, setManualCoords] = useState<[number, number] | null>(null);
  
  const toggleService = (service: string) => {
    if (services.includes(service)) {
      setServices(services.filter(s => s !== service));
    } else {
      setServices([...services, service]);
    }
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let searchLocation = userLocation;
    
    // If user has entered a location but we don't have coordinates
    if (locationInput && !searchLocation) {
      // In a real app, we would geocode the locationInput to get coordinates
      // For this demo, we'll simulate coordinates based on input
      searchLocation = simulateGeolocation();
      setManualCoords(searchLocation);
      setUserLocation(searchLocation);
      
      toast.info("Using approximate location for search");
    } else if (!searchLocation) {
      // Try to get user location if not available
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const coords: [number, number] = [latitude, longitude];
          setUserLocation(coords);
          
          onSearch({
            latitude,
            longitude,
            radius,
            networks,
            services: services.length > 0 ? services : undefined
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          
          // Use fallback coordinates if geolocation fails
          const fallbackCoords = simulateGeolocation();
          setUserLocation(fallbackCoords);
          setManualCoords(fallbackCoords);
          
          toast.warning("Could not get your exact location. Using approximate location for search.");
          
          onSearch({
            latitude: fallbackCoords[0],
            longitude: fallbackCoords[1],
            radius,
            networks,
            services: services.length > 0 ? services : undefined
          });
        }
      );
      return;
    }
    
    if (searchLocation) {
      onSearch({
        latitude: searchLocation[0],
        longitude: searchLocation[1],
        radius,
        networks,
        services: services.length > 0 ? services : undefined
      });
    }
  };
  
  // Get initial user location
  useEffect(() => {
    if (navigator.geolocation && !userLocation) {
      getCurrentLocation(setUserLocation);
    }
  }, [userLocation, setUserLocation]);
  
  return (
    <div className="w-full max-w-md glassmorphism rounded-xl overflow-hidden card-shadow">
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <SearchInput 
            locationInput={locationInput}
            setLocationInput={setLocationInput}
            isSearching={isSearching}
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
          isSearching={isSearching}
        />
        
        <SearchButton isSearching={isSearching} />
      </form>
    </div>
  );
};

export default SearchPanel;
