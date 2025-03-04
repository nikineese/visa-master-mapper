
import React from 'react';
import { cn } from '@/lib/utils';
import { MapPin, CreditCard } from 'lucide-react';
import { getCurrentLocation } from './LocationUtils';

interface FilterPillsProps {
  networks: ('VISA' | 'MASTERCARD')[];
  toggleNetwork: (network: 'VISA' | 'MASTERCARD') => void;
  isSearching: boolean;
  setUserLocation: (location: [number, number]) => void;
  setLocationInput: (value: string) => void;
}

const FilterPills: React.FC<FilterPillsProps> = ({ 
  networks, 
  toggleNetwork, 
  isSearching, 
  setUserLocation, 
  setLocationInput 
}) => {
  return (
    <div className="flex gap-2 mb-4">
      <button
        type="button"
        className="filter-pill"
        onClick={() => getCurrentLocation(setUserLocation, setLocationInput)}
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
  );
};

export default FilterPills;
