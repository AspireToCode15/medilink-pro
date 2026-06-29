export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { QrCode, AlertCircle, FileText, Users, Activity, FileHeart, Share2 } from 'lucide-react'
import QRCodeDisplay from '@/components/shared/QRCodeDisplay'
import { runTriageEngine } from '@/lib/mediq-engine/triage-classifier'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user }, error: userError } = await (await supabase).auth.getUser()

  if (userError || !user) {
    redirect('/login')
  }

  // Fetch basic profile info and primary medical profile
  const { data: profile } = await (await supabase)
    .from('profiles')
    .select('full_name, rescue_token')
    .eq('id', user.id)
    .single()

  const { data: medicalProfile } = await (await supabase)
    .from('medical_profiles')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_primary', true)
    .single()

  // For simplicity, generate the rescue URL using the token
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://medilink-hazel.vercel.app'
  const rescueUrl = profile?.rescue_token ? `${appUrl}/rescue/${profile.rescue_token}` : null

  const isProfileComplete = !!medicalProfile?.blood_group
  
  // Calculate MedIQ Triage Insights if profile is complete
  let triageResult = null
  let firstAidHint = null
  
  if (isProfileComplete) {
    const conditions = medicalProfile.conditions || ''
    const allergies = medicalProfile.allergies || ''
    const medications = medicalProfile.current_medications || ''
    const age = medicalProfile.age || 0
    const bloodGroup = medicalProfile.blood_group || ''
    
    triageResult = runTriageEngine(conditions, allergies, medications, age, bloodGroup)
    if (triageResult.firstAidHints.length > 0) {
       firstAidHint = triageResult.firstAidHints[0]
    }
  }

  // In a real app we'd fetch actual document and family member counts, but using placeholders here for the UI rewrite.
  // Actually, we can fetch them if we want to be accurate.
  const { count: docsCount } = await (await supabase).from('medical_documents').select('*', { count: 'exact', head: true }).eq('medical_profile_id', medicalProfile?.id)
  const { count: familyCount } = await (await supabase).from('medical_profiles').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('is_primary', false)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-heading text-white">Dashboard</h1>
          <p className="text-[#8899BB] mt-1">Welcome back, {profile?.full_name}</p>
        </div>
      </div>

      {!isProfileComplete && (
        <div className="glass-card-red p-6 flex flex-col sm:flex-row items-center gap-4 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />
          <AlertCircle className="h-10 w-10 text-[#FF2D2D] flex-shrink-0 emergency-pulse" />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1">Incomplete Medical Profile</h3>
            <p className="text-[#8899BB] text-sm">Your emergency QR code is missing critical information. Please complete your setup.</p>
          </div>
          <Link 
            href="/profile" 
            className="w-full sm:w-auto bg-[#FF2D2D] hover:bg-[#ff4545] text-white px-6 py-2 rounded-lg font-medium transition-all shadow-[0_0_15px_rgba(255,45,45,0.3)] text-center whitespace-nowrap"
          >
            Complete Setup
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Profile Summary Card */}
        <div className="glass-card p-6 flex flex-col justify-between group hover:border-white/20 transition-all">
          <div>
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
              <FileHeart className="h-5 w-5 text-blue-400" />
            </div>
            <h3 className="text-gray-400 text-sm font-medium">Blood Group</h3>
            <div className="mt-2 text-3xl font-bold text-white font-heading">
              {medicalProfile?.blood_group || 'Not Set'}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5">
            <Link href="/profile" className="text-blue-400 text-sm font-medium hover:text-blue-300 flex items-center gap-1 group-hover:gap-2 transition-all">
              Edit Profile <span className="text-lg leading-none">→</span>
            </Link>
          </div>
        </div>

        {/* QR Code Action Card */}
        <div className="glass-card-red p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center">
            {rescueUrl ? (
              <QRCodeDisplay url={rescueUrl} size={160} />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-[#FF2D2D]/10 flex items-center justify-center mb-4">
                <QrCode className="h-5 w-5 text-[#FF2D2D]" />
              </div>
            )}
            <div className="mt-4 text-center">
              <h3 className="text-gray-400 text-sm font-medium">Emergency ID</h3>
              <div className="mt-1 text-xl font-bold text-white">Your QR Code</div>
              <p className="text-[#8899BB] text-xs mt-1">Ready for scan</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-[#FF2D2D]/20 relative z-10 flex gap-2">
            <Link href="/settings" className="bg-[#FF2D2D] hover:bg-[#ff4545] text-white text-sm px-4 rounded-md font-medium transition-all shadow-[0_0_10px_rgba(255,45,45,0.2)] flex-1 flex items-center justify-center min-h-[48px]">
              View & Print
            </Link>
            <button className="bg-[#0F1420] hover:bg-white/5 border border-white/10 text-white rounded-md transition-all flex items-center justify-center min-h-[48px] min-w-[48px]">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MedIQ Insights Card */}
        <div className="glass-card p-6 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
              <Activity className="h-5 w-5 text-purple-400" />
            </div>
            <h3 className="text-gray-400 text-sm font-medium">MedIQ Triage Level</h3>
            <div className="mt-2 text-xl font-bold font-heading flex items-center gap-2">
              {triageResult ? (
                <>
                  <span className={`w-3 h-3 rounded-full shadow-[0_0_8px_currentColor] ${
                    triageResult.overallSeverity === 'CRITICAL' || triageResult.overallSeverity === 'HIGH' ? 'bg-red-500 text-red-500' :
                    triageResult.overallSeverity === 'MEDIUM' ? 'bg-yellow-500 text-yellow-500' :
                    'bg-green-500 text-green-500'
                  }`} />
                  <span className="text-white">{triageResult.overallSeverity}</span>
                </>
              ) : (
                <span className="text-white">Analyzing...</span>
              )}
            </div>
            {firstAidHint && (
              <p className="text-[#8899BB] text-xs mt-3 bg-white/5 p-2 rounded-md border border-white/5 line-clamp-2">
                💡 {firstAidHint}
              </p>
            )}
          </div>
        </div>

        {/* My Documents */}
        <div className="glass-card p-6 flex flex-col justify-between group hover:border-white/20 transition-all">
          <div>
            <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center mb-4">
              <FileText className="h-5 w-5 text-teal-400" />
            </div>
            <h3 className="text-gray-400 text-sm font-medium">Medical Documents</h3>
            <div className="mt-2 text-3xl font-bold text-white font-heading">
              {docsCount || 0}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5">
            <Link href="/profile?step=4" className="text-teal-400 text-sm font-medium hover:text-teal-300 flex items-center gap-1 group-hover:gap-2 transition-all">
              Manage Docs <span className="text-lg leading-none">→</span>
            </Link>
          </div>
        </div>

        {/* Family Members */}
        <div className="glass-card p-6 flex flex-col justify-between group hover:border-white/20 transition-all">
          <div>
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4">
              <Users className="h-5 w-5 text-orange-400" />
            </div>
            <h3 className="text-gray-400 text-sm font-medium">Linked Family</h3>
            <div className="mt-2 text-3xl font-bold text-white font-heading">
              {familyCount || 0}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5">
            <Link href="/family" className="text-orange-400 text-sm font-medium hover:text-orange-300 flex items-center gap-1 group-hover:gap-2 transition-all">
              View Family <span className="text-lg leading-none">→</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
