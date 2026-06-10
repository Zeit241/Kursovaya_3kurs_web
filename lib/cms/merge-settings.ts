import type {
  CmsSiteSettingsRow,
  MergedSiteSettings,
  VSiteDoctorRow,
  VSiteReviewRow,
} from "@/lib/cms/types"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = Record<string, any>

export const DEFAULT_SETTINGS: MergedSiteSettings = {
  clinicName: "Медицинская клиника",
  phone: "+7 (000) 000-00-00",
  email: "info@clinic.example",
  address: "Укажите адрес в настройках сайта (Directus)",
  bookingUrl: "/services",
  heroTitle: "Забота о здоровье — наш приоритет",
  heroSubtitle:
    "Комплексная медицинская помощь, современное оборудование и команда специалистов рядом с вами.",
  heroBadge: "Нам доверяют пациенты",
  socialLinks: {},
  metaDescriptionDoctors:
    "Врачи клиники: специализации, опыт и запись на приём. Актуальный состав медицинской команды.",
  metaDescriptionServices:
    "Услуги клиники: консультации, диагностика и лечение. Цены и длительность приёма.",
  metaDescriptionAbout:
    "О клинике: миссия, ценности и контакты. Качественная медицинская помощь для всей семьи.",
  aboutMissionRich: "",
  aboutVisionRich: "",
  navLabelAbout: "О клинике",
  navLabelServices: "Услуги",
  navLabelDoctors: "Врачи",
  heroExperienceYearsLabel: "15+",
  section1PhotoFileId: null,
  section2PhotoFileId: null,
  homeFeatureBlocks: [
    {
      title: "Современное оборудование",
      desc: "Диагностика и лечение с использованием актуальных медицинских технологий.",
    },
    {
      title: "Понятная оплата",
      desc: "Помогаем с документами и вопросами по оплате, чтобы вы могли сосредоточиться на здоровье.",
    },
    {
      title: "Команда и сервис",
      desc: "Внимательный персонал и слаженная работа врачей для комфортного визита.",
    },
  ],
  homeStatBlocks: [
    { value: "265K", label: "Консультаций" },
    { value: "96%", label: "Удовлетворённость" },
  ],
}

/** Directus `photo` / file: строка UUID/URL или объект `{ id }`. */
export function normalizeDirectusAssetField (value: unknown): string | null {
  if (value == null) return null
  if (typeof value === "string") {
    const t = value.trim()
    return t || null
  }
  if (typeof value === "object" && value !== null) {
    const o = value as Any
    const id = o.id ?? o.uuid ?? o.file_id ?? o.directus_files_id
    if (id != null) {
      const s = String(id).trim()
      return s || null
    }
  }
  return null
}

