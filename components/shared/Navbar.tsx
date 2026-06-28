'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Activity } from 'lucide-react'

export function Navbar() {
  const pathname = usePathname()
  
  // Hide navbar on rescue pages entirely to keep it clean
  if (pathname.startsWith('/rescue/')) {
    return null
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Activity className="h-6 w-6 text-primary" />
          <span className="font-heading font-bold sm:inline-block text-xl">
            MediLink
          </span>
        </Link>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Can add search or other nav links here */}
          </div>
          <nav className="flex items-center gap-2 text-sm">
            {pathname === '/' ? (
              <>
                <Link href="/login" className="text-muted-foreground hover:text-foreground transition-colors px-4 py-2">
                  Login
                </Link>
                <Link href="/register" className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium transition-colors">
                  Create ID
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors px-4 py-2">
                  Dashboard
                </Link>
                <Link href="/profile" className="text-muted-foreground hover:text-foreground transition-colors px-4 py-2">
                  Profile
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </nav>
  )
}
