import { createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";


export interface Wallet {
  id: number;
  balance: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

interface WalletState {
  wallet: Wallet | null;
  loading: boolean;
  error: string | null;
}

const initialState: WalletState = {
  wallet: null,
  loading: false,
  error: null,
};

const API = "http://localhost:5454/api/wallets";
const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("user_jwt")}`,
  },
});

// 1. Fetch user wallet
export const fetchUserWallet = createAsyncThunk("wallet/fetchUserWallet", async (_, thunkAPI) => {
  try {
    const res = await axios.get(`${API}/user/wallet`, getAuthHeader());
    console.log("",res.data);
    
    return res.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// 2. Pay for an order
export const payForOrder = createAsyncThunk("wallet/payForOrder", async (orderId: number, thunkAPI) => {
  try {
    const res = await axios.put(`${API}/order/${orderId}/pay`, null, getAuthHeader());
    console.log("",res.data);
    return res.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// 3. Transfer wallet-to-wallet
export const transferToWallet = createAsyncThunk(
  "wallet/transferToWallet",
  async ({ walletId, amount }: { walletId: number; amount: number }, thunkAPI) => {
    try {
      const res = await axios.put(
        `${API}/${walletId}/transfer`,
        { amount },
        getAuthHeader()
      );
      console.log("",res.data);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 4. Add balance using Razorpay payment
export const addBalanceAfterPayment = createAsyncThunk(
  "wallet/addBalanceAfterPayment",
  async ({ orderId, payment_id }: { orderId: number; payment_id: string }, thunkAPI) => {
    try {
      const res = await axios.post(
        `${API}/order/${orderId}/pay-order?payment_id=${payment_id}`,
        {},
        getAuthHeader()
      );
      console.log("",res.data);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    clearWalletState: (state) => {
      state.wallet = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Wallet
      .addCase(fetchUserWallet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserWallet.fulfilled, (state, action: PayloadAction<Wallet>) => {
        state.loading = false;
        state.wallet = action.payload;
      })
      .addCase(fetchUserWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Pay for order
      .addCase(payForOrder.fulfilled, (state, action: PayloadAction<Wallet>) => {
        state.wallet = action.payload;
      })

      // Transfer
      .addCase(transferToWallet.fulfilled, (state, action: PayloadAction<Wallet>) => {
        state.wallet = action.payload;
      })

      // Add balance
      .addCase(addBalanceAfterPayment.fulfilled, (state, action: PayloadAction<Wallet>) => {
        state.wallet = action.payload;
      });
  },
});

export const { clearWalletState } = walletSlice.actions;

export default walletSlice.reducer;
