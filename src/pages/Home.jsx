import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fetchProducts } from '../store/slices/productsSlice'
import { addToCart } from '../store/slices/cartSlice'
import { toggleWishlist } from '../store/slices/wishlistSlice'
import { FaStar, FaHeart, FaRegHeart, FaShoppingCart } from 'react-icons/fa'

const Home = () => {
  const dispatch = useDispatch()
  const { items, loading } = useSelector(state => state.products)
  const { items: wishlistItems } = useSelector(state => state.wishlist)
  const featuredProducts = items.filter(p => p.featured).slice(0, 4)

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 sm:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
              Welcome to NovaMart
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-blue-100">
              Discover premium products at amazing prices
            </p>
            <Link to="/shop" className="inline-block bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              Start Shopping
            </Link>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 dark:from-gray-900"></div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
            Featured Products
          </h2>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card group"
                >
                  <Link to={`/product/${product.id}`}>
                    <div className="relative overflow-hidden h-48">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 flex flex-col gap-2">
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            dispatch(toggleWishlist(product))
                          }}
                          className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:scale-110 transition"
                        >
                          {isInWishlist(product.id) ? (
                            <FaHeart className="text-red-500" />
                          ) : (
                            <FaRegHeart className="text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  </Link>
                  <div className="p-4">
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition">
                        {product.name}
                      </h3>
                    </Link>
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
        </motion.div>
      </section>

      {/* Categories Section */}
      <section className="bg-gray-100 dark:bg-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white text-center">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Electronics', 'Fashion', 'Home', 'Books'].map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="relative overflow-hidden rounded-xl h-32 group cursor-pointer"
              >
                <Link to={`/shop?category=${category.toLowerCase()}`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-90 group-hover:opacity-100 transition"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-xl font-semibold">{category}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home