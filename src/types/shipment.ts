export interface Location {
  lat: number;
  lng: number;
  name: string;
  timestamp?: string;
}

export interface Shipment {
  _id: string;
  shipmentId: string;
  containerId: string;
  route: Location[];
  currentLocation: Location;
  eta: string;
  status: 'In Transit' | 'Delivered' | 'Delayed' | 'Processing' | 'Departed';
  origin: string;
  destination: string;
  createdAt: string;
  updatedAt: string;
}
