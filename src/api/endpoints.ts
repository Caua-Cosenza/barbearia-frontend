import { get, post, put, del } from './client'
import type {
  Professional,
  Service,
  Appointment,
  AvailableTimesResponse,
  CreateAppointmentPayload,
  CreatePublicAppointmentPayload,
  PublicAppointmentResponse,
  CancelPageData,
  AdminAppointment,
  AdminStats,
  AdminAppointmentStatus,
  BlockedSlot,
} from '../types'

export const api = {
  professionals: {
    list: () => get<Professional[]>('/professionals'),
  },

  services: {
    list: () => get<Service[]>('/services'),
  },

  availableTimes: {
    fetch: (data: { professionalId: string; serviceId: string; date: string; totalDurationMinutes?: number }) =>
      post<AvailableTimesResponse>('/available-times', data),
  },

  appointments: {
    create: (data: CreateAppointmentPayload) =>
      post<Appointment>('/appointments', data),
    createPublic: (data: CreatePublicAppointmentPayload) =>
      post<PublicAppointmentResponse>('/appointments/public', data),
  },

  cancel: {
    get: (token: string) => get<CancelPageData>(`/cancel/${token}`),
    cancel: (token: string) => post<{ message: string }>(`/cancel/${token}`, {}),
  },

  admin: {
    // Used by AuthContext to verify if the session cookie is still valid
    health: () => get<{ status: string }>('/admin/health'),

    // Auth (cookies set/cleared server-side)
    login: (email: string, password: string) =>
      post<{ user: { id: string; email: string } }>('/auth/login', { email, password }),
    logout: () => post<null>('/auth/logout', {}),

    // Push subscription
    savePushSubscription: (data: { endpoint: string; keys: { p256dh: string; auth: string } }) =>
      post<null>('/admin/push-subscription', data),

    // Dashboard data
    stats: () => get<AdminStats>('/admin/stats'),
    appointments: (date?: string) =>
      get<AdminAppointment[]>(date ? `/admin/appointments?date=${date}` : '/admin/appointments'),
    updateStatus: (id: string, status: AdminAppointmentStatus) =>
      put<{ id: string; status: AdminAppointmentStatus }>(
        `/admin/appointments/${id}/status`,
        { status },
      ),

    // Blocked slots
    blockedSlots: {
      list: (date: string, professionalId: string) =>
        get<BlockedSlot[]>(`/admin/blocked-slots?date=${date}&professionalId=${professionalId}`),
      create: (data: {
        professionalId: string
        date: string
        startTime: string
        endTime: string
        reason?: string
      }) => post<BlockedSlot>('/admin/blocked-slots', data),
      remove: (id: string) => del<null>(`/admin/blocked-slots/${id}`),
    },
  },
}
