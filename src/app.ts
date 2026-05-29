import * as trpcExpress from '@trpc/server/adapters/express';
import express from 'express';
import { appRouter } from './router.js';

import cors from 'cors'
import { createContext } from './utils/trpc.js';
import path from 'path';


const app = express();

app.use(cors());

const staticPath = path.join(process.cwd(), 'client', 'dist')
app.use(express.static(staticPath));

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: createContext,
  }),
);

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

export default app;