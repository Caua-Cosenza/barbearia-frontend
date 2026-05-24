export interface ApiResponse<T = unknown> {
  success: boolean
  data: T | null
  error: string | null
  message: string
  timestamp: string
}

export interface Availability {
  dayOfWeek: number
  startTime: string
  endTime: string
}

export interface Professional {
  id: string
  name: string
  bio?: string | null
  photoUrl?: string | null
  isWalkIn?: boolean
  availability: Availability[]
}

export interface Service {
  id: string
  name: string
  description?: string | null
  durationMinutes: number
  price?: number | null
  amountCents?: number
}

export interface ServiceSnapshot {
  serviceId: string
  name: string
  amountCents: number
  durationMinutes: number
}

export interface AvailableTimesResponse {
  slots: string[]
}

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW'

export interface Appointment {
  id: string
  scheduledAt: string
  status: AppointmentStatus
  service: Pick<Service, 'id' | 'name' | 'durationMinutes'>
  professional: Pick<Professional, 'id' | 'name'>
  createdAt: string
}

export interface BookingWizardState {
  professional: Professional | null
  services: Service[]
  date: string | null
  timeSlot: string | null
  customerName: string
  customerPhone: string
  customerEmail: string
}

export interface CreateAppointmentPayload {
  professional_id: string
  service_id: string
  scheduled_at: string
  customer_name: string
  customer_phone: string
  customer_email?: string
}

// Used by POST /api/v1/appointments/public (no auth required)
export interface CreatePublicAppointmentPayload {
  professionalId: string
  serviceIds: string[]
  scheduledAt: string   // ISO datetime
  guestName: string
  guestPhone: string
  guestEmail?: string
  notes?: string
}

export interface PublicAppointmentResponse {
  id: string
  cancelToken: string
  scheduledAt: string
  status: string
  services: ServiceSnapshot[]
  totalAmountCents: number
  totalDurationMinutes: number
  professional: { id: string; name: string }
}

export interface CancelPageData {
  id: string
  guestName: string
  scheduledAt: string
  status: string
  services: { name: string; amountCents: number; durationMinutes: number }[]
  totalAmountCents: number
  totalDurationMinutes: number
  canCancel: boolean
}

// ---- Admin types ----

export type AdminAppointmentStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'COMPLETED'
  | 'NO_SHOW'

export interface AdminAppointment {
  id: string
  scheduledAt: string
  status: AdminAppointmentStatus
  customerName: string
  customerPhone: string
  customerEmail: string | null
  service: {
    id: string
    name: string
    durationMinutes: number
  }
  professional: {
    id: string
    name: string
  }
}

export interface AdminStats {
  todayCount: number
  weekCount: number
  monthCount: number
  noShowCount: number
}

export interface AuthContextValue {
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}
