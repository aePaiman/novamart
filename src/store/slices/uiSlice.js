import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  theme: localStorage.getItem('novamart_theme') || 'light',
  sidebarOpen: false,
  cartDrawerOpen: false,
  loading: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
      localStorage.setItem('novamart_theme', state.theme)
      if (state.theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    toggleCartDrawer: (state) => {
      state.cartDrawerOpen = !state.cartDrawerOpen
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
  },
})

export const { toggleTheme, toggleSidebar, toggleCartDrawer, setLoading } = uiSlice.actions
export default uiSlice.reducer