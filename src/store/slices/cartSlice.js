import { createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'

const loadCartFromStorage = () => {
  try {
    const stored = localStorage.getItem('novamart_cart')
    return stored ? JSON.parse(stored) : { items: [], total: 0 }
  } catch {
    return { items: [], total: 0 }
  }
}

const saveCartToStorage = (state) => {
  localStorage.setItem('novamart_cart', JSON.stringify(state))
}

const calculateTotals = (items) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 100 ? 0 : 9.99
  const tax = subtotal * 0.08
  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    shipping: parseFloat(shipping.toFixed(2)),
    tax: parseFloat(tax.toFixed(2)),
    total: parseFloat((subtotal + shipping + tax).toFixed(2)),
  }
}

const initialState = {
  ...loadCartFromStorage(),
  ...calculateTotals(loadCartFromStorage().items || []),
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(item => item.id === action.payload.id)
      if (existingItem) {
        existingItem.quantity += 1
        toast.success(`Added another ${action.payload.name} to cart`)
      } else {
        state.items.push({ ...action.payload, quantity: 1 })
        toast.success(`${action.payload.name} added to cart`)
      }
      const totals = calculateTotals(state.items)
      Object.assign(state, totals)
      saveCartToStorage(state)
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload)
      const totals = calculateTotals(state.items)
      Object.assign(state, totals)
      saveCartToStorage(state)
      toast.success('Item removed from cart')
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload
      const item = state.items.find(item => item.id === id)
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.id !== id)
          toast.success('Item removed from cart')
        } else {
          item.quantity = quantity
        }
        const totals = calculateTotals(state.items)
        Object.assign(state, totals)
        saveCartToStorage(state)
      }
    },
    clearCart: (state) => {
      state.items = []
      state.subtotal = 0
      state.shipping = 0
      state.tax = 0
      state.total = 0
      saveCartToStorage(state)
      toast.success('Cart cleared')
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer