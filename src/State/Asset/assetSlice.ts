import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Axios instance
const api = axios.create({
  baseURL: 'http://localhost:5454',
});

// Interfaces
export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
}

export interface AssetModel {
  id: number;
  coinId: string;
  quantity: number;
  buyPrice: number; // ✅ renamed from averageBuyPrice
  user: User;
  coin: Coin;
}

interface AssetState {
  assets: AssetModel[];
  selectedAsset: AssetModel | null;
  loading: boolean;
  error: string | null;
}

const initialState: AssetState = {
  assets: [],
  selectedAsset: null,
  loading: false,
  error: null,
};

// Helper for JWT headers
const getAuthHeaders = (jwt: string) => ({
  headers: { Authorization: `Bearer ${jwt}` },
});

// Thunks
export const fetchAllAssets = createAsyncThunk<AssetModel[], string>(
  'assets/fetchAll',
  async (jwt, thunkAPI) => {
    try {
      const res = await api.get('/api/asset', getAuthHeaders(jwt));
      console.log("fetchAllAssets", res.data);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch assets');
    }
  }
);

export const fetchAssetById = createAsyncThunk<AssetModel, { jwt: string; assetId: number }>(
  'assets/fetchById',
  async ({ jwt, assetId }, thunkAPI) => {
    try {
      const res = await api.get(`/api/asset/${assetId}`, getAuthHeaders(jwt));
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch asset by ID');
    }
  }
);

export const fetchAssetByCoinAndUser = createAsyncThunk<AssetModel, { jwt: string; coinId: string }>(
  'assets/fetchByCoinAndUser',
  async ({ jwt, coinId }, thunkAPI) => {
    try {
      const res = await api.get(`/api/asset/coin/${coinId}/user`, getAuthHeaders(jwt));
      console.log("AssetByCoinAndUser", res.data);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch user asset for coin');
    }
  }
);

// Slice
const assetSlice = createSlice({
  name: 'assets',
  initialState,
  reducers: {
    clearSelectedAsset(state) {
      state.selectedAsset = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAssets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAssets.fulfilled, (state, action: PayloadAction<AssetModel[]>) => {
        state.loading = false;
        state.assets = action.payload;
      })
      .addCase(fetchAllAssets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchAssetById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssetById.fulfilled, (state, action: PayloadAction<AssetModel>) => {
        state.loading = false;
        state.selectedAsset = action.payload;
      })
      .addCase(fetchAssetById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchAssetByCoinAndUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssetByCoinAndUser.fulfilled, (state, action: PayloadAction<AssetModel>) => {
        state.loading = false;
        state.selectedAsset = action.payload;
      })
      .addCase(fetchAssetByCoinAndUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedAsset } = assetSlice.actions;
export default assetSlice.reducer;
