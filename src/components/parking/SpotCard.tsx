import { ParkingSpot, SubscriptionType } from '@/types/parking';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Leaf, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SpotCardProps {
  spot: ParkingSpot;
  onBook: (spot: ParkingSpot) => void;
  subscription?: SubscriptionType;
}

export const SpotCard = ({ spot, onBook, subscription }: SpotCardProps) => {
  const getStatusColor = () => {
    switch (spot.status) {
      case 'free':
        return 'bg-status-free/10 border-status-free text-status-free';
      case 'occupied':
        return 'bg-status-occupied/10 border-status-occupied text-status-occupied';
      case 'reserved':
        return 'bg-status-reserved/10 border-status-reserved text-status-reserved';
    }
  };

  const getStatusText = () => {
    switch (spot.status) {
      case 'free':
        return 'Available';
      case 'occupied':
        return 'Occupied';
      case 'reserved':
        return 'Reserved';
    }
  };

  return (
    <Card className={cn(
      'relative overflow-hidden transition-all duration-300 hover:shadow-lg',
      spot.status === 'free' && 'hover:scale-105 cursor-pointer'
    )}>
      <CardContent className="p-6">
        {/* Header with spot label and EV badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            <h3 className="text-2xl font-bold">{spot.label}</h3>
          </div>
          {spot.isEV && (
            <Badge className="bg-status-ev/20 text-status-ev border-status-ev">
              <Leaf className="w-3 h-3 mr-1" />
              EV
            </Badge>
          )}
        </div>

        {/* Status badge */}
        <div className="mb-4">
          <Badge 
            variant="outline" 
            className={cn('font-medium', getStatusColor())}
          >
            {getStatusText()}
          </Badge>
        </div>

        {/* Price display */}
        <div className="mb-4">
          <div className="text-3xl font-bold text-primary">
            ₹{spot.price}
            <span className="text-sm text-muted-foreground ml-1">/hr</span>
          </div>
          {spot.zone && (
            <p className="text-xs text-muted-foreground mt-1">{spot.zone}</p>
          )}
          {subscription === 'regular' && spot.status === 'free' && (
            <p className="text-xs text-status-ev mt-1">
              ✓ Monthly plan - no surge pricing
            </p>
          )}
          {spot.isEV && spot.status === 'free' && (
            <p className="text-xs text-status-ev mt-1">
              ⚡ 20% EV discount applied
            </p>
          )}
        </div>

        {/* Reserved by info */}
        {spot.reservedBy && (
          <p className="text-sm text-muted-foreground mb-4">
            Reserved by: {spot.reservedBy}
          </p>
        )}

        {/* Action button */}
        {spot.status === 'free' && (
          <Button 
            onClick={() => onBook(spot)}
            className="w-full"
          >
            Book Now
          </Button>
        )}

        {/* Last updated timestamp */}
        <p className="text-xs text-muted-foreground mt-4 text-center">
          Updated: {new Date(spot.lastUpdated).toLocaleTimeString()}
        </p>
      </CardContent>
    </Card>
  );
};
