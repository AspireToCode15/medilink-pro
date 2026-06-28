'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Loader2, ArrowLeft, Users } from 'lucide-react'
import Link from 'next/link'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'

function AddFamilyContent() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [relation, setRelation] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const res = await fetch('/api/family', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, relation })
      })
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error || 'Failed to add family member')
      
      router.push('/family')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/family" className="flex items-center text-[#8899BB] hover:text-white transition-colors mb-4 w-max">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Family
      </Link>

      <div className="glass-card p-6 md:p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-[#FF2D2D]/10 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6 text-[#FF2D2D]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-heading text-white">Add Family Member</h1>
            <p className="text-[#8899BB] text-sm">Create an emergency profile for a loved one</p>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-[#FF2D2D]/50 text-red-400 text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-[#8899BB] mb-2">Member Name</label>
              <input 
                required 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="e.g. Mary Doe"
                className="w-full bg-[#0F1420] border border-white/10 rounded-lg p-3 text-white focus:border-[#FF2D2D] outline-none transition-colors" 
              />
            </div>
            <div>
              <label className="block text-sm text-[#8899BB] mb-2">Relationship</label>
              <input 
                required 
                value={relation} 
                onChange={e => setRelation(e.target.value)} 
                placeholder="e.g. Mother, Child"
                className="w-full bg-[#0F1420] border border-white/10 rounded-lg p-3 text-white focus:border-[#FF2D2D] outline-none transition-colors" 
              />
            </div>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full bg-[#FF2D2D] text-white rounded-lg p-4 font-bold disabled:opacity-50 flex justify-center items-center"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Profile'}
          </motion.button>
        </form>
      </div>
    </div>
  )
}

export default function AddFamilyPage() {
  return <ErrorBoundary><AddFamilyContent /></ErrorBoundary>
}
