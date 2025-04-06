
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
  availableCash?: string[]; // Added field for cash denominations search
}

// Helper function to generate random delta values
const generateRandomDelta = (min: number, max: number): number => {
  return (Math.random() * (max - min) + min) * (Math.random() > 0.5 ? 1 : -1);
};

// Visa API integration for ATM location search
const searchVisaATMs = async (params: SearchParams): Promise<ATM[]> => {
  try {
    const requestBody = {
      requestData: {
        culture: "en-US",
        options: {
          sort: {
            primary: "distance",
            direction: "asc"
          },
          range: {
            count: 10,
            start: 0
          },
          findFilters: [],
          operationName: "or",
          useFirstAmbiguous: true
        },
        distance: params.radius * 0.621371, // Convert km to miles
        location: {
          address: {},
          geocodes: {
            latitude: params.latitude.toString(),
            longitude: params.longitude.toString()
          },
          placeName: ""
        },
        distanceUnit: "mi",
        metaDataOptions: 0
      },
      wsRequestHeaderV2: {
        userId: "CDISIUserID",
        userBid: "10000108",
        requestTs: new Date().toISOString(),
        applicationId: "VATMLOC",
        correlationId: `atm-${Date.now()}`,
        requestMessageId: `request-${Date.now()}`
      }
    };

    // Add service filters if specified
    if (params.services && params.services.length > 0) {
      params.services.forEach(service => {
        requestBody.requestData.options.findFilters.push({
          filterName: "service",
          filterVaule: service
        });
      });
    }

    // This is where we would make the actual API call to Visa
    // For now, we'll continue using mock data but log the request
    console.log('Would call Visa API with:', requestBody);
    console.log('Visa API endpoint:', 'https://sandbox.api.visa.com/globalatmlocator/v3/localatms/totalsinquiry');
    
    // In a real implementation, we would do something like:
    /*
    const response = await fetch('https://sandbox.api.visa.com/globalatmlocator/v3/localatms/totalsinquiry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa('API_KEY:API_SECRET')
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Visa API error:', errorData);
      throw new Error('Failed to fetch ATM data from Visa API');
    }
    
    const data = await response.json();
    // Transform the Visa API response to our ATM format
    */
    
    // For now, continue with mock implementation
    return generateMockATMs(params);
  } catch (error) {
    console.error('Error calling Visa API:', error);
    // Fallback to mock data on error
    return generateMockATMs(params);
  }
};

// This is a mock implementation since we can't directly use the Visa API without proper credentials
// In a real implementation, this would transform the Visa API response
const generateMockATMs = (params: SearchParams): ATM[] => {
  const mockATMs: ATM[] = [
    {
      id: '1',
      name: 'Downtown Bank ATM',
      address: '123 Main Street',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      coordinates: {
        latitude: params.latitude + generateRandomDelta(0.001, 0.005),
        longitude: params.longitude + generateRandomDelta(0.001, 0.005)
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
        latitude: params.latitude + generateRandomDelta(0.001, 0.005),
        longitude: params.longitude + generateRandomDelta(0.001, 0.005)
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
        latitude: params.latitude + generateRandomDelta(0.001, 0.005),
        longitude: params.longitude + generateRandomDelta(0.001, 0.005)
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
        latitude: params.latitude + generateRandomDelta(0.001, 0.005),
        longitude: params.longitude + generateRandomDelta(0.001, 0.005)
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
        latitude: params.latitude + generateRandomDelta(0.001, 0.005),
        longitude: params.longitude + generateRandomDelta(0.001, 0.005)
      },
      networks: ['MASTERCARD'],
      services: ['Cash Withdrawal'],
      hours: 'Mon-Fri: 9AM-5PM, Sat-Sun: Closed',
      availableCash: ['100 UAH']
    }
  ];
  
  return mockATMs;
};

// Main search function, now tries Visa API first with fallback to mock data
export const searchATMs = async (params: SearchParams): Promise<ATM[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Use Visa API for searching
  let allATMs = await searchVisaATMs(params);
  
  // Filter by network
  let filteredATMs = allATMs.filter(atm => 
    params.networks.some(network => atm.networks.includes(network))
  );
  
  // Filter by services if specified
  if (params.services && params.services.length > 0) {
    filteredATMs = filteredATMs.filter(atm => 
      params.services!.some(service => atm.services.includes(service))
    );
  }
  
  // Filter by available cash denominations if specified
  if (params.availableCash && params.availableCash.length > 0) {
    filteredATMs = filteredATMs.filter(atm => 
      atm.availableCash && params.availableCash!.some(cash => atm.availableCash!.includes(cash))
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
