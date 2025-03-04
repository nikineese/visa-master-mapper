
import React from 'react';

interface RadiusSelectorProps {
  radius: number;
  setRadius: (radius: number) => void;
  isSearching: boolean;
}

const RadiusSelector: React.FC<RadiusSelectorProps> = ({ 
  radius, 
  setRadius, 
  isSearching 
}) => {
  return (
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
  );
};

export default RadiusSelector;
