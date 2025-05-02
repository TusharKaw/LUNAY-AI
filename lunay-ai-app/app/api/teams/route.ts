import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Team, TeamMember } from '@/lib/models';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    // Get teams where user is either the creator or a member
    const [ownedTeams, memberTeams] = await Promise.all([
      Team.find({ created_by: session.user.id }),
      TeamMember.find({ user_id: session.user.id })
        .populate('team_id')
        .then(members => members.map(m => m.team_id))
    ]);
    
    const teams = [...ownedTeams, ...memberTeams];
    return NextResponse.json(teams);
  } catch (error) {
    console.error('Error in GET /api/teams:', error);
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

    // Create the team
    const team = await Team.create({
      name,
      created_by: session.user.id
    });

    // Add creator as admin member
    await TeamMember.create({
      team_id: team._id,
      user_id: session.user.id,
      role: 'admin'
    });

    return NextResponse.json(team, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/teams:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
