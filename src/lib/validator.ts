import { z } from 'zod';

export const registerSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(3, 'Display name must be at least 3 characters')
    .max(30, 'Display name must be 30 characters or less')
    .regex(/^[a-zA-Z0-9 _.-]+$/, 'Only letters, numbers, spaces, _, -, . allowed'),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email({ message: 'Invalid email address' })),

  password: z
    .string()
    .trim()
    .min(6, 'Password must be at least 6 characters'),
});