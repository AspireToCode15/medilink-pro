import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Dynamically import sections to prevent hydration mismatch with Framer Motion
const Hero = dynamic(() => import('@/components/landing/Hero'), { ssr: false })
const Stats = dynamic(() => import('@/components/landing/Stats'), { ssr: false })
const HowItWorks = dynamic(() => import('@/components/landing/HowItWorks'), { ssr: false })
const UseCases = dynamic(() => import('@/components/landing/UseCases'), { ssr: false })
const SecurityBadges = dynamic(() => import('@/components/landing/SecurityBadges'), { ssr: false })
const CTA = dynamic(() => import('@/components/landing/CTA'), { ssr: false })

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-[var(--bg-primary)]">
      <div className="animated-bg" />
      <Suspense fallback={null}>
        <Hero />
        <Stats />
        <HowItWorks />
        <UseCases />
        <SecurityBadges />
        <CTA />
      </Suspense>
    </div>
  )
}
