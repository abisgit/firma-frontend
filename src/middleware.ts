import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    // Paths that don't require authentication
    if (pathname === '/login' || pathname === '/') {
        return NextResponse.next();
    }

    // If no token, redirect to login
    /* 
       Note: In a real app we'd also check local storage in a client component 
       or use a more robust session management. For Next.js middleware, 
       we rely on cookies.
    */

    // For demo purposes, we'll allow but we should implement cookie-based auth
    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/org/:path*'],
};
