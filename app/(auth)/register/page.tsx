'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Activity, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react'
import { registerSchema } from '@/lib/validators'

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const validation = registerSchema.safeParse({
        email,
        password,
        confirmPassword,
        fullName
      });

      if (!validation.success) {
        throw new Error(validation.error.issues[0]?.message ?? 'Validation failed');
      }

      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName }
        }
      })

      if (authError) throw new Error(authError.message)

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Registration failed')
    } finally {
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
          <h1 className="text-3xl font-bold font-heading text-white">Join MediLink</h1>
          <p className="text-[#8899BB] mt-2">Create your free emergency profile</p>
        </div>

        {success ? (
          <div className="text-center p-6 bg-green-500/10 border border-green-500/30 rounded-xl space-y-4">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
            <h2 className="text-xl font-bold text-white">Account Created!</h2>
            <p className="text-[#8899BB] text-sm">Please check your email to verify your account.</p>
            <Link href="/login" className="block w-full bg-[#FF2D2D] text-white rounded-lg px-4 py-3 font-semibold mt-4 transition-all hover:bg-[#ff4545]">
              Go to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-5">
            {error && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-[#FF2D2D]/50 flex items-start space-x-3 text-red-400">
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#8899BB] mb-1.5" htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#0F1420] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF2D2D] focus:ring-1 focus:ring-[#FF2D2D] focus:shadow-[0_0_10px_rgba(255,45,45,0.2)] transition-all"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#8899BB] mb-1.5" htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0F1420] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF2D2D] focus:ring-1 focus:ring-[#FF2D2D] focus:shadow-[0_0_10px_rgba(255,45,45,0.2)] transition-all"
                  placeholder="you@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#8899BB] mb-1.5" htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0F1420] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF2D2D] focus:ring-1 focus:ring-[#FF2D2D] focus:shadow-[0_0_10px_rgba(255,45,45,0.2)] transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#8899BB] mb-1.5" htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#0F1420] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF2D2D] focus:ring-1 focus:ring-[#FF2D2D] focus:shadow-[0_0_10px_rgba(255,45,45,0.2)] transition-all"
                />
                <p className="text-xs text-[#445566] mt-2">
                  At least 8 chars, 1 uppercase, 1 lowercase, 1 number
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(255,45,45,0.4)" }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF2D2D] text-white rounded-lg px-4 py-3 font-semibold transition-all flex justify-center items-center mt-2 disabled:opacity-70"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create Free Account'}
            </motion.button>
          </form>
        )}

        <p className="mt-8 text-center text-sm text-[#8899BB]">
          Already have an account?{' '}
          <Link href="/login" className="text-[#FF2D2D] font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
