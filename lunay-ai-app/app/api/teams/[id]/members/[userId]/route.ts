import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Team, TeamMember } from '@/lib/models';
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

export async function PUT(
  req: Request,
  { params }: { params: { id: string; userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { role } = body;

    if (!role) {
      return NextResponse.json(
        { error: 'Role is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user is team admin
    const isAdmin = await isTeamAdmin(params.id, session.user.id);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Only team admins can update member roles' },
        { status: 403 }
      );
    }

    // Check if target user is team creator
    const team = await Team.findById(params.id);
    if (team?.created_by === params.userId) {
      return NextResponse.json(
        { error: "Team creator's role cannot be modified" },
        { status: 403 }
      );
    }

    const member = await TeamMember.findOneAndUpdate(
      { team_id: params.id, user_id: params.userId },
      { role },
      { new: true }
    ).populate('user_id', 'name email avatar_url');

    if (!member) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(member);
  } catch (error) {
    console.error('Error in PUT /api/teams/[id]/members/[userId]:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string; userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Check if user is team admin or the member being removed
    const [isAdmin, team] = await Promise.all([
      isTeamAdmin(params.id, session.user.id),
      Team.findById(params.id)
    ]);

    if (!isAdmin && session.user.id !== params.userId) {
      return NextResponse.json(
        { error: 'Only team admins can remove other members' },
        { status: 403 }
      );
    }

    // Cannot remove team creator
    if (team?.created_by === params.userId) {
      return NextResponse.json(
        { error: 'Team creator cannot be removed' },
        { status: 403 }
      );
    }

    const member = await TeamMember.findOneAndDelete({
      team_id: params.id,
      user_id: params.userId
    });

    if (!member) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/teams/[id]/members/[userId]:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
