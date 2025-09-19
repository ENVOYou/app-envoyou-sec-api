import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const pathname = request.nextUrl.pathname
  
  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return response
  }

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
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
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
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )
  
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    // Define protected routes
    const protectedRoutes = ['/dashboard']
    const authRoutes = ['/auth']
    
    const isProtectedRoute = protectedRoutes.some(route => 
      pathname.startsWith(route)
    )
    const isAuthRoute = authRoutes.some(route => 
      pathname.startsWith(route)
    )
    
    // Redirect authenticated users away from auth pages
    if (session && isAuthRoute) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    
    // Redirect unauthenticated users to login
    if (!session && isProtectedRoute) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
    
    // Root redirect logic
    if (pathname === '/') {
      if (session) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      } else {
        return NextResponse.redirect(new URL('/auth/login', request.url))
      }
    }
    
  } catch (error) {
    console.error('Middleware error:', error)
    // On error, redirect to login for protected routes
    const protectedRoutes = ['/dashboard']
    const isProtectedRoute = protectedRoutes.some(route => 
      pathname.startsWith(route)
    )
    
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}