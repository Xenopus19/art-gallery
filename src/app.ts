import * as trpcExpress from '@trpc/server/adapters/express';
import express from 'express';
import { appRouter } from './router.ts';
import { createContext } from './utils/trpc.ts';
import cors from 'cors'

const app = express();

app.use(cors());

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

export default app;