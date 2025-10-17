import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useParking } from '@/contexts/ParkingContext';
import { SpotCard } from '@/components/parking/SpotCard';
import { EnhancedBookingModal } from '@/components/parking/EnhancedBookingModal';
import { PredictivePanel } from '@/components/manager/PredictivePanel';
import { ParkingMap } from '@/components/parking/ParkingMap';
import { UserNav } from '@/components/UserNav';
import { ParkingSpot, SubscriptionType } from '@/types/parking';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { RefreshCw, TrendingUp, Map, Grid3x3, Car, BookOpen, Crown } from 'lucide-react';
import { MyBookings } from '@/components/parking/MyBookings';
import { SubscriptionPlans } from '@/components/parking/SubscriptionPlans';

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { spots, stats, snapshots, bookSpot } = useParking();
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionType>('guest');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [view, setView] = useState<'map' | 'grid' | 'bookings' | 'subscriptions'>('map');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [sortedSpots, setSortedSpots] = useState<ParkingSpot[]>(spots);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.longitude, position.coords.latitude]);
        },
        (error) => {
          console.log('Geolocation error:', error);
          // Default to Panaji, Goa if geolocation fails
          setUserLocation([73.8278, 15.4909]);
        }
      );
    } else {
      // Default to Panaji, Goa if geolocation not supported
      setUserLocation([73.8278, 15.4909]);
    }
  }, []);

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (loc1: [number, number], loc2: [number, number]) => {
    const R = 6371; // Earth's radius in km
    const dLat = (loc2[1] - loc1[1]) * Math.PI / 180;
    const dLon = (loc2[0] - loc1[0]) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(loc1[1] * Math.PI / 180) * Math.cos(loc2[1] * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Sort spots by distance from user location
  useEffect(() => {
    if (userLocation && spots.length > 0) {
      const spotsWithDistance = spots.map(spot => ({
        ...spot,
        distance: spot.location ? calculateDistance(userLocation, spot.location) : Infinity
      }));
      
      const sorted = spotsWithDistance.sort((a, b) => a.distance - b.distance);
      setSortedSpots(sorted);
    } else {
      setSortedSpots(spots);
    }
  }, [userLocation, spots]);

  // Handle navigation from booking
  useEffect(() => {
    if (location.state?.selectedSpotId) {
      const spot = spots.find(s => s.id === location.state.selectedSpotId);
      if (spot) {
        setSelectedSpot(spot);
        setView('map');
      }
    }
    if (location.state?.viewBookings) {
      setView('bookings');
    }
  }, [location.state, spots]);

  // Simulate real-time updates (refresh every 3 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleBook = (spot: ParkingSpot) => {
    setSelectedSpot(spot);
  };

  const handleConfirmBooking = () => {
    if (selectedSpot) {
      // The EnhancedBookingModal handles the booking internally
      setSelectedSpot(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-md sticky top-0 z-10 backdrop-blur-sm bg-card/95">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Car className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-primary">PARKIT</h1>
                <p className="text-sm text-muted-foreground">Find Your Perfect Spot</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm px-3 py-1.5 rounded-full bg-status-free/10 border border-status-free/20">
                <div className="w-2 h-2 bg-status-free rounded-full animate-pulse" />
                <span className="text-muted-foreground">
                  Live: {lastUpdate.toLocaleTimeString()}
                </span>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setLastUpdate(new Date())}
                title="Refresh"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
              <UserNav />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-card rounded-lg border shadow-sm">
            <p className="text-sm text-muted-foreground mb-1">Available</p>
            <p className="text-3xl font-bold text-status-free">{stats.free}</p>
          </div>
          <div className="p-4 bg-card rounded-lg border shadow-sm">
            <p className="text-sm text-muted-foreground mb-1">Occupied</p>
            <p className="text-3xl font-bold text-status-occupied">{stats.occupied}</p>
          </div>
          <div className="p-4 bg-card rounded-lg border shadow-sm">
            <p className="text-sm text-muted-foreground mb-1">Reserved</p>
            <p className="text-3xl font-bold text-status-reserved">{stats.reserved}</p>
          </div>
          <div className="p-4 bg-card rounded-lg border shadow-sm">
            <p className="text-sm text-muted-foreground mb-1">Avg Price</p>
            <p className="text-3xl font-bold text-primary">₹{stats.averagePrice.toFixed(2)}</p>
          </div>
        </div>

        {/* Predictive availability */}
        {snapshots.length > 0 && (
          <div className="mb-8">
            <PredictivePanel snapshots={snapshots} />
          </div>
        )}

        {/* Subscription info banner */}
        <div className="mb-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-primary" />
              <div>
                <h3 className="font-semibold">Become a Monthly Member</h3>
                <p className="text-sm text-muted-foreground">
                  ₹499/month - Skip surge pricing and get 2 hrs/day in Premium Zones
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="text-sm">
              Save up to ₹{((stats.averagePrice - 30) * 60).toFixed(0)}/month
            </Badge>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={view} onValueChange={(v) => setView(v as 'map' | 'grid' | 'bookings' | 'subscriptions')}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {view === 'bookings' ? 'My Bookings' : view === 'subscriptions' ? 'Subscription Plans' : 'Live Parking Availability'}
            </h2>
            <TabsList>
              <TabsTrigger value="map" className="gap-2">
                <Map className="w-4 h-4" />
                Map
              </TabsTrigger>
              <TabsTrigger value="grid" className="gap-2">
                <Grid3x3 className="w-4 h-4" />
                Grid
              </TabsTrigger>
              <TabsTrigger value="subscriptions" className="gap-2">
                <Crown className="w-4 h-4" />
                Plans
              </TabsTrigger>
              <TabsTrigger value="bookings" className="gap-2">
                <BookOpen className="w-4 h-4" />
                My Bookings
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="map">
            <div className="h-[600px] rounded-lg overflow-hidden border shadow-lg">
              <ParkingMap
                spots={sortedSpots}
                onSpotSelect={handleBook}
                selectedSpot={selectedSpot}
              />
            </div>
          </TabsContent>

          <TabsContent value="grid">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedSpots.map((spot) => (
                <SpotCard
                  key={spot.id}
                  spot={spot}
                  onBook={handleBook}
                  subscription={subscription}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="subscriptions">
            <SubscriptionPlans />
          </TabsContent>

          <TabsContent value="bookings">
            <MyBookings />
          </TabsContent>
        </Tabs>
      </main>

      {/* Booking Modal */}
      <EnhancedBookingModal
        spot={selectedSpot}
        open={!!selectedSpot}
        onClose={() => setSelectedSpot(null)}
        onConfirm={handleConfirmBooking}
      />
    </div>
  );
};

export default Index;
