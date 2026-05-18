import { initTRPC, TRPCError } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import type { TokenUser } from '../routers/loginRouter.ts';
import { JWT_SECRET } from './config.ts';
import jwt from 'jsonwebtoken'

export const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => {
  const authorization = req.headers.authorization;
  let user: TokenUser | null = null;

  if (authorization?.toLowerCase().startsWith("bearer ")) {
    try {
      const token = authorization.substring(7);
      user = jwt.verify(token, JWT_SECRET) as TokenUser;
    } catch {
    }
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
 
export const publicProcedure = t.procedure;
export const router = t.router;
export const protectedProcedure = t.procedure.use(isAuthed);