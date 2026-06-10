import { http, HttpResponse } from "msw"
import { directusBaseUrl, mswServer } from "../../../vitest.setup"

export const mockSiteSettingsRow = {
  id: 1,
  clinic_name: "Клиника MSW",
  phone: "+7 (495) 111-22-33",
  email: "test@clinic.test",
  address: "Москва, ул. Тестовая, 1",
  booking_url: "/services",
  hero_title: "Тестовый заголовок",
  hero_subtitle: "Тестовый подзаголовок",
  hero_badge: "Тест",
  section_1_photo: "11111111-2222-3333-4444-555555555555",
  section_2_photo: null,
}

export const mockDoctors = [
  {
    id: 1,
    bio: "Био",
    hide: false,
    experience_years: 12,
    photo: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    user_id: {
      first_name: "Мария",
      last_name: "Иванова",
      middle_name: null,
    },
  },
]

export const mockDoctorSpecs = [
  {
    doctor_id: 1,
    specialization_id: [{ name: "Терапия" }],
  },
]

export const mockServices = [
  {
    id: 10,
    name: "Приём терапевта",
    description: "Консультация",
    price: 3000,
    duration_minutes: 40,
    code: "THER-01",
  },
]

export const mockSpecServices = [
  {
    service_id: 10,
    specialization_id: { id: 5, name: "Терапия" },
  },
  {
    service_id: 10,
    specialization_id: [{ id: 6, name: "" }],
  },
]

export const mockReviews = [
  {
    id: 100,
    rating: 5,
    review_text: "Всё понравилось",
    created_at: "2025-01-10T08:00:00.000Z",
    doctor_id: {
      id: 1,
      user_id: { first_name: "Мария", last_name: "Иванова" },
    },
    patient_id: {
      id: 2,
      user_id: { first_name: "Пётр", last_name: "Сидоров" },
    },
  },
]

export function registerDirectusHandlers (
  options?: {
  settings?: typeof mockSiteSettingsRow | null
  doctors?: typeof mockDoctors
  services?: typeof mockServices
  reviews?: Array<Record<string, unknown>>
  failDoctors?: boolean
  failServices?: boolean
  failSettings?: boolean
  failSpecializations?: boolean
  failReviews?: boolean
  failSpecServices?: boolean
  failDoctorSpecs?: boolean
  specializations?: Array<{ id: number; name: string; code?: string | null }>
  baseUrl?: string
}
) {
  const base = options?.baseUrl ?? directusBaseUrl
  const settings = options?.settings === null ? [] : [options?.settings ?? mockSiteSettingsRow]
  const doctors = options?.doctors ?? mockDoctors
  const services = options?.services ?? mockServices
  const reviews = options?.reviews ?? mockReviews

  mswServer.use(
    http.get(`${base}/items/cms_site_settings`, () => {
      if (options?.failSettings) {
        return HttpResponse.json({ errors: [{ message: "Forbidden" }] }, { status: 403 })
      }
      return HttpResponse.json({ data: settings })
    }),
    http.get(`${base}/items/doctors`, () => {
      if (options?.failDoctors) {
        return HttpResponse.json({ errors: [{ message: "Forbidden" }] }, { status: 403 })
      }
      return HttpResponse.json({ data: doctors })
    }),
    http.get(`${base}/items/doctor_specializations`, () => {
      if (options?.failDoctorSpecs) {
        return HttpResponse.json({ errors: [{ message: "Forbidden" }] }, { status: 403 })
      }
      return HttpResponse.json({ data: mockDoctorSpecs })
    }),
    http.get(`${base}/items/services`, () => {
      if (options?.failServices) {
        return HttpResponse.json({ errors: [{ message: "Forbidden" }] }, { status: 403 })
      }
      return HttpResponse.json({ data: services })
    }),
    http.get(`${base}/items/specialization_services`, () => {
      if (options?.failSpecServices) {
        return HttpResponse.json({ errors: [{ message: "Forbidden" }] }, { status: 403 })
      }
      return HttpResponse.json({ data: mockSpecServices })
    }),
    http.get(`${base}/items/reviews`, ({ request }) => {
      if (options?.failReviews) {
        return HttpResponse.json({ errors: [{ message: "Forbidden" }] }, { status: 403 })
      }
      const url = new URL(request.url)
      const limit = Number(url.searchParams.get("limit") ?? reviews.length)
      const slice = Number.isFinite(limit) ? reviews.slice(0, limit) : reviews
      return HttpResponse.json({ data: slice })
    }),
    http.get(`${base}/items/specializations`, () => {
      if (options?.failSpecializations) {
        return HttpResponse.json({ errors: [{ message: "Forbidden" }] }, { status: 403 })
      }
      return HttpResponse.json({
        data: options?.specializations ?? [
          { id: 5, name: "Терапия", code: "THER" },
          { id: 99, name: "", code: null },
        ],
      })
    })
  )
}
