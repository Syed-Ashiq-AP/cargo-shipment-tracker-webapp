import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Plus, Minus, Save, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import type { AppDispatch } from '../store';
import { updateShipment, type Location, type Shipment } from '../store/slices/shipmentSlice';

interface EditShipmentFormProps {
  shipment: Shipment;
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormData {
  shipmentId: string;
  containerId: string;
  origin: string;
  destination: string;
  status: 'In Transit' | 'Delivered' | 'Delayed' | 'Processing' | 'Departed';
}

export const EditShipmentForm: React.FC<EditShipmentFormProps> = ({ 
  shipment, 
  onSuccess, 
  onCancel 
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [route, setRoute] = useState<Omit<Location, 'timestamp'>[]>(
    shipment.route.map(({ timestamp, ...rest }) => rest)
  );
  const [currentLocation, setCurrentLocation] = useState<Omit<Location, 'timestamp'>>({
    lat: shipment.currentLocation.lat,
    lng: shipment.currentLocation.lng,
    name: shipment.currentLocation.name
  });

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    defaultValues: {
      shipmentId: shipment.shipmentId,
      containerId: shipment.containerId,
      origin: shipment.origin,
      destination: shipment.destination,
      status: shipment.status
    }
  });

  const addRoutePoint = () => {
    setRoute([...route, { lat: 0, lng: 0, name: '' }]);
  };

  const removeRoutePoint = (index: number) => {
    if (route.length > 1) {
      setRoute(route.filter((_, i) => i !== index));
    }
  };

  const updateRoutePoint = (index: number, field: keyof Location, value: string | number) => {
    const newRoute = [...route];
    newRoute[index] = { ...newRoute[index], [field]: value };
    setRoute(newRoute);
  };

  const updateCurrentLocation = (field: keyof Location, value: string | number) => {
    setCurrentLocation({ ...currentLocation, [field]: value });
  };

  const onSubmit = async (data: FormData) => {
    try {
      const updatedShipmentData = {
        ...data,
        route: route.map(point => ({ ...point, timestamp: new Date().toISOString() })),
        currentLocation: { ...currentLocation, timestamp: new Date().toISOString() },
      };

      await dispatch(updateShipment({ 
        id: shipment._id, 
        updates: updatedShipmentData 
      })).unwrap();
      onSuccess();
    } catch (error) {
      console.error('Failed to update shipment:', error);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Edit Shipment</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={onCancel}
        >
          <X className="w-4 h-4 mr-1" />
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="shipmentId">Shipment ID</Label>
            <Input
              id="shipmentId"
              {...register('shipmentId', { required: 'Shipment ID is required' })}
              placeholder="SH-2025-001"
            />
            {errors.shipmentId && (
              <p className="text-destructive text-sm mt-1">{errors.shipmentId.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="containerId">Container ID</Label>
            <Input
              id="containerId"
              {...register('containerId', { required: 'Container ID is required' })}
              placeholder="CONT-2025-001"
            />
            {errors.containerId && (
              <p className="text-destructive text-sm mt-1">{errors.containerId.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="origin">Origin</Label>
            <Input
              id="origin"
              {...register('origin', { required: 'Origin is required' })}
              placeholder="New York Port"
            />
            {errors.origin && (
              <p className="text-destructive text-sm mt-1">{errors.origin.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="destination">Destination</Label>
            <Input
              id="destination"
              {...register('destination', { required: 'Destination is required' })}
              placeholder="Los Angeles Port"
            />
            {errors.destination && (
              <p className="text-destructive text-sm mt-1">{errors.destination.message}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            {...register('status', { required: 'Status is required' })}
            className="w-full p-2 border border-border rounded-md bg-background text-foreground"
          >
            <option value="Processing">Processing</option>
            <option value="In Transit">In Transit</option>
            <option value="Departed">Departed</option>
            <option value="Delivered">Delivered</option>
            <option value="Delayed">Delayed</option>
          </select>
          {errors.status && (
            <p className="text-destructive text-sm mt-1">{errors.status.message}</p>
          )}
        </div>

        {/* Current Location */}
        <div>
          <Label>Current Location</Label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <Input
              placeholder="Location Name"
              value={currentLocation.name}
              onChange={(e) => updateCurrentLocation('name', e.target.value)}
            />
            <Input
              type="number"
              step="any"
              placeholder="Latitude"
              value={currentLocation.lat}
              onChange={(e) => updateCurrentLocation('lat', parseFloat(e.target.value) || 0)}
            />
            <Input
              type="number"
              step="any"
              placeholder="Longitude"
              value={currentLocation.lng}
              onChange={(e) => updateCurrentLocation('lng', parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>

        {/* Route Points */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label>Route Points</Label>
            <Button type="button" onClick={addRoutePoint} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-1" />
              Add Point
            </Button>
          </div>
          {route.map((point, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <Input
                placeholder="Location Name"
                value={point.name}
                onChange={(e) => updateRoutePoint(index, 'name', e.target.value)}
              />
              <Input
                type="number"
                step="any"
                placeholder="Latitude"
                value={point.lat}
                onChange={(e) => updateRoutePoint(index, 'lat', parseFloat(e.target.value) || 0)}
              />
              <Input
                type="number"
                step="any"
                placeholder="Longitude"
                value={point.lng}
                onChange={(e) => updateRoutePoint(index, 'lng', parseFloat(e.target.value) || 0)}
              />
              {route.length > 1 && (
                <Button
                  type="button"
                  onClick={() => removeRoutePoint(index)}
                  size="sm"
                  variant="outline"
                >
                  <Minus className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            <Save className="w-4 h-4 mr-1" />
            {isSubmitting ? 'Updating...' : 'Update Shipment'}
          </Button>
        </div>
      </form>
    </div>
  );
};
