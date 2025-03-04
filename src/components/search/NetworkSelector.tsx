
import React from 'react';
import { cn } from '@/lib/utils';
import { CreditCard, CheckCircle2 } from 'lucide-react';

interface NetworkSelectorProps {
  networks: ('VISA' | 'MASTERCARD')[];
  toggleNetwork: (network: 'VISA' | 'MASTERCARD') => void;
  isSearching: boolean;
}

const NetworkSelector: React.FC<NetworkSelectorProps> = ({ 
  networks, 
  toggleNetwork, 
  isSearching 
}) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium flex items-center gap-1.5">
          <CreditCard size={14} /> Networks
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
  );
};

export default NetworkSelector;
