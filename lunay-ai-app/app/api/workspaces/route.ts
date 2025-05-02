import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Workspace } from '@/lib/models';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const workspaces = await Workspace.find({
      user_id: session.user.id,
    }).sort({ created_at: -1 });
    
    return NextResponse.json(workspaces);
  } catch (error) {
    console.error('Error in GET /api/workspaces:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const workspace = await Workspace.create({
      user_id: session.user.id,
      name,
    });

    return NextResponse.json(workspace, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/workspaces:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
