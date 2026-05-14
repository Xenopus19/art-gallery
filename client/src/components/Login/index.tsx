import { useNavigate } from "react-router-dom";
import type { LoginInfoType } from "./LoginSchema";
import LoginForm from "./LoginForm";
import useLogin from "../../hooks/useLogin";

const Login = () => {
  const navigate = useNavigate();
  const login = useLogin()

  const handleLogin = async (data: LoginInfoType) => {
    try {
      const result = login(data)
      console.log(result)
      navigate("/")
    } catch (error) {
      console.log(error)
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
