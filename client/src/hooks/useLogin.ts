import type { LoginInfoType } from "../components/Login/LoginSchema.ts";
import { resetUser, setUser } from "../reducers/user.ts";
import { useAppDispatch } from "../store/hooks.ts";
import { trpc } from "../trpc.ts";

const useLogin = () => {
  const loginMutation = trpc.login.login.useMutation();
  const utils = trpc.useUtils();

  const dispatch = useAppDispatch();

  const login = async (data: LoginInfoType) => {
    const result = await loginMutation.mutateAsync({ ...data });
    localStorage.setItem("token", result.token);

    const userData = await utils.users.me.fetch();

    dispatch(setUser(userData));

    return result;
  };

  const logout = () => {
    localStorage.removeItem("token");
    dispatch(resetUser());
    utils.users.me.invalidate();
  };

  return { login, logout };
};

export default useLogin;
