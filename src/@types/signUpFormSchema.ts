import { z } from 'zod'

export const signUpFormSchema = z.object({
  username: z
    .string()
    .nonempty('This field is required')
    .trim()
    .min(3, 'Username must be at least 3 characters long'),
  email: z
    .string({ message: 'Is not a string' })
    .email({ message: 'This email is not valid' })
    .nonempty('This field is required')
    .toLowerCase(),
  password: z
    .string({ message: 'Is not a string' })
    .min(6, { message: 'Password must be at least 6 characters long' })
    .nonempty('This field is required'),
})

export type signUpFormData = z.infer<typeof signUpFormSchema>
