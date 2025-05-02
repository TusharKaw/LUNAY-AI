import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import { User } from '@/lib/models';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  console.log('Received registration request');
  console.log('Request headers:', Object.fromEntries(req.headers.entries()));
  
  try {
    // First check if we can read the request body
    const text = await req.text();
    console.log('Raw request body:', text);
    
    let body;
    try {
      body = JSON.parse(text);
    } catch (e) {
      console.error('Failed to parse request body as JSON:', e);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    console.log('Parsed request body:', { ...body, password: '[REDACTED]' });
    
    const { name, email, password } = body;

    if (!name || !email || !password) {
      console.log('Missing required fields');
      return NextResponse.json(
        { error: 'Name, email and password are required' },
        { status: 400 }
      );
    }

    console.log('Connecting to database...');
    await connectDB();

    // Check if user already exists
    console.log('Checking for existing user...');
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists with email:', email);
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    console.log('Hashing password...');
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create user
    console.log('Creating new user...');
    const user = await User.create({
      name,
      email,
      password_hash,
    });

    console.log('User created successfully:', user._id);

    // Don't send password hash back
    const { password_hash: _, ...userWithoutPassword } = user.toObject();

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/users/register:', error);
    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
