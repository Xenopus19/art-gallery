import { createTRPCReact, httpBatchLink } from '@trpc/react-query';
import type { AppRouter } from '../../src/router';
 
export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: import.meta.env.VITE_BACKEND_URL,
      async headers() {
        const token = localStorage.getItem('token');
        return {
          authorization: token ? `Bearer ${token}` : undefined,
        };
      },
    }),
  ],
});