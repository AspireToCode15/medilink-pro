'use client'

import { useEffect } from 'react'

export default function Error({
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
    <div style={{ background: '#080B14', minHeight: '100vh', color: '#F0F4FF', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="text-center max-w-md">
        <div className="text-4xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold mb-2">Something went wrong!</h2>
        <p className="text-[#8899BB] text-sm mb-6">{error.message || 'An unexpected application error occurred.'}</p>
        <button
          onClick={() => reset()}
          className="bg-[#FF2D2D] hover:bg-[#ff4545] text-white px-6 py-2 rounded-lg font-medium transition-all shadow-[0_0_15px_rgba(255,45,45,0.3)]"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
