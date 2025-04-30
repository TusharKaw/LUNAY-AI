import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Call backend API
    const response = await fetch(`${process.env.BACKEND_URL}/api/subscriptions/plans`);
    
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to fetch subscription plans' },
        { status: response.status }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Subscription plans error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}