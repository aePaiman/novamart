import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { removeFromCart, updateQuantity } from '../store/slices/cartSlice'
import { toggleCartDrawer } from '../store/slices/uiSlice'
import { FaTrash, FaPlus, FaMinus, FaTimes } from 'react-icons/fa'

const CartDrawer = () => {
  const dispatch = useDispatch()
  const { items, subtotal, shipping, tax, total, cartDrawerOpen } = useSelector(state => state.ui)
  const cartItems = useSelector(state => state.cart)

  const closeDrawer = () => {
    dispatch(toggleCartDrawer())
  }

  return (
    <AnimatePresence>
      {cartDrawerOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white dark:bg-gray-900 z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Your Cart ({cartItems.items.length} items)
              </h2>
              <button
                onClick={closeDrawer}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
              >
                <FaTimes className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cartItems.items.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">Your cart is empty</p>
                  <Link
                    to="/shop"
                    onClick={closeDrawer}
                    className="btn-primary inline-block mt-4"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                cartItems.items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                        {item.name}
                      </h4>
                      <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        ${item.price.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1 border border-gray-300 dark:border-gray-600 rounded">
                          <button
                            onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                            className="px-2 py-0.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                          >
                            <FaMinus size={10} />
                          </button>
                          <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                            className="px-2 py-0.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                          >
                            <FaPlus size={10} />
                          </button>
                        </div>
                        <button
                          onClick={() => dispatch(removeFromCart(item.id))}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.items.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-3">
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span>${cartItems.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Shipping</span>
                    <span>{cartItems.shipping === 0 ? 'FREE' : `$${cartItems.shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Tax</span>
                    <span>${cartItems.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span>Total</span>
                    <span className="text-blue-600 dark:text-blue-400">
                      ${cartItems.total.toFixed(2)}
                    </span>
                  </div>
                </div>
                <Link
                  to="/cart"
                  onClick={closeDrawer}
                  className="btn-primary w-full text-center block"
                >
                  View Cart
                </Link>
                <button className="btn-secondary w-full text-center">
                  Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default CartDrawer