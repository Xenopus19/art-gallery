
import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import MainPage from "./components/MainPage";
import SignUp from "./components/SignUp";
import { httpBatchLink } from "@trpc/client";
import { useState}  from "react";
import { trpc } from "./trpc";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from "./components/ui/tooltip";
import Login from "./components/Login";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <MainPage />,
      },
      {
        path: "/sign-up",
        element: <SignUp />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
]);

function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: 'http://localhost:3001/trpc', 
        }),
      ],
    }),
  );
  return (
    <TooltipProvider>
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </trpc.Provider>
    </TooltipProvider>
  );
}

export default App;
