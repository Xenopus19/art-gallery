import { trpc } from "../../trpc";
import SignUpForm from "./SignUpForm";
import type { SignUpInfoType } from "./SignUpSchema";

const SignUp = () => {
  const getUrlMutation = trpc.users.getImageUploadUrl.useMutation();
  const signUpMutation = trpc.users.createUser.useMutation();

  const handleSubmit = async (data: SignUpInfoType) => {
    const {avatar, ...requiredData} = data
    const {key, url} = await getUrlMutation.mutateAsync({fileName: avatar.name, fileType: avatar.type})
    console.log(url)
    await fetch(url, {
          method: 'PUT',
          body: avatar,
          headers: { 'Content-Type': avatar.type }
        });
    
    console.log(key)
    await signUpMutation.mutateAsync({...requiredData, avatarUrl: `${import.meta.env.VITE_BUCKET_URL}/${key}`})
  };

  return (
    <div >
      <p className="text-2xl mb-5 font-bold text-center">Create account</p>
      <SignUpForm onSubmit={handleSubmit} />
    </div>
  );
};

export default SignUp;
