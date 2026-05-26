import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import createPostSchema, { type CreatePostInfoType } from "./CreatePostSchema";

interface CreatePostFormProps {
  onSubmit: (data: CreatePostInfoType) => void;
}

const CreatePostForm = ({ onSubmit }: CreatePostFormProps) => {
  const form = useForm<CreatePostInfoType>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: "",
      description: "",
      image: undefined
    },
  });

  const submit = (data: CreatePostInfoType) => {
    onSubmit(data); 
  };

  return (
    <div className="max-w-md mx-auto">
      <form className="flex flex-col gap-5" onSubmit={form.handleSubmit(submit)}>
        <Field>
          <FieldLabel>Title</FieldLabel>
          <Input {...form.register("title")} />
          <FieldDescription>Post title.</FieldDescription>
          {form.formState.errors.title && (
            <FieldError>{form.formState.errors.title.message}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel>Description</FieldLabel>
          <Textarea {...form.register("description")} />
          <FieldDescription>Post description.</FieldDescription>
          {form.formState.errors.description && (
            <FieldError>{form.formState.errors.description.message}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel>Picture</FieldLabel>
          <Input type="file" {...form.register("image")} />
          <FieldDescription>Post image.</FieldDescription>
          {form.formState.errors.image && (
            <FieldError>{form.formState.errors.image.message as string}</FieldError>
          )}
        </Field>


        <Button type="submit">Create post</Button>
      </form>
    </div>
  );
};

export default CreatePostForm;
