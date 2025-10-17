import { PricingConfig, PricingRule } from '@/types/parking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { DollarSign, Leaf } from 'lucide-react';

interface PricingControlsProps {
  config: PricingConfig;
  onUpdate: (config: Partial<PricingConfig>) => void;
}

export const PricingControls = ({ config, onUpdate }: PricingControlsProps) => {
  const pricingRules: { value: PricingRule; label: string; description: string }[] = [
    {
      value: 'conservative',
      label: 'Conservative',
      description: 'Lower price multipliers (1.2x high, 1.1x moderate)',
    },
    {
      value: 'balanced',
      label: 'Balanced',
      description: 'Standard multipliers (1.5x high, 1.25x moderate)',
    },
    {
      value: 'aggressive',
      label: 'Aggressive',
      description: 'Higher multipliers for maximum revenue (2.0x high, 1.5x moderate)',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Pricing Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pricing Rule */}
        <div className="space-y-3">
          <Label>Pricing Strategy</Label>
          <RadioGroup
            value={config.rule}
            onValueChange={(value) => onUpdate({ rule: value as PricingRule })}
          >
            {pricingRules.map((rule) => (
              <div
                key={rule.value}
                className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
              >
                <RadioGroupItem value={rule.value} id={rule.value} className="mt-1" />
                <Label htmlFor={rule.value} className="flex-1 cursor-pointer">
                  <div className="font-medium">{rule.label}</div>
                  <div className="text-xs text-muted-foreground">{rule.description}</div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* EV Discount */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-status-ev" />
              EV Discount
            </Label>
            <span className="font-medium">{(config.evDiscount * 100).toFixed(0)}%</span>
          </div>
          <Slider
            value={[config.evDiscount * 100]}
            onValueChange={([value]) => onUpdate({ evDiscount: value / 100 })}
            min={0}
            max={50}
            step={5}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Discount applied to electric vehicle parking spots to promote sustainable transportation
          </p>
        </div>

        {/* Base Price Default */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Default Base Price</Label>
            <span className="font-medium">₹{config.basePriceDefault.toFixed(2)}/hr</span>
          </div>
          <Slider
            value={[config.basePriceDefault]}
            onValueChange={([value]) => onUpdate({ basePriceDefault: value })}
            min={20}
            max={100}
            step={5}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Starting price (₹) before dynamic adjustments
          </p>
        </div>

        {/* Info box */}
        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
          <h4 className="font-semibold text-sm mb-2">Pricing Formula:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Base price × occupancy multiplier</li>
            <li>• EV discount applied to EV spots</li>
            <li>• Regular subscribers bypass surge pricing</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
