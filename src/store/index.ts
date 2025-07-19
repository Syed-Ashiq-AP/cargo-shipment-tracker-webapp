import { configureStore } from '@reduxjs/toolkit';
import shipmentReducer from './slices/shipmentSlice';

export const store = configureStore({
  reducer: {
    shipments: shipmentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
