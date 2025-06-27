import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { PayloadAction } from "@reduxjs/toolkit";

// API URL
const API = "http://localhost:5454/api/transaction";

// Get auth headers
const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("user_jwt")}`,
  },
});

// Types
export interface WalletTransaction {
  id: number;
  amount: number;
  type: string; // DEPOSIT, WITHDRAWAL, TRANSFER, etc.
  description: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

interface TransactionState {
  transactions: WalletTransaction[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  transactions: [],
  loading: false,
  error: null,
};

// Thunk: Fetch transactions for logged-in user
export const fetchUserTransactions = createAsyncThunk(
  "transaction/fetchUserTransactions",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(API, getAuthHeader());
      console.log("",res.data);
      
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Slice
const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    clearTransactionState: (state) => {
      state.transactions = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserTransactions.fulfilled, (state, action: PayloadAction<WalletTransaction[]>) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchUserTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearTransactionState } = transactionSlice.actions;

export default transactionSlice.reducer;
