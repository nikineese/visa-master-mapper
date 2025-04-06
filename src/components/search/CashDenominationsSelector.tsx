
import React from 'react';
import { cn } from '@/lib/utils';
import { BanknoteIcon, CheckCircle2 } from 'lucide-react';

interface CashDenominationsSelectorProps {
  availableCash: string[];
  toggleCashDenomination: (denomination: string) => void;
  isSearching: boolean;
}

const CashDenominationsSelector: React.FC<CashDenominationsSelectorProps> = ({ 
  availableCash, 
  toggleCashDenomination, 
  isSearching 
}) => {
  // Available cash denominations
  const denominations = ['50 UAH', '100 UAH', '200 UAH', '500 UAH'];
  
  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium flex items-center gap-1.5">
          <BanknoteIcon size={14} /> Available Cash
        </label>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {denominations.map(denomination => (
          <button
            key={denomination}
            type="button"
            className={cn(
              "px-3 py-1 rounded-lg text-xs flex items-center gap-1 transition-colors",
              availableCash.includes(denomination)
                ? "bg-primary/10 border border-primary/30 text-primary"
                : "bg-white/50 border border-border"
            )}
            onClick={() => toggleCashDenomination(denomination)}
            disabled={isSearching}
          >
            {availableCash.includes(denomination) && <CheckCircle2 size={12} />}
            {denomination}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CashDenominationsSelector;
