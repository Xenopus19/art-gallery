import userRouter from './routers/usersRouter.ts';
import { publicProcedure, router } from './utils/trpc.ts';

export const appRouter = router({
  hello: publicProcedure.query(() => {
    return {message: 'Hello, world!'};
  }),
  users: userRouter
});

export type AppRouter = typeof appRouter;