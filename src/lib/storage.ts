import { ParkingSpot, OccupancySnapshot, PricingConfig } from '@/types/parking';

const STORAGE_KEYS = {
  SPOTS: 'parkit_spots',
  SNAPSHOTS: 'parkit_snapshots',
  PRICING: 'parkit_pricing',
};

/**
 * Initialize default parking spots (₹ Indian pricing)
 */
export const getDefaultSpots = (): ParkingSpot[] => {
  const now = new Date().toISOString();
  const basePrice = 30; // ₹30/hr base for Indian market
  
  // Mock locations around Panaji, Goa
  const locations: [number, number][] = [
    [73.8278, 15.4909], [73.8285, 15.4912], [73.8290, 15.4906],
    [73.8282, 15.4915], [73.8287, 15.4903], [73.8293, 15.4910],
    [73.8280, 15.4917], [73.8295, 15.4908], [73.8283, 15.4901],
    [73.8291, 15.4914], [73.8281, 15.4905], [73.8288, 15.4911],
  ];
  
  return [
    { id: 1, label: 'Panaji-A1', status: 'free', price: basePrice, basePrice, lastUpdated: now, location: locations[0], zone: 'Panaji - Block A' },
    { id: 2, label: 'Panaji-A2', status: 'occupied', price: basePrice, basePrice, lastUpdated: now, location: locations[1], zone: 'Panaji - Block A' },
    { id: 3, label: 'Panaji-B1', status: 'free', isEV: true, price: basePrice, basePrice, lastUpdated: now, location: locations[2], zone: 'Panaji - Block B' },
    { id: 4, label: 'Panaji-B2', status: 'reserved', price: basePrice, basePrice, reservedBy: 'Priya Sharma', lastUpdated: now, location: locations[3], zone: 'Panaji - Block B' },
    { id: 5, label: 'Panaji-C1', status: 'free', price: basePrice, basePrice, lastUpdated: now, location: locations[4], zone: 'Panaji - Block C' },
    { id: 6, label: 'Panaji-C2', status: 'occupied', price: basePrice, basePrice, lastUpdated: now, location: locations[5], zone: 'Panaji - Block C' },
    { id: 7, label: 'Panaji-D1', status: 'free', isEV: true, price: basePrice, basePrice, lastUpdated: now, location: locations[6], zone: 'Panaji - Block D' },
    { id: 8, label: 'Panaji-D2', status: 'free', price: basePrice, basePrice, lastUpdated: now, location: locations[7], zone: 'Panaji - Block D' },
    { id: 9, label: 'Panaji-E1', status: 'reserved', price: basePrice, basePrice, reservedBy: 'Amit Desai', lastUpdated: now, location: locations[8], zone: 'Panaji - Block E' },
    { id: 10, label: 'Panaji-E2', status: 'occupied', price: basePrice, basePrice, lastUpdated: now, location: locations[9], zone: 'Panaji - Block E' },
    { id: 11, label: 'Panaji-F1', status: 'free', price: basePrice, basePrice, lastUpdated: now, location: locations[10], zone: 'Panaji - Block F' },
    { id: 12, label: 'Panaji-F2', status: 'reserved', isEV: true, price: basePrice, basePrice, reservedBy: 'Neha Patel', lastUpdated: now, location: locations[11], zone: 'Panaji - Block F' },
  ];
};

/**
 * Load spots from localStorage or return defaults
 */
export const loadSpots = (): ParkingSpot[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SPOTS);
    return stored ? JSON.parse(stored) : getDefaultSpots();
  } catch {
    return getDefaultSpots();
  }
};

/**
 * Save spots to localStorage
 */
export const saveSpots = (spots: ParkingSpot[]): void => {
  localStorage.setItem(STORAGE_KEYS.SPOTS, JSON.stringify(spots));
};

/**
 * Load occupancy snapshots
 */
export const loadSnapshots = (): OccupancySnapshot[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SNAPSHOTS);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

/**
 * Save occupancy snapshots
 */
export const saveSnapshots = (snapshots: OccupancySnapshot[]): void => {
  localStorage.setItem(STORAGE_KEYS.SNAPSHOTS, JSON.stringify(snapshots));
};

/**
 * Load pricing configuration
 */
export const loadPricingConfig = (): PricingConfig => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PRICING);
    return stored ? JSON.parse(stored) : {
      rule: 'balanced',
      evDiscount: 0.2,
      basePriceDefault: 30, // ₹30/hr
    };
  } catch {
    return {
      rule: 'balanced',
      evDiscount: 0.2,
      basePriceDefault: 30, // ₹30/hr
    };
  }
};

/**
 * Save pricing configuration
 */
export const savePricingConfig = (config: PricingConfig): void => {
  localStorage.setItem(STORAGE_KEYS.PRICING, JSON.stringify(config));
};
