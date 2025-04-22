
import { SearchParams } from '@/utils/api';

export interface SearchPanelProps {
  onSearch: (params: SearchParams) => void;
  isSearching: boolean;
  mapCenter: { lat: number; lng: number };
}

export interface NetworkType {
  id: 'VISA' | 'MASTERCARD';
  active: boolean;
}

export interface CashDenomination {
  value: string;
  active: boolean;
}
