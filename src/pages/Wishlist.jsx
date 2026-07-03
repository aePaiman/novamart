import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toggleWishlist, clearWishlist } from '../store/slices/wishlistSlice'
import { addToCart } from '../store/slices/cartSlice'
import { FaHeart, FaShoppingCart, FaTrash, FaArrowLeft } from 'react-icons/fa'

const Wishlist = () => {
  const dispatch = useDispatch()
  const { items } = useSelector(state => state.wishlist)

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="flex flex-col items-center">
          <FaHeart className="text-6xl text-gray-300 dark:text-gray-600 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Your wishlist is empty
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start saving your favorite items here.
          </p>
          <Link to="/shop" className="btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link to="/shop" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline">
            <FaArrowLeft className="mr-2" /> Continue Shopping
          </Link>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">
            Your Wishlist ({items.length} items)
          </h2>
        </div>
        <button
          onClick={() => dispatch(clearWishlist())}
          className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-2"
        >
          <FaTrash /> Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence>
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: index * 0.05 }}
              className="card group"
            >
              <Link to={`/product/${item.id}`}>
                <div className="relative overflow-hidden h-48">
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      dispatch(toggleWishlist(item))
                    }}
                    className="absolute top-2 right-2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:scale-110 transition"
                  >
                    <FaHeart className="text-red-500" />
                  </button>
                </div>
              </Link>
              <div className="p-4">
                <Link to={`/product/${item.id}`}>
                  <h3 className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition">
                    {item.name}
                  </h3>
                </Link>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.brand}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    ${item.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => {
                      dispatch(addToCart(item))
                      dispatch(toggleWishlist(item))
                    }}
                    className="btn-primary text-sm px-3 py-1.5 flex items-center gap-1"
                  >
                    <FaShoppingCart size={12} />
                    Add
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Wishlist