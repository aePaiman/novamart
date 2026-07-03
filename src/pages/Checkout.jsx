import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { clearCart } from '../store/slices/cartSlice'
import { FaDownload, FaPrint, FaArrowLeft, FaCheck } from 'react-icons/fa'
import toast from 'react-hot-toast'

const Checkout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, subtotal, shipping, tax, total } = useSelector(state => state.cart)
  const { user } = useSelector(state => state.auth)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [orderData, setOrderData] = useState(null)
  const receiptRef = useRef()

  const [orderDetails, setOrderDetails] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: user?.address || '',
    city: '',
    state: '',
    zip: '',
    paymentMethod: 'Credit Card',
    cardNumber: '**** **** **** 1234',
    cardName: user?.name || '',
    expiry: '12/26',
    cvv: '***',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setOrderDetails(prev => ({ ...prev, [name]: value }))
  }

  const generateOrderNumber = () => {
    return 'NM-' + Date.now().toString().slice(-8) + '-' + Math.random().toString(36).slice(-4).toUpperCase()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsProcessing(true)

    // Save current cart data before clearing
    const orderNumber = generateOrderNumber()
    const cartSnapshot = {
      items: [...items],
      subtotal: subtotal,
      shipping: shipping,
      tax: tax,
      total: total,
    }

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      setIsComplete(true)
      
      // Store the order data for display
      setOrderData({
        orderNumber,
        date: new Date().toLocaleString(),
        items: cartSnapshot.items,
        totals: {
          subtotal: cartSnapshot.subtotal,
          shipping: cartSnapshot.shipping,
          tax: cartSnapshot.tax,
          total: cartSnapshot.total,
        },
        customer: orderDetails,
      })

      toast.success(`Order ${orderNumber} placed successfully!`)
      
      // Save order to localStorage
      const orders = JSON.parse(localStorage.getItem('novamart_orders') || '[]')
      orders.push({
        orderNumber,
        date: new Date().toLocaleString(),
        items: cartSnapshot.items,
        totals: {
          subtotal: cartSnapshot.subtotal,
          shipping: cartSnapshot.shipping,
          tax: cartSnapshot.tax,
          total: cartSnapshot.total,
        },
        customer: orderDetails,
        status: 'Confirmed'
      })
      localStorage.setItem('novamart_orders', JSON.stringify(orders))
      
      // Clear cart after 2 seconds
      setTimeout(() => {
        dispatch(clearCart())
      }, 2000)
    }, 2000)
  }

  const downloadReceipt = () => {
    const receipt = receiptRef.current
    if (!receipt) return

    import('html2canvas').then(html2canvas => {
      html2canvas.default(receipt, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
      }).then(canvas => {
        const link = document.createElement('a')
        link.download = `receipt-${orderData?.orderNumber || 'order'}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
        toast.success('Receipt downloaded!')
      }).catch(err => {
        toast.error('Error generating receipt')
        console.error(err)
      })
    }).catch(() => {
      window.print()
    })
  }

  const printReceipt = () => {
    window.print()
  }

  if (items.length === 0 && !isComplete) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Add some items before checking out.
          </p>
          <Link to="/shop" className="btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    )
  }

  if (isComplete && orderData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="card p-8 text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCheck className="text-4xl text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Order Confirmed! 🎉
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your order has been placed successfully.
          </p>
          
          {/* Receipt */}
          <div ref={receiptRef} className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-8 max-w-md mx-auto text-left">
            <div className="text-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
              <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">NovaMart</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Premium Shopping</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Order #{orderData.orderNumber}</p>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Date:</span>
                <span className="font-medium">{orderData.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Customer:</span>
                <span className="font-medium">{orderData.customer.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Email:</span>
                <span className="font-medium">{orderData.customer.email}</span>
              </div>
            </div>

            <hr className="my-4 border-gray-200 dark:border-gray-700" />

            <div className="space-y-2">
              {orderData.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.name} × {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <hr className="my-4 border-gray-200 dark:border-gray-700" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Subtotal:</span>
                <span>${orderData.totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Shipping:</span>
                <span>{orderData.totals.shipping === 0 ? 'FREE' : `$${orderData.totals.shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Tax (8%):</span>
                <span>${orderData.totals.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-gray-200 dark:border-gray-700 pt-2">
                <span>Total:</span>
                <span className="text-blue-600 dark:text-blue-400">${orderData.totals.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-4 text-center border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-xs text-gray-400 dark:text-gray-500">Thank you for shopping at NovaMart! ❤️</p>
            </div>
          </div>

          <div className="flex gap-4 mt-6 justify-center flex-wrap">
            <button
              onClick={downloadReceipt}
              className="btn-primary flex items-center gap-2"
            >
              <FaDownload /> Download Receipt
            </button>
            <button
              onClick={printReceipt}
              className="btn-secondary flex items-center gap-2"
            >
              <FaPrint /> Print
            </button>
            <Link to="/shop" className="btn-secondary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // If cart is empty but not complete yet
  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Add some items before checking out.
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
      <Link to="/cart" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-6">
        <FaArrowLeft className="mr-2" /> Back to Cart
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Checkout Form */}
        <div className="lg:w-2/3">
          <div className="card p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Checkout
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={orderDetails.name}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={orderDetails.email}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Shipping Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={orderDetails.address}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={orderDetails.city}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={orderDetails.state}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    ZIP *
                  </label>
                  <input
                    type="text"
                    name="zip"
                    value={orderDetails.zip}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Payment Method *
                </label>
                <select
                  name="paymentMethod"
                  value={orderDetails.paymentMethod}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Apple Pay">Apple Pay</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="btn-primary w-full py-3 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Place Order'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="card p-6 sticky top-24">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Order Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm">
                <span>Items ({items.length})</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <hr className="border-gray-200 dark:border-gray-700" />
              <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                <span>Total</span>
                <span className="text-blue-600 dark:text-blue-400">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                🔒 Secure checkout · Your information is protected
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout