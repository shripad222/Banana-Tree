import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useParking } from '@/contexts/ParkingContext';
import { Analytics } from '@/components/manager/Analytics';
import { SpotControl } from '@/components/manager/SpotControl';
import { PredictivePanel } from '@/components/manager/PredictivePanel';
import { PricingControls } from '@/components/manager/PricingControls';
import { BulkActions } from '@/components/manager/BulkActions';
import { UserNav } from '@/components/UserNav';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield } from 'lucide-react';

const Manager = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const {
    spots,
    stats,
    snapshots,
    pricingConfig,
    toggleSpotStatus,
    toggleEV,
    updateBasePrice,
    updatePricingConfig,
    simulateFill,
    clearAllReservations,
  } = useParking();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-md sticky top-0 z-10 backdrop-blur-sm bg-card/95">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => signOut()}
                title="Sign Out"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-primary" />
                <div>
                  <h1 className="text-3xl font-bold text-primary">PARKIT Manager</h1>
                  <p className="text-sm text-muted-foreground">
                    Operations Dashboard
                  </p>
                </div>
              </div>
            </div>
            <UserNav />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Analytics Overview */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Analytics Overview</h2>
          <Analytics stats={stats} />
        </section>

        {/* Controls Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pricing Controls */}
          <div className="lg:col-span-2">
            <PricingControls
              config={pricingConfig}
              onUpdate={updatePricingConfig}
            />
          </div>

          {/* Bulk Actions */}
          <div>
            <BulkActions
              totalSpots={stats.total}
              onSimulateFill={simulateFill}
              onClearReservations={clearAllReservations}
            />
          </div>
        </div>

        {/* Predictive Analysis */}
        {snapshots.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4">AI Predictive Analysis</h2>
            <PredictivePanel snapshots={snapshots} stats={stats} />
          </section>
        )}

        {/* Spot Controls */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Spot Management</h2>
          <div className="space-y-3">
            <div className="grid grid-cols-5 gap-4 px-4 text-sm font-semibold text-muted-foreground">
              <div>Spot</div>
              <div>Status Toggle</div>
              <div>EV Mode</div>
              <div>Base Price</div>
              <div>Current Price</div>
            </div>
            {spots.map((spot) => (
              <SpotControl
                key={spot.id}
                spot={spot}
                onToggleStatus={() => toggleSpotStatus(spot.id)}
                onToggleEV={() => toggleEV(spot.id)}
                onUpdateBasePrice={(price) => updateBasePrice(spot.id, price)}
              />
            ))}
          </div>
        </section>

        {/* Info Section */}
        <section className="p-6 bg-muted/50 rounded-lg border">
          <h3 className="font-semibold mb-3">Manager Controls Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <h4 className="font-medium text-foreground mb-2">Status Toggle</h4>
              <p>Cycle through: Free → Occupied → Reserved</p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">EV Mode</h4>
              <p>Mark spots for electric vehicles (applies {(pricingConfig.evDiscount * 100).toFixed(0)}% discount)</p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">Base Price</h4>
              <p>Set starting price before dynamic adjustments</p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">Current Price</h4>
              <p>Final price with all multipliers and discounts applied</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Manager;
