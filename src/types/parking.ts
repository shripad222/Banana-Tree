export type SpotStatus = 'free' | 'occupied' | 'reserved';
export type SubscriptionType = 'regular' | 'guest';
export type PricingRule = 'conservative' | 'balanced' | 'aggressive';
export type VehicleType = '2-wheeler' | '4-wheeler';
export type VehicleSize = 'small' | 'medium' | 'large';
export type FuelType = 'ev' | 'non-ev';

export interface VehicleInfo {
  type: VehicleType;
  size: VehicleSize;
  fuelType: FuelType;
}

export interface ParkingSpot {
  id: number;
  label: string;
  status: SpotStatus;
  isEV?: boolean;
  price: number;
  basePrice: number;
  reservedBy?: string;
  lastUpdated: string;
  location?: [number, number]; // [lng, lat] for map
  zone?: string; // e.g., "Connaught Place - Block A"
}

export interface ParkingStats {
  total: number;
  free: number;
  occupied: number;
  reserved: number;
  occupancyRate: number;
  averagePrice: number;
}

export interface PredictionResult {
  predictedFree: number;
  confidence: 'low' | 'medium' | 'high';
  reasoning: string;
}

export interface OccupancySnapshot {
  timestamp: string;
  free: number;
  total: number;
}

export interface PricingConfig {
  rule: PricingRule;
  evDiscount: number;
  basePriceDefault: number;
}
