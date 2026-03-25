import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import bookReducer from './bookSlice';
import favouriteReducer from './favouriteSlice';
import orderReducer from './orderSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    books: bookReducer,
    favourites: favouriteReducer,
    orders: orderReducer,
  },
});
