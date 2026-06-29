export const dynamic = 'force-dynamic'

import { createClient } from '@supabase/supabase-js'
import { decryptPhone } from '@/lib/contact-masker'
import { runTriageEngine } from '@/lib/mediq-engine/triage-classifier'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

export default async function RescuePage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  try {
    const { token } = await params

    if (!token) {
      return <ErrorPage message="Invalid QR code" />
    }

    // Fetch medical profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('medical_profiles')
      .select('*')
      .eq('rescue_token', token)
      .single()

    if (profileError || !profile) {
      return <ErrorPage message="QR code is invalid or expired" />
    }

    // Fetch emergency contacts
    const { data: contacts } = await supabaseAdmin
      .from('emergency_contacts')
      .select('*')
      .eq('medical_profile_id', profile.id)
      .order('priority', { ascending: true })

    // Decrypt phone numbers server side
    const decryptedContacts = (contacts || []).map((c: any) => ({
      ...c,
      phone_real: (() => {
        try { return decryptPhone(c.phone_encrypted) }
        catch { return '' }
      })()
    }))

    // Log scan
    await supabaseAdmin.from('scan_logs').insert({
      medical_profile_id: profile.id,
      scanned_at: new Date().toISOString(),
    }).then(() => {})

    // Run MedIQ Engine
    const triage = runTriageEngine(
      profile.conditions || '',
      profile.allergies || '',
      profile.current_medications || '',
      profile.age,
      profile.blood_group
    )

    // RENDER
    return (
      <div style={{ background: '#080B14', minHeight: '100vh', color: '#F0F4FF', fontFamily: 'Inter, sans-serif' }}>

        {/* Sticky Emergency Header */}
        <div style={{ background: '#FF2D2D', padding: '12px 20px', position: 'sticky', top: 0, zIndex: 100, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', background: '#fff', animation: 'pulse 1.5s infinite' }}></span>
          <strong style={{ fontSize: '1rem', letterSpacing: '0.05em' }}>⚠️ EMERGENCY MEDICAL ID</strong>
          <span style={{ marginLeft: 'auto', fontSize: '0.8rem', opacity: 0.9 }}>
            Scanned: {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <div style={{ maxWidth: 520, margin: '0 auto', padding: '20px 16px' }}>

          {/* MedIQ Triage Banner */}
          {triage.overallSeverity !== 'NONE' && (
            <div style={{
              background: triage.overallSeverity === 'CRITICAL' ? '#FF0000' :
                          triage.overallSeverity === 'HIGH' ? '#FF6600' :
                          triage.overallSeverity === 'MEDIUM' ? '#FFAA00' : '#444',
              borderRadius: 12, padding: '16px 20px', marginBottom: 16
            }}>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{triage.severityLabel}</div>
              {triage.rescuerAlerts.map((alert: string, i: number) => (
                <div key={i} style={{ marginTop: 6, fontSize: '0.9rem' }}>{alert}</div>
              ))}
            </div>
          )}

          {/* Patient Identity */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,45,45,0.35)', borderRadius: 16, padding: 24, marginBottom: 16, textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 8 }}>{profile.member_name}</div>
            <div style={{ fontSize: '1rem', color: '#8899BB', marginBottom: 16 }}>Age: {profile.age}</div>
            <div style={{
              fontSize: '5rem', fontWeight: 900, color: '#FF2D2D',
              border: '3px solid #FF2D2D', borderRadius: 12,
              padding: '8px 32px', display: 'inline-block',
              boxShadow: '0 0 30px rgba(255,45,45,0.4)'
            }}>
              {profile.blood_group}
            </div>
            {profile.organ_donor && (
              <div style={{ marginTop: 12, background: '#00CC66', color: '#fff', borderRadius: 20, padding: '4px 16px', display: 'inline-block', fontSize: '0.85rem', fontWeight: 600 }}>
                ♥ ORGAN DONOR
              </div>
            )}
          </div>

          {/* Medical Info */}
          {profile.conditions && (
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,45,45,0.2)', borderRadius: 12, padding: 16, marginBottom: 12 }}>
              <div style={{ fontWeight: 600, marginBottom: 6, color: '#FF6B6B' }}>⚕️ Medical Conditions</div>
              <div style={{ color: '#F0F4FF' }}>{profile.conditions}</div>
            </div>
          )}

          {profile.allergies && (
            <div style={{ background: 'rgba(255,45,45,0.08)', border: '1px solid rgba(255,45,45,0.4)', borderRadius: 12, padding: 16, marginBottom: 12 }}>
              <div style={{ fontWeight: 600, marginBottom: 6, color: '#FF2D2D' }}>⚠️ Allergies</div>
              <div style={{ color: '#F0F4FF' }}>{profile.allergies}</div>
            </div>
          )}

          {profile.current_medications && (
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 16, marginBottom: 12 }}>
              <div style={{ fontWeight: 600, marginBottom: 6, color: '#8899BB' }}>💊 Current Medications</div>
              <div style={{ color: '#F0F4FF' }}>{profile.current_medications}</div>
            </div>
          )}

          {/* Emergency Contacts */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20, marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 16 }}>📞 EMERGENCY CONTACTS — Tap to Call</div>
            {decryptedContacts.length === 0 && (
              <div style={{ color: '#8899BB' }}>No emergency contacts added</div>
            )}
            {decryptedContacts.map((contact: any, i: number) => (
              <div key={contact.id} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: i < decryptedContacts.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>
                  {contact.contact_name}
                  {contact.relationship && <span style={{ color: '#8899BB', fontWeight: 400, marginLeft: 8 }}>({contact.relationship})</span>}
                </div>
                <div style={{ color: '#8899BB', fontSize: '0.9rem', marginBottom: 8 }}>{contact.phone_masked}</div>
                <a
                  href={`tel:${contact.phone_real}`}
                  style={{
                    display: 'block', background: '#00CC66', color: '#fff',
                    borderRadius: 10, padding: '12px', textAlign: 'center',
                    fontWeight: 700, fontSize: '1rem', textDecoration: 'none',
                    boxShadow: '0 4px 15px rgba(0,204,102,0.3)',
                    minHeight: '48px'
                  }}
                >
                  📞 Call {contact.contact_name}
                </a>
              </div>
            ))}
          </div>

          {/* First Aid Hints */}
          {triage.firstAidHints.length > 0 && (
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20, marginBottom: 16 }}>
              <div style={{ fontWeight: 700, marginBottom: 12 }}>🩺 First Aid Guidance</div>
              {triage.firstAidHints.map((hint: string, i: number) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                  <span style={{ color: '#FF2D2D', fontWeight: 700, minWidth: 20 }}>{i + 1}.</span>
                  <span style={{ color: '#F0F4FF', fontSize: '0.9rem' }}>{hint}</span>
                </div>
              ))}
            </div>
          )}

          {/* WhatsApp Share */}
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`🚨 EMERGENCY ALERT 🚨\n\nI have found ${profile.member_name} who needs emergency help.\nPlease call immediately.\n\nSent via MediLink Emergency ID\nhttps://medilink-hazel.vercel.app`)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block', background: '#25D366', color: '#fff',
              borderRadius: 12, padding: '14px', textAlign: 'center',
              fontWeight: 700, fontSize: '1rem', textDecoration: 'none',
              marginBottom: 24,
              minHeight: '48px'
            }}
          >
            📲 Send Emergency Alert via WhatsApp
          </a>

          <div style={{ textAlign: 'center', color: '#445566', fontSize: '0.8rem', paddingBottom: 32 }}>
            Powered by MediLink • medilink-hazel.vercel.app
          </div>
        </div>
      </div>
    )
  } catch (error: any) {
    return (
      <div style={{ background: '#080B14', minHeight: '100vh', color: '#F0F4FF', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>⚠️</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 8 }}>Something went wrong</div>
          <div style={{ color: '#8899BB', fontSize: '0.9rem' }}>{error?.message || 'Unknown error'}</div>
        </div>
      </div>
    )
  }
}

function ErrorPage({ message }: { message: string }) {
  return (
    <div style={{ background: '#080B14', minHeight: '100vh', color: '#F0F4FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: 20 }}>
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>❌</div>
        <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>{message}</div>
      </div>
    </div>
  )
}
