import { z } from 'zod';

export const userNameValidation = z
  .string()
  .min(3, 'Username must be atleast 2 characters')
  .max(20, 'Username must be atmost 20 characters')
  .regex(
    /^[a-zA-Z0-9_]*$/,
    'Username must contain only letters, numbers, and underscores'
  );

export const emailValidation = z
  .string()
  .email('Invalid email address')
  .regex(/.+@.+\..+/, 'Invalid email address');

export const signUpSchema = z.object({
  username: userNameValidation,
  email: emailValidation,
  password: z.string().min(6, 'Password must be atleast 6 characters'),
});