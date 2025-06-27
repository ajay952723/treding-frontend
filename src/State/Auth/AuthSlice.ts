import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface AuthState {
  user: any | null;
  jwt: string | null;
  loading: boolean;
  error: string | null;
  isLoggedIn: boolean;
  twoFactorRequired: boolean;
  sessionId: string | null;
}

const initialState: AuthState = {
  user: null,
  jwt: localStorage.getItem("user_jwt") || null,
  loading: false,
  error: null,
  isLoggedIn: !!localStorage.getItem("user_jwt"),
  twoFactorRequired: false,
  sessionId: null,
};

// ✅ Register (POST /auth/signup)
export const register = createAsyncThunk(
  "auth/register",
  async (userData: any, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "http://localhost:5454/auth/signup",
        userData.data
      );
      localStorage.setItem("user_jwt", res.data.jwt);
      console.log("register successfully",res.data);
      userData.navigate("/")
      
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Registration failed"
      );
    }
  }
);

// ✅ Login (POST /auth/signin)
export const login = createAsyncThunk(
  "auth/login",
  async (credentials: any, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "http://localhost:5454/auth/signin",
        credentials
      );

      if (res.data.twoFactorAuthEnabled) {
        // Don't store JWT yet
        return {
          message: res.data.message,
          twoFactorRequired: true,
          sessionId: res.data.session,
        };
      } else {
        localStorage.setItem("user_jwt", res.data.jwt);
        console.log("login successfully",res.data);
        
        return res.data;
      }
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

// ✅ Verify 2FA OTP (POST /auth/two-factor/otp/{otp}?id={sessionId})
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (
    { otp, sessionId }: { otp: string; sessionId: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post(
        `http://localhost:5454/auth/two-factor/otp/${otp}?id=${sessionId}`
      );
      localStorage.setItem("user_jwt", res.data.jwt);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "OTP verification failed"
      );
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const jwt = localStorage.getItem("user_jwt");
      const res = await axios.get("http://localhost:5454/api/users/profile", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("user profile",res.data);
      
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load profile"
      );
    }
  }
);

// ✅ Logout
export const logout = createAsyncThunk("auth/logout", async () => {
    console.log("Logout successfully");
    
  localStorage.removeItem("user_jwt");
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Register
    builder.addCase(register.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.loading = false;
      state.jwt = action.payload.jwt;
      state.isLoggedIn = true;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Login
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload.twoFactorRequired) {
        state.twoFactorRequired = true;
        state.sessionId = action.payload.sessionId;
      } else {
        state.jwt = action.payload.jwt;
        state.isLoggedIn = true;
        state.twoFactorRequired = false;
        state.sessionId = null;
      }
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // OTP Verify
    builder.addCase(verifyOtp.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(verifyOtp.fulfilled, (state, action) => {
      state.loading = false;
      state.jwt = action.payload.jwt;
      state.isLoggedIn = true;
      state.twoFactorRequired = false;
      state.sessionId = null;
    });
    builder.addCase(verifyOtp.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.jwt = null;
      state.isLoggedIn = false;
      state.twoFactorRequired = false;
      state.sessionId = null;
      state.user = null;
      state.error = null;
    }),
      builder.addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      });
    builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(fetchUserProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default authSlice.reducer;
