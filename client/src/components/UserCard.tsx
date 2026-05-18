interface UserCardProps {
  avatarUrl: string;
  username: string;
}

const UserCard = (props: UserCardProps) => {
  return <div className=" flex flex-row gap-5 justify-center items-center">
    <p className="font-bold">{props.username}</p>
    <img className="w-10 h-15" src={props.avatarUrl}/>
  </div>;
};

export default UserCard;
