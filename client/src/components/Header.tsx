import { Link, useNavigate } from "react-router-dom";
import { Landmark, LogInIcon } from "lucide-react";
import TooltipLinkIcon from "./TooltipLinkIcon";

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className="relative z-20 shadow-[0_0_8px_0_rgba(0,0,0,0.4)] w-15 bg-amber-500 flex flex-col items-center gap-5 px-5">
      <Link to="/">
        <p className=" bg-white bg-clip-text text-transparent text-5xl font-extrabold">
          G
        </p>
      </Link>
    
      <TooltipLinkIcon icon={Landmark} text="Sign Up" url="/sign-up"/>
      <TooltipLinkIcon icon={LogInIcon} text="Log In" url="/login"/>
    </div>
  );
};

export default Header;
