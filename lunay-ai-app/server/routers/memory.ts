import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';
import { TRPCError } from '@trpc/server';

export const memoryRouter = router({
  // Get all memory items for an agent
  getAll: protectedProcedure
    .input(z.object({ agentId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Check if agent exists and belongs to the user
      const agent = await ctx.prisma.agent.findUnique({
        where: { id: input.agentId },
      });
      
      if (!agent) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Agent not found',
        });
      }
      
      if (agent.userId !== ctx.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have permission to access this agent\'s memories',
        });
      }
      
      // Get all memory items for the agent
      const memories = await ctx.prisma.memoryItem.findMany({
        where: { agentId: input.agentId },
        orderBy: { createdAt: 'desc' },
      });
      
      return memories;
    }),
    
  // Create a new memory item
  create: protectedProcedure
    .input(
      z.object({
        agentId: z.string(),
        type: z.string(),
        content: z.string(),
        metadata: z.record(z.any()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { agentId, type, content, metadata } = input;
      
      // Check if agent exists and belongs to the user
      const agent = await ctx.prisma.agent.findUnique({
        where: { id: agentId },
      });
      
      if (!agent) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Agent not found',
        });
      }
      
      if (agent.userId !== ctx.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have permission to add memories to this agent',
        });
      }
      
      // Create the memory item
      const memoryItem = await ctx.prisma.memoryItem.create({
        data: {
          agentId,
          type,
          content,
          metadata,
        },
      });
      
      return memoryItem;
    }),
    
  // Update a memory item
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        type: z.string().optional(),
        content: z.string().optional(),
        metadata: z.record(z.any()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;
      
      // Get the memory item to check ownership
      const memoryItem = await ctx.prisma.memoryItem.findUnique({
        where: { id },
        include: { agent: true },
      });
      
      if (!memoryItem) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Memory item not found',
        });
      }
      
      // Check if the memory's agent belongs to the user
      if (memoryItem.agent.userId !== ctx.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have permission to update this memory item',
        });
      }
      
      // Update the memory item
      const updatedMemoryItem = await ctx.prisma.memoryItem.update({
        where: { id },
        data: updateData,
      });
      
      return updatedMemoryItem;
    }),
    
  // Delete a memory item
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Get the memory item to check ownership
      const memoryItem = await ctx.prisma.memoryItem.findUnique({
        where: { id: input.id },
        include: { agent: true },
      });
      
      if (!memoryItem) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Memory item not found',
        });
      }
      
      // Check if the memory's agent belongs to the user
      if (memoryItem.agent.userId !== ctx.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have permission to delete this memory item',
        });
      }
      
      // Delete the memory item
      await ctx.prisma.memoryItem.delete({
        where: { id: input.id },
      });
      
      return { success: true };
    }),
});
