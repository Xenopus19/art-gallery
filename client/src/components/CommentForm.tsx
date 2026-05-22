import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Field, FieldDescription, FieldError, FieldLabel } from "./ui/field";
import { Textarea } from "./ui/textarea";

const commentSchema = z.object({
  text: z.string().max(500),
});

export type CommentInfoType = z.infer<typeof commentSchema>;

interface CommentFormProps {
  onSubmit: (data: CommentInfoType) => void;
}
const CommentForm = ({ onSubmit }: CommentFormProps) => {
  const form = useForm<CommentInfoType>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      text: "",
    },
  });

  const submit = async (data: CommentInfoType) => {
    onSubmit(data)
    form.reset();
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={form.handleSubmit(submit)}>
      <Field>
        <FieldLabel>Leave a comment:</FieldLabel>
        <Textarea {...form.register("text")} />
        <FieldDescription>Your message.</FieldDescription>
        {form.formState.errors.text && (
          <FieldError>{form.formState.errors.text.message}</FieldError>
        )}
      </Field>

      <Button type="submit">Comment</Button>
    </form>
  );
};

export default CommentForm;
