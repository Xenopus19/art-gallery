import { trpc } from "../trpc";
import { useParams } from "react-router-dom";
import UserCard from "./UserCard";
import Comment from "./Comment";
import LikeButton from "./LikeButton";
import { useAppSelector } from "../store/hooks";
import CommentForm, { type CommentInfoType } from "./CommentForm";

const PostPage = () => {
  const { id } = useParams<{ id: string }>();
  const currentUser = useAppSelector((state) => state.user);
  const postQuery = trpc.posts.getPostById.useQuery(
    { postId: id as string },
    { enabled: !!id },
  );
  const hasLiked = trpc.like.hasLiked.useQuery(
    { postId: id as string },
    { enabled: !!id && !!currentUser },
  );
  const likeMutation = trpc.like.toggleLike.useMutation();
  const commentPostMutation = trpc.posts.commentPost.useMutation();

  if (!postQuery.isSuccess || !!!id) {
    return <p>Loading...</p>;
  }

  const likePost = async () => {
      await likeMutation.mutateAsync({postId: id})
      hasLiked.refetch();
      postQuery.refetch();
  };

  const leaveComment = async (data: CommentInfoType) => {
    await commentPostMutation.mutateAsync({postId: id, text: data.text});
    postQuery.refetch();
  }

  const post = postQuery.data;
  const author = post.author
    ? post.author
    : { username: "user", avatarUrl: "https://picsum.photos/200", id: "" };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className=" shadow-xl p-4 rounded-2xl flex flex-row justify-between items-center">
          <img src={post.imageUrl} className="max-w-2/3 max-h-2/3" />
          <div>
            <UserCard
              username={author.username}
              avatarUrl={author.avatarUrl}
              userId={author.id}
            >
              <p className="font-bold">{post.title}</p>
              <p className="font-light">{post.description}</p>
              <div className="flex flex-col items-center gap-2">
                <p className="font-light">Likes: {post.likesCount}</p>
                {currentUser.data && (
                  <LikeButton onSubmit={likePost} hasLiked={hasLiked.data? hasLiked.data : false } />
                )}
              </div>
            </UserCard>
          </div>
        </div>
      </div>
      {currentUser.data && <CommentForm onSubmit={leaveComment}/>}
      {post.comments &&
        post.comments.map((c) => <Comment key={c.id} comment={c} />)}
    </div>
  );
};

export default PostPage;
