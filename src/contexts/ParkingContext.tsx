import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ParkingSpot, ParkingStats, SubscriptionType, OccupancySnapshot, PricingConfig } from '@/types/parking';
import { updateAllPrices } from '@/lib/pricing';
import { addSnapshot } from '@/lib/prediction';
import { loadSpots, saveSpots, loadSnapshots, saveSnapshots, loadPricingConfig, savePricingConfig, getDefaultSpots } from '@/lib/storage';
import { toast } from '@/hooks/use-toast';

interface ParkingContextType {
  spots: ParkingSpot[];
  stats: ParkingStats;
  snapshots: OccupancySnapshot[];
  pricingConfig: PricingConfig;
  bookSpot: (id: number, userName: string, subscription: SubscriptionType) => boolean;
  releaseSpot: (id: number) => boolean;
  toggleSpotStatus: (id: number) => void;
  toggleEV: (id: number) => void;
  updateBasePrice: (id: number, price: number) => void;
  updatePricingConfig: (config: Partial<PricingConfig>) => void;
  simulateFill: (count: number) => void;
  clearAllReservations: () => void;
}

const ParkingContext = createContext<ParkingContextType | undefined>(undefined);

export const ParkingProvider = ({ children }: { children: ReactNode }) => {
  const [spots, setSpots] = useState<ParkingSpot[]>([]);
  const [snapshots, setSnapshots] = useState<OccupancySnapshot[]>([]);
  const [pricingConfig, setPricingConfig] = useState<PricingConfig>({
    rule: 'balanced',
    evDiscount: 0.2,
    basePriceDefault: 10,
  });
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from storage
  useEffect(() => {
    try {
      const loadedSpots = loadSpots();
      const loadedSnapshots = loadSnapshots();
      const loadedConfig = loadPricingConfig();

      // Migrate old seeded data (e.g., Delhi/no-location) to Goa defaults once
      const needsMigrationToGoa =
        loadedSpots.length === 0 ||
        loadedSpots.every(s =>
          !s.location ||
          (typeof s.label === 'string' && s.label.startsWith('Spot ')) ||
          // Old Delhi bounding box approx (lon 76-78, lat 27-29)
          (s.location && s.location[0] > 76 && s.location[0] < 78 && s.location[1] > 27 && s.location[1] < 29)
        );

      const initialSpots = needsMigrationToGoa ? getDefaultSpots() : loadedSpots;

      if (needsMigrationToGoa) {
        try { saveSpots(initialSpots); } catch {}
      }

      setSpots(updateAllPrices(initialSpots, loadedConfig.evDiscount));
      setSnapshots(loadedSnapshots);
      setPricingConfig(loadedConfig);
    } catch (error) {
      console.error('Error initializing parking context:', error);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save to storage on changes
  useEffect(() => {
    if (spots.length > 0) {
      saveSpots(spots);
    }
  }, [spots]);

  useEffect(() => {
    saveSnapshots(snapshots);
  }, [snapshots]);

  useEffect(() => {
    savePricingConfig(pricingConfig);
  }, [pricingConfig]);

  // Calculate stats
  const stats: ParkingStats = React.useMemo(() => {
    const total = spots.length;
    const free = spots.filter(s => s.status === 'free').length;
    const occupied = spots.filter(s => s.status === 'occupied').length;
    const reserved = spots.filter(s => s.status === 'reserved').length;
    const occupancyRate = total > 0 ? (occupied + reserved) / total : 0;
    const averagePrice = total > 0 
      ? spots.reduce((sum, s) => sum + s.price, 0) / total 
      : 0;

    return { total, free, occupied, reserved, occupancyRate, averagePrice };
  }, [spots]);

  // Periodic snapshot updates (every 2 minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      setSnapshots(prev => addSnapshot(prev, stats.free, stats.total));
    }, 120000); // 2 minutes

    // Initial snapshot
    if (snapshots.length === 0 && stats.total > 0) {
      setSnapshots(prev => addSnapshot(prev, stats.free, stats.total));
    }

    return () => clearInterval(interval);
  }, [stats.free, stats.total]);

  // Update prices when occupancy changes
  useEffect(() => {
    setSpots(prev => updateAllPrices(prev, pricingConfig.evDiscount));
  }, [stats.occupancyRate, pricingConfig.evDiscount]);

  const bookSpot = (id: number, userName: string, subscription: SubscriptionType): boolean => {
    const spot = spots.find(s => s.id === id);
    if (!spot || spot.status !== 'free') {
      toast({
        title: 'Booking Failed',
        description: 'This spot is not available',
        variant: 'destructive',
      });
      return false;
    }

    setSpots(prev => prev.map(s => 
      s.id === id 
        ? { ...s, status: 'reserved', reservedBy: userName, lastUpdated: new Date().toISOString() }
        : s
    ));

    toast({
      title: 'Booking Successful',
      description: `Spot ${spot.label} reserved for ${userName}`,
    });

    return true;
  };

  const releaseSpot = (id: number): boolean => {
    const spot = spots.find(s => s.id === id);
    if (!spot) return false;

    setSpots(prev => prev.map(s =>
      s.id === id
        ? { ...s, status: 'free', reservedBy: undefined, lastUpdated: new Date().toISOString() }
        : s
    ));

    toast({
      title: 'Spot Released',
      description: `Spot ${spot.label} is now available`,
    });

    return true;
  };

  const toggleSpotStatus = (id: number) => {
    setSpots(prev => prev.map(s => {
      if (s.id !== id) return s;
      
      let newStatus: ParkingSpot['status'];
      if (s.status === 'free') newStatus = 'occupied';
      else if (s.status === 'occupied') newStatus = 'reserved';
      else newStatus = 'free';

      return {
        ...s,
        status: newStatus,
        reservedBy: newStatus === 'reserved' ? 'System' : undefined,
        lastUpdated: new Date().toISOString(),
      };
    }));
  };

  const toggleEV = (id: number) => {
    setSpots(prev => prev.map(s =>
      s.id === id
        ? { ...s, isEV: !s.isEV, lastUpdated: new Date().toISOString() }
        : s
    ));
  };

  const updateBasePrice = (id: number, price: number) => {
    setSpots(prev => prev.map(s =>
      s.id === id
        ? { ...s, basePrice: price, lastUpdated: new Date().toISOString() }
        : s
    ));
  };

  const updatePricingConfig = (config: Partial<PricingConfig>) => {
    setPricingConfig(prev => ({ ...prev, ...config }));
    toast({
      title: 'Pricing Updated',
      description: 'Pricing configuration has been updated',
    });
  };

  const simulateFill = (count: number) => {
    let filled = 0;
    setSpots(prev => prev.map(s => {
      if (filled >= count || s.status !== 'free') return s;
      filled++;
      return { ...s, status: 'occupied', lastUpdated: new Date().toISOString() };
    }));
    
    toast({
      title: 'Simulation Complete',
      description: `${filled} spots filled`,
    });
  };

  const clearAllReservations = () => {
    setSpots(prev => prev.map(s =>
      s.status === 'reserved'
        ? { ...s, status: 'free', reservedBy: undefined, lastUpdated: new Date().toISOString() }
        : s
    ));
    
    toast({
      title: 'Reservations Cleared',
      description: 'All reservations have been cleared',
    });
  };

  // Don't render children until initialized
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <ParkingContext.Provider
      value={{
        spots,
        stats,
        snapshots,
        pricingConfig,
        bookSpot,
        releaseSpot,
        toggleSpotStatus,
        toggleEV,
        updateBasePrice,
        updatePricingConfig,
        simulateFill,
        clearAllReservations,
      }}
    >
      {children}
    </ParkingContext.Provider>
  );
};

export const useParking = () => {
  const context = useContext(ParkingContext);
  if (!context) {
    throw new Error('useParking must be used within ParkingProvider');
  }
  return context;
};
