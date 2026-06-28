'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Activity, AlertCircle, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        throw new Error(authError.message)
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to login')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-transparent">
      <div className="animated-bg" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card-red w-full max-w-[420px] p-8 z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <Activity className="h-12 w-12 text-[#FF2D2D] mb-4 emergency-pulse" />
          <h1 className="text-3xl font-bold font-heading text-white">MediLink</h1>
          <p className="text-[#8899BB] mt-2">Sign in to your emergency profile</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-[#FF2D2D]/50 flex items-start space-x-3 text-red-400">
              <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#8899BB] mb-1.5" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full bg-[#0F1420] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF2D2D] focus:ring-1 focus:ring-[#FF2D2D] focus:shadow-[0_0_10px_rgba(255,45,45,0.2)] transition-all"
                placeholder="you@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#8899BB] mb-1.5" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full bg-[#0F1420] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF2D2D] focus:ring-1 focus:ring-[#FF2D2D] focus:shadow-[0_0_10px_rgba(255,45,45,0.2)] transition-all"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(255,45,45,0.4)" }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF2D2D] text-white rounded-lg px-4 py-3 font-semibold transition-all flex justify-center items-center mt-2 disabled:opacity-70"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign In'}
          </motion.button>
        </form>

        <p className="mt-8 text-center text-sm text-[#8899BB]">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-[#FF2D2D] font-medium hover:underline">
            Create Free Account
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
