
// // middleware.ts
// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// export function middleware(request: NextRequest) {
//   // Get the pathname from the request
//   const path = request.nextUrl.pathname

//   // Public paths that don't require authentication
//   const isPublicPath = path === '/auth' || path === '/auth/register'

//   // Get the token from cookies
//   const token = request.cookies.get('token')?.value || ''

//   // If it's a protected route and no token exists, redirect to login
//   if (!isPublicPath && !token) {
//     return NextResponse.redirect(new URL('/auth', request.url))
//   }

//   // If user is logged in and tries to access auth pages, redirect to dashboard
//   if (isPublicPath && token) {
//     return NextResponse.redirect(new URL('/dashboard', request.url))
//   }

//   // Continue with the request if everything is fine
//   return NextResponse.next()
// }

// // Configure which routes the middleware should run on
// export const config = {
//   matcher: [
//     '/dashboard/:path*',
//     '/profile/:path*',
//     '/skills/:path*',
//     '/progress/:path*',
//     '/summaries/:path*',
//     '/resources/:path*',
//     '/auth/:path*'
//   ]
// }



























import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Public paths that don't require authentication
  const isPublicPath = path === '/auth'

  // Get the token from cookies
  const token = request.cookies.get('token')?.value || ''

  // If user is logged in and tries to access auth page, redirect to dashboard
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If it's a protected route and no token exists, redirect to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  // Continue with the request
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/skills/:path*',
    '/progress/:path*',
    '/summaries/:path*',
    '/resources/:path*',
    '/auth' 
  ]
}







// // middleware.ts
// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// export function middleware(request: NextRequest) {
//   const path = request.nextUrl.pathname

//   // Public paths that don't require authentication
//   const publicPaths = ['/auth', '/auth/register', '/auth/forgot-password']
//   const isPublicPath = publicPaths.some(publicPath =>
//     path === publicPath || path.startsWith(publicPath + '/')
//   )

//   // Get all cookies for debugging
//   const cookies = request.cookies.getAll()
//   const token = request.cookies.get('token')?.value || ''

//   console.log('--- Middleware Debug ---')
//   console.log('Path:', path)
//   console.log('Is Public Path:', isPublicPath)
//   console.log('All Cookies:', cookies)
//   console.log('Token from cookies:', token ? 'EXISTS' : 'MISSING')
//   console.log('Request URL:', request.url)
//   console.log('Request Headers:', Object.fromEntries(request.headers.entries()))

//   // If user is logged in and tries to access any auth page, redirect to dashboard
//   if (isPublicPath && token) {
//     console.log('Redirecting logged-in user to dashboard')
//     return NextResponse.redirect(new URL('/dashboard', request.url))
//   }

//   // If it's a protected route and no token exists, redirect to login
//   if (!isPublicPath && !token && !path.startsWith('/_next')) {
//     console.log('Redirecting unauthenticated user to auth')
//     return NextResponse.redirect(new URL('/auth', request.url))
//   }

//   console.log('Allowing request to proceed')
//   // Continue with the request
//   return NextResponse.next()
// }

// export const config = {
//   matcher: [
//     '/((?!api|_next/static|_next/image|favicon.ico).*)',
//     '/dashboard/:path*',
//     '/profile/:path*',
//     '/skills/:path*',
//     '/progress/:path*',
//     '/summaries/:path*',
//     '/resources/:path*',
//     '/auth/:path*'
//   ]
// }