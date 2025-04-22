
import React from 'react';
import AnimatedTransition from '../AnimatedTransition';
import NetworkSelector from './NetworkSelector';
import RadiusSelector from './RadiusSelector';
import ServicesSelector from './ServicesSelector';
import CashDenominationsSelector from './CashDenominationsSelector';

interface FiltersPanelProps {
  networks: ('VISA' | 'MASTERCARD')[];
  toggleNetwork: (network: 'VISA' | 'MASTERCARD') => void;
  radius: number;
  setRadius: (radius: number) => void;
  services: string[];
  toggleService: (service: string) => void;
  availableCash: string[];
  toggleCashDenomination: (denomination: string) => void;
  isSearching: boolean;
}

const FiltersPanel: React.FC<FiltersPanelProps> = ({
  networks,
  toggleNetwork,
  radius,
  setRadius,
  services,
  toggleService,
  availableCash,
  toggleCashDenomination,
  isSearching
}) => {
  return (
    <AnimatedTransition
      show={true}
      duration={300}
      type="fade"
      className="overflow-hidden"
    >
      <div className="bg-secondary/30 backdrop-blur-sm rounded-lg p-3 mb-4">
        <NetworkSelector
          networks={networks}
          toggleNetwork={toggleNetwork}
          isSearching={isSearching}
        />

        <RadiusSelector
          radius={radius}
          setRadius={setRadius}
          isSearching={isSearching}
        />

        <CashDenominationsSelector
          availableCash={availableCash}
          toggleCashDenomination={toggleCashDenomination}
          isSearching={isSearching}
        />

        <ServicesSelector
          services={services}
          toggleService={toggleService}
          isSearching={isSearching}
        />
      </div>
    </AnimatedTransition>
  );
};

export default FiltersPanel;
