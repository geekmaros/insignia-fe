import { z } from 'zod'

const linkInputSchema = z.object({
  id: z.union([z.string().min(1), z.number().int().positive()]).optional(),
  type: z.string().trim().max(30),
  label: z.string().trim().max(50).optional(),
  value: z.string().trim().max(255),
  position: z.number().int().min(0).optional()
})

export const cardSchema = z.object({
  basic: z.object({
    name: z.string().trim().min(1, 'Name is required'),
    prefix: z.string().optional(),
    suffix: z.string().optional(),
    accreditation: z.string().optional(),
    title: z.string().optional(),
    department: z.string().optional(),
    company: z.string().optional(),
    headline: z.string().optional()
  }),
  links: z.array(linkInputSchema).default([]),
  customization: z.object({
    template: z.string().trim().min(1, 'Template is required'),
    color: z.string().optional(),
    logo: z.string().optional(),
    profileImage: z.string().optional()
  })
})
