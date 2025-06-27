import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { PayloadAction } from "@reduxjs/toolkit";

// API config
const API = "http://localhost:5454/api/withdrawal";
const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("user_jwt")}`,
  },
});

// Types
export interface Withdrawal {
  id: number;
  amount: number;
  status: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  date: string;
  [key: string]: any;
}

interface WithdrawalState {
  withdrawals: Withdrawal[];
  loading: boolean;
  error: string | null;
}

const initialState: WithdrawalState = {
  withdrawals: [],
  loading: false,
  error: null,
};

// 1. Create Withdrawal Request
export const createWithdrawal = createAsyncThunk(
  "withdrawal/createWithdrawal",
  async (amount: number, thunkAPI) => {
    try {
      const res = await axios.post(`${API}/${amount}`, null, getAuthHeader());
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 2. Get User Withdrawal History
export const fetchUserWithdrawalsHistory = createAsyncThunk(
  "withdrawal/fetchUserWithdrawalsHistory",
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

// 3. Admin: Get All Withdrawal Requests
export const fetchAllWithdrawals = createAsyncThunk(
  "withdrawal/fetchAllWithdrawals",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${API}/admin/withdrawal`, getAuthHeader());
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 4. Admin: Approve or Reject Withdrawal
export const proceedWithdrawal = createAsyncThunk(
  "withdrawal/proceedWithdrawal",
  async ({ id, accept }: { id: number; accept: boolean }, thunkAPI) => {
    try {
      const res = await axios.patch(
        `${API}/admin/withdrawal/${id}/proced/${accept}`,
        null,
        getAuthHeader()
      );
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Slice
const withdrawalSlice = createSlice({
  name: "withdrawal",
  initialState,
  reducers: {
    clearWithdrawalState: (state) => {
      state.withdrawals = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Withdrawal
      .addCase(createWithdrawal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createWithdrawal.fulfilled, (state, action: PayloadAction<Withdrawal>) => {
        state.loading = false;
        state.withdrawals.unshift(action.payload);
      })
      .addCase(createWithdrawal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch User Withdrawals
      .addCase(fetchUserWithdrawalsHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserWithdrawalsHistory.fulfilled, (state, action: PayloadAction<Withdrawal[]>) => {
        state.loading = false;
        state.withdrawals = action.payload;
      })
      .addCase(fetchUserWithdrawalsHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch All (Admin)
      .addCase(fetchAllWithdrawals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllWithdrawals.fulfilled, (state, action: PayloadAction<Withdrawal[]>) => {
        state.loading = false;
        state.withdrawals = action.payload;
      })
      .addCase(fetchAllWithdrawals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Proceed Withdrawal (Admin)
      .addCase(proceedWithdrawal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(proceedWithdrawal.fulfilled, (state, action: PayloadAction<Withdrawal>) => {
        state.loading = false;
        state.withdrawals = state.withdrawals.map((w) =>
          w.id === action.payload.id ? action.payload : w
        );
      })
      .addCase(proceedWithdrawal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearWithdrawalState } = withdrawalSlice.actions;
export default withdrawalSlice.reducer;
