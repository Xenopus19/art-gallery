import { Outlet } from "react-router-dom";
import Header from "./Header";
import Message from "./Message";
import { setUser } from "../reducers/user";
import { makeMessage } from "../reducers/message";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../store/hooks";
import { trpc } from "../trpc";

const AppLayout = () => {
   const utils = trpc.useUtils();
  const [isInitializing, setIsInitializing] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token')
      if(token)
      {
        try {
          const userData = await utils.users.me.fetch();
          dispatch(setUser(userData))
        } catch {
          dispatch(makeMessage("Token invalid or expired.", true))
          localStorage.removeItem('token')
        }
      }
      setIsInitializing(false)
    }
    loadUser();
  }, [dispatch, utils.users.me]);

  if(isInitializing)
  {
    return(
      <p>Loading...</p>
    )
  }
  return (
    <div className="flex min-h-screen">
      <div className="grid-background"></div>
      <Header />
      <div className="min-h-screen w-full bg-gradient-to-r from-blue-50 via-white to-blue-50 flex flex-col items-center px-5 ">
        <div className="w-full mx-auto min-h-screen bg-white shadow-[0_0_8px_0_rgba(0,0,0,0.4)] flex flex-col z-10">
          <main className="flex-grow p-6 md:p-10">
            <Message/>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
