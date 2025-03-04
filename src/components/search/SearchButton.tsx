
import React from 'react';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

interface SearchButtonProps {
  isSearching: boolean;
}

const SearchButton: React.FC<SearchButtonProps> = ({ isSearching }) => {
  return (
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
  );
};

export default SearchButton;
