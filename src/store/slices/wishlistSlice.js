import { createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'

const loadWishlist = () => {
  try {
    return JSON.parse(localStorage.getItem('novamart_wishlist') || '[]')
  } catch {
    return []
  }
}

const initialState = {
  items: loadWishlist(),
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist: (state, action) => {
      const exists = state.items.some(item => item.id === action.payload.id)
      if (exists) {
        state.items = state.items.filter(item => item.id !== action.payload.id)
        toast.success('Removed from wishlist')
      } else {
        state.items.push(action.payload)
        toast.success('Added to wishlist ❤️')
      }
      localStorage.setItem('novamart_wishlist', JSON.stringify(state.items))
    },
    clearWishlist: (state) => {
      state.items = []
      localStorage.removeItem('novamart_wishlist')
      toast.success('Wishlist cleared')
    },
  },
})

export const { toggleWishlist, clearWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer