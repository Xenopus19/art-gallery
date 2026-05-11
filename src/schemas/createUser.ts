import { z } from 'zod';

const createUserSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(5).max(100),
  description: z.string().max(500).optional().default(''),
  avatarUrl: z.string().url().optional().default(''),
});

export default createUserSchema;