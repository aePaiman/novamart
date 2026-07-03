import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import toast from 'react-hot-toast'

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }) => {
    const response = await axios.get('/api/users', { params: { email, password } })
    if (response.data.length === 0) {
      throw new Error('Invalid credentials')
    }
    return response.data[0]
  }
)

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData) => {
    const response = await axios.post('/api/users', userData)
    return response.data
  }
)

const loadUserFromStorage = () => {
  try {
    const user = localStorage.getItem('novamart_user')
    return user ? JSON.parse(user) : null
  } catch {
    return null
  }
}

const initialState = {
  user: loadUserFromStorage(),
  isAuthenticated: !!loadUserFromStorage(),
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      localStorage.removeItem('novamart_user')
      toast.success('Logged out successfully')
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = true
        localStorage.setItem('novamart_user', JSON.stringify(action.payload))
        toast.success(`Welcome back, ${action.payload.name}!`)
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
        toast.error('Login failed. Please check your credentials.')
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = true
        localStorage.setItem('novamart_user', JSON.stringify(action.payload))
        toast.success(`Welcome to NovaMart, ${action.payload.name}!`)
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
        toast.error('Registration failed. Please try again.')
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer