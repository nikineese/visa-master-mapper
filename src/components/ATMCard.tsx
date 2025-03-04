import React from 'react';
import { ATM } from '@/utils/api';
import { formatDistance, getGoogleMapsUrl } from '@/utils/mapUtils';
import { cn } from '@/lib/utils';
import { ExternalLink, Clock, Phone, CreditCard, MapPin, Navigation } from 'lucide-react';

interface ATMCardProps {
  atm: ATM;
  onClick?: () => void;
  isSelected?: boolean;
  highlightNetwork?: 'VISA' | 'MASTERCARD' | null;
}

const ATMCard: React.FC<ATMCardProps> = ({ 
  atm, 
  onClick, 
  isSelected = false,
  highlightNetwork = null 
}) => {
  return (
    <div 
      className={cn(
        "atm-card group cursor-pointer",
        isSelected && "ring-2 ring-primary/70",
        "transform transition-transform duration-300 hover:translate-y-[-2px]"
      )}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-lg">{atm.name}</h3>
        <div className="flex gap-1">
          {atm.networks.map(network => (
            <span 
              key={network} 
              className={cn(
                "text-xs px-2 py-0.5 rounded-full font-medium",
                network === 'VISA' ? "bg-blue-50 text-blue-600 border border-blue-200" : "bg-orange-50 text-orange-600 border border-orange-200",
                highlightNetwork === network && "ring-2 ring-offset-1",
                highlightNetwork === 'VISA' && network === 'VISA' ? "ring-blue-400" : "",
                highlightNetwork === 'MASTERCARD' && network === 'MASTERCARD' ? "ring-orange-400" : ""
              )}
            >
              {network}
            </span>
          ))}
        </div>
      </div>
      
      <div className="flex items-center gap-1.5 text-muted-foreground mb-1.5">
        <MapPin size={14} />
        <p className="text-sm truncate">{atm.address}, {atm.city}</p>
      </div>
      
      {atm.distance !== undefined && (
        <div className="inline-block bg-secondary/70 text-secondary-foreground text-xs px-2 py-1 rounded-md mb-3">
          {formatDistance(atm.distance)}
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock size={14} />
          <p className="text-xs truncate">{atm.hours}</p>
        </div>
        
        {atm.phoneNumber && (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Phone size={14} />
            <p className="text-xs truncate">{atm.phoneNumber}</p>
          </div>
        )}
      </div>
      
      <div className="mt-2 flex flex-wrap gap-1.5 mb-3">
        {atm.services.map(service => (
          <span 
            key={service}
            className="text-xs bg-secondary/50 text-secondary-foreground px-2 py-0.5 rounded-full"
          >
            {service}
          </span>
        ))}
      </div>
      
      <a 
        href={getGoogleMapsUrl(atm)} 
        target="_blank" 
        rel="noopener noreferrer"
        className="bg-primary hover:bg-primary/90 text-white font-medium rounded-full px-4 py-2 flex items-center justify-center gap-2 transition-colors duration-300 shadow-sm hover:shadow-md"
        onClick={(e) => e.stopPropagation()}
      >
        <Navigation size={16} /> <span className="text-white">Navigate</span> <ExternalLink size={14} className="ml-1 text-white" />
      </a>
    </div>
  );
};

export default ATMCard;
