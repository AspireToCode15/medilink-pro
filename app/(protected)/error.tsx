'use client'

import { useEffect } from 'react'

export default function ProtectedError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="glass-card p-8 text-center max-w-xl mx-auto my-12 border-red-500/30">
      <div className="text-4xl mb-4">🚨</div>
      <h2 className="text-xl font-bold text-white mb-2">Error Loading Dashboard Section</h2>
      <p className="text-[#8899BB] text-sm mb-6">
        We encountered an error retrieving your medical information. This could be due to a temporary network issue.
      </p>
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => reset()}
          className="bg-[#FF2D2D] hover:bg-[#ff4545] text-white px-6 py-2 rounded-lg font-medium transition-all"
        >
          Retry Section
        </button>
        <button
          onClick={() => window.location.reload()}
          className="bg-transparent border border-white/10 hover:bg-white/5 text-white px-6 py-2 rounded-lg font-medium transition-all"
        >
          Reload Page
        </button>
      </div>
    </div>
  )
}
