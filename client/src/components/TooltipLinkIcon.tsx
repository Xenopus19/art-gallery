import { Icon, Settings, type LucideIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Link } from "react-router-dom";

export interface TooltipLinkProps {
  text: string;
  url: string;
  icon: LucideIcon;
  onClick? : () => void
}

const TooltipLinkIcon = ({ text, icon: Icon, url, onClick}: TooltipLinkProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link to={url}>
          <Button onClick={onClick} variant="outline" size="icon">
            <Icon className="h-4 w-4" />
          </Button>
        </Link>
      </TooltipTrigger>

      <TooltipContent>
        <p>{text}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default TooltipLinkIcon;
