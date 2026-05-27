import { useInView } from "react-intersection-observer";
import { trpc } from "../trpc";
import { useEffect, useRef } from "react";
import PostList from "./PostList";

const MainPage = () => {
  const triggerRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = trpc.posts.getInfinitePosts.useInfiniteQuery(
    { limit: 10 },
    {
      getNextPageParam: (lastPage) => lastPage.newCursor,
    },
  );

  useEffect(() => {
    if (!triggerRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(triggerRef.current);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, data]);

  if (status === "pending" || !data) return <div>Loading...</div>;

  const flatPosts = data.pages.flatMap((page) => page.posts);
  return (
    <>
      <p className="text-center font-extrabold text-2xl">
        Welcome to the art world
      </p>
      <PostList posts={flatPosts} />
      <div ref={triggerRef} className="text-center p-6 mt-4">
        {isFetchingNextPage ? (
          <span className="text-blue-500 animate-pulse">
            Loading new posts...
          </span>
        ) : (
          !hasNextPage && (
            <span className="text-gray-400 text-sm">Posts ended</span>
          )
        )}
      </div>
    </>
  );
};

export default MainPage;
