import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Agent } from '@/lib/models';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import type { Session } from 'next-auth';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const workspace_id = searchParams.get('workspace_id');
    
    await connectDB();
    
    const query = workspace_id 
      ? { workspace_id } 
      : { user_id: session.user.id };
      
    const agents = await Agent.find(query).sort({ created_at: -1 });
    
    return NextResponse.json(agents);
  } catch (error) {
    console.error('Error in GET /api/agents:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, persona, config, workspace_id } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const agent = await Agent.create({
      user_id: session.user.id,
      workspace_id,
      name,
      persona,
      config,
    });

    return NextResponse.json(agent, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/agents:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
