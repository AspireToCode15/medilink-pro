# Handoff Report: Profile Setup Flow Enhancements

## 1. Observation
We analyzed `app/(protected)/profile/page.tsx` and identified the following current implementation details:
- **Navigation Container (Lines 367-392):**
  ```tsx
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
  ```
  - Observation 1.1: Next buttons are not full-width, do not have a minimum height of 48px, use different text labels ("Next", "Save & Secure Profile", "Complete Setup"), and do not use a standard design on Step 4.
  - Observation 1.2: The Back button is only rendered if `currentStep > 1 && currentStep < 4`. This leaves Step 4 without a Back button.
  - Observation 1.3: Progression to the next step (lines 128, 174) is done using `nextStep()` immediately on click without any validation check.

- **Header and Progress Bar (Lines 182-200):**
  ```tsx
        <h1 className="text-3xl font-heading font-bold text-white mb-6">Profile Setup</h1>
        <div className="relative h-2 bg-[#0F1420] rounded-full overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-[#FF2D2D] rounded-full"
            initial={{ width: `${((currentStep - 1) / 4) * 100}%` }}
            animate={{ width: `${(currentStep / 4) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
  ```
  - Observation 1.4: There is no step indicator (like "Step X of Y") text displayed on the UI.
  - Observation 1.5: The progress bar uses `initial` width which causes layout jumps when changing directions (going backward/forward).

- **Data Models and Schema Validation (observed in `lib/validators.ts` lines 23-43):**
  - `profileSetupSchema` validates `fullName` with `.min(2).max(50)`, and `age` with `z.number().min(1).max(120)`.
  - `contactSchema` validates `name` with `.min(2)`, `relationship` with `.min(2)`, and `phone` with a regex match for `/^\+?[0-9*]{10,15}$/` (which supports phone numbers and masked asterisk format).

---

## 2. Logic Chain
- **Next Button (Requirement 1):**
  - To ensure a visible, full-width red "Next →" button exists at the bottom of every step with min-height 48px, we must replace individual buttons in steps 1, 2, 3, and 4 with buttons styled with `w-full min-h-[48px] bg-[#FF2D2D] hover:bg-[#ff4545] text-white flex items-center justify-center` and text `"Next →"`.
  - These buttons should trigger:
    - Step 1 & 2: A validation-guarded next step function.
    - Step 3: A validation-guarded save profile function (`handleSave`).
    - Step 4: Redirection to the dashboard.

- **Field Validation (Requirement 2):**
  - To prevent invalid progression, we must intercept step progression.
  - We will introduce a `validateStep(step)` function:
    - If step is 1, it checks `fullName.trim().length >= 2` and checks if `age` parsed as integer is between 1 and 120.
    - If step is 3, it filters non-empty contacts and checks that name is at least 2 chars, relationship is not empty, and phone is not empty and matches either the masked format (containing `*`) or standard phone regex `/^\+?[0-9*]{10,15}$/`.
  - The validation errors should be passed to the existing component `error` state `setError(message)`.

- **Step Indicator & Progress Bar (Requirement 3):**
  - To display a step indicator, we will render `Step {currentStep} of {steps.length}` side-by-side with the header `Profile Setup`.
  - To make the progress bar animate smoothly without initial layout jumps, we will remove the `initial` attribute from the `motion.div` and animate width directly using `${(currentStep / steps.length) * 100}%`.

- **Back Button (Requirement 4):**
  - To include the Back button on all steps except Step 1, we will remove the `currentStep < 4` constraint from the Back button condition and render it when `currentStep > 1`.
  - To handle the full-width layout cleanly, we will group the buttons vertically inside a flex column container.

---

## 3. Caveats
- **Masked Phone Numbers:** In Step 3, phone numbers fetched from the server may contain mask characters (`*`). The client-side validation pattern `/^\+?[0-9*]{10,15}$/` explicitly allows asterisks to prevent blocking users who don't modify their encrypted numbers.
- **Skip Flow on Step 4:** The original flow had a "Skip for now" option on Step 4. Replacing it with a full-width red "Next →" button fulfills the requirement that "Next →" exists at the bottom of every step and progresses the user (to `/dashboard`).

---

## 4. Conclusion
We can achieve all 4 objectives by modifying `app/(protected)/profile/page.tsx` as specified in the Proposed Changes section below.

---

## 5. Proposed Changes

Below are the exact code modifications for `app/(protected)/profile/page.tsx`.

### 5.1 Step Validation Helper and Progression Handlers
Add the `validateStep` helper and `handleNextClick` right before the `nextStep` definition:

```tsx
  const validateStep = (step: number): boolean => {
    setError(null)
    if (step === 1) {
      if (!profile.fullName || profile.fullName.trim().length < 2) {
        setError('Full Name must be at least 2 characters.')
        return false
      }
      const ageNum = parseInt(profile.age, 10)
      if (isNaN(ageNum) || ageNum < 1 || ageNum > 120 || ageNum.toString() !== profile.age.trim()) {
        setError('Age must be a positive integer between 1 and 120.')
        return false
      }
    } else if (step === 3) {
      const activeContacts = contacts.filter(
        c => c.name.trim() !== '' || c.relationship.trim() !== '' || c.phone.trim() !== ''
      )
      if (activeContacts.length === 0) {
        setError('At least one emergency contact is required.')
        return false
      }
      for (let i = 0; i < activeContacts.length; i++) {
        const contact = activeContacts[i]
        if (!contact.name || contact.name.trim().length < 2) {
          setError(`Emergency Contact #${i + 1} name must be at least 2 characters.`)
          return false
        }
        if (!contact.relationship || contact.relationship.trim().length === 0) {
          setError(`Emergency Contact #${i + 1} relationship is required.`)
          return false
        }
        const phoneTrimmed = contact.phone.trim()
        if (!phoneTrimmed) {
          setError(`Emergency Contact #${i + 1} phone number is required.`)
          return false
        }
        const phoneRegex = /^\+?[0-9*]{10,15}$/
        if (!phoneRegex.test(phoneTrimmed)) {
          setError(`Emergency Contact #${i + 1} phone number is invalid (must be 10-15 digits).`)
          return false
        }
      }
    }
    return true
  }

  const handleNextClick = () => {
    if (validateStep(currentStep)) {
      nextStep()
    }
  }
