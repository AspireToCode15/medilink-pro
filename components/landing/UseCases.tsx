'use client'

import { motion } from 'framer-motion'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'

const useCasesData = [
  { icon: '🏔️', title: 'Hikers & Trekkers', desc: 'Remote areas, no signal — QR works offline once cached' },
  { icon: '🧓', title: 'Elderly & Parents', desc: 'Create profiles for your parents in minutes' },
  { icon: '💉', title: 'Diabetics & Epileptics', desc: 'Critical condition alerts for first responders' },
  { icon: '🏍️', title: 'Bike Riders', desc: 'Stick QR on helmet — instantly scannable after accident' },
  { icon: '✈️', title: 'Solo Travelers', desc: 'Emergency contacts across language barriers' },
  { icon: '🎒', title: 'School Children', desc: 'Parents get notified when QR is scanned' },
]

function UseCasesContent() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <section className="py-24 px-4 max-w-7xl mx-auto relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-white">Who Needs MediLink?</h2>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {useCasesData.map((item, index) => (
          <motion.div 
            key={index} 
            variants={cardVariants} 
            whileHover={{ y: -4, borderColor: 'rgba(255, 45, 45, 0.4)', boxShadow: '0 0 20px rgba(255, 45, 45, 0.1)' }}
            className="glass-card p-6 transition-all"
          >
            <div className="text-4xl mb-4">{item.icon}</div>
            <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
            <p className="text-[#8899BB] text-sm leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

export default function UseCases() {
  return <ErrorBoundary><UseCasesContent /></ErrorBoundary>
}
