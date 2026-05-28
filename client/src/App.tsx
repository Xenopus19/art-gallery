import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import MainPage from "./components/MainPage";
import SignUp from "./components/SignUp";
import {  useState } from "react";
import { trpc, trpcClient } from "./trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "./components/ui/tooltip";
import Login from "./components/Login";
import { Provider } from "react-redux";
import { store } from "./store";
import UserProfile from "./components/UserProfile";
import PostPage from "./components/PostPage";
import CreatePost from "./components/CreatePost";

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
      {
        path: `/profile/:id`,
        element: <UserProfile />,
      },
      {
        path: `/post/:id`,
        element: <PostPage />,
      },
      {
        path: `/createPost`,
        element: <CreatePost />,
      },
    ],
  },
]);

function App() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <Provider store={store}>
      <TooltipProvider>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
          </QueryClientProvider>
        </trpc.Provider>
      </TooltipProvider>
    </Provider>
  );
}

export default App;
