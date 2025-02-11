import { z } from 'zod'

export const DownloadSchema = z.object({
  filename: z.string().nonempty({ message: 'This field is required' }),
  quantity: z.number().int().positive({ message: 'This field is required' }),
})

export type DownloadFormData = z.infer<typeof DownloadSchema>
