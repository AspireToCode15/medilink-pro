'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Plus, Trash2, ArrowRight, ArrowLeft, CheckCircle2, ShieldAlert } from 'lucide-react'
import DocumentUpload from '@/components/shared/DocumentUpload'
import { runTriageEngine } from '@/lib/mediq-engine/triage-classifier'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'

const steps = [
  { id: 1, title: 'Personal Info' },
  { id: 2, title: 'Medical Data' },
  { id: 3, title: 'Emergency Contacts' },
  { id: 4, title: 'Documents' }
]

function ProfileWizardContent() {
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const stepParam = searchParams.get('step')
  let initialStep = parseInt(stepParam || '1', 10)
  if (isNaN(initialStep) || initialStep < 1 || initialStep > 4) initialStep = 1
  
  const [currentStep, setCurrentStep] = useState(initialStep)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [userId, setUserId] = useState<string | null>(null)
  const [medicalProfileId, setMedicalProfileId] = useState<string | null>(null)
  
  // Form State
  const [profile, setProfile] = useState({
    fullName: '',
    age: '',
    bloodGroup: 'A+',
    weight: '',
    height: '',
    organDonor: false,
    conditions: '',
    allergies: '',
    medications: ''
  })
  
  const [contacts, setContacts] = useState([
    { name: '', relationship: '', phone: '' }
  ])

  // Real-time MedIQ Triage Preview
  const [triagePreview, setTriagePreview] = useState<any>(null)

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (profile.conditions || profile.allergies) {
        setTriagePreview(runTriageEngine(
          profile.conditions,
          profile.allergies,
          profile.medications,
          parseInt(profile.age) || 0,
          profile.bloodGroup
        ))
      } else {
        setTriagePreview(null)
      }
    }, 500)
    return () => clearTimeout(delayDebounce)
  }, [profile.conditions, profile.allergies, profile.medications, profile.age, profile.bloodGroup])

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)

      const { data: medicalProfile } = await supabase
        .from('medical_profiles')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_primary', true)
        .single()

      if (medicalProfile) {
        setMedicalProfileId(medicalProfile.id)
        setProfile({
          fullName: medicalProfile.member_name || '',
          age: medicalProfile.age?.toString() || '',
          bloodGroup: medicalProfile.blood_group || 'A+',
          weight: medicalProfile.weight_kg?.toString() || '',
          height: medicalProfile.height_cm?.toString() || '',
          organDonor: medicalProfile.organ_donor || false,
          conditions: medicalProfile.conditions || '',
          allergies: medicalProfile.allergies || '',
          medications: medicalProfile.current_medications || ''
        })

        const { data: loadedContacts } = await supabase
          .from('emergency_contacts')
          .select('*')
          .eq('medical_profile_id', medicalProfile.id)
          .order('priority', { ascending: true })

        if (loadedContacts && loadedContacts.length > 0) {
          setContacts(loadedContacts.map(c => ({
            name: c.contact_name,
            relationship: c.relationship,
            phone: c.phone_masked
          })))
        }
      } else {
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single()
          
        if (userProfile) {
          setProfile(p => ({ ...p, fullName: userProfile.full_name || '' }))
        }
      }
      setLoading(false)
    }
    loadData()
  }, [supabase])

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  const handleContactChange = (index: number, field: string, value: string) => {
    const newContacts = [...contacts]
    newContacts[index] = { ...newContacts[index], [field]: value }
    setContacts(newContacts)
  }

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setSaving(true)
    setError(null)
    
    try {
      const payload = {
        profile: {
          ...profile,
          age: parseInt(profile.age),
          weight: profile.weight ? parseFloat(profile.weight) : undefined,
          height: profile.height ? parseFloat(profile.height) : undefined,
        },
        contacts: {
          contacts: contacts.filter(c => c.name.trim() !== '' || c.relationship.trim() !== '' || c.phone.trim() !== '')
        }
      }
      
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save')
      
      if (data.medicalProfileId) setMedicalProfileId(data.medicalProfileId)
      else if (data.medicalProfile?.id) setMedicalProfileId(data.medicalProfile.id)
      else if (data.id) setMedicalProfileId(data.id)
      
      nextStep()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-[50vh]"><Loader2 className="h-10 w-10 animate-spin text-[#FF2D2D]" /></div>
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header & Progress Bar */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-white mb-6">Profile Setup</h1>
        <div className="relative h-2 bg-[#0F1420] rounded-full overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-[#FF2D2D] rounded-full"
            initial={{ width: `${((currentStep - 1) / 4) * 100}%` }}
            animate={{ width: `${(currentStep / 4) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
        <div className="flex justify-between mt-3">
          {steps.map(step => (
            <span key={step.id} className={`text-xs font-medium transition-colors ${currentStep >= step.id ? 'text-[#FF2D2D]' : 'text-[#445566]'}`}>
              {step.title}
            </span>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-[#FF2D2D]/50 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Form Wizard */}
      <div className="relative min-h-[400px]">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="glass-card p-6 md:p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Personal Info</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-[#8899BB] mb-2">Full Name</label>
                  <input required value={profile.fullName} onChange={e => setProfile({...profile, fullName: e.target.value})} className="w-full bg-[#0F1420] border border-white/10 rounded-lg p-3 text-white focus:border-[#FF2D2D] outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-sm text-[#8899BB] mb-2">Age</label>
                  <input type="number" required value={profile.age} onChange={e => setProfile({...profile, age: e.target.value})} className="w-full bg-[#0F1420] border border-white/10 rounded-lg p-3 text-white focus:border-[#FF2D2D] outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-sm text-[#8899BB] mb-2">Blood Group</label>
                  <select value={profile.bloodGroup} onChange={e => setProfile({...profile, bloodGroup: e.target.value})} className="w-full bg-[#0F1420] border border-white/10 rounded-lg p-3 text-white focus:border-[#FF2D2D] outline-none transition-colors">
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                  </select>
                </div>
                <div className="flex flex-col justify-center pt-6">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <div className="relative">
                      <input type="checkbox" className="sr-only" checked={profile.organDonor} onChange={e => setProfile({...profile, organDonor: e.target.checked})} />
                      <div className={`block w-14 h-8 rounded-full transition-colors ${profile.organDonor ? 'bg-green-500' : 'bg-white/10'}`}></div>
                      <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${profile.organDonor ? 'transform translate-x-6' : ''}`}></div>
                    </div>
                    <span className="text-[#8899BB] font-medium">Registered Organ Donor</span>
                  </label>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="glass-card p-6 md:p-8 space-y-6"
            >
              <h2 className="text-2xl font-bold text-white mb-2">Medical Data</h2>
              
              {triagePreview && triagePreview.overallSeverity !== 'NONE' && (
                <div className="bg-[#FF2D2D]/10 border border-[#FF2D2D]/30 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2 text-[#FF2D2D] mb-2">
                    <ShieldAlert className="w-5 h-5" />
                    <span className="font-bold text-sm uppercase">MedIQ Triage Preview: {triagePreview.severityLabel}</span>
                  </div>
                  <ul className="text-xs text-[#F0F4FF] list-disc list-inside">
                    {triagePreview.rescuerAlerts.slice(0,2).map((a: string, i: number) => <li key={i}>{a}</li>)}
                  </ul>
                </div>
              )}

              <div>
                <label className="block text-sm text-[#8899BB] mb-2">Medical Conditions</label>
                <textarea rows={3} placeholder="e.g. Type 1 Diabetes, Asthma (or write 'None')" value={profile.conditions} onChange={e => setProfile({...profile, conditions: e.target.value})} className="w-full bg-[#0F1420] border border-white/10 rounded-lg p-3 text-white focus:border-[#FF2D2D] outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-sm text-[#8899BB] mb-2">Allergies</label>
                <textarea rows={3} placeholder="e.g. Penicillin, Peanuts (or write 'None')" value={profile.allergies} onChange={e => setProfile({...profile, allergies: e.target.value})} className="w-full bg-[#0F1420] border border-white/10 rounded-lg p-3 text-white focus:border-[#FF2D2D] outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-sm text-[#8899BB] mb-2">Current Medications</label>
                <textarea rows={2} placeholder="e.g. Insulin" value={profile.medications} onChange={e => setProfile({...profile, medications: e.target.value})} className="w-full bg-[#0F1420] border border-white/10 rounded-lg p-3 text-white focus:border-[#FF2D2D] outline-none transition-colors" />
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="glass-card border-[#FF2D2D]/30 p-6 md:p-8"
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white">Emergency Contacts</h2>
                <p className="text-[#8899BB] text-sm mt-1">Numbers are AES-256 encrypted and stored safely.</p>
              </div>

              <div className="space-y-4">
                {contacts.map((contact, index) => (
                  <div key={index} className="bg-[#0F1420] p-4 rounded-xl border border-white/10 relative group">
                    {index > 0 && (
                      <button onClick={() => {
                        const newC = [...contacts]; newC.splice(index, 1); setContacts(newC);
                      }} className="absolute top-3 right-3 text-white/30 hover:text-[#FF2D2D] transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-[#8899BB] mb-1">Name</label>
                        <input required value={contact.name} onChange={e => handleContactChange(index, 'name', e.target.value)} className="w-full bg-transparent border-b border-white/10 py-2 text-white focus:border-[#FF2D2D] outline-none transition-colors" />
                      </div>
                      <div>
                        <label className="block text-xs text-[#8899BB] mb-1">Relationship</label>
                        <input required value={contact.relationship} onChange={e => handleContactChange(index, 'relationship', e.target.value)} placeholder="e.g. Spouse" className="w-full bg-transparent border-b border-white/10 py-2 text-white focus:border-[#FF2D2D] outline-none transition-colors" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs text-[#8899BB] mb-1">Phone Number</label>
                        <input required type="tel" value={contact.phone} onChange={e => handleContactChange(index, 'phone', e.target.value)} placeholder={contact.phone.includes('*') ? "Hidden for security. Type to change." : "+91 9876543210"} className="w-full bg-transparent border-b border-white/10 py-2 text-white focus:border-[#FF2D2D] outline-none transition-colors" />
                        {contact.phone.includes('*') && <span className="text-xs text-[#445566] mt-1 block">Current number is encrypted.</span>}
                      </div>
                    </div>
                  </div>
                ))}
                
                {contacts.length < 3 && (
                  <button onClick={() => setContacts([...contacts, { name: '', relationship: '', phone: '' }])} className="w-full py-3 border border-dashed border-white/20 rounded-xl text-[#8899BB] hover:text-white hover:border-white/40 transition-colors flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" /> Add Another Contact
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {currentStep === 4 && medicalProfileId && userId && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="glass-card p-6 md:p-8"
            >
              <div className="text-center mb-8">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white">Profile Saved Successfully!</h2>
                <p className="text-[#8899BB] text-sm mt-2">You can optionally upload medical documents now, or skip to dashboard.</p>
              </div>

              <div className="bg-[#0F1420] rounded-xl p-1">
                <DocumentUpload 
                  medicalProfileId={medicalProfileId} 
                  userId={userId} 
                  onComplete={() => router.push('/dashboard')}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t border-white/10">
        {currentStep > 1 && currentStep < 4 ? (
          <button onClick={prevStep} className="flex items-center gap-2 text-[#8899BB] hover:text-white px-4 py-2 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        ) : <div />}
        
        {currentStep < 3 ? (
          <button onClick={nextStep} className="flex items-center gap-2 bg-[#FF2D2D] text-white px-6 py-2 rounded-lg hover:bg-[#ff4545] transition-colors shadow-[0_0_15px_rgba(255,45,45,0.3)]">
            Next <ArrowRight className="w-4 h-4" />
          </button>
        ) : currentStep === 3 ? (
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-[#FF2D2D] text-white px-6 py-2 rounded-lg hover:bg-[#ff4545] transition-colors shadow-[0_0_15px_rgba(255,45,45,0.3)] disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save & Secure Profile'}
          </button>
        ) : currentStep === 4 ? (
          <div className="flex w-full justify-between items-center">
            <button onClick={() => router.push('/dashboard')} className="text-[#8899BB] hover:text-white px-4 py-2 transition-colors">
              Skip for now
            </button>
            <button onClick={() => router.push('/dashboard')} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors shadow-[0_0_15px_rgba(34,197,94,0.3)]">
              Complete Setup
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div className="flex justify-center items-center h-[50vh]"><Loader2 className="h-10 w-10 animate-spin text-[#FF2D2D]" /></div>}>
        <ProfileWizardContent />
      </Suspense>
    </ErrorBoundary>
  )
}
