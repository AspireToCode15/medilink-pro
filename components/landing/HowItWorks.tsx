'use client'

import { motion } from 'framer-motion'
import { UserPlus, QrCode, Phone, ArrowRight } from 'lucide-react'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'

function HowItWorksContent() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 }
    }
  }

  const stepVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  return (
    <section id="how-it-works" className="py-24 px-4 max-w-7xl mx-auto relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-white">How MediLink Works</h2>
        <p className="text-[#8899BB] max-w-2xl mx-auto text-lg">Three steps between an accident and the right help</p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="flex flex-col md:flex-row items-center justify-between gap-6 relative"
      >
        {/* Step 1 */}
        <motion.div variants={stepVariants} className="glass-card flex-1 p-8 text-center hover:border-[#FF2D2D]/50 transition-colors h-full w-full">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <UserPlus className="w-8 h-8 text-[#FF2D2D]" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Fill Your Profile</h3>
          <p className="text-[#8899BB] text-sm">Add blood group, conditions, allergies, emergency contacts in 2 minutes.</p>
        </motion.div>

        {/* Arrow 1 */}
        <motion.div variants={stepVariants} className="hidden md:block text-[#FF2D2D] opacity-50">
          <ArrowRight className="w-8 h-8 animate-pulse" />
        </motion.div>

        {/* Step 2 */}
        <motion.div variants={stepVariants} className="glass-card flex-1 p-8 text-center hover:border-[#FF2D2D]/50 transition-colors h-full w-full">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <QrCode className="w-8 h-8 text-[#FF2D2D]" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Get Your QR Code</h3>
          <p className="text-[#8899BB] text-sm">Print it, save it on your phone, or wear it on a wristband.</p>
        </motion.div>

        {/* Arrow 2 */}
        <motion.div variants={stepVariants} className="hidden md:block text-[#FF2D2D] opacity-50">
          <ArrowRight className="w-8 h-8 animate-pulse" />
        </motion.div>

        {/* Step 3 */}
        <motion.div variants={stepVariants} className="glass-card flex-1 p-8 text-center hover:border-[#FF2D2D]/50 transition-colors h-full w-full">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Phone className="w-8 h-8 text-[#FF2D2D]" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Rescuers Get Instant Info</h3>
          <p className="text-[#8899BB] text-sm">Anyone with a phone can scan your QR — no app, no login required.</p>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default function HowItWorks() {
  return <ErrorBoundary><HowItWorksContent /></ErrorBoundary>
}
