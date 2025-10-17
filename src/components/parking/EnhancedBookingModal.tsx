import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { ParkingSpot, VehicleType, VehicleSize, FuelType } from '@/types/parking';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Zap, MapPin, Clock, IndianRupee, Wallet, Car, Bike } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface EnhancedBookingModalProps {
  spot: ParkingSpot | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const EnhancedBookingModal = ({ spot, open, onClose, onConfirm }: EnhancedBookingModalProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hours, setHours] = useState(1);
  const [isBooking, setIsBooking] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [vehicleType, setVehicleType] = useState<VehicleType>('4-wheeler');
  const [vehicleSize, setVehicleSize] = useState<VehicleSize>('medium');
  const [fuelType, setFuelType] = useState<FuelType>('non-ev');
  const [registrationNumber, setRegistrationNumber] = useState('');

  // Calculate size multiplier
  const getSizeMultiplier = () => {
    if (vehicleType === '2-wheeler') return 0.5;
    switch (vehicleSize) {
      case 'small': return 0.8;
      case 'large': return 1.3;
      default: return 1;
    }
  };

  // Apply EV discount (20% off for electric vehicles)
  const getEvDiscount = () => {
    return fuelType === 'ev' ? 0.8 : 1;
  };

  const totalCost = spot ? spot.price * hours * getSizeMultiplier() * getEvDiscount() : 0;

  // Fetch wallet balance
  useEffect(() => {
    const fetchWalletBalance = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('wallet_balance')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching wallet balance:', error);
        return;
      }

      setWalletBalance(data?.wallet_balance || 0);
    };

    if (open) {
      fetchWalletBalance();
    }
  }, [user, open]);

  const handleBook = async () => {
    if (!spot || !user) return;

    // Validate registration number
    if (!registrationNumber.trim()) {
      toast({
        title: 'Registration Required',
        description: 'Please enter your vehicle registration number',
        variant: 'destructive',
      });
      return;
    }

    // Check if wallet has sufficient balance
    if (walletBalance < totalCost) {
      toast({
        title: 'Insufficient Balance',
        description: `You need ₹${totalCost.toFixed(2)} but only have ₹${walletBalance.toFixed(2)} in your wallet`,
        variant: 'destructive',
      });
      return;
    }

    setIsBooking(true);
    try {
      // Deduct from wallet
      const newBalance = walletBalance - totalCost;
      const { error: walletError } = await supabase
        .from('profiles')
        .update({ wallet_balance: newBalance })
        .eq('id', user.id);

      if (walletError) throw walletError;

      // Create booking with auto-start (simulating camera detection)
      const { error: bookingError } = await supabase.from('bookings').insert({
        user_id: user.id,
        spot_id: spot.id,
        spot_label: spot.label,
        price_per_hour: spot.price,
        duration_hours: hours,
        total_cost: totalCost,
        status: 'active',
        vehicle_type: vehicleType,
        vehicle_size: vehicleSize,
        fuel_type: fuelType,
        vehicle_registration_number: registrationNumber.trim().toUpperCase(),
        parking_started_at: new Date().toISOString(), // Auto-start on booking (camera detection simulation)
      });

      if (bookingError) throw bookingError;

      // Check for active subscription and apply benefits
      const { data: activeSub } = await supabase
        .from('user_subscriptions')
        .select('*, subscription_plans!inner(*)')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .gte('end_date', new Date().toISOString())
        .maybeSingle();

      let message = `${spot.label} reserved for ${hours} hour${hours > 1 ? 's' : ''}. Parking timer started automatically.`;
      
      if (activeSub) {
        if (activeSub.subscription_plans.unlimited_parking) {
          message = `${spot.label} reserved for ${hours} hour${hours > 1 ? 's' : ''} - FREE with your ${activeSub.plan_name}!`;
        } else if (activeSub.subscription_plans.discount_percentage > 0) {
          message = `${spot.label} reserved for ${hours} hour${hours > 1 ? 's' : ''} with ${activeSub.subscription_plans.discount_percentage}% discount!`;
        }
      }

      toast({
        title: 'Booking Confirmed!',
        description: message,
      });

      onConfirm();
      onClose();

      // Navigate to bookings tab
      setTimeout(() => {
        navigate('/', { state: { viewBookings: true } });
      }, 500);
    } catch (error: any) {
      toast({
        title: 'Booking Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsBooking(false);
    }
  };

  if (!spot) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            {spot.isEV && <Zap className="w-6 h-6 text-status-ev" />}
            Book {spot.label}
          </DialogTitle>
          <DialogDescription>
            Reserve your parking spot now
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Wallet Balance */}
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-primary" />
                <span className="font-semibold">Wallet Balance:</span>
              </div>
              <span className="text-xl font-bold text-primary">₹{walletBalance.toFixed(2)}</span>
            </div>
          </div>

          {/* Spot Details */}
          <div className="p-4 bg-muted/50 rounded-lg space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Location:</span>
              <span className="font-medium">{spot.zone || 'Premium Zone'}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <IndianRupee className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Rate:</span>
              <span className="font-medium">₹{spot.price}/hour</span>
            </div>

            {spot.isEV && (
              <div className="flex items-center gap-2 text-sm">
                <Zap className="w-4 h-4 text-status-ev" />
                <span className="text-status-ev font-medium">EV Charging Available</span>
              </div>
            )}
          </div>

          {/* Vehicle Registration Number */}
          <div className="space-y-2">
            <Label htmlFor="registration" className="flex items-center gap-2">
              <Car className="w-4 h-4" />
              Vehicle Registration Number
            </Label>
            <Input
              id="registration"
              type="text"
              placeholder="e.g., DL01AB1234"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value.toUpperCase())}
              className="uppercase"
              maxLength={15}
            />
          </div>

          {/* Vehicle Type */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Car className="w-4 h-4" />
              Vehicle Type
            </Label>
            <RadioGroup value={vehicleType} onValueChange={(v) => setVehicleType(v as VehicleType)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2-wheeler" id="2w" />
                <Label htmlFor="2w" className="cursor-pointer flex items-center gap-2">
                  <Bike className="w-4 h-4" />
                  2-Wheeler (50% discount)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="4-wheeler" id="4w" />
                <Label htmlFor="4w" className="cursor-pointer flex items-center gap-2">
                  <Car className="w-4 h-4" />
                  4-Wheeler
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Vehicle Size (only for 4-wheeler) */}
          {vehicleType === '4-wheeler' && (
            <div className="space-y-3">
              <Label>Vehicle Size</Label>
              <RadioGroup value={vehicleSize} onValueChange={(v) => setVehicleSize(v as VehicleSize)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="small" id="small" />
                  <Label htmlFor="small" className="cursor-pointer">Small Car (20% discount)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium" className="cursor-pointer">Medium Car (Standard)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="large" id="large" />
                  <Label htmlFor="large" className="cursor-pointer">Large Car (30% premium)</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Fuel Type */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Fuel Type
            </Label>
            <RadioGroup value={fuelType} onValueChange={(v) => setFuelType(v as FuelType)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ev" id="ev" />
                <Label htmlFor="ev" className="cursor-pointer flex items-center gap-2">
                  <Zap className="w-4 h-4 text-status-ev" />
                  Electric Vehicle (20% discount)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="non-ev" id="non-ev" />
                <Label htmlFor="non-ev" className="cursor-pointer">Non-Electric Vehicle</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Duration Selector */}
          <div className="space-y-2">
            <Label htmlFor="hours" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Duration (hours)
            </Label>
            <Input
              id="hours"
              type="number"
              min="1"
              max="24"
              value={hours}
              onChange={(e) => setHours(Math.max(1, Math.min(24, parseInt(e.target.value) || 1)))}
            />
          </div>

          {/* Total Cost */}
          <div className="p-4 bg-primary/10 rounded-lg border-2 border-primary/20">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">Total Cost:</span>
              <span className="text-2xl font-bold text-primary">₹{totalCost.toFixed(2)}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {hours} hour{hours > 1 ? 's' : ''} × ₹{spot.price}/hr × {getSizeMultiplier()}x
              {fuelType === 'ev' && ' × 0.8 (EV discount)'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleBook} 
              disabled={isBooking || walletBalance < totalCost} 
              className="flex-1"
            >
              {isBooking ? 'Booking...' : walletBalance < totalCost ? 'Insufficient Balance' : `Book for ₹${totalCost.toFixed(0)}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};