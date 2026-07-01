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
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#080B14]"
        >
          <div className="flex items-center space-x-3 mb-8">
            <Activity className="h-10 w-10 text-red-500 emergency-pulse" />
            <h1 className="text-3xl font-bold tracking-tight text-white font-heading">MediLink</h1>
          </div>
          
          <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden mb-4 relative">
            <motion.div 
              className="absolute top-0 left-0 bottom-0 bg-red-500 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </div>
          
          <p className="text-sm text-muted-foreground animate-pulse">Securing your medical data...</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
