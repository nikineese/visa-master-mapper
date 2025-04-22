import mockAtms from '../vinnytsia_atms.json'

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
    console.log(mockAtms);

    // For now, continue with mock implementation
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return mockAtms;
  } catch (error) {
    console.error('Error calling Visa API:', error);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return mockAtms;
  }
};

// This is a mock implementation since we can't directly use the Visa API without proper credentials
// In a real implementation, this would transform the Visa API response

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
