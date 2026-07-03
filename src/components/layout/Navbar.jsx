import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FaShoppingCart, FaHeart, FaUser, FaSearch, FaMoon, FaSun, FaBars } from 'react-icons/fa'
import { toggleTheme, toggleCartDrawer } from '../../store/slices/uiSlice'
import { logout } from '../../store/slices/authSlice'

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { theme } = useSelector(state => state.ui)
  const { isAuthenticated, user } = useSelector(state => state.auth)
  const { items } = useSelector(state => state.cart)
  const { items: wishlistItems } = useSelector(state => state.wishlist)
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/shop?search=${searchQuery}`)
      setSearchQuery('')
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled
        ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg'
        : 'bg-white dark:bg-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              NovaMart
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">✨ Premium</span>
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 pr-4 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </form>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              {theme === 'dark' ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-600" />}
            </button>

            <Link to="/wishlist" className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition">
              <FaHeart className="text-red-500" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <button
              onClick={() => dispatch(toggleCartDrawer())}
              className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
            >
              <FaShoppingCart className="text-blue-600 dark:text-blue-400" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </button>

            <div className="relative group">
              {isAuthenticated ? (
                <div className="flex items-center space-x-2 cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden lg:inline text-sm font-medium">{user?.name}</span>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                    <Link to="/" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Home</Link>
                    <Link to="/shop" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Shop</Link>
                    <Link to="/wishlist" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Wishlist</Link>
                    <Link to="/cart" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Cart</Link>
                    <hr className="my-2 border-gray-200 dark:border-gray-700" />
                    {user?.email === 'john@example.com' && (
                      <>
                        <Link to="/admin" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-blue-600 font-medium">
                          🔧 Admin Panel
                        </Link>
                        <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-purple-600 font-medium">
                          📊 Order History
                        </Link>
                        <hr className="my-2 border-gray-200 dark:border-gray-700" />
                      </>
                    )}
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600">
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="btn-primary text-sm px-4 py-2">
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar