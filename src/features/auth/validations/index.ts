import { z } from 'zod';

const email = z
  .string({
    invalid_type_error: 'Email must be of type string.',
    required_error: 'Email is required.',
  })
  .email({
    message: 'Invalid email.',
  });

const password = z
  .string({
    invalid_type_error: 'Password must be of type string.',
    required_error: 'Password is required.',
  })
  .min(9, {
    message: 'Password must contain at least 9 characters.',
  })
  .max(20, {
    message: 'Password must not contain more than 20 characters.',
  })
  .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$&*])/, {
    message: 'Password should contain at least 1 lower case letter, 1 upper case letter, 1 decimal and 1 special character.',
  });

export const loginFormSchema = z.object({ email, password });

export type LoginFormSchema = z.infer<typeof loginFormSchema>;
