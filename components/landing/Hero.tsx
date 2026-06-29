'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'

function HeroContent() {
  const headline = "Your Medical ID.\nIn a QR Code."
  const chars = headline.split("")

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-20 px-4 md:px-8 max-w-7xl mx-auto z-10">
      <div className="flex flex-col md:flex-row items-center w-full gap-12">
        
        {/* Left Side */}
        <div className="flex-1 w-full space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full text-red-400 text-sm font-medium"
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>LIVE • Emergency Ready</span>
          </motion.div>

          <h1 className="text-[2.8rem] md:text-[5rem] font-bold leading-tight font-heading whitespace-pre-line">
            {chars.map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1, delay: index * 0.03 }}
                className={index > 16 ? "gradient-text" : "text-white"}
              >
                {char}
              </motion.span>
            ))}
          </h1>

          <motion.p 
            className="text-[1.1rem] text-[#8899BB] font-body max-w-lg leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            First responders scan. Your blood group, allergies & emergency contacts appear instantly.<br/><br/>
            No app. No login. Works when you&apos;re unconscious.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <Link href="/register">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto bg-[#FF2D2D] hover:bg-[#ff4545] text-white px-8 py-3 rounded-full font-medium transition-all shadow-[0_0_20px_rgba(255,45,45,0.3)] hover:shadow-[0_0_30px_rgba(255,45,45,0.5)] emergency-pulse"
              >
                Create Free MediLink →
              </motion.button>
            </Link>
            <a href="#how-it-works">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto bg-transparent border border-[#FF2D2D] text-white hover:bg-[#FF2D2D]/10 px-8 py-3 rounded-full font-medium transition-all"
              >
                See How It Works ↓
              </motion.button>
            </a>
          </motion.div>

          <motion.div 
            className="text-sm text-[#445566] flex flex-wrap gap-x-4 gap-y-2 mt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
          >
            <span>✓ Free forever</span>
            <span>✓ No app needed</span>
            <span>✓ Works offline</span>
            <span>✓ AES-256 encrypted</span>
          </motion.div>
        </div>

        {/* Right Side - Phone Mockup */}
        <div className="flex-1 w-full flex justify-center lg:justify-end relative">
          <div className="absolute inset-0 bg-[#FF2D2D]/20 blur-[100px] rounded-full w-[300px] h-[400px] mx-auto z-0 pointer-events-none" />
          
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="relative z-10 w-[280px] h-[580px] border-[8px] border-[#1a1f2e] rounded-[3rem] bg-[#080B14] shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Phone Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#1a1f2e] rounded-b-xl z-20" />
            
            {/* Phone Content */}
            <div className="flex-1 pt-12 px-4 flex flex-col items-center relative">
              <motion.div 
                className="absolute left-0 right-0 h-1 bg-red-500 z-50 shadow-[0_0_10px_red]"
                animate={{ top: ['0%', '100%'] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              />
              <p className="text-red-500 font-bold mb-2">EMERGENCY ID</p>
              <div className="w-full bg-[#1a1f2e] p-4 rounded-xl border border-red-500/30 flex flex-col items-center mt-8">
                <p className="text-gray-400 text-sm">BLOOD GROUP</p>
                <h2 className="text-[5rem] font-bold text-[#FF2D2D] leading-none mb-2">O+</h2>
              </div>
              <div className="w-full mt-4 space-y-3">
                <div className="h-10 bg-[#1a1f2e] rounded-lg w-full" />
                <div className="h-10 bg-[#1a1f2e] rounded-lg w-full" />
                <div className="h-12 bg-green-500/20 border border-green-500/50 rounded-lg w-full mt-8" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#445566]"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        ↓
      </motion.div>
    </section>
  )
}

export default function Hero() {
  return <ErrorBoundary><HeroContent /></ErrorBoundary>
}
