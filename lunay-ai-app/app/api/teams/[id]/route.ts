import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Team, TeamMember } from '@/lib/models';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Helper to check if user has access to team
async function hasTeamAccess(teamId: string, userId: string) {
  const [team, member] = await Promise.all([
    Team.findOne({ _id: teamId, created_by: userId }),
    TeamMember.findOne({ team_id: teamId, user_id: userId })
  ]);
  return team || member;
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
    
    const hasAccess = await hasTeamAccess(params.id, session.user.id);
    if (!hasAccess) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    const team = await Team.findById(params.id);
    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    // Get team members
    const members = await TeamMember.find({ team_id: params.id })
      .populate('user_id', 'name email avatar_url');

    return NextResponse.json({ ...team.toObject(), members });
  } catch (error) {
    console.error('Error in GET /api/teams/[id]:', error);
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

    // Only team creator can update team
    const team = await Team.findOneAndUpdate(
      { _id: params.id, created_by: session.user.id },
      { name },
      { new: true }
    );

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    return NextResponse.json(team);
  } catch (error) {
    console.error('Error in PUT /api/teams/[id]:', error);
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
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Only team creator can delete team
    const team = await Team.findOne({
      _id: params.id,
      created_by: session.user.id,
    });

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    // Delete all team members
    await TeamMember.deleteMany({ team_id: params.id });

    // Delete the team
    await team.deleteOne();

    return NextResponse.json({ message: 'Team and members deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/teams/[id]:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
