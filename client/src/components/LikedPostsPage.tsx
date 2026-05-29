import { trpc } from "../trpc"
import PostList from "./PostList"

const LikedPostsPage = () => {
    const likedPosts = trpc.posts.getPostsLikedByUser.useQuery();
    
    if(!likedPosts.isSuccess)
    {
        return <p className="font-extrabold text-2xl text-center">Loading...</p>
    }
    return <div>
        <p className="font-extrabold text-2xl text-center">Posts you have liked</p>
        <PostList posts={likedPosts.data}/>

    </div>
}

export default LikedPostsPage