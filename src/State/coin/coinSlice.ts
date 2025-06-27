import { createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Interfaces
export interface CoinMarketData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  marketCap: number;
  [key: string]: any;
}

export interface CoinDetails {
  id: string;
  name: string;
  symbol: string;
  image: {
    small: string;
    thumb?: string;
    large?: string;
  };
  market_data: {
    current_price: {
      usd: number;
    };
    price_change_percentage_24h: number;
    market_cap_change_24h: number;
  };
  [key: string]: any;
}

interface CoinState {
  coins: CoinMarketData[];
  selectedCoin: CoinMarketData | null;
  chartData: any;
  details: CoinDetails | null;
  topCoins: any;
  trending: any;
  searchResult: any;
  loading: boolean;
  error: string | null;
}

const initialState: CoinState = {
  coins: [],
  selectedCoin: null,
  chartData: null,
  details: null,
  topCoins: null,
  trending: null,
  searchResult: null,
  loading: false,
  error: null,
};

// Thunks

export const fetchCoins = createAsyncThunk(
  "coin/fetchCoins",
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const res = await axios.get(`http://localhost:5454/api/coins/list?page=${page}`);
      console.log("",res.data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to fetch coins");
    }
  }
);

export const fetchMarketChart = createAsyncThunk(
  "coin/fetchMarketChart",
  async ({ coinId, days }: { coinId: string; days: number }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`http://localhost:5454/api/coins/${coinId}/market-chart?days=${days}`);
      console.log("",res.data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to fetch chart data");
    }
  }
);

export const fetchCoinDetails = createAsyncThunk(
  "coin/fetchCoinDetails",
  async (coinId: string, { rejectWithValue }) => {
    try {
      const res = await axios.get(`http://localhost:5454/api/coins/${coinId}/details`);
      console.log("fetchCoinDetails",res.data);
      
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to fetch coin details");
    }
  }
);

export const fetchCoinById = createAsyncThunk(
  "coin/fetchCoinById",
  async (coinId: string, { rejectWithValue }) => {
    try {
      const res = await axios.get(`http://localhost:5454/api/coins/${coinId}`);
      console.log("",res.data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to fetch coin");
    }
  }
);

export const searchCoin = createAsyncThunk(
  "coin/searchCoin",
  async (keyword: string, { rejectWithValue }) => {
    try {
      const res = await axios.get(`http://localhost:5454/api/coins/search?keyword=${keyword}`);
      console.log("",res.data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Search failed");
    }
  }
);

export const fetchTop50Coins = createAsyncThunk(
  "coin/fetchTop50Coins",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`http://localhost:5454/api/coins/top-50`);
      console.log("",res.data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to fetch top 50 coins");
    }
  }
);

export const fetchTrendingCoins = createAsyncThunk(
  "coin/fetchTrendingCoins",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`http://localhost:5454/api/coins/trending`);
      console.log("",res.data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to fetch trending coins");
    }
  }
);

// Slice
const coinSlice = createSlice({
  name: "coin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoins.fulfilled, (state, action: PayloadAction<CoinMarketData[]>) => {
        state.loading = false;
        state.coins = action.payload;
      })
      .addCase(fetchCoins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchMarketChart.fulfilled, (state, action) => {
        state.chartData = action.payload;
      })
      .addCase(fetchCoinDetails.fulfilled, (state, action: PayloadAction<CoinDetails>) => {
        state.details = action.payload;
      })
      .addCase(fetchCoinById.fulfilled, (state, action: PayloadAction<CoinMarketData>) => {
        state.selectedCoin = action.payload;
      })
      .addCase(searchCoin.fulfilled, (state, action) => {
        state.searchResult = action.payload;
      })
      .addCase(fetchTop50Coins.fulfilled, (state, action) => {
        state.topCoins = action.payload;
      })
      .addCase(fetchTrendingCoins.fulfilled, (state, action) => {
        state.trending = action.payload;
      });
  },
});

export default coinSlice.reducer;
