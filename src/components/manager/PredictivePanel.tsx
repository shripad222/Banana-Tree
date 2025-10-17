import { OccupancySnapshot } from '@/types/parking';
import { predictAvailability } from '@/lib/prediction';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Activity, AlertCircle } from 'lucide-react';

interface PredictivePanelProps {
  snapshots: OccupancySnapshot[];
  stats?: { occupancyRate: number };
}

export const PredictivePanel = ({ snapshots, stats }: PredictivePanelProps) => {
  const prediction = predictAvailability(snapshots, 30, stats);

  const getConfidenceBadge = () => {
    const variants = {
      low: { color: 'bg-status-occupied/20 text-status-occupied border-status-occupied', icon: AlertCircle },
      medium: { color: 'bg-status-reserved/20 text-status-reserved border-status-reserved', icon: Activity },
      high: { color: 'bg-status-free/20 text-status-free border-status-free', icon: TrendingUp },
    };

    const variant = variants[prediction.confidence];
    const Icon = variant.icon;

    return (
      <Badge variant="outline" className={variant.color}>
        <Icon className="w-3 h-3 mr-1" />
        {prediction.confidence.toUpperCase()} Confidence
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Predictive Availability
          </CardTitle>
          {getConfidenceBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Prediction result */}
        <div className="p-6 bg-primary/5 rounded-lg border border-primary/20">
          <p className="text-sm text-muted-foreground mb-2">In 30 minutes:</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-primary">
              {prediction.predictedFree}
            </span>
            <span className="text-lg text-muted-foreground">
              spots likely available
            </span>
          </div>
        </div>

        {/* Reasoning */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Analysis:</h4>
          <p className="text-sm text-muted-foreground">
            {prediction.reasoning}
          </p>
        </div>

        {/* Historical data info */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Data points:</span>
            <span className="font-medium">{snapshots.length}</span>
          </div>
          {snapshots.length < 10 && (
            <p className="text-xs text-muted-foreground mt-2">
              Prediction accuracy improves with more historical data
            </p>
          )}
        </div>

        {/* How it works */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">How it works:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Analyzes historical occupancy patterns</li>
            <li>• Calculates average change per 10-minute window</li>
            <li>• Extrapolates trend to predict future availability</li>
            <li>• Confidence based on data variance and sample size</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
