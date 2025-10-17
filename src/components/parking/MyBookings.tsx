import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navigation, MapPin, Clock, IndianRupee, Car, Bike, Zap, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useParking } from '@/contexts/ParkingContext';

interface Booking {
  id: string;
  spot_label: string;
  spot_id: number;
  start_time: string;
  duration_hours: number;
  total_cost: number;
  status: string;
  vehicle_type: string;
  vehicle_size?: string;
  fuel_type: string;
  parking_started_at?: string | null;
  vehicle_registration_number?: string;
}

export const MyBookings = () => {
  const { user } = useAuth();
  const { spots } = useParking();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('start_time', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error: any) {
      console.error('Error fetching bookings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load bookings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getDirections = (spotId: number) => {
    const spot = spots.find(s => s.id === spotId);
    if (!spot || !spot.location) {
      toast({
        title: 'Location Not Available',
        description: 'Unable to get directions for this spot',
        variant: 'destructive',
      });
      return;
    }

    const [lng, lat] = spot.location;
    // Open Google Maps with directions
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      '_blank'
    );
  };


  const endBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: 'completed',
          end_time: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: 'Booking Ended',
        description: 'Your parking session has been ended',
      });

      fetchBookings();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to end booking',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Car className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Active Bookings</h3>
        <p className="text-muted-foreground">
          You don't have any active parking reservations
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">My Active Bookings</h2>
        <Badge variant="secondary">{bookings.length} Active</Badge>
      </div>

      <div className="grid gap-4">
        {bookings.map((booking) => {
          const spot = spots.find(s => s.id === booking.spot_id);
          const bookingTime = new Date(booking.start_time);
          const parkingStarted = booking.parking_started_at ? new Date(booking.parking_started_at) : null;
          const endTime = parkingStarted 
            ? new Date(parkingStarted.getTime() + booking.duration_hours * 60 * 60 * 1000)
            : null;
          const timeRemaining = endTime ? Math.max(0, Math.floor((endTime.getTime() - Date.now()) / 60000)) : null;

          return (
            <Card key={booking.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Spot Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        {booking.spot_label}
                        {booking.fuel_type === 'ev' && (
                          <Zap className="w-5 h-5 text-status-ev" />
                        )}
                      </h3>
                      {spot?.zone && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <MapPin className="w-4 h-4" />
                          {spot.zone}
                        </div>
                      )}
                    </div>
                    {parkingStarted ? (
                      <Badge variant={timeRemaining && timeRemaining > 60 ? 'default' : 'destructive'}>
                        {timeRemaining && timeRemaining > 0 ? `${timeRemaining} min left` : 'Expired'}
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        Not Started
                      </Badge>
                    )}
                  </div>

                  {/* Vehicle & Booking Details */}
                  <div className="flex flex-wrap gap-4 text-sm">
                    {booking.vehicle_registration_number && (
                      <div className="flex items-center gap-2 font-mono font-bold text-primary">
                        <Car className="w-4 h-4" />
                        {booking.vehicle_registration_number}
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      {booking.vehicle_type === '2-wheeler' ? (
                        <Bike className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Car className="w-4 h-4 text-muted-foreground" />
                      )}
                      <span className="capitalize">
                        {booking.vehicle_type}
                        {booking.vehicle_size && ` • ${booking.vehicle_size}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{booking.duration_hours} hour{booking.duration_hours > 1 ? 's' : ''}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <IndianRupee className="w-4 h-4 text-muted-foreground" />
                      <span className="font-semibold">₹{booking.total_cost.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>Booked: {bookingTime.toLocaleTimeString()}</span>
                    </div>
                    
                    {parkingStarted && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-status-ev" />
                        <span>Started: {parkingStarted.toLocaleTimeString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => getDirections(booking.spot_id)}
                    className="gap-2"
                    variant="outline"
                  >
                    <Navigation className="w-4 h-4" />
                    Get Directions
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => endBooking(booking.id)}
                  >
                    End Session
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
