import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import type { LoginInfoType } from "./LoginSchema";
import loginSchema from "./LoginSchema";

interface LoginFormProps {
  onSubmit: (data: LoginInfoType) => void;
}

const LoginForm = ({ onSubmit }: LoginFormProps) => {
  const form = useForm<LoginInfoType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const submit = async (data: LoginInfoType) => {
    onSubmit(data);
  };

  return (
    <div className="max-w-md mx-auto">
      <form className="flex flex-col gap-5" onSubmit={form.handleSubmit(submit)}>
        <Field>
          <FieldLabel>Username</FieldLabel>
          <Input autoComplete='username' {...form.register("username")} />
          <FieldDescription>Your username.</FieldDescription>
          {form.formState.errors.username && (
            <FieldError>{form.formState.errors.username.message}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel>Password</FieldLabel>
          <Input autoComplete='current-password' type="password" {...form.register("password")} />
          <FieldDescription>Your password.</FieldDescription>
          {form.formState.errors.password && (
            <FieldError>{form.formState.errors.password.message}</FieldError>
          )}
        </Field>

        <Button type="submit">Login</Button>
      </form>
    </div>
  );
};

export default LoginForm;
