import type { inferRouterOutputs } from "@trpc/server";
import type { PostType } from "../../../src/models/Post";
import UserCard from "./UserCard";
import type { AppRouter } from "../../../src/router";
import { Heart } from "lucide-react";

type RouterOutput = inferRouterOutputs<AppRouter>;

type PostWithAuthorType = RouterOutput["posts"]["getPostsByUserId"][number];

interface PostCardProps {
  post: PostWithAuthorType;
}

const PostCard = ({ post }: PostCardProps) => {
  return (
    <div className=" shadow-xl p-4 rounded-2xl flex flex-row justify-between items-center">
      <div>
        <p className="font-bold">{post.title} by {post.author? post.author.username : "user" }</p>
        <p>{post.description}</p>
        <div className="flex flex-row">
          <Heart />
          <p>: {post.likesCount}</p>
        </div>
      </div>
      <img src={post.imageUrl} />
    </div>
  );
};

export default PostCard;
