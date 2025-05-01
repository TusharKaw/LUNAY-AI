import { router } from '../trpc';
import { userRouter } from './user';
import { agentRouter } from './agent';
import { workspaceRouter } from './workspace';
import { teamRouter } from './team';
import { memoryRouter } from './memory';
import { toolRouter } from './tool';

export const appRouter = router({
  user: userRouter,
  agent: agentRouter,
  workspace: workspaceRouter,
  team: teamRouter,
  memory: memoryRouter,
  tool: toolRouter,
});

export type AppRouter = typeof appRouter;
