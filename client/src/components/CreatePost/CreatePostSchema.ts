import z from "zod";

const createPostSchema = z.object({
  description: z.string().min(3).max(100),
  title: z.string().min(5).max(50),
  image: z
    .custom<FileList>()
    .refine((files) => files instanceof FileList && files.length === 1, "Need one file")
    .transform((files) => files[0])
    .refine((file) => file && file.size <= 5 * 1024 * 1024, "Max size 5MB"),
});

export type CreatePostInfoType = z.infer<typeof createPostSchema>;

export default createPostSchema;
