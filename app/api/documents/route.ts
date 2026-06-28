export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Find primary medical profile
    const { data: profile } = await supabase
      .from('medical_profiles')
      .select('id')
      .eq('user_id', user.id)
      .eq('is_primary', true)
      .single()

    if (!profile) return NextResponse.json([])

    // Fetch documents
    const { data: documents, error } = await supabase
      .from('medical_documents')
      .select('*')
      .eq('medical_profile_id', profile.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(documents || [])
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { medical_profile_id, document_name, document_type, storage_path, file_size_kb } = body

    if (!medical_profile_id || !document_name || !document_type || !storage_path || file_size_kb === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('medical_documents')
      .insert({
        medical_profile_id,
        document_name,
        document_type,
        storage_path,
        file_size_kb
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { document_id, storage_path } = body

    if (!document_id || !storage_path) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verify ownership
    const { data: doc } = await supabase
      .from('medical_documents')
      .select('medical_profile_id')
      .eq('id', document_id)
      .single()

    if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const { data: profile } = await supabase
      .from('medical_profiles')
      .select('user_id')
      .eq('id', doc.medical_profile_id)
      .single()

    if (!profile || profile.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('documents')
      .remove([storage_path])

    // Delete from DB
    const { error: dbError } = await supabase
      .from('medical_documents')
      .delete()
      .eq('id', document_id)

    if (dbError) throw dbError

    if (storageError) {
      return NextResponse.json({ success: true, warning: 'storage delete failed' })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
