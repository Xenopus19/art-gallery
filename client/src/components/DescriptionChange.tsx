import { useState } from "react";
import { Button } from "./ui/button";
import { Edit } from "lucide-react";
import { useForm } from "react-hook-form";
import { descriptionChangeSchema } from "./SignUp/SignUpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "./ui/field";
import { Textarea } from "./ui/textarea";
import type z from "zod";

interface DescriptionChangeProps{
    onSubmit: (data: DescriptionChangeInfoType) => void
}

export type DescriptionChangeInfoType = z.infer<typeof descriptionChangeSchema>;

const DescriptionChange = ({onSubmit} : DescriptionChangeProps) => {
  const [isOpened, setIsOpened] = useState(false);

  const form = useForm<DescriptionChangeInfoType>({
      resolver: zodResolver(descriptionChangeSchema),
      defaultValues: {
        description: "",
      },
    });
  
    const submit = async (data: DescriptionChangeInfoType) => {
        setIsOpened(false);
      onSubmit(data)
      form.reset();
    }

  return (
    <>
      <Button onClick={() => setIsOpened(!isOpened)}>
        <Edit />
      </Button>

      {isOpened && (
        <div className="flex flex-col gap-2">
          <form className="flex flex-col gap-5" onSubmit={form.handleSubmit(submit)}>
      <Field>
        <FieldLabel>Update profile description:</FieldLabel>
        <Textarea {...form.register("description")} />
        {form.formState.errors.description && (
          <FieldError>{form.formState.errors.description.message}</FieldError>
        )}
      </Field>

      <Button type="submit">Update</Button>
    </form>
        </div>
      )}
    </>
  );
};

export default DescriptionChange;
