import { Link } from "react-router-dom";
import type { RouterOutput } from "../trpc";

type PostWithAuthorType = RouterOutput["posts"]["getPostsByUserId"][number];

interface PostCardProps {
  post: PostWithAuthorType;
}

const PostCard = ({ post }: PostCardProps) => {
  return (
    <Link to={`/post/${post.id}`}>
      <div className="max-w-52 shadow-xl p-2 rounded-2xl flex flex-col justify-between items-center">
        <img className="mb-2 rounded-2xl" src={post.imageUrl} />
        <div className="max-w-2/3 px-1 text-center">
          <p className="font-bold wrap-break-word">
            {post.title} by {post.author ? post.author.username : "user"}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
