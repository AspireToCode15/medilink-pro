'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, User, Users, BarChart3, Settings } from 'lucide-react'

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Profile', href: '/profile', icon: User },
  { name: 'Family', href: '/family', icon: Users },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] bg-[#080B14]">
      {/* Sidebar for Desktop */}
      <aside className="hidden w-64 border-r border-[#FF2D2D]/20 bg-[#0F1420] md:block">
        <div className="flex h-full flex-col py-6">
          <nav className="flex-1 space-y-2 px-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 rounded-lg px-3 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#FF2D2D]/10 text-[#FF2D2D] border border-[#FF2D2D]/30 shadow-[0_0_15px_rgba(255,45,45,0.1)]'
                      : 'text-[#8899BB] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 relative">
        <div className="animated-bg" />
        <div className="mx-auto max-w-5xl">
          {children}
        </div>
      </main>

      {/* Bottom Nav for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-[#FF2D2D]/20 bg-[#0F1420]/90 backdrop-blur-xl md:hidden">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center space-y-1 w-full h-full transition-colors ${
                isActive ? 'text-[#FF2D2D]' : 'text-[#8899BB] hover:text-white'
              }`}
            >
              <item.icon className={`h-5 w-5 ${isActive ? 'scale-110 transition-transform' : ''}`} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
