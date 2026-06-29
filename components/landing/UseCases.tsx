'use client'

import { motion } from 'framer-motion'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'

import { Mountain, Users, Syringe, Bike, Plane, Backpack } from 'lucide-react'

const useCasesData = [
  { icon: Mountain, title: 'Hikers & Trekkers', desc: 'Remote areas, no signal — QR works offline once cached' },
  { icon: Users, title: 'Elderly & Parents', desc: 'Create profiles for your parents in minutes' },
  { icon: Syringe, title: 'Diabetics & Epileptics', desc: 'Critical condition alerts for first responders' },
  { icon: Bike, title: 'Bike Riders', desc: 'Stick QR on helmet — instantly scannable after accident' },
  { icon: Plane, title: 'Solo Travelers', desc: 'Emergency contacts across language barriers' },
  { icon: Backpack, title: 'School Children', desc: 'Parents get notified when QR is scanned' },
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
            className="glass-card p-6 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF2D2D]/20 to-[#FF2D2D]/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-[#FF2D2D]/20 shadow-[0_0_15px_rgba(255,45,45,0.15)]">
              <item.icon className="w-6 h-6 text-[#FF2D2D]" strokeWidth={1.5} />
            </div>
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
