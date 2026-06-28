import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { checkRateLimit } from './lib/rate-limiter'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })
  
  const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? 'unknown'
  const path = request.nextUrl.pathname

  // Rate Limiting Logic
  if (path.startsWith('/rescue/')) {
    if (!checkRateLimit(ip, 'rescue', 30, 3600000)) {
      return new NextResponse('Too Many Requests', { status: 429 })
    }
  } else if (path.startsWith('/api/scan-log')) {
    if (!checkRateLimit(ip, 'scan-log', 60, 3600000)) {
      return new NextResponse('Too Many Requests', { status: 429 })
    }
  } else if (path.startsWith('/register')) {
    if (!checkRateLimit(ip, 'register', 10, 3600000)) {
      return new NextResponse('Too Many Requests', { status: 429 })
    }
  } else if (path.startsWith('/api/qr')) {
    if (!checkRateLimit(ip, 'qr', 5, 3600000)) {
      return new NextResponse('Too Many Requests', { status: 429 })
    }
  }

  // Supabase Auth Guarding
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          supabaseResponse = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          supabaseResponse.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          supabaseResponse = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          supabaseResponse.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isProtectedRoute = 
    path.startsWith('/dashboard') || 
    path.startsWith('/profile') || 
    path.startsWith('/family') || 
    path.startsWith('/analytics') || 
    path.startsWith('/settings');

  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }
  
  if (user && (path === '/login' || path === '/register')) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
