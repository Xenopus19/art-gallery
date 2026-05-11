import * as trpcExpress from '@trpc/server/adapters/express';
import express from 'express';
import { appRouter } from './router.ts';
import { createContext } from './utils/trpc.ts';

const app = express();

app.use(
  '/api',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

export default app;