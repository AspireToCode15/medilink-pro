export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { profileSetupSchema, emergencyContactsSchema } from '@/lib/validators';
import { encryptPhone, maskPhone } from '@/lib/contact-masker';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    
    // Parse the merged body of profile and contacts
    const profileData = profileSetupSchema.parse(body.profile);
    const contactsData = emergencyContactsSchema.parse(body.contacts);

    // 1. Get or Generate Rescue Token
    let rescueToken = uuidv4();
    
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('rescue_token')
      .eq('id', user.id)
      .single();

    if (existingProfile?.rescue_token) {
      rescueToken = existingProfile.rescue_token;
    } else {
      // Update profile with new token and setup complete
      await supabase
        .from('profiles')
        .update({ 
          is_setup_complete: true,
          rescue_token: rescueToken,
          full_name: profileData.fullName
        })
        .eq('id', user.id);
    }

    // 2. Insert/Update Medical Profile
    const { data: medicalProfile, error: profileError } = await supabase
      .from('medical_profiles')
      .upsert({
        user_id: user.id,
        member_name: profileData.fullName,
        age: profileData.age,
        blood_group: profileData.bloodGroup,
        weight_kg: profileData.weight,
        height_cm: profileData.height,
        conditions: profileData.conditions,
        allergies: profileData.allergies,
        current_medications: profileData.medications,
        organ_donor: profileData.organDonor,
        is_primary: true,
        member_label: 'Self',
        rescue_token: rescueToken
      }, { onConflict: 'rescue_token' })
      .select('id')
      .single();

    if (profileError || !medicalProfile) {
      throw new Error(profileError?.message || 'Failed to upsert medical profile');
    }

    // 3. Delete existing contacts for this profile
    const { data: existingContacts } = await supabase
      .from('emergency_contacts')
      .select('*')
      .eq('medical_profile_id', medicalProfile.id);

    await supabase
      .from('emergency_contacts')
      .delete()
      .eq('medical_profile_id', medicalProfile.id);

    // 4. Insert new contacts
    const contactsToInsert = contactsData.contacts.map((contact, index) => {
      let phoneEncrypted = '';
      let phoneMasked = '';
      if (contact.phone.includes('*')) {
        const existing = existingContacts?.find(ec => ec.phone_masked === contact.phone);
        phoneEncrypted = existing ? existing.phone_encrypted : encryptPhone(contact.phone);
        phoneMasked = contact.phone;
      } else {
        phoneEncrypted = encryptPhone(contact.phone);
        phoneMasked = maskPhone(contact.phone);
      }
      return {
        medical_profile_id: medicalProfile.id,
        contact_name: contact.name,
        relationship: contact.relationship,
        phone_encrypted: phoneEncrypted,
        phone_masked: phoneMasked,
        priority: index + 1
      };
    });

    const { error: contactsError } = await supabase
      .from('emergency_contacts')
      .insert(contactsToInsert);

    if (contactsError) {
      throw new Error(contactsError.message);
    }

    return NextResponse.json({ success: true, rescueToken, medicalProfileId: medicalProfile.id });
  } catch (error: any) {
    console.error('Profile API Error:', error);
    if (error.errors && Array.isArray(error.errors) && error.errors.length > 0) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
