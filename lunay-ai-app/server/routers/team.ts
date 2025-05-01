import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';
import { TRPCError } from '@trpc/server';

export const teamRouter = router({
  // Get all teams the user belongs to
  getAll: protectedProcedure.query(async ({ ctx }) => {
    // Get teams the user owns
    const ownedTeams = await ctx.prisma.team.findMany({
      where: { ownerId: ctx.user.id },
    });
    
    // Get teams the user is a member of
    const memberTeams = await ctx.prisma.teamMember.findMany({
      where: { userId: ctx.user.id },
      include: { team: true },
    });
    
    return {
      ownedTeams,
      memberTeams: memberTeams.map(m => m.team),
    };
  }),
  
  // Get a team by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const team = await ctx.prisma.team.findUnique({
        where: { id: input.id },
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  avatarUrl: true,
                },
              },
            },
          },
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true,
            },
          },
        },
      });
      
      if (!team) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Team not found',
        });
      }
      
      // Check if user is owner or member
      const isMember = team.members.some(member => member.userId === ctx.user.id);
      const isOwner = team.ownerId === ctx.user.id;
      
      if (!isOwner && !isMember) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have permission to access this team',
        });
      }
      
      return {
        ...team,
        isOwner,
        userRole: isOwner ? 'owner' : team.members.find(m => m.userId === ctx.user.id)?.role,
      };
    }),
    
  // Create a new team
  create: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const team = await ctx.prisma.team.create({
        data: {
          name: input.name,
          ownerId: ctx.user.id,
        },
      });
      
      return team;
    }),
    
  // Invite a user to a team
  invite: protectedProcedure
    .input(
      z.object({
        teamId: z.string(),
        email: z.string().email(),
        role: z.enum(['admin', 'editor', 'viewer']),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { teamId, email, role } = input;
      
      // Check if the team exists and the user is the owner
      const team = await ctx.prisma.team.findUnique({
        where: { id: teamId },
      });
      
      if (!team) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Team not found',
        });
      }
      
      if (team.ownerId !== ctx.user.id) {
        // Check if user is an admin
        const membership = await ctx.prisma.teamMember.findFirst({
          where: {
            teamId,
            userId: ctx.user.id,
            role: 'admin',
          },
        });
        
        if (!membership) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have permission to invite users to this team',
          });
        }
      }
      
      // Find the user by email
      const invitedUser = await ctx.prisma.user.findUnique({
        where: { email },
      });
      
      if (!invitedUser) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User with this email does not exist',
        });
      }
      
      // Check if the user is already a member
      const existingMember = await ctx.prisma.teamMember.findFirst({
        where: {
          teamId,
          userId: invitedUser.id,
        },
      });
      
      if (existingMember) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'User is already a member of this team',
        });
      }
      
      // Add the user to the team
      const teamMember = await ctx.prisma.teamMember.create({
        data: {
          teamId,
          userId: invitedUser.id,
          role,
        },
      });
      
      return teamMember;
    }),
    
  // Update a team member's role
  updateMemberRole: protectedProcedure
    .input(
      z.object({
        teamId: z.string(),
        userId: z.string(),
        role: z.enum(['admin', 'editor', 'viewer']),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { teamId, userId, role } = input;
      
      // Check if the team exists and the user is the owner
      const team = await ctx.prisma.team.findUnique({
        where: { id: teamId },
      });
      
      if (!team) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Team not found',
        });
      }
      
      if (team.ownerId !== ctx.user.id) {
        // Check if user is an admin
        const membership = await ctx.prisma.teamMember.findFirst({
          where: {
            teamId,
            userId: ctx.user.id,
            role: 'admin',
          },
        });
        
        if (!membership) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have permission to update member roles in this team',
          });
        }
      }
      
      // Update the member's role
      const teamMember = await ctx.prisma.teamMember.update({
        where: {
          teamId_userId: {
            teamId,
            userId,
          },
        },
        data: { role },
      });
      
      return teamMember;
    }),
    
  // Remove a member from a team
  removeMember: protectedProcedure
    .input(
      z.object({
        teamId: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { teamId, userId } = input;
      
      // Check if the team exists and the user is the owner
      const team = await ctx.prisma.team.findUnique({
        where: { id: teamId },
      });
      
      if (!team) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Team not found',
        });
      }
      
      if (team.ownerId !== ctx.user.id) {
        // Check if user is an admin
        const membership = await ctx.prisma.teamMember.findFirst({
          where: {
            teamId,
            userId: ctx.user.id,
            role: 'admin',
          },
        });
        
        if (!membership) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have permission to remove members from this team',
          });
        }
      }
      
      // Cannot remove the owner
      if (userId === team.ownerId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Cannot remove the team owner',
        });
      }
      
      // Remove the member
      await ctx.prisma.teamMember.delete({
        where: {
          teamId_userId: {
            teamId,
            userId,
          },
        },
      });
      
      return { success: true };
    }),
    
  // Delete a team
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Check if the team exists and the user is the owner
      const team = await ctx.prisma.team.findUnique({
        where: { id: input.id },
      });
      
      if (!team) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Team not found',
        });
      }
      
      if (team.ownerId !== ctx.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only the team owner can delete a team',
        });
      }
      
      // Delete all team members first
      await ctx.prisma.teamMember.deleteMany({
        where: { teamId: input.id },
      });
      
      // Then delete the team
      await ctx.prisma.team.delete({
        where: { id: input.id },
      });
      
      return { success: true };
    }),
});
