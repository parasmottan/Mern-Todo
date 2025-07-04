import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

const initialState = {
  user: null,
  loading: false,
  error: null,
  message: null,
};

<<<<<<< HEAD
// ✅ Register User
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      const res = await axios.post('/api/auth/register', userData);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
=======
// Register User
export const registerUser = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
  try {
    const res = await axios.post('/auth/register', userData);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Registration failed');
>>>>>>> 49777850e4fb3851217e1b13adca0632c232f79e
  }
);

<<<<<<< HEAD
// ✅ Login User
export const loginUser = createAsyncThunk(
  'auth/login',
  async (userData, thunkAPI) => {
    try {
      const res = await axios.post('/api/auth/login', userData, {
        withCredentials: true,
      });

      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Login failed');
    }
=======
// Login User
export const loginUser = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
  try {
    const res = await axios.post('/auth/login', userData, { withCredentials: true });
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Login failed');
>>>>>>> 49777850e4fb3851217e1b13adca0632c232f79e
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.message = null;
      localStorage.removeItem('user');
    },
    loadUserFromStorage: (state) => {
      const userData = localStorage.getItem('user');
      if (userData) {
        state.user = JSON.parse(userData);
      }
    },
    clearMessages: (state) => {
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null; // wait for email verification
        state.message = "Registration successful! Please check your email.";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, loadUserFromStorage, clearMessages } = authSlice.actions;
export default authSlice.reducer;
