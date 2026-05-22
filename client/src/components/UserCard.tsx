import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface UserCardProps {
  avatarUrl: string;
  username: string;
  userId: string;
  children?: ReactNode;
}

const UserCard = (props: UserCardProps) => {
  return (
    <div className="flex flex-row gap-2">
      <img
        className="w-10 h-10 object-cover border-2 rounded-3xl "
        src={props.avatarUrl}
      />
      <div className=" flex flex-col gap-2 justify-center items-center">
        {props.userId !== "" ? (
          <Link to={`/profile/${props.userId}`}>
            <p className="font-bold text-amber-950">{props.username}</p>
          </Link>
        ) : (
          <p className="font-bold">{props.username}</p>
        )}

        <div>{props.children}</div>
      </div>
    </div>
  );
};

export default UserCard;
