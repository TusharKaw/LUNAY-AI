import { inferAsyncReturnType } from '@trpc/server';
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '../lib/prisma';

export async function createContext({ req }: FetchCreateContextFnOptions) {
  // For API routes, we need to get the session from the request
  let session = null;
  try {
    session = await getToken({ req: req as NextRequest });
  } catch (err) {
    console.error('Error getting token:', err);
  }
  
  // If a session exists, we can get the user from the database
  let user = null;
  if (session?.sub) {
    try {
      user = await prisma.user.findUnique({
        where: { id: session.sub },
      });
    } catch (err) {
      console.error('Error finding user:', err);
      // Continue without user data
    }
  }
  
  return {
    prisma,
    user,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
