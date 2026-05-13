import { Outlet } from "react-router-dom";
import Header from "./Header";

const AppLayout = () => {
  return (
    <div className="flex min-h-screen">
      <div className="grid-background"></div>
      <Header />
      <div className="min-h-screen w-full bg-gradient-to-r from-blue-50 via-white to-blue-50 flex flex-col items-center px-5 ">
        <div className="w-full mx-auto min-h-screen bg-white shadow-[0_0_8px_0_rgba(0,0,0,0.4)] flex flex-col z-10">
          <main className="flex-grow p-6 md:p-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
