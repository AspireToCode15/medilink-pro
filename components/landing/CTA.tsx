'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'

function CTAContent() {
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-br from-[#FF2D2D]/20 to-[#080B14] border-t border-[#FF2D2D]/20">
      <div className="absolute inset-0 bg-[#080B14]/40" />
      
      <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold font-heading mb-6 text-white"
        >
          Create Your Free MediLink in 2 Minutes
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-[#F0F4FF] text-xl mb-10 font-medium"
        >
          It could save your life.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link href="/register">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="bg-white text-[#FF2D2D] hover:bg-gray-100 px-10 py-4 rounded-full font-bold text-lg transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)]"
            >
              Get Started Free →
            </motion.button>
          </Link>
          
          <p className="mt-6 text-[#8899BB] text-sm font-medium">
            No credit card. No app download. Free forever.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default function CTA() {
  return <ErrorBoundary><CTAContent /></ErrorBoundary>
}
