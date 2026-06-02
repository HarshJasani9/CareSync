import { NextResponse } from 'next/server';

// Routes that require authentication, grouped by allowed role
const protectedRoutes = {
  patient: ['/dashboard', '/appointments', '/prescriptions', '/records'],
  doctor: ['/doctor'],
  admin: ['/admin'],
};

// Role → default dashboard redirect
const dashboardMap = {
  patient: '/dashboard',
  doctor: '/doctor/dashboard',
  admin: '/admin/dashboard',
};

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('cl_token')?.value;

  // Determine if the current path is protected
  const isProtected =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/appointments') ||
    pathname.startsWith('/prescriptions') ||
    pathname.startsWith('/records') ||
    pathname.startsWith('/doctor') ||
    pathname.startsWith('/admin');

  // Public routes — let them through
  if (!isProtected) {
    return NextResponse.next();
  }

  // No token — redirect to login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Decode JWT payload to check role
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const role = payload.role;

    // Role-based access control
    const isPatientRoute =
      pathname.startsWith('/dashboard') ||
      pathname.startsWith('/appointments') ||
      pathname.startsWith('/prescriptions') ||
      pathname.startsWith('/records');
    const isDoctorRoute = pathname.startsWith('/doctor');
    const isAdminRoute = pathname.startsWith('/admin');

    // Check if user is accessing routes they shouldn't
    if (isPatientRoute && role !== 'patient') {
      return NextResponse.redirect(new URL(dashboardMap[role] || '/login', request.url));
    }
    if (isDoctorRoute && role !== 'doctor') {
      return NextResponse.redirect(new URL(dashboardMap[role] || '/login', request.url));
    }
    if (isAdminRoute && role !== 'admin') {
      return NextResponse.redirect(new URL(dashboardMap[role] || '/login', request.url));
    }

    return NextResponse.next();
  } catch {
    // Invalid token — redirect to login
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('cl_token');
    return response;
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/appointments/:path*',
    '/prescriptions/:path*',
    '/records/:path*',
    '/doctor/:path*',
    '/admin/:path*',
  ],
};
