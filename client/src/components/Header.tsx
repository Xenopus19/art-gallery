import { Link } from "react-router-dom";
import { Landmark, LogInIcon, LogOut, Plus, User } from "lucide-react";
import TooltipLinkIcon from "./TooltipLinkIcon";
import { useAppSelector } from "../store/hooks";
import useLogin from "../hooks/useLogin";

const Header = () => {
  const user = useAppSelector((state) => state.user.data);
  const { logout } = useLogin();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="relative z-20 shadow-[0_0_8px_0_rgba(0,0,0,0.4)] w-15 bg-amber-500 flex flex-col items-center gap-5 px-5">
      <Link to="/">
        <p className=" bg-white bg-clip-text text-transparent text-5xl font-extrabold">
          G
        </p>
      </Link>

      {user && (
        <>
          <TooltipLinkIcon
            icon={User}
            text={`Welcome, ${user.username}`}
            url={`/profile/${user.id}`}
          />
          <TooltipLinkIcon
            icon={Plus}
            text={`Create Post`}
            url={`/createPost`}
          />
          <TooltipLinkIcon
            icon={LogOut}
            text={`Logout`}
            url={`/`}
            onClick={handleLogout}
          />
        </>
      )}
      {!user && (
        <>
          <TooltipLinkIcon icon={Landmark} text="Sign Up" url="/sign-up" />
          <TooltipLinkIcon icon={LogInIcon} text="Log In" url="/login" />
        </>
      )}
    </div>
  );
};

export default Header;
