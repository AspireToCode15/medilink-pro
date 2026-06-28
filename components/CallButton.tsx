'use client'

import { Phone } from 'lucide-react'

interface CallButtonProps {
  phoneNumber: string
  contactName: string
  scanLogId: string | null
}

export function CallButton({ phoneNumber, contactName, scanLogId }: CallButtonProps) {
  const handleClick = () => {
    if (scanLogId) {
      fetch('/api/scan-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scanLogId, action: 'call_initiated' })
      }).catch(console.error)
    }
  }

  return (
    <a 
      href={`tel:${phoneNumber}`}
      onClick={handleClick}
      className="bg-red-600 hover:bg-red-500 text-white p-4 rounded-full shadow-[0_0_20px_rgba(255,0,0,0.5)] transition-transform active:scale-95 flex items-center justify-center flex-shrink-0"
      aria-label={`Call ${contactName}`}
    >
      <Phone className="h-8 w-8" />
    </a>
  )
}
