import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../Store";

// Types
export interface CoinMarketData {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
}

export interface Watchlist {
  id: number;
  userId: number;
  coins: CoinMarketData[];
}

interface WatchlistState {
  watchlist: Watchlist | null;
  loading: boolean;
  error: string | null;
}

// Axios base config
const API = "http://localhost:5454/api/watchlist";
const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("user_jwt")}`,
  },
});

// Initial state
const initialState: WatchlistState = {
  watchlist: null,
  loading: false,
  error: null,
};

// Fetch user watchlist
export const fetchUserWatchlist = createAsyncThunk<Watchlist, void>(
  "watchlist/fetchUserWatchlist",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${API}/user`, getAuthHeader());
      console.log("fetch watchlist", res.data);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// Add coin to watchlist
export const addCoinToWatchlist = createAsyncThunk<CoinMarketData, string>(
  "watchlist/addCoinToWatchlist",
  async (coinId, thunkAPI) => {
    try {
      const res = await axios.post(
        `${API}/add/coin/${coinId}`,
        null,
        getAuthHeader()
      );
      console.log("Add coin ", res.data);

      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

export const removeCoinFromWatchlist = createAsyncThunk<string, string>(
  "watchlist/removeCoinFromWatchlist",
  async (coinId, thunkAPI) => {
    try {
      await axios.delete(`${API}/remove/coin/${coinId}`, getAuthHeader());
      return coinId; // Return coinId to remove it from state
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// Slice
const watchListSlice = createSlice({
  name: "watchlist",
  initialState,
  reducers: {
    clearWatchlistState: (state) => {
      state.watchlist = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch watchlist
      .addCase(fetchUserWatchlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserWatchlist.fulfilled,
        (state, action: PayloadAction<Watchlist>) => {
          state.loading = false;
          state.watchlist = action.payload;
        }
      )
      .addCase(fetchUserWatchlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Add coin to watchlist
      .addCase(addCoinToWatchlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addCoinToWatchlist.fulfilled,
        (state, action: PayloadAction<CoinMarketData>) => {
          state.loading = false;
          if (state.watchlist) {
            state.watchlist.coins.push(action.payload);
          }
        }
      )
      .addCase(addCoinToWatchlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(
        removeCoinFromWatchlist.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          if (state.watchlist) {
            state.watchlist.coins = state.watchlist.coins.filter(
              (coin) => coin.id !== action.payload
            );
          }
        }
      )
      .addCase(removeCoinFromWatchlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Exports
export const { clearWatchlistState } = watchListSlice.actions;
export const selectWatchlist = (state: RootState) => state.watchlist;
export default watchListSlice.reducer;
