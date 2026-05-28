import z from "zod";

const signUpSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(5).max(100),
  description: z.string().max(500),
  avatar: z
    .custom<FileList>()
    .refine((files) => files?.length === 1, "Need one file")
    .transform((files) => files[0])
    .refine((file) => file.size <= 5 * 1024 * 1024, "Max size 5MB"),
});

export const descriptionChangeSchema = signUpSchema.pick({ description: true });
export type SignUpInfoType = z.infer<typeof signUpSchema>;

export default signUpSchema;
