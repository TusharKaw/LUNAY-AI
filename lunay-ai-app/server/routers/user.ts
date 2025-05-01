import { z } from 'zod';
import { protectedProcedure, publicProcedure, router } from '../trpc';
import { TRPCError } from '@trpc/server';
import bcrypt from 'bcryptjs';

export const userRouter = router({
  // Get current user's profile
  me: protectedProcedure.query(async ({ ctx }) => {
    return ctx.user;
  }),
  
  // Register a new user
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { email, password, name } = input;
      
      // Check if user already exists
      const existingUser = await ctx.prisma.user.findUnique({
        where: { email },
      });
      
      if (existingUser) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'User with this email already exists',
        });
      }
      
      // Hash the password
      const passwordHash = await bcrypt.hash(password, 10);
      
      // Create the user
      const user = await ctx.prisma.user.create({
        data: {
          email,
          passwordHash,
          name,
        },
      });
      
      return { id: user.id };
    }),
    
  // Update user profile
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        avatarUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, avatarUrl } = input;
      
      const user = await ctx.prisma.user.update({
        where: { id: ctx.user.id },
        data: {
          ...(name && { name }),
          ...(avatarUrl && { avatarUrl }),
        },
      });
      
      return user;
    }),
});
