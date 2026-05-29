import { makeMessage } from "../../reducers/message";
import { TRPCClientError } from "@trpc/client";
import { useAppDispatch } from "../../store/hooks";
import useUploadImage from "../../hooks/useUploadImage";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreatePostForm from "./CreatePostForm";
import type { CreatePostInfoType } from "./CreatePostSchema";
import { trpc } from "../../trpc";

const CreatePost = () => {
  const {uploadImage} = useUploadImage();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const createPostMutation = trpc.posts.createPost.useMutation();

  const dispatch = useAppDispatch();

  if(isLoading)
    return <p>Loading, please wait...</p>

  const handleSubmit = async (data: CreatePostInfoType) => {
    try {
      setIsLoading(true);

      const { image, ...requiredData } = data;
      const imageFile = image[0];

      const key = await uploadImage(imageFile)
      const imageUrl = `${import.meta.env.VITE_BUCKET_URL}/${key}`
      console.log(imageUrl)
      const post = await createPostMutation.mutateAsync({...requiredData, imageUrl})
      navigate(`/post/${post.id}`)
    } catch (error) {
      if(error instanceof TRPCClientError)
      {
        dispatch(makeMessage(error.message, true));
      }
    }finally{
      setIsLoading(false)
    }
  };

  return (
    <div>
      <p className="text-2xl mb-5 font-bold text-center">Create post</p>
      <CreatePostForm onSubmit={handleSubmit} />
    </div>
  );
};

export default CreatePost;
