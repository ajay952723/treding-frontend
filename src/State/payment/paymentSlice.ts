import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";



// Base URL for your PaymentController
const API = "http://localhost:5454/api/payment";

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("user_jwt")}`,
  },
});

export interface PaymentResponse {
  orderId: number;
  payment_url: string;
  paymentMethod: string;
  amount: number;
}

interface PaymentState {
  paymentResponse: PaymentResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  paymentResponse: null,
  loading: false,
  error: null,
};

// Async thunk to create payment order
export const createPaymentOrder = createAsyncThunk(
  "payment/createPaymentOrder",
  async (
    { amount, paymentMethod }: { amount: number; paymentMethod: "RAZORPAY" | "STRIPE" },
    thunkAPI
  ) => {
    try {
      const res = await axios.post(
        `${API}/${paymentMethod}/amount/${amount}`,
        {},
        getAuthHeader()
      );
      console.log("Payment response:", res.data);
     
      return res.data as PaymentResponse;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    clearPaymentState: (state) => {
      state.paymentResponse = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPaymentOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaymentOrder.fulfilled, (state, action: PayloadAction<PaymentResponse>) => {
        state.loading = false;
        state.paymentResponse = action.payload;
      })
      .addCase(createPaymentOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearPaymentState } = paymentSlice.actions;

export default paymentSlice.reducer;
