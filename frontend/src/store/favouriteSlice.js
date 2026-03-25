import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../services/api';

const initialState = {
  favourites: [],
  isLoading: false,
  error: null,
};

export const fetchFavourites = createAsyncThunk('favs/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/favourites');
    return data;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

export const addToFavs = createAsyncThunk('favs/add', async (bookId, { rejectWithValue }) => {
  try {
    const { data } = await API.post(`/favourites/${bookId}`);
    return data;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

export const removeFromFavs = createAsyncThunk('favs/remove', async (bookId, { rejectWithValue }) => {
  try {
    await API.delete(`/favourites/${bookId}`);
    return bookId;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

const favouriteSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavourites.pending, (state) => { state.isLoading = true; })
      .addCase(fetchFavourites.fulfilled, (state, action) => {
        state.isLoading = false;
        state.favourites = action.payload;
      })
      .addCase(addToFavs.fulfilled, (state, action) => {
        // Since the backend returns the updated fav object, we just fetch again or update locally
        // For simplicity, we'll re-fetch in the component or handle here
      })
      .addCase(removeFromFavs.fulfilled, (state, action) => {
        state.favourites = state.favourites.filter(b => b._id !== action.payload);
      });
  },
});

export default favouriteSlice.reducer;
