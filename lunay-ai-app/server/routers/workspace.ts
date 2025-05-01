import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';
import { TRPCError } from '@trpc/server';

export const workspaceRouter = router({
  // Get all workspaces for the current user
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.workspace.findMany({
      where: { userId: ctx.user.id },
      orderBy: { createdAt: 'desc' },
    });
  }),
  
  // Get a workspace by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const workspace = await ctx.prisma.workspace.findUnique({
        where: { id: input.id },
        include: {
          agents: true,
        },
      });
      
      if (!workspace) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Workspace not found',
        });
      }
      
      // Check if the workspace belongs to the user
      if (workspace.userId !== ctx.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have permission to access this workspace',
        });
      }
      
      return workspace;
    }),
    
  // Create a new workspace
  create: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const workspace = await ctx.prisma.workspace.create({
        data: {
          name: input.name,
          userId: ctx.user.id,
        },
      });
      
      return workspace;
    }),
    
  // Update a workspace
  update: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id, name } = input;
      
      // Check if workspace exists and belongs to the user
      const workspace = await ctx.prisma.workspace.findUnique({
        where: { id },
      });
      
      if (!workspace) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Workspace not found',
        });
      }
      
      if (workspace.userId !== ctx.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have permission to update this workspace',
        });
      }
      
      // Update the workspace
      const updatedWorkspace = await ctx.prisma.workspace.update({
        where: { id },
        data: { name },
      });
      
      return updatedWorkspace;
    }),
    
  // Delete a workspace
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Check if workspace exists and belongs to the user
      const workspace = await ctx.prisma.workspace.findUnique({
        where: { id: input.id },
      });
      
      if (!workspace) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Workspace not found',
        });
      }
      
      if (workspace.userId !== ctx.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have permission to delete this workspace',
        });
      }
      
      // First, update any agents in this workspace to not have a workspace
      await ctx.prisma.agent.updateMany({
        where: { workspaceId: input.id },
        data: { workspaceId: null },
      });
      
      // Then delete the workspace
      await ctx.prisma.workspace.delete({
        where: { id: input.id },
      });
      
      return { success: true };
    }),
});
