import { useParams } from "react-router-dom";
import { trpc } from "../trpc";
import PostCard from "./PostCard";

const UserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const userQuery = trpc.users.getUserById.useQuery(
    { id: id as string },
    {
      enabled: !!id,
    },
  );
  const postsQuery = trpc.posts.getPostsByUserId.useQuery(
    { userId: id as string },
    {
      enabled: !!id,
    },
  );

  if (!id) return <p>User not found</p>;

  if (!userQuery.isSuccess || !postsQuery.isSuccess) return <p>Loading...</p>;

  return (
    <div className="flex flex-col gap-10 justify-center ">
      <div className="shadow-xl p-4 rounded-2xl">
        <div className="flex flex-col justify-center items-center gap-2">
          <img
            className=" shadow-xl w-30 h-50 object-cover rounded-2xl border-4 border-lime-500 border-b-lime-600"
            src={userQuery.data.avatarUrl}
            alt="User avatar"
          />
          <p className="font-bold text-xl">{userQuery.data.username}</p>
          <p>{userQuery.data.description}</p>
        </div>
      </div>
      <div>
        
        {postsQuery.data.map((p) => (
          <PostCard post={p}/>
        ))}
      </div>
    </div>
  );
};

export default UserProfile;
