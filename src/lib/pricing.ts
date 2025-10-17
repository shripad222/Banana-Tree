import { ParkingSpot, SubscriptionType, PricingRule } from '@/types/parking';

/**
 * Calculate dynamic pricing for a parking spot (in ₹)
 * 
 * Formula:
 * - Base occupancy multiplier based on occupancy rate
 * - EV discount applied for electric vehicle spots
 * - Regular subscription bypasses surge pricing
 * - All prices in Indian Rupees (₹)
 */
export const calculateSpotPrice = (
  spot: ParkingSpot,
  occupancyRate: number,
  evDiscount: number = 0.2,
  subscription?: SubscriptionType
): number => {
  // Regular subscribers get base price always
  if (subscription === 'regular') {
    return Number(spot.basePrice.toFixed(2));
  }

  // Calculate occupancy multiplier
  let multiplier = 1.0;
  if (occupancyRate > 0.75) {
    multiplier = 1.5; // High demand
  } else if (occupancyRate > 0.5) {
    multiplier = 1.25; // Moderate demand
  }

  // Apply EV discount if applicable
  let price = spot.basePrice * multiplier;
  if (spot.isEV) {
    price = price * (1 - evDiscount);
  }

  return Number(price.toFixed(2));
};

/**
 * Update all spot prices based on current occupancy
 */
export const updateAllPrices = (
  spots: ParkingSpot[],
  evDiscount: number = 0.2
): ParkingSpot[] => {
  const total = spots.length;
  const unavailable = spots.filter(
    s => s.status === 'occupied' || s.status === 'reserved'
  ).length;
  const occupancyRate = unavailable / total;

  return spots.map(spot => ({
    ...spot,
    price: calculateSpotPrice(spot, occupancyRate, evDiscount),
  }));
};

/**
 * Get pricing rule multipliers
 */
export const getPricingMultipliers = (rule: PricingRule) => {
  const multipliers = {
    conservative: { high: 1.2, moderate: 1.1 },
    balanced: { high: 1.5, moderate: 1.25 },
    aggressive: { high: 2.0, moderate: 1.5 },
  };
  return multipliers[rule];
};
