import imageRouter from './routers/imageRouter.js';
import likeRouter from './routers/likeRouter.js';
import loginRouter from './routers/loginRouter.js';
import postsRouter from './routers/postsRouter.js';
import userRouter from './routers/usersRouter.js';
import { publicProcedure, router } from './utils/trpc.js';

export const appRouter = router({
  hello: publicProcedure.query(() => {
    return {message: 'Hello, world!'};
  }),
  users: userRouter,
  login: loginRouter,
  posts: postsRouter,
  like: likeRouter,
  image: imageRouter
});

export type AppRouter = typeof appRouter;