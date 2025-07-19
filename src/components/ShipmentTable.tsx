import React from 'react';
import { format } from 'date-fns';
import { MapPin, Clock, Eye } from 'lucide-react';
import { Button } from './ui/button';
import type { Shipment } from '../store/slices/shipmentSlice';

interface ShipmentTableProps {
  shipments: Shipment[];
  onSelectShipment: (shipment: Shipment) => void;
  getStatusColor: (status: string) => string;
}

export const ShipmentTable: React.FC<ShipmentTableProps> = ({
  shipments,
  onSelectShipment,
  getStatusColor,
}) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch {
      return dateString;
    }
  };

  if (shipments.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg">No shipments found</div>
        <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Shipment Details
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Route
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Current Location
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ETA
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {shipments.map((shipment) => (
            <tr key={shipment._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {shipment.shipmentId}
                  </div>
                  <div className="text-sm text-gray-500">
                    Container: {shipment.containerId}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 text-green-500 mr-1" />
                    {shipment.origin}
                  </div>
                  <div className="flex items-center mt-1">
                    <MapPin className="w-4 h-4 text-red-500 mr-1" />
                    {shipment.destination}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {shipment.currentLocation.name}
                </div>
                <div className="text-xs text-gray-500">
                  {shipment.currentLocation.lat.toFixed(4)}, {shipment.currentLocation.lng.toFixed(4)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(shipment.status)}`}>
                  {shipment.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-gray-900">
                  <Clock className="w-4 h-4 mr-1" />
                  {formatDate(shipment.eta)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSelectShipment(shipment)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
