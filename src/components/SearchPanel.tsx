
import React, { useState, useEffect } from 'react';
import { SearchParams } from '@/utils/api';
import { cn } from '@/lib/utils';
import { 
  Search, 
  MapPin, 
  Sliders, 
  X, 
  CreditCard, 
  CircleDollarSign,
  ChevronDown,
  CheckCircle2, 
  ChevronsUpDown
} from 'lucide-react';
import AnimatedTransition from './AnimatedTransition';
import { toast } from 'sonner';

interface SearchPanelProps {
  onSearch: (params: SearchParams) => void;
  isSearching: boolean;
  userLocation: [number, number] | null;
  setUserLocation: (location: [number, number]) => void;
}

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
  
  // Available services
  const availableServices = [
    'Cash Withdrawal',
    'Cash Deposit',
    'Check Deposit',
    'Balance Inquiry',
    'Pin Change'
  ];
  
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
  
  // Function to simulate geolocation based on search input
  const simulateGeolocation = () => {
    // If there's user input but no actual geolocation, create a simulated location
    // For demo purposes, these coordinates are in New York City
    const defaultLat = 40.7128;
    const defaultLng = -74.0060;
    
    // Add some slight randomization to the coordinates
    const variation = (Math.random() - 0.5) * 0.05;
    const simulatedLat = defaultLat + variation;
    const simulatedLng = defaultLng + variation;
    
    return [simulatedLat, simulatedLng] as [number, number];
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
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([
            position.coords.latitude,
            position.coords.longitude
          ]);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Don't show toast here, we'll handle it in the search function
        }
      );
    }
  }, [userLocation, setUserLocation]);
  
  return (
    <div className="w-full max-w-md glassmorphism rounded-xl overflow-hidden card-shadow">
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Search for ATMs near you"
              className="search-input pl-10"
              value={locationInput}
              onChange={e => setLocationInput(e.target.value)}
              disabled={isSearching}
            />
            {locationInput && (
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setLocationInput('')}
              >
                <X size={16} />
              </button>
            )}
          </div>
          
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
        
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            className="filter-pill"
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    setUserLocation([
                      position.coords.latitude,
                      position.coords.longitude
                    ]);
                    setLocationInput('');
                  },
                  (error) => {
                    console.error('Error getting location:', error);
                    toast.error('Could not get your location. Please enter a location manually.');
                    
                    // Don't set simulated location here, let the user enter one
                  }
                );
              }
            }}
            disabled={isSearching}
          >
            <MapPin size={14} /> Current Location
          </button>
          
          {networks.map(network => (
            <button
              key={network}
              type="button"
              className={cn(
                "filter-pill",
                networks.includes(network) && "filter-pill-active"
              )}
              onClick={() => toggleNetwork(network)}
              disabled={isSearching}
            >
              <CreditCard size={14} /> {network}
            </button>
          ))}
        </div>
        
        <AnimatedTransition
          show={showFilters}
          duration={300}
          type="fade"
          className="overflow-hidden"
        >
          <div className="bg-secondary/30 backdrop-blur-sm rounded-lg p-3 mb-4">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium flex items-center gap-1.5">
                  <CircleDollarSign size={14} /> Networks
                </label>
              </div>
              
              <div className="flex gap-2">
                {(['VISA', 'MASTERCARD'] as const).map(network => (
                  <button
                    key={network}
                    type="button"
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors",
                      networks.includes(network)
                        ? network === 'VISA'
                          ? "bg-blue-100 text-blue-700 border border-blue-200"
                          : "bg-orange-100 text-orange-700 border border-orange-200"
                        : "bg-white/50 border border-border"
                    )}
                    onClick={() => toggleNetwork(network)}
                    disabled={isSearching || (networks.length === 1 && networks.includes(network))}
                  >
                    {networks.includes(network) && <CheckCircle2 size={14} />}
                    {network}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium" htmlFor="radius-slider">
                  Search Radius: {radius} km
                </label>
              </div>
              <input
                id="radius-slider"
                type="range"
                min="1"
                max="20"
                step="1"
                value={radius}
                onChange={e => setRadius(parseInt(e.target.value))}
                className="w-full"
                disabled={isSearching}
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium flex items-center gap-1.5">
                  <ChevronsUpDown size={14} /> Services
                </label>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {availableServices.map(service => (
                  <button
                    key={service}
                    type="button"
                    className={cn(
                      "px-3 py-1 rounded-lg text-xs flex items-center gap-1 transition-colors",
                      services.includes(service)
                        ? "bg-primary/10 border border-primary/30 text-primary"
                        : "bg-white/50 border border-border"
                    )}
                    onClick={() => toggleService(service)}
                    disabled={isSearching}
                  >
                    {services.includes(service) && <CheckCircle2 size={12} />}
                    {service}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </AnimatedTransition>
        
        <button
          type="submit"
          className={cn(
            "w-full bg-primary text-primary-foreground rounded-lg py-2.5 font-medium transition-all",
            "hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/30",
            isSearching && "opacity-70 cursor-not-allowed"
          )}
          disabled={isSearching}
        >
          {isSearching ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Search size={18} /> Find ATMs
            </span>
          )}
        </button>
      </form>
    </div>
  );
};

export default SearchPanel;

