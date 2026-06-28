export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server';
import { logCallInitiated } from '@/lib/scan-logger';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { scanLogId, action } = body;

    if (action === 'call_initiated' && scanLogId) {
      await logCallInitiated(scanLogId);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
