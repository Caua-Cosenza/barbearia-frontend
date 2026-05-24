import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
})

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Nome muito curto').max(100),
    email: z.string().email('Email inválido'),
    phone: z.string().regex(/^\+?[1-9]\d{7,14}$/, 'Telefone inválido'),
    password: z
      .string()
      .min(8, 'Mínimo 8 caracteres')
      .regex(/[A-Z]/, 'Precisa ter maiúscula')
      .regex(/[0-9]/, 'Precisa ter número')
      .regex(/[^A-Za-z0-9]/, 'Precisa ter caractere especial'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Senhas não conferem',
    path: ['confirmPassword'],
  })

export const bookingSchema = z.object({
  professionalId: z.string().uuid('Selecione um profissional'),
  serviceId: z.string().uuid('Selecione um serviço'),
  scheduledAt: z.string().min(1, 'Selecione uma data e hora'),
  notes: z.string().max(500).optional(),
})

export type LoginForm = z.infer<typeof loginSchema>
export type RegisterForm = z.infer<typeof registerSchema>
export type BookingForm = z.infer<typeof bookingSchema>
