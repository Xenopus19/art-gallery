import PostCard, { type PostWithAuthorType } from "./PostCard";

interface PostListProps {
  posts: PostWithAuthorType[];
}

const PostList = ({ posts }: PostListProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 max-w-7xl mx-auto justify-items-center">
      {posts.map((p) => (
        <PostCard key={p.id} post={p} />
      ))}
    </div>
  );
};

export default PostList;
