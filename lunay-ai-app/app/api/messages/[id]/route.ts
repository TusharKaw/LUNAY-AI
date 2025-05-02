import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Message, Agent } from '@/lib/models';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import type { Session } from 'next-auth';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const message = await Message.findById(params.id);
    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    // Verify user has access to the agent
    const agent = await Agent.findOne({
      _id: message.agent_id,
      user_id: session.user.id,
    });

    if (!agent) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error in GET /api/messages/[id]:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const message = await Message.findById(params.id);
    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    // Verify user has access to the agent
    const agent = await Agent.findOne({
      _id: message.agent_id,
      user_id: session.user.id,
    });

    if (!agent) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    // Only allow editing user messages
    if (message.role !== 'user') {
      return NextResponse.json(
        { error: 'Can only edit user messages' },
        { status: 403 }
      );
    }

    message.content = content;
    await message.save();

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error in PUT /api/messages/[id]:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const message = await Message.findById(params.id);
    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    // Verify user has access to the agent
    const agent = await Agent.findOne({
      _id: message.agent_id,
      user_id: session.user.id,
    });

    if (!agent) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    await message.deleteOne();

    return NextResponse.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/messages/[id]:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
