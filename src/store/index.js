import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './slices/cartSlice.js'
import productsReducer from './slices/productsSlice.js'
import authReducer from './slices/authSlice.js'
import wishlistReducer from './slices/wishlistSlice.js'
import uiReducer from './slices/uiSlice.js'

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productsReducer,
    auth: authReducer,
    wishlist: wishlistReducer,
    ui: uiReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
})