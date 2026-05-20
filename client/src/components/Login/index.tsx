import { useNavigate } from "react-router-dom";
import type { LoginInfoType } from "./LoginSchema";
import LoginForm from "./LoginForm";
import useLogin from "../../hooks/useLogin";
import { TRPCClientError } from "@trpc/client";
import { useAppDispatch } from "../../store/hooks";
import { makeMessage } from "../../reducers/message";

const Login = () => {
  const navigate = useNavigate();
  const {login} = useLogin()
  const dispatch = useAppDispatch();

  const handleLogin = async (data: LoginInfoType) => {
    try {
      const result = await login(data)
      console.log(result)
      navigate("/")
    } catch (error) {
      console.log(error)
      if(error instanceof TRPCClientError)
      {
        dispatch(makeMessage(error.message, true))
      }
    }
  };

  return (
    <div >
      <p className="text-2xl mb-5 font-bold text-center">Log into existing account</p>
      <LoginForm onSubmit={handleLogin} />
    </div>
  );
};

export default Login;
