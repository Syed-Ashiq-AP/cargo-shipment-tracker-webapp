import React, { useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
import { useDispatch } from 'react-redux';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Clock, Package } from 'lucide-react';
import { Button } from './ui/button';
import type { Shipment } from '../store/slices/shipmentSlice';
import type { AppDispatch } from '../store';
import { updateShipmentLocation } from '../store/slices/shipmentSlice';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface ShipmentMapProps {
  shipments: Shipment[];
  selectedShipment: Shipment | null;
  onSelectShipment: (shipment: Shipment | null) => void;
}

export const ShipmentMap: React.FC<ShipmentMapProps> = ({
  shipments,
  selectedShipment,
  onSelectShipment,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const mapRef = useRef<L.Map>(null);

  // Map click handler component
  const MapClickHandler = () => {
    useMapEvents({
      click: (e: L.LeafletMouseEvent) => {
        if (selectedShipment) {
          const { lat, lng } = e.latlng;
          const newLocation = {
            lat,
            lng,
            name: `Updated Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
            timestamp: new Date().toISOString(),
          };

          dispatch(updateShipmentLocation({
            id: selectedShipment._id,
            location: newLocation,
          }));
        }
      },
    });
    return null;
  };

  // Custom icons for different shipment statuses
  const createCustomIcon = (status: string) => {
    const colors = {
      'In Transit': '#3B82F6',
      'Delivered': '#10B981',
      'Delayed': '#EF4444',
      'Processing': '#F59E0B',
      'Departed': '#8B5CF6',
    };

    return L.divIcon({
      html: `<div style="background-color: ${colors[status as keyof typeof colors] || '#6B7280'}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      className: 'custom-marker',
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
  };

  const routeIcon = L.divIcon({
    html: '<div style="background-color: #9CA3AF; width: 8px; height: 8px; border-radius: 50%; border: 2px solid white;"></div>',
    className: 'route-marker',
    iconSize: [8, 8],
    iconAnchor: [4, 4],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Transit': return 'text-blue-400';
      case 'Delivered': return 'text-green-400';
      case 'Delayed': return 'text-red-400';
      case 'Processing': return 'text-yellow-400';
      case 'Departed': return 'text-purple-400';
      default: return 'text-muted-foreground';
    }
  };

  // Calculate map center based on shipments
  const calculateCenter = (): [number, number] => {
    if (shipments.length === 0) return [39.8283, -98.5795]; // Center of US

    const lats = shipments.map(s => s.currentLocation.lat);
    const lngs = shipments.map(s => s.currentLocation.lng);
    
    const centerLat = lats.reduce((sum, lat) => sum + lat, 0) / lats.length;
    const centerLng = lngs.reduce((sum, lng) => sum + lng, 0) / lngs.length;
    
    return [centerLat, centerLng];
  };

  const center = calculateCenter();

  return (
    <div className="space-y-4">
      {/* Map Controls */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {selectedShipment ? (
            <span>
              Click on the map to update location for shipment{' '}
              <strong className="text-foreground">{selectedShipment.shipmentId}</strong>
            </span>
          ) : (
            'Select a shipment to update its location'
          )}
        </div>
        {selectedShipment && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelectShipment(null)}
          >
            Clear Selection
          </Button>
        )}
      </div>

      {/* Map Container */}
      <div className="h-96 rounded-lg overflow-hidden border border-border bg-card">
        <MapContainer
          center={center}
          zoom={4}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <MapClickHandler />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Shipment Markers */}
          {shipments.map((shipment) => (
            <React.Fragment key={shipment._id}>
              {/* Current Location Marker */}
              <Marker
                position={[shipment.currentLocation.lat, shipment.currentLocation.lng]}
                icon={createCustomIcon(shipment.status)}
              >
                <Popup>
                  <div className="p-2 min-w-48 bg-card text-foreground">
                    <div className="font-semibold text-lg mb-2 text-foreground">{shipment.shipmentId}</div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Package className="w-4 h-4 mr-1" />
                        Container: {shipment.containerId}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {shipment.currentLocation.name}
                      </div>
                      <div className="flex items-center">
                        <Navigation className="w-4 h-4 mr-1" />
                        {shipment.origin} → {shipment.destination}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        ETA: {new Date(shipment.eta).toLocaleDateString()}
                      </div>
                      <div className={`font-semibold ${getStatusColor(shipment.status)}`}>
                        {shipment.status}
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>

              {/* Route Markers and Line */}
              {shipment.route.map((location, index) => (
                <Marker
                  key={`${shipment._id}-route-${index}`}
                  position={[location.lat, location.lng]}
                  icon={routeIcon}
                >
                  <Popup>
                    <div className="bg-card text-foreground">
                      <strong className="text-foreground">{location.name}</strong>
                      <br />
                      <span className="text-muted-foreground">Route point {index + 1}</span>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* Route Line */}
              {shipment.route.length > 1 && (
                <Polyline
                  positions={shipment.route.map(loc => [loc.lat, loc.lng] as [number, number])}
                  color={selectedShipment?._id === shipment._id ? '#3B82F6' : '#9CA3AF'}
                  weight={selectedShipment?._id === shipment._id ? 4 : 2}
                  opacity={0.7}
                />
              )}
            </React.Fragment>
          ))}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="font-semibold mb-2 text-foreground">Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
            In Transit
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
            Delivered
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
            Delayed
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
            Processing
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-purple-500 mr-2"></div>
            Departed
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-gray-400 mr-2"></div>
            Route Points
          </div>
        </div>
      </div>
    </div>
  );
};
