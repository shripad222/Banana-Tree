import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ParkingSpot } from '@/types/parking';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface ParkingMapProps {
  spots: ParkingSpot[];
  onSpotSelect: (spot: ParkingSpot) => void;
  selectedSpot: ParkingSpot | null;
}

// Create custom markers based on spot status
const createCustomIcon = (status: string, isEV: boolean, spotNumber: string) => {
  const getStatusColor = (status: string, isEV: boolean) => {
    if (isEV) return '#22c55e';
    if (status === 'free') return '#10b981';
    if (status === 'occupied') return '#ef4444';
    return '#eab308';
  };

  const color = getStatusColor(status, isEV);

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: ${color};
        border: 3px solid white;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 10px;
        color: white;
        cursor: pointer;
      ">
        ${spotNumber}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

export const ParkingMap = ({ spots, onSpotSelect, selectedSpot }: ParkingMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = L.map(mapContainer.current).setView([15.4909, 73.8278], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map.current);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update markers when spots change
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    spots.forEach(spot => {
      if (!spot.location || !map.current) return;

      // Extract just the block and number (e.g., "A1" from "Panaji-A1")
      const spotNumber = spot.label.split('-').pop() || spot.label;
      const marker = L.marker([spot.location[1], spot.location[0]], {
        icon: createCustomIcon(spot.status, spot.isEV, spotNumber),
      }).addTo(map.current);

      marker.bindPopup(`
        <div style="padding: 8px;">
          <h3 style="font-weight: bold; margin-bottom: 4px;">${spot.label}</h3>
          <p style="margin: 2px 0;">₹${spot.price}/hr</p>
          ${spot.zone ? `<p style="margin: 2px 0; font-size: 12px; color: #666;">${spot.zone}</p>` : ''}
          ${spot.isEV ? '<p style="margin: 2px 0; color: #22c55e; font-size: 12px;">⚡ EV Charging</p>' : ''}
        </div>
      `);

      marker.on('click', () => {
        onSpotSelect(spot);
      });

      markersRef.current.push(marker);
    });
  }, [spots, onSpotSelect]);

  // Fly to selected spot
  useEffect(() => {
    if (!map.current || !selectedSpot?.location) return;
    map.current.flyTo([selectedSpot.location[1], selectedSpot.location[0]], 18, {
      duration: 1,
    });
  }, [selectedSpot]);

  // Handle location search
  const handleSearch = async () => {
    if (!searchQuery.trim() || !map.current) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        map.current.flyTo([parseFloat(lat), parseFloat(lon)], 15, {
          duration: 1.5,
        });
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg" />

      {/* Search Box */}
      <div className="absolute top-4 right-4 bg-card/95 backdrop-blur p-2 rounded-lg shadow-lg border z-[1000] w-64">
        <div className="flex gap-2">
          <Input
            placeholder="Search location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1"
          />
          <button
            onClick={handleSearch}
            className="px-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute top-4 left-4 bg-card/95 backdrop-blur px-4 py-2 rounded-lg shadow-lg border z-[1000]">
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-status-free" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-status-occupied" />
            <span>Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-status-reserved" />
            <span>Reserved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-status-ev" />
            <span>⚡ EV</span>
          </div>
        </div>
      </div>
    </div>
  );
};
