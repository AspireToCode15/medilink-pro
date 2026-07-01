# Handoff Report: QR URL Domain fixes and Global Code Pattern Polish

## 1. Observation
Below are the direct observations from the codebase analysis:

### QR Code URL Domain Pattern
* **`lib/qr-generator.ts` (Line 4):**
  ```typescript
  const url = `${process.env.NEXT_PUBLIC_APP_URL || 'https://medilink-hazel.vercel.app'}/rescue/${token}`;
  ```
* **`app/(protected)/dashboard/page.tsx` (Line 33-34):**
  ```typescript
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://medilink-hazel.vercel.app'
  const rescueUrl = profile?.rescue_token ? `${appUrl}/rescue/${profile.rescue_token}` : null
  ```
* **`app/(protected)/settings/page.tsx` (Lines 105-108):**
  ```typescript
  <QRCodeDisplay 
    url={`${process.env.NEXT_PUBLIC_APP_URL || 'https://medilink-hazel.vercel.app'}/rescue/${profile.rescue_token}`} 
    size={200} 
  />
  ```
* **`components/shared/QRCodeDisplay.tsx` (Lines 7-21):**
  ```typescript
  export default function QRCodeDisplay({ url, size = 200 }: { url: string, size?: number }) {
    const [qrSrc, setQrSrc] = useState<string>('')
  
    useEffect(() => {
      QRCode.toDataURL(url, {
        width: size,
  ```
* **`app/rescue/[token]/page.tsx` (Line 211, 226):**
  ```typescript
  href={`https://wa.me/?text=${encodeURIComponent(`🚨 EMERGENCY ALERT 🚨\n\nI have found ${profile.member_name} who needs emergency help.\nPlease call immediately.\n\nSent via MediLink Emergency ID\nhttps://medilink-hazel.vercel.app`)}`}
  ...
  Powered by MediLink • medilink-hazel.vercel.app
  ```

---

### Global Code Pattern Polish
* **`getSession` Audit:**
  A case-insensitive grep search for `getSession` or `getsession` across `app/`, `lib/`, and `components/` returned 0 results. All components use `supabase.auth.getUser()`.
* **Missing Try/Catch on Async `useEffect` hooks:**
  * **`app/(protected)/profile/page.tsx` (Lines 72-126):** `loadData()` is an `async` function inside `useEffect` querying Supabase profiles and contacts, but has no try/catch wrapper.
  * **`app/(protected)/settings/page.tsx` (Lines 21-37):** `loadData()` is an `async` function inside `useEffect` querying Supabase profile info, but has no try/catch wrapper.
  * **`app/(protected)/family/page.tsx` (Lines 16-34):** `loadMembers()` is an `async` function inside `useEffect` fetching family profiles, but has no try/catch wrapper.
  * **`app/(protected)/analytics/page.tsx` (Lines 15-72):** `fetchAnalytics()` is an `async` function inside `useEffect` fetching logs, but has no try/catch wrapper.
* **Unsafe Property Access & Optional Chaining Opportunities:**
  * **`app/(protected)/analytics/page.tsx` (Line 53 & Line 149):**
    * Line 53: `const dateStr = log.scanned_at.split('T')[0]` assumes `log.scanned_at` is always populated and non-null.
    * Line 149: `{log.ip_address} • {log.user_agent.substring(0, 30)}...` will throw a runtime error if `log.user_agent` is null (e.g. from headless scans or bots).
  * **`app/(protected)/family/page.tsx` (Lines 68-77):** Accesses properties like `member.member_name`, `member.member_label`, `member.age`, `member.blood_group`, `member.conditions`, `member.rescue_token` without optional chaining inside `.map()`.
  * **`app/(protected)/profile/page.tsx` (Lines 164-166):**
    ```typescript
    if (data.medicalProfileId) setMedicalProfileId(data.medicalProfileId)
    else if (data.medicalProfile?.id) setMedicalProfileId(data.medicalProfile.id)
    else if (data.id) setMedicalProfileId(data.id)
    ```
    Accesses `data.medicalProfileId` and `data.id` directly. If `data` is undefined/null, this will throw.
* **Missing Route-Level Error Boundaries:**
  The project currently has a custom component `components/shared/ErrorBoundary.tsx` but lacks route-level/layout-level `error.tsx` boundary files under the App Router directory structure (`app/error.tsx`, `app/(protected)/error.tsx`).

---

## 2. Logic Chain
1. **QR Domain Standardisation**: Standardizing the variable and fallback mechanism to `const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://medilink-hazel.vercel.app'` ensures consistency and prevents potential environment leaks or hardcoded mismatches.
2. **Dynamic Rescue page & WhatsApp URL**: Since `app/rescue/[token]/page.tsx` is also a public domain landing point, it is logical to apply the standardized `baseUrl` pattern there to support dynamic environment URLs instead of hardcoded strings.
3. **Optional Chaining**: Property accesses on values returned from Supabase, API fetches, or array maps (like logs and family members) can easily result in runtime null pointer exceptions if database fields are empty. Adding optional chaining (`?.`) prevents crashes and gracefully falls back to placeholders.
4. **Try/Catch on `useEffect` Async Calls**: Functions called within React lifecycle hooks like `useEffect` execute outside standard global request boundaries. If a database query fails, it results in unhandled promise rejections, leaving the UI stuck in loading states. Wrapping them in try/catch guarantees the application can transition out of loading states and present error messages.
5. **Next.js Route Error Boundaries**: Implementing Next.js `error.tsx` files ensures layout-level error recovery. A protected error boundary prevents crashes inside settings or family pages from breaking the main dashboard layout navigation.

