import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaEnvelope, FaArrowLeft, FaCheck, FaSpinner } from 'react-icons/fa'
import toast from 'react-hot-toast'
import axios from 'axios'

const ForgotPassword = () => {
  const [step, setStep] = useState(1) // 1: email, 2: reset code, 3: new password
  const [email, setEmail] = useState('')
  const [resetCode, setResetCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [generatedCode, setGeneratedCode] = useState('')

  const handleSendCode = async (e) => {
    e.preventDefault()
    
    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    setLoading(true)

    try {
      // Check if user exists
      const response = await axios.get('/api/users', { params: { email } })
      
      if (response.data.length === 0) {
        toast.error('No account found with this email address')
        setLoading(false)
        return
      }

      // Generate a 6-digit reset code
      const code = Math.floor(100000 + Math.random() * 900000).toString()
      setGeneratedCode(code)
      
      // Simulate sending email
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Show the code to the user (in a real app, this would be sent via email)
      toast.success(`Reset code sent to ${email}`)
      
      // For demo purposes, show the code in a toast
      toast(`🔑 Your reset code: ${code}`, {
        duration: 10000,
        style: {
          background: '#1e293b',
          color: '#fff',
          fontSize: '16px',
          fontWeight: 'bold',
        },
      })
      
      setStep(2)
    } catch (error) {
      toast.error('Error sending reset code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = (e) => {
    e.preventDefault()
    
    if (!resetCode) {
      toast.error('Please enter the reset code')
      return
    }

    if (resetCode !== generatedCode) {
      toast.error('Invalid reset code. Please try again.')
      return
    }

    toast.success('Code verified! Please set your new password.')
    setStep(3)
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    
    if (!newPassword || !confirmPassword) {
      toast.error('Please fill in all fields')
      return
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      // Find user by email
      const response = await axios.get('/api/users', { params: { email } })
      const user = response.data[0]
      
      // Update password
      await axios.patch(`/api/users/${user.id}`, {
        password: newPassword
      })
      
      toast.success('Password reset successfully! Please login with your new password.')
      
      // Reset form and go back to login after 2 seconds
      setTimeout(() => {
        setStep(1)
        setEmail('')
        setResetCode('')
        setNewPassword('')
        setConfirmPassword('')
        setGeneratedCode('')
        window.location.href = '/login'
      }, 2000)
      
    } catch (error) {
      toast.error('Error resetting password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const goToLogin = () => {
    window.location.href = '/login'
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="card p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {step === 1 && 'Forgot Password'}
              {step === 2 && 'Enter Reset Code'}
              {step === 3 && 'Set New Password'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {step === 1 && 'Enter your email to receive a reset code'}
              {step === 2 && 'Enter the 6-digit code sent to your email'}
              {step === 3 && 'Create your new password'}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-between mb-8">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step >= num 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                }`}>
                  {step > num ? <FaCheck /> : num}
                </div>
                {num < 3 && (
                  <div className={`w-12 h-0.5 mx-1 ${
                    step > num 
                      ? 'bg-blue-600' 
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {step === 1 && (
            <form onSubmit={handleSendCode} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-10"
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  We'll send a 6-digit reset code to this email
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-lg flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" /> Sending...
                  </>
                ) : (
                  'Send Reset Code'
                )}
              </button>

              <div className="text-center">
                <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline text-sm inline-flex items-center gap-1">
                  <FaArrowLeft size={12} /> Back to Login
                </Link>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Reset Code
                </label>
                <input
                  type="text"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="input-field text-center text-2xl tracking-widest font-bold"
                  placeholder="••••••"
                  maxLength="6"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Enter the 6-digit code sent to your email
                </p>
                <button
                  type="button"
                  onClick={() => {
                    toast(`🔑 Your reset code: ${generatedCode}`, {
                      duration: 10000,
                      style: {
                        background: '#1e293b',
                        color: '#fff',
                        fontSize: '16px',
                        fontWeight: 'bold',
                      },
                    })
                  }}
                  className="text-blue-600 dark:text-blue-400 text-sm hover:underline mt-2"
                >
                  Resend code
                </button>
              </div>

              <button
                type="submit"
                className="btn-primary w-full py-3 text-lg"
              >
                Verify Code
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm"
                >
                  ← Back to email
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input-field"
                  placeholder="At least 6 characters"
                  minLength="6"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field"
                  placeholder="Confirm your new password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-lg flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" /> Resetting...
                  </>
                ) : (
                  'Reset Password'
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm"
                >
                  ← Back to code
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default ForgotPassword