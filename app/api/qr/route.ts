export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { profileId } = body; // which profile to regenerate for

    if (!profileId) {
      return NextResponse.json({ error: 'Profile ID required' }, { status: 400 });
    }

    const newToken = uuidv4();

    // Verify ownership
    const { data: profile, error: fetchError } = await supabase
      .from('medical_profiles')
      .select('id, is_primary')
      .eq('id', profileId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !profile) {
      return NextResponse.json({ error: 'Profile not found or access denied' }, { status: 404 });
    }

    // Update token in medical_profiles
    const { error: updateError } = await supabase
      .from('medical_profiles')
      .update({ rescue_token: newToken })
      .eq('id', profileId);

    if (updateError) throw updateError;

    // If it's the primary profile, update the user's main profiles record as well
    if (profile.is_primary) {
      await supabase
        .from('profiles')
        .update({ rescue_token: newToken, qr_regenerated_at: new Date().toISOString() })
        .eq('id', user.id);
    }

    return NextResponse.json({ success: true, rescueToken: newToken });
  } catch (error: any) {
    console.error('QR Regeneration Error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
