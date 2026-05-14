import type { LoginInfoType } from "../components/Login/LoginSchema";
import { trpc } from "../trpc";

const useLogin = () => {
  const loginMutation = trpc.login.login.useMutation();

  const login = async (data: LoginInfoType) => {
    const result = await loginMutation.mutateAsync({ ...data });
    localStorage.setItem("token", result.token);
    return result
  };

  return login
};

export default useLogin;