---

## 3. Caveats
* **No Code Execution**: In accordance with the prompt constraints, no code modifications were applied, and no build or test scripts were run.
* **Next.js Page Transitions**: In `app/(protected)/family/page.tsx`, page navigation is done using `window.location.href = '/family/add'`. Replacing this with Next.js `router.push()` or standard Next.js `<Link>` components would prevent full page refreshes.

---

## 4. Conclusion & Proposed Changes
To standardise and polish the codebase, the following code modifications are proposed:

### Task 1: Standardize QR Code URL Domain Pattern

#### 1. `lib/qr-generator.ts`
Replace:
```typescript
const url = `${process.env.NEXT_PUBLIC_APP_URL || 'https://medilink-hazel.vercel.app'}/rescue/${token}`;
```
With:
```typescript
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://medilink-hazel.vercel.app';
const url = `${baseUrl}/rescue/${token}`;
```

#### 2. `app/(protected)/dashboard/page.tsx`
Replace:
```typescript
  // For simplicity, generate the rescue URL using the token
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://medilink-hazel.vercel.app'
  const rescueUrl = profile?.rescue_token ? `${appUrl}/rescue/${profile.rescue_token}` : null
```
With:
```typescript
  // For simplicity, generate the rescue URL using the token
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://medilink-hazel.vercel.app'
  const rescueUrl = profile?.rescue_token ? `${baseUrl}/rescue/${profile.rescue_token}` : null
```

#### 3. `app/(protected)/settings/page.tsx`
Add definition of `baseUrl` near other hooks, and update the display url prop:
Replace:
```typescript
export default function SettingsPage() {
  const supabase = createClient()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [regenerating, setRegenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    ...
```
With:
```typescript
export default function SettingsPage() {
  const supabase = createClient()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [regenerating, setRegenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://medilink-hazel.vercel.app'

  useEffect(() => {
    ...
```
And replace the prop in `QRCodeDisplay`:
```typescript
            {profile?.rescue_token && (
              <QRCodeDisplay 
                url={`${process.env.NEXT_PUBLIC_APP_URL || 'https://medilink-hazel.vercel.app'}/rescue/${profile.rescue_token}`} 
                size={200} 
              />
            )}
```
With:
```typescript
            {profile?.rescue_token && (
              <QRCodeDisplay 
                url={`${baseUrl}/rescue/${profile.rescue_token}`} 
                size={200} 
              />
            )}
```

#### 4. `components/shared/QRCodeDisplay.tsx`
Add domain fallback awareness to prepend `baseUrl` to relative paths (like `/rescue/...`) if they are passed as URLs:
Replace:
```typescript
export default function QRCodeDisplay({ url, size = 200 }: { url: string, size?: number }) {
  const [qrSrc, setQrSrc] = useState<string>('')

  useEffect(() => {
    QRCode.toDataURL(url, {
```
With:
```typescript
export default function QRCodeDisplay({ url, size = 200 }: { url: string, size?: number }) {
  const [qrSrc, setQrSrc] = useState<string>('')
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://medilink-hazel.vercel.app'

  useEffect(() => {
    const targetUrl = url.startsWith('http') ? url : `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`
    QRCode.toDataURL(targetUrl, {
```

