
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
  mapCenter,
}) => {
  const [networks, setNetworks] = useState<('VISA' | 'MASTERCARD')[]>(['VISA', 'MASTERCARD']);
  const [radius, setRadius] = useState(5);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

      toast.info('Using approximate location for search');

      onSearch({
        latitude: mapCenter.lat,
        longitude: mapCenter.lng,
        radius,
        networks,
        services: services.length > 0 ? services : undefined,
        availableCash: availableCash.length > 0 ? availableCash : undefined
      });
  };

  return (
    <div className="w-full max-w-md glassmorphism rounded-xl overflow-hidden card-shadow">
      <form onSubmit={handleSubmit} className="p-4">

        <FilterPills
          networks={networks}
          toggleNetwork={toggleNetwork}
          isSearching={isSearching}
        />

        <FiltersPanel
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
