import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../services/api';

const initialState = {
  orders: [],
  myOrders: [],
  isLoading: false,
  error: null,
};

export const checkout = createAsyncThunk('orders/checkout', async (orderData, { rejectWithValue }) => {
  try {
    const { data } = await API.post('/orders', orderData);
    return data;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

export const fetchMyOrders = createAsyncThunk('orders/fetchMy', async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/orders/myorders');
    return data;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

export const fetchAllOrders = createAsyncThunk('orders/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/orders');
    return data;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkout.pending, (state) => { state.isLoading = true; })
      .addCase(checkout.fulfilled, (state) => { state.isLoading = false; })
      .addCase(fetchMyOrders.fulfilled, (state, action) => { state.myOrders = action.payload; })
      .addCase(fetchAllOrders.fulfilled, (state, action) => { state.orders = action.payload; });
  },
});

export default orderSlice.reducer;
