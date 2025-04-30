import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;
  
  // Define public paths that don't require authentication
  const isPublicPath = path === '/' || 
                      path.startsWith('/auth/') || 
                      path === '/subscription' || 
                      path === '/try-luna' ||
                      path.startsWith('/_next') ||
                      path.startsWith('/api/') ||
                      path.startsWith('/images/');
  
  // Get the token from the cookies or authorization header
  const token = request.cookies.get('token')?.value || 
                request.headers.get('authorization')?.split(' ')[1] || '';
  
  // If the path requires authentication and there's no token, redirect to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  // If the user is logged in and tries to access login/register pages, redirect to dashboard
  if (token && (path.startsWith('/auth/login') || path.startsWith('/auth/register'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};