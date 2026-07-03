import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { fetchProductById } from '../store/slices/productsSlice'
import { addToCart } from '../store/slices/cartSlice'
import { toggleWishlist } from '../store/slices/wishlistSlice'
import { FaStar, FaHeart, FaRegHeart, FaShoppingCart, FaChevronLeft, FaMinus, FaPlus } from 'react-icons/fa'

const ProductDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { currentProduct, loading } = useSelector(state => state.products)
  const { items: wishlistItems } = useSelector(state => state.wishlist)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    dispatch(fetchProductById(id))
    window.scrollTo(0, 0)
  }, [dispatch, id])

  const isInWishlist = () => {
    return currentProduct ? wishlistItems.some(item => item.id === currentProduct.id) : false
  }

  const handleAddToCart = () => {
    if (currentProduct) {
      for (let i = 0; i < quantity; i++) {
        dispatch(addToCart(currentProduct))
      }
      setQuantity(1)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2 h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="md:w-1/2 space-y-4">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!currentProduct) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Product not found</h2>
        <Link to="/shop" className="btn-primary inline-block mt-4">
          Back to Shop
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link to="/shop" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-6">
        <FaChevronLeft className="mr-2" /> Back to Shop
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Images */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-1/2"
        >
          <div className="overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
            <img
              src={currentProduct.images[selectedImage]}
              alt={currentProduct.name}
              className="w-full h-96 object-cover"
            />
          </div>
          <div className="flex gap-2 mt-4">
            {currentProduct.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                  selectedImage === index ? 'border-blue-500' : 'border-transparent'
                }`}
              >
                <img src={img} alt={`${currentProduct.name} ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-1/2"
        >
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {currentProduct.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{currentProduct.brand}</p>
            </div>
            <button
              onClick={() => dispatch(toggleWishlist(currentProduct))}
              className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              {isInWishlist() ? (
                <FaHeart className="text-red-500 text-xl" />
              ) : (
                <FaRegHeart className="text-gray-500 text-xl" />
              )}
            </button>
          </div>

          <div className="flex items-center mt-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < Math.floor(currentProduct.rating) ? 'fill-current' : 'text-gray-300'} />
              ))}
            </div>
            <span className="ml-2 text-gray-600 dark:text-gray-400">
              {currentProduct.rating} ({currentProduct.reviews} reviews)
            </span>
          </div>

          <div className="mt-4">
            <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              ${currentProduct.price.toFixed(2)}
            </span>
            {currentProduct.stock > 0 ? (
              <span className="ml-4 text-sm text-green-600 dark:text-green-400 font-medium">
                ✓ In Stock
              </span>
            ) : (
              <span className="ml-4 text-sm text-red-600 font-medium">
                Out of Stock
              </span>
            )}
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-gray-900 dark:text-white">Description</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400 leading-relaxed">
              {currentProduct.description}
            </p>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-gray-900 dark:text-white">Available Colors</h3>
            <div className="flex gap-2 mt-2">
              {currentProduct.colors.map((color, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
                >
                  {color}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <FaMinus />
              </button>
              <span className="w-12 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(currentProduct.stock, quantity + 1))}
                className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <FaPlus />
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={currentProduct.stock === 0}
              className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaShoppingCart /> Add to Cart
            </button>
          </div>

          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              🚚 Free shipping on orders over $100
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              🔒 Secure checkout with encryption
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ProductDetail