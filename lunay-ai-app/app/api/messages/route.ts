import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Message, Agent } from '@/lib/models';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const agent_id = searchParams.get('agent_id');
    
    if (!agent_id) {
      return NextResponse.json(
        { error: 'agent_id is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Verify agent belongs to user
    const agent = await Agent.findOne({
      _id: agent_id,
      user_id: session.user.id,
    });

    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    const messages = await Message.find({ agent_id })
      .sort({ created_at: -1 })
      .limit(50);  // Limit to last 50 messages

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error in GET /api/messages:', error);
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
    const { agent_id, content, role = 'user', tool_calls } = body;

    if (!agent_id || !content) {
      return NextResponse.json(
        { error: 'agent_id and content are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Verify agent belongs to user
    const agent = await Agent.findOne({
      _id: agent_id,
      user_id: session.user.id,
    });

    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    const message = await Message.create({
      agent_id,
      content,
      role,
      tool_calls,
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/messages:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