export function mergeSiteSettings (
  row: CmsSiteSettingsRow | null
): MergedSiteSettings {
  if (!row) return { ...DEFAULT_SETTINGS }
  return {
    clinicName: row.clinic_name?.trim() || DEFAULT_SETTINGS.clinicName,
    phone: row.phone?.trim() || DEFAULT_SETTINGS.phone,
    email: row.email?.trim() || DEFAULT_SETTINGS.email,
    address: row.address?.trim() || DEFAULT_SETTINGS.address,
    bookingUrl: row.booking_url?.trim() || DEFAULT_SETTINGS.bookingUrl,
    heroTitle: row.hero_title?.trim() || DEFAULT_SETTINGS.heroTitle,
    heroSubtitle: row.hero_subtitle?.trim() || DEFAULT_SETTINGS.heroSubtitle,
    heroBadge: row.hero_badge?.trim() || DEFAULT_SETTINGS.heroBadge,
    socialLinks:
      row.social_links && typeof row.social_links === "object"
        ? row.social_links
        : {},
    metaDescriptionDoctors:
      row.meta_description_doctors?.trim() ||
      DEFAULT_SETTINGS.metaDescriptionDoctors,
    metaDescriptionServices:
      row.meta_description_services?.trim() ||
      DEFAULT_SETTINGS.metaDescriptionServices,
    metaDescriptionAbout:
      row.meta_description_about?.trim() ||
      DEFAULT_SETTINGS.metaDescriptionAbout,
    aboutMissionRich: row.about_mission_rich?.trim() ?? "",
    aboutVisionRich: row.about_vision_rich?.trim() ?? "",
    navLabelAbout:
      row.nav_label_about?.trim() || DEFAULT_SETTINGS.navLabelAbout,
    navLabelServices:
      row.nav_label_services?.trim() || DEFAULT_SETTINGS.navLabelServices,
    navLabelDoctors:
      row.nav_label_doctors?.trim() || DEFAULT_SETTINGS.navLabelDoctors,
    heroExperienceYearsLabel:
      row.hero_years_experience_label?.trim() ||
      DEFAULT_SETTINGS.heroExperienceYearsLabel,
    section1PhotoFileId: normalizeDirectusAssetField(row.section_1_photo),
    section2PhotoFileId: normalizeDirectusAssetField(row.section_2_photo),
    homeFeatureBlocks: [
      {
        title:
          row.home_feature_1_title?.trim() ||
          DEFAULT_SETTINGS.homeFeatureBlocks[0].title,
        desc:
          row.home_feature_1_desc?.trim() ||
          DEFAULT_SETTINGS.homeFeatureBlocks[0].desc,
      },
      {
        title:
          row.home_feature_2_title?.trim() ||
          DEFAULT_SETTINGS.homeFeatureBlocks[1].title,
        desc:
          row.home_feature_2_desc?.trim() ||
          DEFAULT_SETTINGS.homeFeatureBlocks[1].desc,
      },
      {
        title:
          row.home_feature_3_title?.trim() ||
          DEFAULT_SETTINGS.homeFeatureBlocks[2].title,
        desc:
          row.home_feature_3_desc?.trim() ||
          DEFAULT_SETTINGS.homeFeatureBlocks[2].desc,
      },
    ],
    homeStatBlocks: [
      {
        value:
          row.home_stat_1_value?.trim() ||
          DEFAULT_SETTINGS.homeStatBlocks[0].value,
        label:
          row.home_stat_1_label?.trim() ||
          DEFAULT_SETTINGS.homeStatBlocks[0].label,
      },
      {
        value:
          row.home_stat_2_value?.trim() ||
          DEFAULT_SETTINGS.homeStatBlocks[1].value,
        label:
          row.home_stat_2_label?.trim() ||
          DEFAULT_SETTINGS.homeStatBlocks[1].label,
      },
    ],
  }
}

export function joinUserName (u: Any | null): string {
  if (!u || typeof u !== "object") return ""
  const fn = String(u.first_name ?? "").trim()
  const ln = String(u.last_name ?? "").trim()
  const mn = String(u.middle_name ?? "").trim()
  const s = [ln, fn, mn].filter(Boolean).join(" ").trim()
  return s || [fn, ln].filter(Boolean).join(" ")
}

/** Directus может отдать связь как user_id (объект) или user */
export function pickUser (doc: Any): Any | null {
  if (!doc || typeof doc !== "object") return null
  const u = doc.user_id ?? doc.user
  return typeof u === "object" && u !== null ? u : null
}

export function mapDoctorRow (
  d: Any,
  specMap: Map<number, string>
): VSiteDoctorRow {
  const id = Number(d.id)
  const u = pickUser(d)
  const display = joinUserName(u) || `Врач #${id}`
  return {
    doctor_id: id,
    display_name: display,
    bio_display: d.bio ?? null,
    experience_years: d.experience_years ?? null,
    operational_photo_ref: normalizeDirectusAssetField(d.photo),
    cms_photo_file_id: null,
    hero_sort: id,
    specialties_display: specMap.get(id) ?? "",
    hidden_from_landing: false,
  }
}

export function mapReviewRow (r: Any): VSiteReviewRow {
  const du = pickUser(r.doctor_id ?? r.doctor)
  const pu = pickUser(r.patient_id ?? r.patient)
  const created = r.created_at
  return {
    review_id: Number(r.id),
    rating: r.rating ?? null,
    patient_display_name: joinUserName(pu) || "Пациент",
    review_text: r.review_text ?? null,
    doctor_display_name: joinUserName(du) || "",
    created_at:
      typeof created === "string"
        ? created
        : created instanceof Date
          ? created.toISOString()
          : null,
    published_on_landing: true,
  }
}
