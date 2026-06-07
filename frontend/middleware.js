import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl

  // Read token from cookie named 'cl_token'
  const token = request.cookies.get('cl_token')?.value

  // Define protected route prefixes and their required role
  const protectedRoutes = [
    { prefix: '/dashboard', role: 'patient' },
    { prefix: '/patient',   role: 'patient' },
    { prefix: '/doctor',    role: 'doctor'  },
    { prefix: '/admin',     role: 'admin'   },
  ]

  const matched = protectedRoutes.find(r => pathname.startsWith(r.prefix))

  // If route is not protected, allow through
  if (!matched) return NextResponse.next()

  // No token → redirect to login with callbackUrl
  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Decode JWT payload WITHOUT verifying signature
  // (signature verification happens on the backend — middleware runs on edge
  //  and does not have access to JWT_SECRET securely)
  try {
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString()
    )

    // Check expiry
    const now = Math.floor(Date.now() / 1000)
    if (payload.exp && payload.exp < now) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      const response = NextResponse.redirect(loginUrl)
      response.cookies.delete('cl_token')
      return response
    }

    // Check role mismatch
    if (matched.role && payload.role !== matched.role) {
      // Redirect to their correct dashboard instead of login
      const roleRedirects = {
        patient: '/dashboard',
        doctor:  '/doctor/dashboard',
        admin:   '/admin/dashboard',
      }
      const correctDash = roleRedirects[payload.role] || '/login'
      const redirectUrl = new URL(correctDash, request.url)
      redirectUrl.searchParams.set('error', 'unauthorized')
      return NextResponse.redirect(redirectUrl)
    }

    return NextResponse.next()
  } catch {
    // Malformed token → clear and redirect to login
    const loginUrl = new URL('/login', request.url)
    const response = NextResponse.redirect(loginUrl)
    response.cookies.delete('cl_token')
    return response
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/patient/:path*',
    '/doctor/:path*',
    '/admin/:path*',
  ],
}
