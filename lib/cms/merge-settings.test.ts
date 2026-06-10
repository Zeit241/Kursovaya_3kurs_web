import { describe, expect, it } from "vitest"
import {
  DEFAULT_SETTINGS,
  mapDoctorRow,
  mapReviewRow,
  mergeSiteSettings,
} from "@/lib/cms/merge-settings"

describe("mergeSiteSettings", () => {
  it("returns defaults when row is null", () => {
    const merged = mergeSiteSettings(null)
    expect(merged.clinicName).toBe(DEFAULT_SETTINGS.clinicName)
    expect(merged.homeFeatureBlocks).toHaveLength(3)
  })

  it("merges clinic name from row", () => {
    const merged = mergeSiteSettings({
      clinic_name: "Клиника Здоровье",
      social_links: null,
    })
    expect(merged.clinicName).toBe("Клиника Здоровье")
    expect(merged.socialLinks).toEqual({})
    expect(
      mergeSiteSettings({
        social_links: "invalid" as unknown as Record<string, string>,
      }).socialLinks
    ).toEqual({})
  })

  it("trims whitespace from phone", () => {
    const merged = mergeSiteSettings({ phone: "  +7 999 000-00-00  " })
    expect(merged.phone).toBe("+7 999 000-00-00")
  })

  it("extracts section photo UUID from nested object", () => {
    const uuid = "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee"
    const merged = mergeSiteSettings({
      section_1_photo: { id: uuid },
      section_2_photo: "   ",
    })
    expect(merged.section1PhotoFileId).toBe(uuid)
    expect(merged.section2PhotoFileId).toBeNull()
    expect(
      mergeSiteSettings({ section_1_photo: { id: "   " } }).section1PhotoFileId
    ).toBeNull()
  })
})

describe("mapDoctorRow", () => {
  it("builds display name from user_id", () => {
    const row = mapDoctorRow(
      {
        id: 5,
        bio: "Опытный врач",
        experience_years: 10,
        photo: null,
        user_id: {
          first_name: "Иван",
          last_name: "Петров",
          middle_name: "Сергеевич",
        },
      },
      new Map([[5, "Терапия"]])
    )
    expect(row.display_name).toBe("Петров Иван Сергеевич")
    expect(row.specialties_display).toBe("Терапия")
  })

  it("falls back to doctor id when user is missing", () => {
    const row = mapDoctorRow({ id: 7, photo: null }, new Map())
    expect(row.display_name).toBe("Врач #7")
  })
})

describe("mapReviewRow", () => {
  it("maps patient and doctor display names", () => {
    const row = mapReviewRow({
      id: 1,
      rating: 5,
      review_text: "Отличный приём",
      created_at: "2024-01-15T10:00:00.000Z",
      doctor_id: {
        user_id: { first_name: "Анна", last_name: "Смирнова" },
      },
      patient_id: {
        user_id: { first_name: "Олег", last_name: "Кузнецов" },
      },
    })
    expect(row.patient_display_name).toBe("Кузнецов Олег")
    expect(row.doctor_display_name).toBe("Смирнова Анна")
    expect(row.review_text).toBe("Отличный приём")
  })

  it("serializes Date created_at to ISO string", () => {
    const date = new Date("2024-06-01T12:00:00.000Z")
    const row = mapReviewRow({
      id: 2,
      rating: 4,
      created_at: date,
      review_text: null,
      doctor_id: null,
      patient_id: null,
    })
    expect(row.created_at).toBe(date.toISOString())
    expect(row.patient_display_name).toBe("Пациент")
    expect(row.review_text).toBeNull()

    const withoutDate = mapReviewRow({
      id: 3,
      rating: 3,
      created_at: null,
      doctor_id: null,
      patient_id: null,
    })
    expect(withoutDate.created_at).toBeNull()
  })
})
