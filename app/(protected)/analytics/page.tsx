'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Loader2, Activity } from 'lucide-react'

export default function AnalyticsPage() {
  const supabase = createClient()
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    async function fetchAnalytics() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get user's profiles
      const { data: profiles } = await supabase
        .from('medical_profiles')
        .select('id')
        .eq('user_id', user.id)

      if (profiles && profiles.length > 0) {
        const profileIds = profiles.map(p => p.id)
        
        // Get scan logs for last 30 days
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const { data: scanLogs } = await supabase
          .from('scan_logs')
          .select('*')
          .in('medical_profile_id', profileIds)
          .gte('scanned_at', thirtyDaysAgo.toISOString())
          .order('scanned_at', { ascending: false })

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
            const dateStr = log.scanned_at.split('T')[0]
            if (daysData[dateStr] !== undefined) {
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
      
      setLoading(false)
    }

    fetchAnalytics()
  }, [])

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-bold">Analytics</h1>
          <p className="text-muted-foreground">Track when and where your Medical IDs were scanned.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="glass-card col-span-1 border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardDescription>Total Scans (30 Days)</CardDescription>
            <CardTitle className="text-4xl">{logs.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground flex items-center">
              <Activity className="h-4 w-4 mr-1 text-primary" />
              Real-time tracking active
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card mt-6">
        <CardHeader>
          <CardTitle>Scan History (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis 
                  dataKey="date" 
                  stroke="#888888" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#888888" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  allowDecimals={false}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.1)' }}
                  contentStyle={{ backgroundColor: '#080B14', borderColor: '#333' }}
                />
                <Bar dataKey="scans" fill="var(--accent-red)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card mt-6">
        <CardHeader>
          <CardTitle>Recent Activity Log</CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No scans recorded in the last 30 days.</p>
          ) : (
            <div className="space-y-4">
              {logs.slice(0, 10).map((log) => (
                <div key={log.id} className="flex justify-between items-center border-b border-border pb-4 last:border-0">
                  <div>
                    <div className="font-medium">QR Scanned</div>
                    <div className="text-xs text-muted-foreground font-mono mt-1">
                      {log.ip_address} • {log.user_agent.substring(0, 30)}...
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">
                      {new Date(log.scanned_at).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(log.scanned_at).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
