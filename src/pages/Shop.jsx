import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fetchProducts, setFilters } from '../store/slices/productsSlice.js'
import { addToCart } from '../store/slices/cartSlice.js'
import { toggleWishlist } from '../store/slices/wishlistSlice.js'
import { FaStar, FaHeart, FaRegHeart, FaShoppingCart, FaFilter } from 'react-icons/fa'

const Shop = () => {
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const { items, loading, filters } = useSelector(state => state.products)
  const { items: wishlistItems } = useSelector(state => state.wishlist)
  const [showFilters, setShowFilters] = useState(false)
  
  // Get the highest price from products
  const highestPrice = items.length > 0 
    ? Math.max(...items.map(p => p.price)) 
    : 2000
  
  // Add 20% buffer to max price
  const maxPriceLimit = Math.ceil(highestPrice * 1.2)

  const [localFilters, setLocalFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    minPrice: 0,
    maxPrice: maxPriceLimit,
  })

  // Update maxPrice when products load or highest price changes
  useEffect(() => {
    setLocalFilters(prev => ({
      ...prev,
      maxPrice: maxPriceLimit
    }))
  }, [maxPriceLimit])

  useEffect(() => {
    dispatch(fetchProducts({ 
      category: localFilters.category,
      q: localFilters.search 
    }))
  }, [dispatch, localFilters.category, localFilters.search])

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId)
  }

  const handleFilterChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }))
  }

  const applyFilters = () => {
    dispatch(setFilters(localFilters))
    dispatch(fetchProducts({ 
      category: localFilters.category,
      q: localFilters.search 
    }))
    setShowFilters(false)
  }

  const clearFilters = () => {
    setLocalFilters({
      category: '',
      search: '',
      minPrice: 0,
      maxPrice: maxPriceLimit,
    })
    dispatch(setFilters({}))
    dispatch(fetchProducts())
  }

  // Case-insensitive category filtering
  const filteredProducts = items.filter(product => {
    const matchesPrice = product.price >= localFilters.minPrice && product.price <= localFilters.maxPrice
    const matchesCategory = !localFilters.category || 
      product.category.toLowerCase() === localFilters.category.toLowerCase()
    return matchesPrice && matchesCategory
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden btn-secondary flex items-center gap-2 mb-4 w-full justify-center"
        >
          <FaFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        {/* Filters Sidebar */}
        <div className={`
          ${showFilters ? 'block' : 'hidden'} 
          md:block
          w-full md:w-64 lg:w-72 flex-shrink-0
        `}>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg sticky top-24">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Filters
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={localFilters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="input-field"
                >
                  <option value="">All Categories</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Home">Home</option>
                  <option value="Books">Books</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price Range (Max: ${maxPriceLimit.toFixed(0)})
                </label>
                <div className="flex gap-4">
                  <input
                    type="number"
                    placeholder="Min"
                    value={localFilters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', Number(e.target.value))}
                    className="input-field w-1/2"
                    min="0"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={localFilters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
                    className="input-field w-1/2"
                    min="0"
                    max={maxPriceLimit}
                  />
                </div>
                <div className="mt-2">
                  <input
                    type="range"
                    min="0"
                    max={maxPriceLimit}
                    value={localFilters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>$0</span>
                    <span>${localFilters.maxPrice.toFixed(0)}</span>
                    <span>${maxPriceLimit.toFixed(0)}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={applyFilters} className="btn-primary flex-1">
                  Apply Filters
                </button>
                <button onClick={clearFilters} className="btn-secondary">
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {filteredProducts.length} Products
            </h2>
            {searchParams.get('search') && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Results for: "{searchParams.get('search')}"
              </span>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="card animate-pulse">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="card group"
                >
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 flex flex-col gap-2">
                      <button
                        onClick={() => dispatch(toggleWishlist(product))}
                        className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:scale-110 transition"
                      >
                        {isInWishlist(product.id) ? (
                          <FaHeart className="text-red-500" />
                        ) : (
                          <FaRegHeart className="text-gray-400" />
                        )}
                      </button>
                    </div>
                    {product.stock < 10 && (
                      <div className="absolute bottom-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        Only {product.stock} left
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition">
                          {product.name}
                        </h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{product.brand}</span>
                      </div>
                      <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                        {product.category}
                      </span>
                    </div>
                    <div className="flex items-center mt-1">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className={i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'} />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                        ({product.reviews})
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        ${product.price.toFixed(2)}
                      </span>
                      <button
                        onClick={() => dispatch(addToCart(product))}
                        className="btn-primary text-sm px-3 py-1.5 flex items-center gap-1"
                      >
                        <FaShoppingCart size={12} />
                        Add
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {filteredProducts.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">No products found in this category</p>
              <button onClick={clearFilters} className="btn-primary mt-4">
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Shop