export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { decryptPhone } from '@/lib/contact-masker'
import { runTriageEngine } from '@/lib/mediq-engine/triage-classifier'
import { getDictionary } from '@/lib/i18n'
import { notFound } from 'next/navigation'
import { AlertTriangle, Activity, HeartPulse, ShieldAlert, CheckCircle2, Droplets } from 'lucide-react'
import { logScan } from '@/lib/scan-logger'
import { headers } from 'next/headers'
import Link from 'next/link'
import crypto from 'crypto'
import { CallButton } from '@/components/CallButton'

export default async function RescuePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const supabase = await createClient()
  const dict = getDictionary()
  
  // 1. Fetch Profile
  const { data: profile, error } = await supabase
    .from('medical_profiles')
    .select('*')
    .eq('rescue_token', token)
    .single()

  if (error || !profile) {
    notFound()
  }

  // 2. Fetch Contacts
  const { data: contacts } = await supabase
    .from('emergency_contacts')
    .select('*')
    .eq('medical_profile_id', profile.id)
    .order('priority', { ascending: true })

  // 3. Log Scan
  const headersList = headers()
  const ip = headersList.get('x-forwarded-for') || 'unknown'
  const userAgent = headersList.get('user-agent') || 'unknown'
  
  const scanLogId = crypto.randomUUID()
  // Fire and forget
  logScan(scanLogId, profile.id, ip, userAgent).catch(console.error)

  // 4. Run Triage Engine
  const triage = runTriageEngine(
    profile.conditions || '',
    profile.allergies || '',
    profile.current_medications || '',
    profile.age,
    profile.blood_group
  )

  const scanTime = new Date().toLocaleTimeString()

  return (
    <div className="min-h-screen bg-[#080B14] text-white font-sans selection:bg-[#FF2D2D]/30 relative overflow-hidden">
      <div className="animated-bg" />
      
      {/* Top Emergency Banner */}
      <div className="bg-[#FF2D2D] px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-[0_4px_30px_rgba(255,45,45,0.4)] border-b border-red-400">
        <div className="flex items-center space-x-2 emergency-pulse">
          <AlertTriangle className="h-6 w-6 text-white" />
          <span className="font-bold text-lg tracking-wider uppercase font-heading">{dict.rescue.emergencyAlert}</span>
        </div>
        <div className="text-xs font-mono opacity-90 font-medium">
          {dict.rescue.scannedAt.replace('{time}', scanTime)}
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-6 pb-24 relative z-10">
        
        {/* Triage Alerts (If Any) - Moved to top for immediate rescuer visibility */}
        {triage.overallSeverity !== 'NONE' && (
          <div className="glass-card-red border-l-4 border-l-[#FF2D2D] p-5">
            <div className="flex items-start space-x-3">
              <ShieldAlert className="h-7 w-7 text-[#FF2D2D] flex-shrink-0 mt-0.5 emergency-pulse" />
              <div>
                <h3 className="font-bold text-[#FF2D2D] text-lg mb-2 uppercase tracking-wide">{triage.severityLabel}</h3>
                <ul className="space-y-2 text-red-100 text-sm font-medium">
                  {triage.rescuerAlerts.map((alert, i) => (
                    <li key={i} className="flex items-start">
                      <span className="mr-2 mt-0.5 text-[#FF2D2D]">•</span>
                      <span>{alert}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Patient Identity Card */}
        <div className="glass-card p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF2D2D]/10 blur-[60px] -z-10 rounded-full"></div>
          <h1 className="text-4xl md:text-5xl font-black font-heading mb-6 tracking-tight text-white">{profile.member_name}</h1>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-2">
            <div className="bg-[#0F1420] p-4 rounded-xl border border-white/5 shadow-inner">
              <div className="text-sm text-[#8899BB] mb-1 font-medium">{dict.rescue.age}</div>
              <div className="text-2xl font-bold">{profile.age} Yrs</div>
            </div>
            
            <div className="bg-[#0F1420] p-4 rounded-xl border border-[#FF2D2D]/20 shadow-inner relative overflow-hidden">
              <div className="absolute -right-2 -bottom-2 text-[#FF2D2D] opacity-10">
                <Droplets className="w-16 h-16" />
              </div>
              <div className="text-sm text-[#8899BB] mb-1 font-medium">{dict.rescue.bloodGroup}</div>
              <div className="text-3xl font-bold text-[#FF2D2D] flex items-center">
                {profile.blood_group}
              </div>
            </div>

            {profile.organ_donor && (
              <div className="bg-[#0F1420] p-4 rounded-xl border border-green-500/20 col-span-2 md:col-span-1 flex flex-col justify-center">
                <div className="text-green-500 font-bold flex items-center text-lg">
                  <CheckCircle2 className="h-6 w-6 mr-2" />
                  {dict.rescue.organDonor}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Medical Information */}
        <div className="glass-card overflow-hidden !p-0">
          <div className="p-4 border-b border-white/5 bg-white/[0.02]">
            <h2 className="text-xl font-bold font-heading text-white">{dict.rescue.conditions}</h2>
          </div>
          <div className="p-5 text-gray-300 font-medium leading-relaxed">
            {profile.conditions || dict.rescue.noneReported}
          </div>
        </div>

        <div className="glass-card overflow-hidden !p-0">
          <div className="p-4 border-b border-white/5 bg-white/[0.02]">
            <h2 className="text-xl font-bold font-heading text-white">{dict.rescue.allergies}</h2>
          </div>
          <div className="p-5 font-medium leading-relaxed text-[#FF2D2D]">
            {profile.allergies || <span className="text-gray-400 font-normal">{dict.rescue.noneReported}</span>}
          </div>
        </div>

        <div className="glass-card overflow-hidden !p-0">
          <div className="p-4 border-b border-white/5 bg-white/[0.02]">
            <h2 className="text-xl font-bold font-heading text-white">{dict.rescue.medications}</h2>
          </div>
          <div className="p-5 text-gray-300 font-medium leading-relaxed">
            {profile.current_medications || dict.rescue.noneReported}
          </div>
        </div>

        {/* First Aid Hints */}
        {triage.firstAidHints.length > 0 && (
          <div className="glass-card overflow-hidden !p-0 border-blue-500/30">
            <div className="p-4 border-b border-blue-500/20 bg-blue-500/10">
              <h2 className="text-xl font-bold font-heading text-blue-400">{dict.rescue.firstAidHints}</h2>
            </div>
            <div className="p-5 text-blue-100 bg-[#0F1420]">
              <ul className="space-y-3 font-medium">
                {triage.firstAidHints.map((hint, i) => (
                  <li key={i} className="flex items-start">
                    <Activity className="h-5 w-5 mr-3 flex-shrink-0 text-blue-400 mt-0.5" />
                    <span>{hint}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Emergency Contacts */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold font-heading mb-4 px-2 text-white">{dict.rescue.emergencyContacts}</h2>
          <div className="space-y-4">
            {contacts?.map((contact) => {
              // SECURITY: Decrypt server-side. 
              // The decrypted number ONLY goes into the href attr.
              const decryptedNumber = decryptPhone(contact.phone_encrypted);
              
              return (
                <div key={contact.id} className="glass-card p-5 flex items-center justify-between group">
                  <div>
                    <h3 className="text-xl font-bold text-white">{contact.contact_name}</h3>
                    <div className="text-[#FF2D2D] font-medium text-sm mt-1 uppercase tracking-wider">{contact.relationship}</div>
                    <div className="text-xl font-mono mt-2 tracking-widest text-[#8899BB]">{contact.phone_masked}</div>
                  </div>
                  
                  {/* The actual number is never rendered in visible text */}
                  <CallButton 
                    phoneNumber={decryptedNumber} 
                    contactName={contact.contact_name} 
                    scanLogId={scanLogId} 
                  />
                </div>
              )
            })}
          </div>
        </div>

        {/* WhatsApp Share Button */}
        <div className="pt-8">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(dict.rescue.notifyMessage.replace('{name}', profile.member_name))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full block text-center bg-[#25D366] text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(37,211,102,0.3)] hover:bg-[#1ebd59] transition-all hover:scale-[1.02]"
          >
            {dict.rescue.shareLocation}
          </a>
        </div>
      </div>
      
      <footer className="text-center py-8 text-[#445566] text-sm border-t border-white/5 relative z-10 bg-[#080B14]">
        Powered by <Link href="/" className="font-bold text-white hover:text-[#FF2D2D] transition-colors">MediLink</Link>
      </footer>
    </div>
  )
}
