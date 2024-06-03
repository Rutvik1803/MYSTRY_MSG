import { z } from 'zod';

export const signInSchema = z.object({
  identifier: z.string().min(3, 'Identifier must be atleast 3 characters'),
  password: z.string().min(6, 'Password must be atleast 6 characters'),
});
