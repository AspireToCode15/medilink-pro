'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'

function Counter({ end, duration = 2, suffix = "" }: { end: number, duration?: number, suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  useEffect(() => {
    if (isInView) {
      let start = 0
      const increment = end / (duration * 60)
      const timer = setInterval(() => {
        start += increment
        if (start >= end) {
          setCount(end)
          clearInterval(timer)
        } else {
          setCount(Math.floor(start))
        }
      }, 1000 / 60)
      return () => clearInterval(timer)
    }
  }, [isInView, end, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

function StatsContent() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  return (
    <section className="relative py-16 px-4 bg-[#FF2D2D]/5 border-y border-[#FF2D2D]/10">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <motion.div variants={itemVariants} className="glass-card text-center p-8">
            <h3 className="text-4xl md:text-5xl font-bold text-[#FF2D2D] font-heading mb-2">
              <Counter end={16} suffix="L+" />
            </h3>
            <p className="text-[#8899BB]">Road accidents per year in India</p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="glass-card text-center p-8">
            <h3 className="text-4xl md:text-5xl font-bold text-[#FF2D2D] font-heading mb-2">
              <Counter end={75} suffix="%" />
            </h3>
            <p className="text-[#8899BB]">Accident victims arrive unconscious</p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="glass-card text-center p-8">
            <h3 className="text-4xl md:text-5xl font-bold text-[#FF2D2D] font-heading mb-2">
              <Counter end={2} suffix=" sec" />
            </h3>
            <p className="text-[#8899BB]">Time to access MediLink emergency data</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default function Stats() {
  return <ErrorBoundary><StatsContent /></ErrorBoundary>
}
