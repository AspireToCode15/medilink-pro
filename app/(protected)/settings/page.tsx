'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, RefreshCw, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import QRCodeDisplay from '@/components/shared/QRCodeDisplay'

export default function SettingsPage() {
  const supabase = createClient()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [regenerating, setRegenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: medicalProfile } = await supabase
        .from('medical_profiles')
        .select('id, rescue_token')
        .eq('user_id', user.id)
        .eq('is_primary', true)
        .single()

      setProfile(medicalProfile)
      setLoading(false)
    }
    loadData()
  }, [])

  const handleRegenerateQR = async () => {
    if (!confirm('Are you sure? This will invalidate your existing QR code and ID cards immediately. You will need to print new ones.')) {
      return
    }

    setRegenerating(true)
    setError(null)
    setSuccess(null)

    try {
      const res = await fetch('/api/qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId: profile.id })
      })
      
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error || 'Failed to regenerate')
      
      setSuccess('QR code successfully regenerated. Your old QR code is now invalid.')
      
      // Update local state
      setProfile({ ...profile, rescue_token: data.rescueToken })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setRegenerating(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-heading font-bold">Settings</h1>
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="border-success text-success bg-success/10">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Card className="glass-card border-red-500/30">
        <CardHeader>
          <CardTitle className="text-red-500">Regenerate QR Code</CardTitle>
          <CardDescription>
            If your QR code was exposed publicly or you suspect unauthorized scans, you can regenerate it.
            This will immediately permanently invalidate your old QR code.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center py-6">
          {profile?.rescue_token && (
            <QRCodeDisplay 
              url={`${process.env.NEXT_PUBLIC_APP_URL || 'https://medilink-pro.vercel.app'}/rescue/${profile.rescue_token}`} 
              size={200} 
            />
          )}
          <div className="bg-[#0F1420] p-4 rounded-lg border border-white/10 mt-6 w-full text-center">
            <p className="text-sm font-mono break-all text-[#8899BB]">{profile?.rescue_token}</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="destructive" onClick={handleRegenerateQR} disabled={regenerating || !profile}>
            {regenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Regenerate Now
          </Button>
        </CardFooter>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardFooter>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
