import { Heart } from "lucide-react";
import { Button } from "./ui/button";

interface LikeButtonProps {
    onSubmit: () => void,
    hasLiked: boolean
}

const LikeButton = ({onSubmit, hasLiked}: LikeButtonProps) => {
    const fillColor = hasLiked ? 'fill-red-500' : ''
  return <Button variant='outline' onClick={onSubmit}>
    <Heart className={`text-red-700 ${fillColor}`}/>
  </Button>;
};

export default LikeButton;
