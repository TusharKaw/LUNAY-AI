import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // For development, use mock login instead of calling a real backend
    // In production, you'd want to set BACKEND_URL in your environment variables
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
    
    // Check if this is a test account for local development
    if (email === 'user@example.com' && password === 'password') {
      return NextResponse.json({
        user: {
          id: '1',
          email: 'user@example.com',
          name: 'Test User',
        },
        token: 'mock-jwt-token-for-development',
      });
    }
    
    // Regular backend API call for production
    const response = await fetch(`${backendUrl}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Authentication failed' },
        { status: response.status }
      );
    }
    
    // Set token in cookie
    const nextResponse = NextResponse.json(data);
    nextResponse.cookies.set({
      name: 'token',
      value: data.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });
    
    return nextResponse;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}