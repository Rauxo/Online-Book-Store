import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../services/api';

const initialState = {
  books: [],
  isLoading: false,
  error: null,
};

export const fetchBooks = createAsyncThunk('books/fetchAll', async (keyword = '', { rejectWithValue }) => {
  try {
    const { data } = await API.get(`/books?keyword=${keyword}`);
    return data;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

export const addBook = createAsyncThunk('books/add', async (bookData, { rejectWithValue }) => {
  try {
    const { data } = await API.post('/books', bookData);
    return data;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

export const updateBook = createAsyncThunk('books/update', async ({ id, bookData }, { rejectWithValue }) => {
  try {
    const { data } = await API.put(`/books/${id}`, bookData);
    return data;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

export const deleteBook = createAsyncThunk('books/delete', async (id, { rejectWithValue }) => {
  try {
    await API.delete(`/books/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

const bookSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => { state.isLoading = true; })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.books = state.books.filter(b => b._id !== action.payload);
      });
  },
});

export default bookSlice.reducer;
