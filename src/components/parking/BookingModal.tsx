import { useState } from 'react';
import { ParkingSpot, SubscriptionType } from '@/types/parking';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Leaf, CreditCard } from 'lucide-react';

interface BookingModalProps {
  spot: ParkingSpot | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (userName: string, subscription: SubscriptionType) => void;
}

export const BookingModal = ({ spot, open, onClose, onConfirm }: BookingModalProps) => {
  const [userName, setUserName] = useState('');
  const [subscription, setSubscription] = useState<SubscriptionType>('guest');

  const handleConfirm = () => {
    if (!userName.trim()) return;
    onConfirm(userName, subscription);
    setUserName('');
    setSubscription('guest');
    onClose();
  };

  if (!spot) return null;

  const finalPrice = subscription === 'regular' ? spot.basePrice : spot.price;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Book Parking Spot {spot.label}</DialogTitle>
          <DialogDescription>
            Complete your reservation details below
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Spot details */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <h4 className="font-semibold">{spot.label}</h4>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="bg-status-free/10 text-status-free border-status-free">
                  Available
                </Badge>
                {spot.isEV && (
                  <Badge className="bg-status-ev/20 text-status-ev border-status-ev">
                    <Leaf className="w-3 h-3 mr-1" />
                    EV
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Name input */}
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          {/* Subscription type */}
          <div className="space-y-3">
            <Label>Subscription Plan</Label>
            <RadioGroup value={subscription} onValueChange={(v) => setSubscription(v as SubscriptionType)}>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="guest" id="guest" />
                <Label htmlFor="guest" className="flex-1 cursor-pointer">
                  <div className="font-medium">Pay-as-you-go</div>
                  <div className="text-xs text-muted-foreground">Dynamic pricing based on demand</div>
                </Label>
                <div className="text-sm font-semibold">₹{spot.price}/hr</div>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer border-primary/50 bg-primary/5">
                <RadioGroupItem value="regular" id="regular" />
                <Label htmlFor="regular" className="flex-1 cursor-pointer">
                  <div className="font-medium flex items-center gap-2">
                    Monthly Plan
                    <Badge variant="secondary">₹499/month</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">2 hrs/day + No surge pricing</div>
                </Label>
                <div className="text-sm font-semibold">₹{spot.basePrice}/hr</div>
              </div>
            </RadioGroup>
          </div>

          {/* Price summary */}
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Price per hour</span>
              <div className="text-2xl font-bold text-primary">
                ₹{finalPrice.toFixed(2)}
              </div>
            </div>
            {subscription === 'regular' && spot.price !== spot.basePrice && (
              <p className="text-xs text-status-ev">
                ✓ You save ₹{(spot.price - spot.basePrice).toFixed(2)}/hr with Monthly plan!
              </p>
            )}
            {spot.isEV && (
              <p className="text-xs text-status-ev flex items-center gap-1 mt-1">
                <Leaf className="w-3 h-3" />
                ⚡ Supporting eco-friendly parking
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={!userName.trim()}
            className="gap-2"
          >
            <CreditCard className="w-4 h-4" />
            Confirm Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
