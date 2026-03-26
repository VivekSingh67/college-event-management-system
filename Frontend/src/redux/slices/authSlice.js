import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "@/services/auth.service";
import { toast } from "sonner";

// ─── Async Thunks ──────────────────────────────────────────────────────────────

/**
 * Login thunk — calls auth service, stores token + user in localStorage.
 */
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await authService.login({ email, password });
      // Persist for page refresh
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success(data.message || "Login successful");
      return data.user;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.message ||
        "Login failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

/**
 * Register thunk — enforces role="student", stores token + user.
 *
 * If a non-student role is detected in the payload, it is rejected on the
 * client side BEFORE any network request is made.
 */
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    // ⚠️  Student-only registration guard
    if (userData.role && userData.role !== "student") {
      const message = "Registration is only allowed for students.";
      toast.error(message);
      return rejectWithValue(message);
    }

    try {
      const data = await authService.register(userData);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success(data.message || "Registration successful");
      return data.user;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.message ||
        "Registration failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

/**
 * Logout thunk — clears localStorage and Redux state.
 */
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      toast.success("Logged out successfully");
    } catch (error) {
      // Even if the server call fails, clear local state
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      const message = error.response?.data?.message || "Logout failed";
      return rejectWithValue(message);
    }
  }
);

/**
 * Update Password thunk.
 */
export const updatePasswordUser = createAsyncThunk(
  "auth/updatePassword",
  async (data, { rejectWithValue }) => {
    try {
      const res = await authService.updatePassword(data);
      toast.success("Password updated successfully");
      return res;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update password";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// ─── Slice ─────────────────────────────────────────────────────────────────────

const storedUser = localStorage.getItem("user");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedUser ? JSON.parse(storedUser) : null,
    isLoading: false,
    error: null,
  },
  reducers: {
    /** Manually set user (used by AuthProvider sync) */
    setUser(state, action) {
      state.user = action.payload;
    },
    /** Clear auth state without API call */
    clearAuth(state) {
      state.user = null;
      state.error = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    // ── Login ──
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // ── Register ──
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // ── Logout ──
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null; // Always clear on logout
      });
  },
});

export const { setUser, clearAuth } = authSlice.actions;

// ─── Selectors ─────────────────────────────────────────────────────────────────
export const selectUser = (state) => state.auth.user;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;
export const selectIsAuthenticated = (state) => !!state.auth.user;

export default authSlice.reducer;
