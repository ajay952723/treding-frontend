import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface PaymentDetails {
  id: number;
  accountNumber: string;
  accountHoldername: string;
  ifscCode: string;
  bankName: string;
  createdAt: string;
  updatedAt: string;
}

interface PaymentState {
  details: PaymentDetails | null;
  loading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  details: null,
  loading: false,
  error: null,
};

const API = "http://localhost:5454/api/payment";

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("user_jwt")}`,
  },
});

// 1. Fetch User's Payment Details
export const fetchPaymentDetails = createAsyncThunk(
  "payment/fetchPaymentDetails",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${API}/payment-details`, getAuthHeader());
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 2. Add or Update Payment Details
export const addPaymentDetails = createAsyncThunk(
  "payment/addPaymentDetails",
  async (
    {
      accountNumber,
      accountHoldername,
      ifscCode,
      bankName,
    }: Omit<PaymentDetails, "id" | "createdAt" | "updatedAt">,
    thunkAPI
  ) => {
    try {
      const res = await axios.post(
        `${API}/payment-details`,
        { accountNumber, accountHoldername, ifscCode, bankName },
        getAuthHeader()
      );
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const paymentDetailsSlice = createSlice({
  name: "paymentDetails",
  initialState,
  reducers: {
    clearPaymentDetailsState: (state) => {
      state.details = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaymentDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentDetails.fulfilled, (state, action: PayloadAction<PaymentDetails>) => {
        state.loading = false;
        state.details = action.payload;
      })
      .addCase(fetchPaymentDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(addPaymentDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPaymentDetails.fulfilled, (state, action: PayloadAction<PaymentDetails>) => {
        state.loading = false;
        state.details = action.payload;
      })
      .addCase(addPaymentDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearPaymentDetailsState } = paymentDetailsSlice.actions;

export default paymentDetailsSlice.reducer;
