import type { RouterOutput } from "../trpc";
import UserCard from "./UserCard";

type PostData = NonNullable<RouterOutput["posts"]["getPostById"]>;

type CommentType = NonNullable<PostData["comments"]>[number];

interface CommentProps {
  comment: CommentType;
}

const Comment = ({ comment }: CommentProps) => {
  const author = comment.author;
  const date = new Date(comment.createdAt);

  const normalDate = new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "numeric", 
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
  return (
    <div className=" shadow-xl p-4 rounded-2xl flex flex-row justify-between items-center">
      <div className="flex flex-col ">
        {author && (
          <UserCard
            avatarUrl={author.avatarUrl}
            userId={author.id}
            username={author.username}
          />
        )}
        <p>{comment.text}</p>
      </div>
      <p className="text-accent-foreground font-light text-xs">
        {normalDate}
      </p>
    </div>
  );
};

export default Comment;
