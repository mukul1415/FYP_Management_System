import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

const AUTH_SESSION_KEY = "authSession";

const hasAuthSession = () =>
  typeof window !== "undefined" &&
  localStorage.getItem(AUTH_SESSION_KEY) === "true";

const rememberAuthSession = () => {
  localStorage.setItem(AUTH_SESSION_KEY, "true");
};

const clearAuthSession = () => {
  localStorage.removeItem(AUTH_SESSION_KEY);
};

export const login = createAsyncThunk("login", async (data, thunkAPI) => {
  try {
    const res = await axiosInstance.post("/auth/login", data, {
      headers: { "Content-Type": "application/json" },
    });
    rememberAuthSession();
    toast.success(res.data.message);
    return res.data.user;
  } catch (error) {
    const message = error?.response?.data?.message || "Failed to login";
    toast.error(message);
    return thunkAPI.rejectWithValue(message);
  }
});

export const forgotPassword = createAsyncThunk(
  "auth/password/forgot",

  async (email, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/auth/password/forgot", {
        email,
      });

      toast.success(res.data.message);

      return null;
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to send reset email";

      toast.error(message);

      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const resetPassword = createAsyncThunk(
  "auth/password/reset",

  async ({ token, password, confirmPassword }, thunkAPI) => {
    try {
      const res = await axiosInstance.put(`/auth/password/reset/${token}`, {
        password,
        confirmPassword,
      });

      toast.success(res.data.message);

      return null;
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to reset password";

      toast.error(message);

      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const getUser = createAsyncThunk("auth/me", async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get(`/auth/me`);
    return res.data.user;
  } catch (error) {
    clearAuthSession();
    return thunkAPI.rejectWithValue(
      error?.response?.data?.message || "Failed to fetch user",
    );
  }
});

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get(`/auth/logout`);
    clearAuthSession();
    return null;
  } catch (error) {
    clearAuthSession();
    const message = error?.response?.data?.message || "Failed to logout";
    toast.error(message);
    return thunkAPI.rejectWithValue(message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isUpdatingPassword: false,
    isRequestingForToken: false,
    isCheckingAuth: hasAuthSession(),
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoggingIn = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggingIn = false;
        state.authUser = action.payload;
      })
      .addCase(login.rejected, (state) => {
        state.isLoggingIn = false;
      })
      .addCase(getUser.pending, (state) => {
        state.isCheckingAuth = true;
        state.authUser = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isCheckingAuth = false;
        state.authUser = action.payload;
      })
      .addCase(getUser.rejected, (state) => {
        state.isCheckingAuth = false;
        state.authUser = null;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.authUser = null;
      })
      .addCase(logout.rejected, (state) => {
        state.authUser = null;
      })
      .addCase(forgotPassword.pending, (state, action) => {
        state.isRequestingForToken = true;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isRequestingForToken = false;
      })
      .addCase(forgotPassword.rejected, (state) => {
        state.isRequestingForToken = false;
      })
      .addCase(resetPassword.pending, (state, action) => {
        state.isUpdatingPassword = true;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isUpdatingPassword = false;
        state.authUser = null;
      })
      .addCase(resetPassword.rejected, (state) => {
        state.isUpdatingPassword = false;
      });
  },
});

export default authSlice.reducer;
