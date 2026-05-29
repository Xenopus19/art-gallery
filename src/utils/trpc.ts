import { initTRPC, TRPCError } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import type { TokenUser } from '../routers/loginRouter.ts';
import { JWT_SECRET } from './config.js';
import jwt from 'jsonwebtoken'
import z from 'zod';
import Like from '../models/Like.js';

export const createContext = ({
  req,
}: trpcExpress.CreateExpressContextOptions) => {
  const authorization = req.headers.authorization;
  let user: TokenUser | null = null;

  if (authorization?.toLowerCase().startsWith("bearer ")) {
      const token = authorization.substring(7);
      user = jwt.verify(token, JWT_SECRET) as TokenUser;

  }

  return {
    user, 
  };
}; 
type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.user) {
    throw new TRPCError({ 
      code: 'UNAUTHORIZED',
      message: 'Unauthorized' 
    });
  }
  
  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthed);

export const hasLikedProcedure = protectedProcedure.input(z.object({ postId: z.string() })) 
  .use(async ({ ctx, input, next }) => {
    const like = await Like.findOne({where: {postId: input.postId, userId: ctx.user.id}})

    return next({
      ctx: {
        hasLiked: !!like, 
      },
    });
  });
 
export const publicProcedure = t.procedure;
export const router = t.router;