#### 5. `app/rescue/[token]/page.tsx` (Bonus - WhatsApp dynamic domain)
Define `baseUrl` and use it for WhatsApp sharing:
Replace:
```typescript
export default async function RescuePage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  try {
    const { token } = await params
```
With:
```typescript
export default async function RescuePage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://medilink-hazel.vercel.app'
  try {
    const { token } = await params
```
And update the WhatsApp button & footer references:
Replace:
```typescript
          {/* WhatsApp Share */}
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`🚨 EMERGENCY ALERT 🚨\n\nI have found ${profile.member_name} who needs emergency help.\nPlease call immediately.\n\nSent via MediLink Emergency ID\nhttps://medilink-hazel.vercel.app`)}`}
            ...
          </a>

          <div style={{ textAlign: 'center', color: '#445566', fontSize: '0.8rem', paddingBottom: 32 }}>
            Powered by MediLink • medilink-hazel.vercel.app
          </div>
```
With:
```typescript
          {/* WhatsApp Share */}
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`🚨 EMERGENCY ALERT 🚨\n\nI have found ${profile.member_name} who needs emergency help.\nPlease call immediately.\n\nSent via MediLink Emergency ID\n${baseUrl}`)}`}
            ...
          </a>

          <div style={{ textAlign: 'center', color: '#445566', fontSize: '0.8rem', paddingBottom: 32 }}>
            Powered by MediLink • {baseUrl.replace(/^https?:\/\//, '')}
          </div>
```

---

### Task 2: Polish Global Code Patterns

#### 1. Add Try/Catch to `useEffect` Async Calls & Handle Errors gracefully

* **`app/(protected)/profile/page.tsx`:**
  Wrap async block inside `loadData` in a try/catch:
  ```typescript
  useEffect(() => {
    async function loadData() {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) throw authError || new Error('User not found')
        setUserId(user.id)

        const { data: medicalProfile, error: profileError } = await supabase
          .from('medical_profiles')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_primary', true)
          .single()

        if (profileError && profileError.code !== 'PGRST116') throw profileError // Ignore row-not-found error code

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

          const { data: loadedContacts, error: contactsError } = await supabase
            .from('emergency_contacts')
            .select('*')
            .eq('medical_profile_id', medicalProfile.id)
            .order('priority', { ascending: true })

          if (contactsError) throw contactsError

          if (loadedContacts && loadedContacts.length > 0) {
            setContacts(loadedContacts.map(c => ({
              name: c.contact_name,
              relationship: c.relationship,
              phone: c.phone_masked
            })))
          }
        } else {
          const { data: userProfile, error: userProfileError } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', user.id)
            .single()
            
          if (userProfileError) throw userProfileError
          if (userProfile) {
            setProfile(p => ({ ...p, fullName: userProfile.full_name || '' }))
          }
        }
      } catch (err: any) {
        console.error('Error loading profile wizard data:', err)
        setError(err.message || 'Failed to load profile details')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [supabase])
  ```

* **`app/(protected)/settings/page.tsx`:**
  Wrap async block inside `loadData` in a try/catch:
  ```typescript
  useEffect(() => {
    async function loadData() {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) throw authError || new Error('No user found')

        const { data: medicalProfile, error: profileError } = await supabase
          .from('medical_profiles')
          .select('id, rescue_token')
          .eq('user_id', user.id)
          .eq('is_primary', true)
          .single()

        if (profileError) throw profileError
        setProfile(medicalProfile)
      } catch (err: any) {
        console.error('Error loading settings:', err)
        setError(err.message || 'Failed to load profile settings')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])
  ```

* **`app/(protected)/family/page.tsx`:**
  Wrap async block inside `loadMembers` in a try/catch, adding state error boundaries:
  ```typescript
  // Add state for error
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    async function loadMembers() {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) throw authError || new Error('No user found')

        const { data, error: profileError } = await supabase
          .from('medical_profiles')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_primary', false)
          .order('created_at', { ascending: false })

        if (profileError) throw profileError
        if (data) {
          setMembers(data)
        }
      } catch (err: any) {
        console.error('Error loading family members:', err)
        setError(err.message || 'Failed to load family members')
      } finally {
        setLoading(false)
      }
    }
    loadMembers()
  }, [])
  ```

