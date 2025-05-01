import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';
import { TRPCError } from '@trpc/server';

export const agentRouter = router({
  // Get all agents for the current user
  getAll: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string().optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.agent.findMany({
        where: {
          userId: ctx.user.id,
          ...(input?.workspaceId && { workspaceId: input.workspaceId }),
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }),
    
  // Get a single agent by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const agent = await ctx.prisma.agent.findUnique({
        where: { id: input.id },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
          },
        },
      });
      
      if (!agent) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Agent not found',
        });
      }
      
      // Check if the agent belongs to the user
      if (agent.userId !== ctx.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have permission to access this agent',
        });
      }
      
      return agent;
    }),
    
  // Create a new agent
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        persona: z.object({
          role: z.string(),
          goals: z.array(z.string()),
          personality: z.string(),
        }),
        workspaceId: z.string().optional(),
        config: z.object({
          systemPrompt: z.string(),
          tools: z.array(z.string()).optional(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, persona, config, workspaceId } = input;
      
      // If workspace ID is provided, check if it belongs to the user
      if (workspaceId) {
        const workspace = await ctx.prisma.workspace.findUnique({
          where: { id: workspaceId },
        });
        
        if (!workspace || workspace.userId !== ctx.user.id) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have permission to use this workspace',
          });
        }
      }
      
      // Create the agent
      const agent = await ctx.prisma.agent.create({
        data: {
          name,
          persona,
          config,
          userId: ctx.user.id,
          ...(workspaceId && { workspaceId }),
        },
      });
      
      return agent;
    }),
    
  // Update an agent
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        persona: z.object({
          role: z.string(),
          goals: z.array(z.string()),
          personality: z.string(),
        }).optional(),
        config: z.object({
          systemPrompt: z.string(),
          tools: z.array(z.string()).optional(),
        }).optional(),
        workspaceId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;
      
      // Check if agent exists and belongs to the user
      const agent = await ctx.prisma.agent.findUnique({
        where: { id },
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
          message: 'You do not have permission to update this agent',
        });
      }
      
      // If workspace ID is changing, check if it belongs to the user
      if (updateData.workspaceId && updateData.workspaceId !== agent.workspaceId) {
        const workspace = await ctx.prisma.workspace.findUnique({
          where: { id: updateData.workspaceId },
        });
        
        if (!workspace || workspace.userId !== ctx.user.id) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have permission to use this workspace',
          });
        }
      }
      
      // Update the agent
      const updatedAgent = await ctx.prisma.agent.update({
        where: { id },
        data: updateData,
      });
      
      return updatedAgent;
    }),
    
  // Delete an agent
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Check if agent exists and belongs to the user
      const agent = await ctx.prisma.agent.findUnique({
        where: { id: input.id },
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
          message: 'You do not have permission to delete this agent',
        });
      }
      
      // Delete all related data first (messages, memories)
      await ctx.prisma.message.deleteMany({
        where: { agentId: input.id },
      });
      
      await ctx.prisma.memoryItem.deleteMany({
        where: { agentId: input.id },
      });
      
      // Then delete the agent
      await ctx.prisma.agent.delete({
        where: { id: input.id },
      });
      
      return { success: true };
    }),
    
  // Send a message to an agent
  chat: protectedProcedure
    .input(
      z.object({
        agentId: z.string(),
        message: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { agentId, message } = input;
      
      // Check if agent exists and belongs to the user
      const agent = await ctx.prisma.agent.findUnique({
        where: { id: agentId },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
            take: 10, // Get last 10 messages for context
          },
        },
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
          message: 'You do not have permission to chat with this agent',
        });
      }
      
      // Save the user message
      const userMessage = await ctx.prisma.message.create({
        data: {
          agentId,
          role: 'user',
          content: message,
        },
      });
      
      // TODO: Call OpenAI API to get response
      // This would need to be implemented with the actual OpenAI integration
      
      // For now, just create a placeholder response
      const assistantMessage = await ctx.prisma.message.create({
        data: {
          agentId,
          role: 'assistant',
          content: `This is a placeholder response. In a real implementation, this would be generated by OpenAI based on the agent's persona, configuration, and chat history.`,
        },
      });
      
      return { userMessage, assistantMessage };
    }),
    
  // Get chat history for an agent
  getHistory: protectedProcedure
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
          message: 'You do not have permission to access this agent history',
        });
      }
      
      // Get all messages for the agent
      const messages = await ctx.prisma.message.findMany({
        where: { agentId: input.agentId },
        orderBy: { createdAt: 'asc' },
      });
      
      return messages;
    }),
    
  // Clear chat history for an agent
  clearHistory: protectedProcedure
    .input(z.object({ agentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
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
          message: 'You do not have permission to clear this agent history',
        });
      }
      
      // Delete all messages for the agent
      await ctx.prisma.message.deleteMany({
        where: { agentId: input.agentId },
      });
      
      return { success: true };
    }),
});
