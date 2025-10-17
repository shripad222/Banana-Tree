import { ParkingSpot } from '@/types/parking';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Leaf, RotateCw, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface SpotControlProps {
  spot: ParkingSpot;
  onToggleStatus: () => void;
  onToggleEV: () => void;
  onUpdateBasePrice: (price: number) => void;
}

export const SpotControl = ({ spot, onToggleStatus, onToggleEV, onUpdateBasePrice }: SpotControlProps) => {
  const [priceInput, setPriceInput] = useState(spot.basePrice.toString());

  const getStatusColor = () => {
    switch (spot.status) {
      case 'free':
        return 'text-status-free';
      case 'occupied':
        return 'text-status-occupied';
      case 'reserved':
        return 'text-status-reserved';
    }
  };

  const handlePriceUpdate = () => {
    const price = parseFloat(priceInput);
    if (!isNaN(price) && price > 0) {
      onUpdateBasePrice(price);
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
          {/* Spot info */}
          <div className="md:col-span-1">
            <h4 className="font-bold text-lg">{spot.label}</h4>
            <p className={cn('text-sm font-medium', getStatusColor())}>
              {spot.status.toUpperCase()}
            </p>
          </div>

          {/* Status control */}
          <div className="md:col-span-1">
            <Button
              onClick={onToggleStatus}
              variant="outline"
              size="sm"
              className="w-full gap-2"
            >
              <RotateCw className="w-4 h-4" />
              Toggle
            </Button>
          </div>

          {/* EV toggle */}
          <div className="md:col-span-1">
            <Button
              onClick={onToggleEV}
              variant={spot.isEV ? 'default' : 'outline'}
              size="sm"
              className={cn(
                'w-full gap-2',
                spot.isEV && 'bg-status-ev hover:bg-status-ev/90'
              )}
            >
              <Leaf className="w-4 h-4" />
              {spot.isEV ? 'EV' : 'Regular'}
            </Button>
          </div>

          {/* Base price */}
          <div className="md:col-span-1">
            <div className="flex gap-2">
              <Input
                type="number"
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
                onBlur={handlePriceUpdate}
                className="w-full"
                min="0"
                step="0.5"
              />
            </div>
          </div>

          {/* Current price */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg">₹{spot.price}</span>
              <span className="text-xs text-muted-foreground">/hr</span>
            </div>
            {spot.reservedBy && (
              <p className="text-xs text-muted-foreground mt-1">
                {spot.reservedBy}
              </p>
            )}
            {spot.zone && (
              <p className="text-xs text-muted-foreground">{spot.zone}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
