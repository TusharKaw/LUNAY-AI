import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const userData = await request.json();
    
    // Validate input
    if (!userData.name || !userData.email || !userData.password || !userData.authMethod) {
      return NextResponse.json(
        { message: 'Name, email, password, and authentication method are required' },
        { status: 400 }
      );
    }
    
    // Call backend API
    const response = await fetch(`${process.env.BACKEND_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Registration failed' },
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
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}