import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';
import { TRPCError } from '@trpc/server';

export const toolRouter = router({
  // Get all tools created by the user
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.tool.findMany({
      where: { createdById: ctx.user.id },
      orderBy: { createdAt: 'desc' },
    });
  }),
  
  // Get a tool by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const tool = await ctx.prisma.tool.findUnique({
        where: { id: input.id },
      });
      
      if (!tool) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Tool not found',
        });
      }
      
      // Check if the tool belongs to the user
      if (tool.createdById !== ctx.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have permission to access this tool',
        });
      }
      
      return tool;
    }),
    
  // Create a new tool
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        schema: z.object({
          name: z.string(),
          description: z.string(),
          parameters: z.object({
            type: z.string(),
            properties: z.record(z.any()),
            required: z.array(z.string()).optional(),
          }),
        }),
        handlerUrl: z.string().url(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, description, schema, handlerUrl } = input;
      
      // Create the tool
      const tool = await ctx.prisma.tool.create({
        data: {
          name,
          description,
          schema,
          handlerUrl,
          createdById: ctx.user.id,
        },
      });
      
      return tool;
    }),
    
  // Update a tool
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        schema: z.object({
          name: z.string(),
          description: z.string(),
          parameters: z.object({
            type: z.string(),
            properties: z.record(z.any()),
            required: z.array(z.string()).optional(),
          }),
        }).optional(),
        handlerUrl: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;
      
      // Check if tool exists and belongs to the user
      const tool = await ctx.prisma.tool.findUnique({
        where: { id },
      });
      
      if (!tool) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Tool not found',
        });
      }
      
      if (tool.createdById !== ctx.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have permission to update this tool',
        });
      }
      
      // Update the tool
      const updatedTool = await ctx.prisma.tool.update({
        where: { id },
        data: updateData,
      });
      
      return updatedTool;
    }),
    
  // Delete a tool
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Check if tool exists and belongs to the user
      const tool = await ctx.prisma.tool.findUnique({
        where: { id: input.id },
      });
      
      if (!tool) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Tool not found',
        });
      }
      
      if (tool.createdById !== ctx.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have permission to delete this tool',
        });
      }
      
      // Delete the tool
      await ctx.prisma.tool.delete({
        where: { id: input.id },
      });
      
      return { success: true };
    }),
    
  // Execute a tool
  execute: protectedProcedure
    .input(
      z.object({
        toolId: z.string(),
        parameters: z.record(z.any()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { toolId, parameters } = input;
      
      // Check if tool exists and belongs to the user
      const tool = await ctx.prisma.tool.findUnique({
        where: { id: toolId },
      });
      
      if (!tool) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Tool not found',
        });
      }
      
      // In a real implementation, you would call the handler URL with the parameters
      // For this example, we'll just return a mock response
      
      return {
        success: true,
        result: `Mock result for tool ${tool.name} with parameters ${JSON.stringify(parameters)}`,
      };
    }),
});
