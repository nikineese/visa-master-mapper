
export interface ATM {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  distance?: number; // in kilometers
  networks: ('VISA' | 'MASTERCARD')[];
  services: string[];
  hours: string;
  phoneNumber?: string;
  availableCash?: string[]; // Added field for cash denominations
}

export interface SearchParams {
  latitude: number;
  longitude: number;
  radius: number; // in kilometers
  networks: ('VISA' | 'MASTERCARD')[];
  services?: string[];
}

// This is a mock implementation since we can't directly use the Visa/Mastercard APIs
// In a real implementation, this would make actual API calls
export const searchATMs = async (params: SearchParams): Promise<ATM[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const mockATMs: ATM[] = [
    {
      id: '1',
      name: 'Downtown Bank ATM',
      address: '123 Main Street',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      coordinates: {
        latitude: params.latitude + 0.002,
        longitude: params.longitude + 0.003
      },
      networks: ['VISA', 'MASTERCARD'],
      services: ['Cash Withdrawal', 'Balance Inquiry', 'Deposits'],
      hours: '24/7',
      phoneNumber: '+1 (555) 123-4567',
      availableCash: ['50 UAH', '100 UAH', '200 UAH']
    },
    {
      id: '2',
      name: 'Central Credit Union',
      address: '456 Park Avenue',
      city: 'New York',
      state: 'NY',
      postalCode: '10002',
      coordinates: {
        latitude: params.latitude - 0.001,
        longitude: params.longitude + 0.002
      },
      networks: ['VISA'],
      services: ['Cash Withdrawal', 'Balance Inquiry'],
      hours: 'Mon-Fri: 9AM-8PM, Sat: 10AM-5PM, Sun: Closed',
      availableCash: ['50 UAH', '100 UAH']
    },
    {
      id: '3',
      name: 'Midtown Financial ATM',
      address: '789 Broadway',
      city: 'New York',
      state: 'NY',
      postalCode: '10003',
      coordinates: {
        latitude: params.latitude + 0.003,
        longitude: params.longitude - 0.002
      },
      networks: ['MASTERCARD'],
      services: ['Cash Withdrawal', 'Cash Deposit', 'Check Deposit'],
      hours: '24/7',
      phoneNumber: '+1 (555) 987-6543',
      availableCash: ['100 UAH', '500 UAH']
    },
    {
      id: '4',
      name: 'West Side Bank',
      address: '101 Hudson Street',
      city: 'New York',
      state: 'NY',
      postalCode: '10004',
      coordinates: {
        latitude: params.latitude - 0.003,
        longitude: params.longitude - 0.004
      },
      networks: ['VISA', 'MASTERCARD'],
      services: ['Cash Withdrawal', 'Balance Inquiry', 'Pin Change'],
      hours: 'Mon-Sun: 8AM-10PM',
      availableCash: ['50 UAH', '100 UAH', '200 UAH', '500 UAH']
    },
    {
      id: '5',
      name: 'North Hills Credit Union',
      address: '202 Fifth Avenue',
      city: 'New York',
      state: 'NY',
      postalCode: '10005',
      coordinates: {
        latitude: params.latitude + 0.005,
        longitude: params.longitude - 0.001
      },
      networks: ['MASTERCARD'],
      services: ['Cash Withdrawal'],
      hours: 'Mon-Fri: 9AM-5PM, Sat-Sun: Closed',
      availableCash: ['100 UAH']
    }
  ];
  
  // Filter by network
  let filteredATMs = mockATMs.filter(atm => 
    params.networks.some(network => atm.networks.includes(network))
  );
  
  // Filter by services if specified
  if (params.services && params.services.length > 0) {
    filteredATMs = filteredATMs.filter(atm => 
      params.services!.some(service => atm.services.includes(service))
    );
  }
  
  // Calculate distance (simplified formula)
  filteredATMs = filteredATMs.map(atm => {
    const lat1 = params.latitude;
    const lon1 = params.longitude;
    const lat2 = atm.coordinates.latitude;
    const lon2 = atm.coordinates.longitude;
    
    // Simplified distance calculation (not accurate for real usage)
    const distance = Math.sqrt(
      Math.pow((lat2 - lat1) * 111, 2) + 
      Math.pow((lon2 - lon1) * 111 * Math.cos(lat1 * Math.PI / 180), 2)
    );
    
    return { ...atm, distance };
  });
  
  // Filter by radius
  filteredATMs = filteredATMs.filter(atm => 
    (atm.distance || 0) <= params.radius
  );
  
  // Sort by distance
  filteredATMs.sort((a, b) => (a.distance || 0) - (b.distance || 0));
  
  return filteredATMs;
};