```

Modify `handleSave` to include the Step 3 validation check:
```tsx
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!validateStep(3)) return
    setSaving(true)
    setError(null)
    
    try {
      ...
```

### 5.2 Header and Progress Bar Section (Lines 182-192)
Replace the existing header section with the updated step indicator and animation:
```tsx
      {/* Header & Progress Bar */}
      <div>
        <div className="flex justify-between items-end mb-6">
          <h1 className="text-3xl font-heading font-bold text-white">Profile Setup</h1>
          <span className="text-sm font-medium text-[#8899BB] mb-1">
            Step {currentStep} of {steps.length}
          </span>
        </div>
        <div className="relative h-2 bg-[#0F1420] rounded-full overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-[#FF2D2D] rounded-full"
            animate={{ width: `${(currentStep / steps.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
        ...
```

### 5.3 Navigation Buttons Section (Lines 367-392)
Replace the entire bottom button container with a stacked flex column containing the full-width red "Next →" button and the back button:
```tsx
      {/* Navigation Buttons */}
      <div className="flex flex-col gap-3 pt-6 border-t border-white/10">
        {currentStep < 3 ? (
          <button 
            type="button"
            onClick={handleNextClick} 
            className="w-full min-h-[48px] bg-[#FF2D2D] hover:bg-[#ff4545] text-white rounded-lg flex items-center justify-center font-semibold transition-colors shadow-[0_0_15px_rgba(255,45,45,0.3)]"
          >
            Next →
          </button>
        ) : currentStep === 3 ? (
          <button 
            type="button"
            onClick={handleSave} 
            disabled={saving} 
            className="w-full min-h-[48px] bg-[#FF2D2D] hover:bg-[#ff4545] text-white rounded-lg flex items-center justify-center font-semibold transition-colors shadow-[0_0_15px_rgba(255,45,45,0.3)] disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Next →'}
          </button>
        ) : currentStep === 4 ? (
          <button 
            type="button"
            onClick={() => router.push('/dashboard')} 
            className="w-full min-h-[48px] bg-[#FF2D2D] hover:bg-[#ff4545] text-white rounded-lg flex items-center justify-center font-semibold transition-colors shadow-[0_0_15px_rgba(255,45,45,0.3)]"
          >
            Next →
          </button>
        ) : null}

        {currentStep > 1 && (
          <button 
            type="button"
            onClick={prevStep} 
            className="w-full py-2.5 flex items-center justify-center gap-2 text-[#8899BB] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        )}
      </div>
```

---

## 6. Verification Method
1. **Initial state check**:
   - Check if page compiles successfully after applying the diff.
2. **Visual Verification**:
   - Render Step 1: Ensure step indicator "Step 1 of 4" is visible. Ensure the "Next →" button is red, full-width, and has a min-height of 48px. Ensure there is NO Back button.
3. **Step 1 Field Validation**:
   - Set fullName to empty or single character (e.g. "A"). Click "Next →". Verification condition: Error message must appear and page must remain on Step 1.
   - Set fullName to "Alice" and age to 0 or 121 or letters. Click "Next →". Verification condition: Error message must appear and page must remain on Step 1.
   - Set fullName to "Alice" and age to "30". Click "Next →". Verification condition: Page must transition to Step 2.
4. **Step 2 Navigation and Back check**:
   - Verification condition: Ensure Step 2 has a visible Back button. Clicking Back must return to Step 1.
   - Ensure progress bar width correctly updates from 25% to 50% without jumpiness.
5. **Step 3 Field Validation**:
   - Set emergency contact name to empty, relationship to empty, and phone to invalid. Click "Next →". Verification condition: Error message must appear.
   - Set correct contact details. Click "Next →". Verification condition: Page must save and transition to Step 4.
6. **Step 4 Navigation check**:
   - Verification condition: Step 4 must display "Step 4 of 4" and progress bar must be at 100%.
   - Ensure Step 4 has a visible Back button and clicking it goes back to Step 3.
   - Click the full-width red "Next →" button on Step 4. Verification condition: User is navigated to the dashboard.
