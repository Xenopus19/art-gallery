import { z } from 'zod';

const createPostSchema = z.object({
  description: z.string().min(3).max(100),
  title: z.string().min(5).max(50),
  imageUrl: z.string().url(),
});

export default createPostSchema;