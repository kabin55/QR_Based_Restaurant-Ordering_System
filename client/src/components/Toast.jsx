// Toast.jsx
import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (!message) return
    const timer = setTimeout(() => {
      onClose?.()
    }, duration)
    return () => clearTimeout(timer)
  }, [message, onClose, duration])

  if (!message) return null

  const typeStyles = {
    success: 'bg-green-600 border-green-400 text-white',
    error: 'bg-red-600 border-red-400 text-white',
    info: 'bg-[#393f4d] border-[#d4d4dc] text-[#d4d4dc]',
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed left-1/2 -translate-x-1/2 top-6 sm:top-10 z-50"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3 }}
      >
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg text-xs sm:text-sm border ${typeStyles[type]}`}
          role="alert"
        >
          <span>{message}</span>
          <button
            onClick={onClose}
            aria-label="Close"
            className="ml-2 text-white hover:opacity-70 transition"
          >
            <X size={14} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
