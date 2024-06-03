import { z } from 'zod';

export const messageSchema = z.object({
  content: z
    .string()
    .min(5, 'Content must be atleast 1 character')
    .max(300, 'Content must be atmost 300 characters'),
});
