import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import signUpSchema, { type SignUpInfoType } from "./SignUpSchema";
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

interface SignUpFormProps {
  onSubmit: (data: SignUpInfoType) => void;
}

const SignUpForm = ({ onSubmit }: SignUpFormProps) => {
  const form = useForm<SignUpInfoType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      password: "",
      description: "",
    },
  });

  const submit = async (data: SignUpInfoType) => {
    onSubmit(data);
  };

  return (
    <div className="max-w-md mx-auto">
      <form className="flex flex-col gap-5" onSubmit={form.handleSubmit(submit)}>
        <Field>
          <FieldLabel>Username</FieldLabel>
          <Input autoComplete='username' {...form.register("username")} />
          <FieldDescription>Public username.</FieldDescription>
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

        <Field>
          <FieldLabel>Description</FieldLabel>
          <Textarea
            className="resize-none"
            {...form.register("description")}
          />
          <FieldDescription>Your profile description.</FieldDescription>
          {form.formState.errors.description && (
            <FieldError>{form.formState.errors.description.message}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel>Profile picture</FieldLabel>
          <Input type="file" {...form.register("avatar")} />
          <FieldDescription>Your avatar.</FieldDescription>
          {form.formState.errors.avatar && (
            <FieldError>{form.formState.errors.avatar.message as string}</FieldError>
          )}
        </Field>


        <Button type="submit">Sign Up</Button>
      </form>
    </div>
  );
};

export default SignUpForm;
