
import React, { useState, useEffect } from 'react';
import { Search, CreditCard } from 'lucide-react';
import AnimatedTransition from '@/components/AnimatedTransition';
import SearchPanel from '@/components/SearchPanel';
import MapView from '@/components/Map';
import { ATM, SearchParams, searchATMs } from '@/utils/api';
import ATMCard from '@/components/ATMCard';
import { toast } from '@/components/ui/sonner';

const Index = () => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [atms, setAtms] = useState<ATM[]>([]);
  const [selectedAtm, setSelectedAtm] = useState<ATM | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [highlightNetwork, setHighlightNetwork] = useState<'VISA' | 'MASTERCARD' | null>(null);

  const handleSearch = async (params: SearchParams) => {
    try {
      setIsSearching(true);
      setSelectedAtm(null);
      setShowResults(false);
      
      const results = await searchATMs(params);
      
      setAtms(results);
      setShowResults(true);
      
      if (results.length === 0) {
        toast.info('No ATMs found matching your criteria. Try expanding your search radius or changing filters.');
      } else {
        toast.success(`Found ${results.length} ATM${results.length === 1 ? '' : 's'} near you.`);
      }
    } catch (error) {
      console.error('Error searching ATMs:', error);
      toast.error('Failed to search for ATMs. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    // Check if user has interacted with the page
    const hasInteracted = localStorage.getItem('hasInteracted');
    
    if (hasInteracted === 'true' && userLocation) {
      // Automatically search when location is set and user has interacted before
      handleSearch({
        latitude: userLocation[0],
        longitude: userLocation[1],
        radius: 5,
        networks: ['VISA', 'MASTERCARD']
      });
    }
    
    // Set interaction flag
    localStorage.setItem('hasInteracted', 'true');
  }, [userLocation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30">
      <div className="container px-4 py-8 mx-auto max-w-7xl">
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-3">
            <CreditCard size={14} />
            VISA / Mastercard ATM Finder
          </div>
          <h1 className="text-4xl font-bold mb-2 tracking-tight">Find ATMs Near You</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Search for VISA and Mastercard ATMs in your area, filter by services, and get directions.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            <SearchPanel 
              onSearch={handleSearch} 
              isSearching={isSearching}
              userLocation={userLocation}
              setUserLocation={setUserLocation}
            />
            
            <AnimatedTransition
              show={showResults && atms.length > 0}
              duration={300}
              type="fade"
              className="mt-4 lg:max-h-[calc(100vh-320px)] lg:overflow-y-auto pr-1 space-y-3"
            >
              <div className="flex justify-between items-center mb-1">
                <h2 className="text-lg font-medium">Results ({atms.length})</h2>
                
                <div className="flex gap-1">
                  <button
                    className={`p-1 rounded ${highlightNetwork === 'VISA' ? 'bg-blue-100 text-blue-600' : 'hover:bg-secondary'}`}
                    onClick={() => setHighlightNetwork(highlightNetwork === 'VISA' ? null : 'VISA')}
                  >
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Visa.svg/1200px-Visa.svg.png" 
                      alt="Visa"
                      className="h-5 w-8 object-contain"
                    />
                  </button>
                  
                  <button
                    className={`p-1 rounded ${highlightNetwork === 'MASTERCARD' ? 'bg-orange-100 text-orange-600' : 'hover:bg-secondary'}`}
                    onClick={() => setHighlightNetwork(highlightNetwork === 'MASTERCARD' ? null : 'MASTERCARD')}
                  >
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Mastercard_2019_logo.svg/1200px-Mastercard_2019_logo.svg.png" 
                      alt="Mastercard"
                      className="h-5 w-8 object-contain"
                    />
                  </button>
                </div>
              </div>
              
              {atms.map(atm => (
                <ATMCard 
                  key={atm.id} 
                  atm={atm} 
                  onClick={() => setSelectedAtm(atm)}
                  isSelected={selectedAtm?.id === atm.id}
                  highlightNetwork={highlightNetwork}
                />
              ))}
            </AnimatedTransition>
            
            <AnimatedTransition
              show={showResults && atms.length === 0}
              duration={300}
              type="fade"
              className="mt-4"
            >
              <div className="bg-white/70 backdrop-blur-md rounded-xl border border-border p-4 text-center">
                <div className="text-muted-foreground mb-2">
                  <Search size={36} className="mx-auto mb-2 opacity-50" />
                </div>
                <h3 className="text-lg font-medium mb-1">No ATMs Found</h3>
                <p className="text-muted-foreground text-sm">
                  Try adjusting your search filters or increasing the search radius.
                </p>
              </div>
            </AnimatedTransition>
          </div>
          
          <div className="lg:col-span-2 h-[70vh] rounded-xl overflow-hidden shadow-xl bg-white/30 backdrop-blur-sm border border-border">
            <MapView 
              atms={atms} 
              selectedAtm={selectedAtm}
              setSelectedAtm={setSelectedAtm}
              userLocation={userLocation}
            />
          </div>
        </div>
        
        <footer className="text-center text-sm text-muted-foreground">
          <p>
            ATM Finder &copy; {new Date().getFullYear()} | VISA and Mastercard are registered trademarks of their respective owners.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
