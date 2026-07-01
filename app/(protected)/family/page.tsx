'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Plus, QrCode, Trash2, Users } from 'lucide-react'
import Link from 'next/link'

export default function FamilyPage() {
  const supabase = createClient()
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
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

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-bold">Family Members</h1>
          <p className="text-muted-foreground">Manage emergency IDs for dependents (up to 5 on free tier).</p>
        </div>
        <Button className="min-h-[48px]" onClick={() => window.location.href = '/family/add'}>
          <Plus className="h-4 w-4 mr-2" /> Add Member
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {members.length === 0 ? (
        <Card className="glass-card text-center py-12">
          <CardContent className="flex flex-col items-center">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-bold mb-2">No Family Members Added</h3>
            <p className="text-muted-foreground mb-6">Create QR IDs for your parents or children.</p>
            <Button className="min-h-[48px]" onClick={() => window.location.href = '/family/add'} variant="outline">
              Add First Member
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
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
                <Button variant="ghost" className="text-red-500 hover:text-red-400 min-h-[48px] min-w-[48px]">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
