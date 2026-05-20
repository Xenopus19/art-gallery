import { trpc } from "../../trpc";
import SignUpForm from "./SignUpForm";
import type { SignUpInfoType } from "./SignUpSchema";
import { makeMessage } from "../../reducers/message";
import { TRPCClientError } from "@trpc/client";
import { useAppDispatch } from "../../store/hooks";

const SignUp = () => {
  const getUrlMutation = trpc.users.getImageUploadUrl.useMutation();
  const signUpMutation = trpc.users.createUser.useMutation();

  const dispatch = useAppDispatch();

  const handleSubmit = async (data: SignUpInfoType) => {
    try {
      const { avatar, ...requiredData } = data;
      const { key, url } = await getUrlMutation.mutateAsync({
        fileName: avatar.name,
        fileType: avatar.type,
      });
      console.log(url);
      await fetch(url, {
        method: "PUT",
        body: avatar,
        headers: { "Content-Type": avatar.type },
      });

      await signUpMutation.mutateAsync({
        ...requiredData,
        avatarUrl: `${import.meta.env.VITE_BUCKET_URL}/${key}`,
      });
    } catch (error) {
      if(error instanceof TRPCClientError)
      {
        console.log("Making message")
        dispatch(makeMessage(error.message, true));
      }
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
