import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Play, Trash2, RotateCcw } from 'lucide-react';

interface BulkActionsProps {
  totalSpots: number;
  onSimulateFill: (count: number) => void;
  onClearReservations: () => void;
}

export const BulkActions = ({ totalSpots, onSimulateFill, onClearReservations }: BulkActionsProps) => {
  const [fillCount, setFillCount] = useState('5');

  const handleSimulateFill = () => {
    const count = parseInt(fillCount);
    if (!isNaN(count) && count > 0) {
      onSimulateFill(count);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="w-5 h-5" />
          Bulk Actions & Simulation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Simulate Fill */}
        <div className="space-y-3">
          <Label htmlFor="fill-count">Simulate Spot Fill</Label>
          <div className="flex gap-2">
            <Input
              id="fill-count"
              type="number"
              min="1"
              max={totalSpots}
              value={fillCount}
              onChange={(e) => setFillCount(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSimulateFill} className="gap-2">
              <Play className="w-4 h-4" />
              Fill
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Automatically fills the specified number of free spots as occupied
          </p>
        </div>

        {/* Clear Reservations */}
        <div className="space-y-3">
          <Label>Clear All Reservations</Label>
          <Button
            onClick={onClearReservations}
            variant="outline"
            className="w-full gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear Reservations
          </Button>
          <p className="text-xs text-muted-foreground">
            Removes all current reservations and marks spots as available
          </p>
        </div>

        {/* Demo note */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Demo Mode
          </h4>
          <p className="text-xs text-muted-foreground">
            Use these controls to simulate real-world scenarios and test dynamic pricing behavior
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
