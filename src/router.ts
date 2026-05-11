import { publicProcedure, router } from './utils/trpc.ts';

export const appRouter = router({
  hello: publicProcedure.query(() => {
    return {message: 'Hello, world!'};
  })
});

export type AppRouter = typeof appRouter;