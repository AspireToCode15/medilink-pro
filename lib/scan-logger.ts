import { createClient } from './supabase/server';

export async function logScan(
  scanLogId: string,
  medicalProfileId: string, 
  ipAddress: string, 
  userAgent: string, 
  latitude?: number, 
  longitude?: number
) {
  try {
    const supabase = await createClient();
    
    // Very basic IP-based location mapping could be done here if an API was allowed, 
    // but the spec forbids external APIs. We will just log what we have.
    await supabase.from('scan_logs').insert({
      id: scanLogId,
      medical_profile_id: medicalProfileId,
      ip_address: ipAddress,
      user_agent: userAgent,
      latitude,
      longitude,
    });
  } catch (error) {
    console.error('Failed to log scan', error);
  }
}

export async function logCallInitiated(scanLogId: string) {
  try {
    const supabase = await createClient();
    await supabase.from('scan_logs').update({ call_initiated: true }).eq('id', scanLogId);
  } catch (error) {
    console.error('Failed to log call initiated', error);
  }
}
