import * as trpcExpress from '@trpc/server/adapters/express';
import express from 'express';
import { appRouter } from './router.ts';

import cors from 'cors'
import { createContext } from './utils/trpc.ts';


const app = express();

app.use(cors());

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: createContext,
  }),
);

export default app;