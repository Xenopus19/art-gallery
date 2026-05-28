import { trpc } from "../../trpc";
import SignUpForm from "./SignUpForm";
import type { SignUpInfoType } from "./SignUpSchema";
import { makeMessage } from "../../reducers/message";
import { TRPCClientError } from "@trpc/client";
import { useAppDispatch } from "../../store/hooks";
import useUploadImage from "../../hooks/useUploadImage";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useLogin from "../../hooks/useLogin";

const SignUp = () => {
  const {uploadImage} = useUploadImage();
  const signUpMutation = trpc.users.createUser.useMutation();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {login} = useLogin();

  const dispatch = useAppDispatch();

  if(isLoading)
    return <p>Loading, please wait...</p>

  const handleSubmit = async (data: SignUpInfoType) => {
    try {
      setIsLoading(true);
      const { avatar, ...requiredData } = data;
      
      const key = await uploadImage(avatar)

      const user = await signUpMutation.mutateAsync({
        ...requiredData,
        avatarUrl: `${import.meta.env.VITE_BUCKET_URL}/${key}`,
      });

      login({username: data.username, password: data.password})
      navigate(`/profile/${user.id}`)
    } catch (error) {
      if(error instanceof TRPCClientError)
      {
        console.log("Making message")
        dispatch(makeMessage(error.message, true));
      }
    }finally{
      setIsLoading(false)
    }
  };

  return (
    <div>
      <p className="text-2xl mb-5 font-bold text-center">Create account</p>
      <SignUpForm onSubmit={handleSubmit} />
    </div>
  );
};

export default SignUp;
