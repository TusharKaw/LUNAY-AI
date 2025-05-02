import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Team, TeamMember, User } from '@/lib/models';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Helper to check if user is team admin
async function isTeamAdmin(teamId: string, userId: string) {
  const [isCreator, isAdmin] = await Promise.all([
    Team.findOne({ _id: teamId, created_by: userId }).select('_id'),
    TeamMember.findOne({ team_id: teamId, user_id: userId, role: 'admin' }).select('_id')
  ]);
  return isCreator || isAdmin;
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Check if user has access to team
    const member = await TeamMember.findOne({
      team_id: params.id,
      user_id: session.user.id
    });

    if (!member) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    const members = await TeamMember.find({ team_id: params.id })
      .populate('user_id', 'name email avatar_url');

    return NextResponse.json(members);
  } catch (error) {
    console.error('Error in GET /api/teams/[id]/members:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { email, role = 'member' } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user is team admin
    const isAdmin = await isTeamAdmin(params.id, session.user.id);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Only team admins can add members' },
        { status: 403 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user is already a member
    const existingMember = await TeamMember.findOne({
      team_id: params.id,
      user_id: user._id
    });

    if (existingMember) {
      return NextResponse.json(
        { error: 'User is already a team member' },
        { status: 400 }
      );
    }

    // Add user to team
    const member = await TeamMember.create({
      team_id: params.id,
      user_id: user._id,
      role
    });

    const populatedMember = await member.populate('user_id', 'name email avatar_url');
    return NextResponse.json(populatedMember, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/teams/[id]/members:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
