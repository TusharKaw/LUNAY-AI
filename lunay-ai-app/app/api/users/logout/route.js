import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Clear the token cookie
    const response = NextResponse.json({ message: 'Logged out successfully' });
    response.cookies.delete('token');
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}