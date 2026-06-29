'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity } from 'lucide-react'

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    // Auto-dismiss after animation completes (1.5s for progress bar + 0.5s buffer)
    const timer = setTimeout(() => {
      setVisible(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#080B14] overflow-hidden"
        >
          {/* Use the new animated gradient background from globals.css for a premium feel */}
          <div className="animated-bg absolute inset-0 z-0 opacity-60" />
          
          <div className="relative z-10 flex flex-col items-center justify-center">
            {/* Logo Area with subtle glow */}
            <div className="flex items-center space-x-3 mb-10 relative">
              <div className="absolute inset-0 bg-red-500/20 blur-[40px] rounded-full z-0" />
              <Activity className="h-12 w-12 text-[#FF2D2D] emergency-pulse relative z-10 drop-shadow-[0_0_15px_rgba(255,45,45,0.5)]" />
              <h1 className="text-4xl font-bold tracking-tight text-white font-heading relative z-10">MediLink</h1>
            </div>
            
            {/* Premium Progress Bar */}
            <div className="w-72 h-1.5 bg-white/5 rounded-full overflow-hidden mb-6 relative shadow-inner border border-white/5">
              <motion.div 
                className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-[#FF2D2D] to-[#FF6B6B] rounded-full shadow-[0_0_15px_rgba(255,45,45,0.6)]"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            
            {/* Pulsing Text */}
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-sm text-[#8899BB] animate-pulse tracking-wide font-medium"
            >
              Securing your medical data...
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
