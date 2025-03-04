
import { SearchParams } from '@/utils/api';

export interface SearchPanelProps {
  onSearch: (params: SearchParams) => void;
  isSearching: boolean;
  userLocation: [number, number] | null;
  setUserLocation: (location: [number, number]) => void;
}

export interface NetworkType {
  id: 'VISA' | 'MASTERCARD';
  active: boolean;
}
