import { beforeEach, describe, expect, it, vi } from "vitest"
import {
  mockServices,
  registerDirectusHandlers,
} from "@/lib/cms/test-helpers/directus-handlers"

vi.mock("next/cache", () => ({
  unstable_cache: <T extends (...args: never[]) => unknown>(fn: T) => fn,
}))

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react")
  return {
    ...actual,
    cache: <T extends (...args: never[]) => unknown>(fn: T) => fn,
  }
})

describe("Directus integration", () => {
  beforeEach(() => {
    vi.resetModules()
    registerDirectusHandlers()
  })

  it("getMergedSiteSettings merges CMS row from Directus", async () => {
    const { getMergedSiteSettings } = await import("@/lib/cms/directus")
    const settings = await getMergedSiteSettings()
    expect(settings.clinicName).toBe("Клиника MSW")
    expect(settings.heroTitle).toBe("Тестовый заголовок")
  })

  it("getMergedSiteSettings falls back to defaults when CMS row is empty", async () => {
    registerDirectusHandlers({ settings: null })
    const { getMergedSiteSettings } = await import("@/lib/cms/directus")
    const { DEFAULT_SETTINGS } = await import("@/lib/cms/merge-settings")
    const settings = await getMergedSiteSettings()
    expect(settings.clinicName).toBe(DEFAULT_SETTINGS.clinicName)
  })

  it("getLandingDoctors maps doctor with specialty from join table", async () => {
    const { getLandingDoctors } = await import("@/lib/cms/directus")
    const doctors = await getLandingDoctors()
    expect(doctors).toHaveLength(1)
    expect(doctors[0].display_name).toBe("Иванова Мария")
    expect(doctors[0].specialties_display).toBe("Терапия")

    registerDirectusHandlers({ failDoctorSpecs: true })
    vi.resetModules()
    registerDirectusHandlers({ failDoctorSpecs: true })
    const { getLandingDoctors: getDoctorsWithoutSpecs } = await import(
      "@/lib/cms/directus"
    )
    const withoutSpecs = await getDoctorsWithoutSpecs()
    expect(withoutSpecs[0].specialties_display).toBe("")

    registerDirectusHandlers({ doctors: [] })
    vi.resetModules()
    registerDirectusHandlers({ doctors: [] })
    const { getLandingDoctors: getNoDoctors } = await import("@/lib/cms/directus")
    expect(await getNoDoctors()).toEqual([])
  })

  it("returns empty collections when Directus responds with errors", async () => {
    registerDirectusHandlers({
      failDoctors: true,
      failServices: true,
      failSettings: true,
      failSpecializations: true,
      failReviews: true,
    })
    const {
      getLandingDoctors,
      getLandingServices,
      getLandingReviews,
      getLandingSpecializations,
      getMergedSiteSettings,
    } = await import("@/lib/cms/directus")
    const { DEFAULT_SETTINGS } = await import("@/lib/cms/merge-settings")
    const [doctors, services, reviews, specs, settings] = await Promise.all([
      getLandingDoctors(),
      getLandingServices(),
      getLandingReviews(2),
      getLandingSpecializations(),
      getMergedSiteSettings(),
    ])
    expect(doctors).toEqual([])
    expect(services).toEqual([])
    expect(reviews).toEqual([])
    expect(specs).toEqual([])
    expect(settings.clinicName).toBe(DEFAULT_SETTINGS.clinicName)
  })

  it("getLandingServices maps service with specialization chips", async () => {
    const { getLandingServices, getLandingSpecializations } = await import(
      "@/lib/cms/directus"
    )
    const [services, specs] = await Promise.all([
      getLandingServices(),
      getLandingSpecializations(),
    ])
    expect(services[0].title_display).toBe("Приём терапевта")
    expect(services[0].specialization_chips).toEqual([
      { id: 6, name: "Специализация 6" },
      { id: 5, name: "Терапия" },
    ])
    expect(specs[0].name).toBe("Терапия")
    expect(specs.some((s) => s.name === "Специализация 99")).toBe(true)

    registerDirectusHandlers({ services: [], failSpecServices: true })
    vi.resetModules()
    registerDirectusHandlers({ services: [], failSpecServices: true })
    const { getLandingServices: getEmptyServices } = await import(
      "@/lib/cms/directus"
    )
    expect(await getEmptyServices()).toEqual([])

    registerDirectusHandlers({
      services: mockServices,
      failSpecServices: true,
    })
    vi.resetModules()
    registerDirectusHandlers({
      services: mockServices,
      failSpecServices: true,
    })
    const { getLandingServices: getServicesWithoutSpecs } = await import(
      "@/lib/cms/directus"
    )
    const bare = await getServicesWithoutSpecs()
    expect(bare[0].specialization_chips).toEqual([])
  })

  it("getLandingReviews maps patient and doctor names", async () => {
    const { getLandingReviews } = await import("@/lib/cms/directus")
    const reviews = await getLandingReviews()
    expect(reviews[0].patient_display_name).toBe("Сидоров Пётр")
    expect(reviews[0].doctor_display_name).toBe("Иванова Мария")
  })

  it("getLandingReviews respects limit parameter", async () => {
    registerDirectusHandlers({
      reviews: [
        ...Array.from({ length: 4 }, (_, i) => ({
          id: i + 1,
          rating: 5,
          review_text: `Review ${i}`,
          created_at: "2025-01-01T00:00:00.000Z",
          doctor_id: null,
          patient_id: null,
        })),
      ],
    })
    const { getLandingReviews } = await import("@/lib/cms/directus")
    const reviews = await getLandingReviews(2)
    expect(reviews.length).toBeLessThanOrEqual(2)
  })

  it("directusPublicUrl reads env and works without auth token", async () => {
    const { directusPublicUrl } = await import("@/lib/cms/directus")
    const { directusBaseUrl } = await import("../../vitest.setup")
    expect(directusPublicUrl()).toBe(directusBaseUrl)

    const savedPublic = process.env.NEXT_PUBLIC_DIRECTUS_URL
    const savedInternal = process.env.DIRECTUS_INTERNAL_URL
    const savedToken = process.env.DIRECTUS_TOKEN
    process.env.NEXT_PUBLIC_DIRECTUS_URL = "http://localhost:8055"
    process.env.DIRECTUS_INTERNAL_URL = "http://localhost:8055"
    process.env.DIRECTUS_TOKEN = ""
    vi.resetModules()
    registerDirectusHandlers({ baseUrl: "http://localhost:8055" })
    const { directusPublicUrl: fallbackUrl, getMergedSiteSettings } =
      await import("@/lib/cms/directus")
    expect(fallbackUrl()).toBe("http://localhost:8055")
    await expect(getMergedSiteSettings()).resolves.toMatchObject({
      clinicName: "Клиника MSW",
    })
    process.env.NEXT_PUBLIC_DIRECTUS_URL = savedPublic
    process.env.DIRECTUS_INTERNAL_URL = savedInternal
    process.env.DIRECTUS_TOKEN = savedToken ?? "test-token"
  })
})
