import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { shipmentApi } from '../../api/shipmentApi';
import type { Location, Shipment } from '../../types/shipment';

// Re-export types for convenience
export type { Location, Shipment };

interface ShipmentState {
  shipments: Shipment[];
  currentShipment: Shipment | null;
  loading: boolean;
  error: string | null;
  filters: {
    status: string;
    search: string;
  };
}

const initialState: ShipmentState = {
  shipments: [],
  currentShipment: null,
  loading: false,
  error: null,
  filters: {
    status: '',
    search: '',
  },
};

// Async thunks
export const fetchShipments = createAsyncThunk(
  'shipments/fetchShipments',
  async () => {
    const response = await shipmentApi.getAllShipments();
    return response.data;
  }
);

export const fetchShipmentById = createAsyncThunk(
  'shipments/fetchShipmentById',
  async (id: string) => {
    const response = await shipmentApi.getShipmentById(id);
    return response.data;
  }
);

export const createShipment = createAsyncThunk(
  'shipments/createShipment',
  async (shipmentData: Partial<Shipment>) => {
    const response = await shipmentApi.createShipment(shipmentData);
    return response.data;
  }
);

export const updateShipment = createAsyncThunk(
  'shipments/updateShipment',
  async ({ id, updates }: { id: string; updates: Partial<Shipment> }) => {
    const response = await shipmentApi.updateShipment(id, updates);
    return response.data;
  }
);

export const updateShipmentLocation = createAsyncThunk(
  'shipments/updateLocation',
  async ({ id, location }: { id: string; location: Location }) => {
    const response = await shipmentApi.updateLocation(id, location);
    return response.data;
  }
);

export const getShipmentETA = createAsyncThunk(
  'shipments/getETA',
  async (id: string) => {
    const response = await shipmentApi.getETA(id);
    return response.data;
  }
);

const shipmentSlice = createSlice({
  name: 'shipments',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<ShipmentState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentShipment: (state) => {
      state.currentShipment = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all shipments
      .addCase(fetchShipments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShipments.fulfilled, (state, action) => {
        state.loading = false;
        state.shipments = action.payload;
      })
      .addCase(fetchShipments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch shipments';
      })
      // Fetch shipment by ID
      .addCase(fetchShipmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShipmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentShipment = action.payload;
      })
      .addCase(fetchShipmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch shipment';
      })
      // Create shipment
      .addCase(createShipment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createShipment.fulfilled, (state, action) => {
        state.loading = false;
        state.shipments.push(action.payload);
      })
      .addCase(createShipment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create shipment';
      })
      // Update shipment
      .addCase(updateShipment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateShipment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.shipments.findIndex(s => s._id === action.payload._id);
        if (index !== -1) {
          state.shipments[index] = action.payload;
        }
        if (state.currentShipment?._id === action.payload._id) {
          state.currentShipment = action.payload;
        }
      })
      .addCase(updateShipment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update shipment';
      })
      // Update location
      .addCase(updateShipmentLocation.fulfilled, (state, action) => {
        const index = state.shipments.findIndex(s => s._id === action.payload._id);
        if (index !== -1) {
          state.shipments[index] = action.payload;
        }
        if (state.currentShipment?._id === action.payload._id) {
          state.currentShipment = action.payload;
        }
      })
      // Get ETA
      .addCase(getShipmentETA.fulfilled, (state, action) => {
        const { shipmentId, eta } = action.payload;
        const index = state.shipments.findIndex(s => s._id === shipmentId);
        if (index !== -1) {
          state.shipments[index].eta = eta;
        }
        if (state.currentShipment?._id === shipmentId) {
          state.currentShipment.eta = eta;
        }
      });
  },
});

export const { setFilters, clearCurrentShipment, clearError } = shipmentSlice.actions;
export default shipmentSlice.reducer;
