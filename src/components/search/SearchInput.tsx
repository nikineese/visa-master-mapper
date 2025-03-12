
import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  locationInput: string;
  setLocationInput: (value: string) => void;
  isSearching: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({ 
  locationInput, 
  setLocationInput, 
  isSearching 
}) => {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
      <input
        type="text"
        placeholder="Enter a location (e.g., New York, Chicago)"
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
  );
};

export default SearchInput;
