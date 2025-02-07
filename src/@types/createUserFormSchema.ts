import { z } from 'zod'

export const createUserFormSchema = z.object({
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

export type createUserFormData = z.infer<typeof createUserFormSchema>
