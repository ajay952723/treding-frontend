import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// API setup with baseURL
const api = axios.create({
  baseURL: 'http://localhost:5454', // change if backend runs on another port
});

// Interfaces
export interface CreateOrderRequest {
  coinId: string;
  quantity: number;
  orderType: 'BUY' | 'SELL';
}

export interface Order {
  id: number;
  orderType: 'BUY' | 'SELL';
  price: number;
  timestamp: string;
  orderStatus: string;
  user: {
    id: number;
    fullName: string;
    email: string;
    mobile: string;
    role: string;
  };
  orderItem: {
    id: number;
    quantity: number;
    buyprice: number;
    sellPrice: number;
    coin: {
      id: string;
      symbol: string;
      name: string;
      image: string;
      current_price: number;
      market_cap: number;
      market_cap_rank: number;
      total_volume: number;
      high_24h: number;
      low_24h: number;
      price_change_24h: number;
      price_change_percentage_24h: number;
      market_cap_change_24h: number;
      market_cap_change_percentage_24h: number;
      circulating_supply: number;
      total_supply: number;
      max_supply: number;
    };
  };
}

// Slice state
interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
};

// Helper for headers
const getAuthHeaders = (jwt: string) => ({
  headers: { Authorization: `Bearer ${jwt}` },
});

// Thunks
export const placeOrder = createAsyncThunk(
  'orders/placeOrder',
  async ({ jwt, request }: { jwt: string; request: CreateOrderRequest }, thunkAPI) => {
    try {
      const res = await api.post('/api/orders/pay', request, getAuthHeaders(jwt));
      console.log("Order placed:", res.data);
      return res.data as Order;
    } catch (err: any) {
      console.error("Order placement failed:", err.response?.data || err.message || err);
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to place order');
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchById',
  async ({ jwt, orderId }: { jwt: string; orderId: number }, thunkAPI) => {
    try {
      const res = await api.get(`/api/orders/${orderId}`, getAuthHeaders(jwt));
      return res.data as Order;
    } catch (err: any) {
      console.error("Fetch order failed:", err.response?.data || err.message || err);
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch order');
    }
  }
);

export const fetchAllOrders = createAsyncThunk(
  'orders/fetchAll',
  async (
    { jwt, orderType, assetSymbol }: { jwt: string; orderType?: string; assetSymbol?: string },
    thunkAPI
  ) => {
    try {
      const params = new URLSearchParams();
      if (orderType) params.append('order_type', orderType);
      if (assetSymbol) params.append('assetSymbol', assetSymbol);

      const res = await api.get(`/api/orders/all?${params.toString()}`, getAuthHeaders(jwt));
      console.log("Order fetch:", res.data);
      return res.data as Order[];
    } catch (err: any) {
      console.error("Fetch all orders failed:", err.response?.data || err.message || err);
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

// Slice
const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder(state) {
      state.currentOrder = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
