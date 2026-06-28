'use client'

import { motion } from 'framer-motion'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'

const badges = [
  { icon: '🔐', text: 'AES-256 Encrypted' },
  { icon: '🛡️', text: 'Zero Plain Text Storage' },
  { icon: '🔒', text: 'Row Level Security' },
  { icon: '📵', text: 'No Third-Party Sharing' }
]

function SecurityBadgesContent() {
  return (
    <section className="py-24 relative overflow-hidden bg-[#080B14]">
      {/* CSS Grid Pattern Background */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{
          backgroundImage: `linear-gradient(rgba(255, 45, 45, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 45, 45, 0.5) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} 
      />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-white">Military-Grade Security</h2>
          <p className="text-[#8899BB] max-w-2xl mx-auto text-lg">Your data is protected at every level</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {badges.map((badge, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glass-card-red py-3 px-6 flex items-center space-x-3 text-sm font-medium text-white shadow-[0_0_15px_rgba(255,45,45,0.15)]"
            >
              <span className="text-xl">{badge.icon}</span>
              <span>{badge.text}</span>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-3xl mx-auto text-center glass-card p-8 bg-[#0F1420]/80"
        >
          <p className="text-[#8899BB] italic leading-relaxed">
            &quot;Phone numbers are encrypted with AES-256. Even if someone hacks our database, they see only encrypted gibberish. Contact numbers appear only as 98765***** on screen — never in plain readable text.&quot;
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default function SecurityBadges() {
  return <ErrorBoundary><SecurityBadgesContent /></ErrorBoundary>
}
