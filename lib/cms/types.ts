/**
 * Адаптеры для UI. Данные приходят из Directus (операционные таблицы + cms_site_settings)
 * и маппятся в directus.ts.
 */

export interface CmsSiteSettingsRow {
  id?: number
  clinic_name?: string | null
  phone?: string | null
  email?: string | null
  address?: string | null
  booking_url?: string | null
  hero_title?: string | null
  hero_subtitle?: string | null
  hero_badge?: string | null
  social_links?: Record<string, string> | null
  meta_description_doctors?: string | null
  meta_description_services?: string | null
  meta_description_about?: string | null
  about_mission_rich?: string | null
  about_vision_rich?: string | null
  nav_label_about?: string | null
  nav_label_services?: string | null
  nav_label_doctors?: string | null
  hero_years_experience_label?: string | null
  section_1_photo?: unknown
  section_2_photo?: unknown
  home_feature_1_title?: string | null
  home_feature_1_desc?: string | null
  home_feature_2_title?: string | null
  home_feature_2_desc?: string | null
  home_feature_3_title?: string | null
  home_feature_3_desc?: string | null
  home_stat_1_value?: string | null
  home_stat_1_label?: string | null
  home_stat_2_value?: string | null
  home_stat_2_label?: string | null
}

export type HomeFeatureBlock = { title: string; desc: string }
export type HomeStatBlock = { value: string; label: string }

export interface VSiteDoctorRow {
  doctor_id: number
  display_name?: string | null
  bio_display?: string | null
  experience_years?: number | null
  /** UUID файла Directus или полный URL из doctors.photo */
  operational_photo_ref?: string | null
  cms_photo_file_id?: string | null
  hero_sort?: number | null
  specialties_display?: string | null
  hidden_from_landing?: boolean | null
}

export interface VSiteServiceRow {
  service_id: number
  title_display?: string | null
  description_display?: string | null
  operational_name?: string | null
  operational_price?: string | number | null
  duration_minutes?: number | null
  category_display?: string | null
  /** id специализаций из specialization_services (Directus) */
  specialization_ids?: number[]
  /** Чипы специализаций (по одной на строку в UI) */
  specialization_chips?: { id: number; name: string }[]
  show_operational_price?: boolean | null
  published_on_site?: boolean | null
  sort_order?: number | null
  hidden_from_landing?: boolean | null
}

export interface VSiteReviewRow {
  review_id: number
  rating?: number | null
  patient_display_name?: string | null
  review_text?: string | null
  doctor_display_name?: string | null
  created_at?: string | null
  published_on_landing?: boolean | null
}

/** Normalized for React components */
export interface MergedSiteSettings {
  clinicName: string
  phone: string
  email: string
  address: string
  bookingUrl: string
  heroTitle: string
  heroSubtitle: string
  heroBadge: string
  socialLinks: Record<string, string>
  metaDescriptionDoctors: string
  metaDescriptionServices: string
  metaDescriptionAbout: string
  aboutMissionRich: string
  aboutVisionRich: string
  navLabelAbout: string
  navLabelServices: string
  navLabelDoctors: string
  /** Подпись «лет опыта» на главной (например «15+») */
  heroExperienceYearsLabel: string
  /** UUID файла Directus — hero */
  section1PhotoFileId: string | null
  /** UUID файла Directus — блок услуг */
  section2PhotoFileId: string | null
  homeFeatureBlocks: HomeFeatureBlock[]
  homeStatBlocks: HomeStatBlock[]
}
