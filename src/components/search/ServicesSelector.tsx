
import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronsUpDown, CheckCircle2 } from 'lucide-react';

interface ServicesSelectorProps {
  services: string[];
  toggleService: (service: string) => void;
  isSearching: boolean;
}

const ServicesSelector: React.FC<ServicesSelectorProps> = ({ 
  services, 
  toggleService, 
  isSearching 
}) => {
  // Available services
  const availableServices = [
    'Cash Withdrawal',
    'Cash Deposit',
    'Check Deposit',
    'Balance Inquiry',
    'Pin Change'
  ];
  
  return (
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
  );
};

export default ServicesSelector;
