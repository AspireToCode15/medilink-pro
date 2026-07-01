'use client'

import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { Loader2 } from 'lucide-react'

export default function QRCodeDisplay({ url, size = 200 }: { url: string, size?: number }) {
  const [qrSrc, setQrSrc] = useState<string>('')
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://medilink-hazel.vercel.app'

  useEffect(() => {
    const targetUrl = url.startsWith('http') ? url : `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`
    QRCode.toDataURL(targetUrl, {
      width: size,
      margin: 2,
      color: {
        dark: '#FF2D2D',
        light: '#ffffff'
      }
    })
    .then(url => setQrSrc(url))
    .catch(err => console.error('QR Generate Error:', err))
  }, [url, size, baseUrl])

  if (!qrSrc) return <div className="flex justify-center items-center h-32 w-32 bg-white/5 rounded-xl"><Loader2 className="w-6 h-6 animate-spin text-[#FF2D2D]" /></div>

  return (
    <div className="bg-white p-2 rounded-xl shadow-[0_0_20px_rgba(255,45,45,0.2)] inline-block relative overflow-hidden">
      <div className="absolute inset-0 bg-[#FF2D2D] opacity-10 animate-pulse pointer-events-none" />
      <img src={qrSrc} alt="Emergency QR Code" width={size} height={size} className="rounded-lg relative z-10" />
    </div>
  )
}