* **`app/(protected)/analytics/page.tsx`:**
  Wrap async block inside `fetchAnalytics` in a try/catch:
  ```typescript
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) throw authError || new Error('No user found')

        // Get user's profiles
        const { data: profiles, error: profilesError } = await supabase
          .from('medical_profiles')
          .select('id')
          .eq('user_id', user.id)

        if (profilesError) throw profilesError

        if (profiles && profiles.length > 0) {
          const profileIds = profiles.map(p => p.id)
          
          // Get scan logs for last 30 days
          const thirtyDaysAgo = new Date()
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

          const { data: scanLogs, error: logsError } = await supabase
            .from('scan_logs')
            .select('*')
            .in('medical_profile_id', profileIds)
            .gte('scanned_at', thirtyDaysAgo.toISOString())
            .order('scanned_at', { ascending: false })

          if (logsError) throw logsError

          if (scanLogs) {
            setLogs(scanLogs)
            
            // Group for chart (last 30 days)
            const daysData: Record<string, number> = {}
            for (let i = 29; i >= 0; i--) {
              const d = new Date()
              d.setDate(d.getDate() - i)
              const dateStr = d.toISOString().split('T')[0]
              daysData[dateStr] = 0
            }

            scanLogs.forEach(log => {
              const dateStr = log.scanned_at?.split('T')[0]
              if (dateStr && daysData[dateStr] !== undefined) {
                daysData[dateStr]++
              }
            })

            const formattedData = Object.entries(daysData).map(([date, count]) => ({
              date: date.substring(5), // MM-DD
              scans: count
            }))

            setChartData(formattedData)
          }
        }
      } catch (err: any) {
        console.error('Error loading analytics:', err)
        setError(err.message || 'Failed to load analytics data')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])
  ```

#### 2. Optional Chaining on Unsafe Object/Array Properties

* **`app/(protected)/analytics/page.tsx`:**
  Line 149: Prevent null/undefined crashes from bot requests with empty user agents:
  Replace:
  ```typescript
  <div className="text-xs text-muted-foreground font-mono mt-1">
    {log.ip_address} • {log.user_agent.substring(0, 30)}...
  </div>
  ```
  With:
  ```typescript
  <div className="text-xs text-muted-foreground font-mono mt-1">
    {log.ip_address || 'Unknown IP'} • {log.user_agent?.substring(0, 30) || 'Unknown Client'}...
  </div>
  ```

* **`app/(protected)/family/page.tsx`:**
  Use optional chaining when displaying family members:
  Replace:
  ```typescript
  {members.map(member => (
    <Card key={member.id} className="glass-card">
      <CardHeader className="pb-3">
        <CardTitle>{member.member_name}</CardTitle>
        <CardDescription>{member.member_label} • {member.age} Yrs • {member.blood_group}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground truncate">
          {member.conditions || 'No conditions'}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t border-border pt-4">
        <Button variant="outline" className="min-h-[48px]" onClick={() => window.open(`/rescue/${member.rescue_token}`, '_blank')}>
          <QrCode className="h-4 w-4 mr-2" /> View QR
        </Button>
  ```
  With:
  ```typescript
  {members.map(member => (
    <Card key={member?.id} className="glass-card">
      <CardHeader className="pb-3">
        <CardTitle>{member?.member_name || 'Unnamed Member'}</CardTitle>
        <CardDescription>{member?.member_label || 'Dependent'} • {member?.age || 0} Yrs • {member?.blood_group || 'Unknown'}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground truncate">
          {member?.conditions || 'No conditions'}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t border-border pt-4">
        <Button variant="outline" className="min-h-[48px]" onClick={() => member?.rescue_token && window.open(`/rescue/${member.rescue_token}`, '_blank')}>
          <QrCode className="h-4 w-4 mr-2" /> View QR
        </Button>
  ```

* **`app/(protected)/profile/page.tsx`:**
  Replace:
  ```typescript
  if (data.medicalProfileId) setMedicalProfileId(data.medicalProfileId)
  else if (data.medicalProfile?.id) setMedicalProfileId(data.medicalProfile.id)
  else if (data.id) setMedicalProfileId(data.id)
  ```
  With:
  ```typescript
  if (data?.medicalProfileId) setMedicalProfileId(data.medicalProfileId)
  else if (data?.medicalProfile?.id) setMedicalProfileId(data.medicalProfile.id)
  else if (data?.id) setMedicalProfileId(data.id)
  ```

#### 3. Standardize Layout-Level and App-Level Error Boundaries

Create `app/error.tsx` (Global error boundary):
```typescript
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
```

Create `app/(protected)/error.tsx` (Protected route error boundary):
```typescript
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
```

---

## 5. Verification Method

To verify these changes:
1. Run standard TypeScript build check:
   ```powershell
   npm run build
   ```
   Or run TS compiler checks directly:
   ```powershell
   npx tsc --noEmit
   ```
2. Run standard ESLint check to verify no syntax errors:
   ```powershell
   npm run lint
   ```
3. Verification condition: Both steps must compile with zero type errors and zero build failures.
