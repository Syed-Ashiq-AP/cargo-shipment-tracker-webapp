import axios from 'axios';
import type { Location, Shipment } from '../types/shipment';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Backend response wrapper type
interface ApiResponse<T> {
  status: 'success' | 'error';
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  message?: string;
}

export const shipmentApi = {
  // Get all shipments
  getAllShipments: async () => {
    const response = await api.get<ApiResponse<Shipment[]>>('/shipments');
    return { data: response.data.data };
  },
  
  // Get shipment by ID
  getShipmentById: async (id: string) => {
    const response = await api.get<ApiResponse<Shipment>>(`/shipment/${id}`);
    return { data: response.data.data };
  },
  
  // Create new shipment
  createShipment: async (shipmentData: Partial<Shipment>) => {
    const response = await api.post<ApiResponse<Shipment>>('/shipment', shipmentData);
    return { data: response.data.data };
  },
  
  // Update shipment
  updateShipment: async (id: string, updates: Partial<Shipment>) => {
    const response = await api.put<ApiResponse<Shipment>>(`/shipment/${id}`, updates);
    return { data: response.data.data };
  },
  
  // Update shipment location
  updateLocation: async (id: string, location: Location) => {
    const response = await api.post<ApiResponse<Shipment>>(`/shipment/${id}/update-location`, { location });
    return { data: response.data.data };
  },
  
  // Get shipment ETA
  getETA: async (id: string) => {
    const response = await api.get<ApiResponse<{ shipmentId: string; eta: string }>>(`/shipment/${id}/eta`);
    return { data: response.data.data };
  },
};
