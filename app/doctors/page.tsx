import type { Metadata } from "next"
import {
  directusPublicUrl,
  getLandingDoctors,
  getMergedSiteSettings,
} from "@/lib/cms/directus"
import { doctorPortraitSrc } from "@/lib/cms/images"
import { DoctorsPageClient, type DoctorCardVm } from "./doctors-page-client"

export async function generateMetadata (): Promise<Metadata> {
  const s = await getMergedSiteSettings()
  return {
    title: `Врачи — ${s.clinicName}`,
    description: s.metaDescriptionDoctors,
  }
}

export default async function DoctorsPage () {
  const settings = await getMergedSiteSettings()
  const base = directusPublicUrl()
  const rows = await getLandingDoctors()

  const doctors: DoctorCardVm[] = rows.map((d) => ({
    id: d.doctor_id,
    name:
      (d.display_name && d.display_name.trim()) ||
      `Врач #${d.doctor_id}`,
    specialty:
      (d.specialties_display && d.specialties_display.trim()) || "Специалист",
    experienceYears: d.experience_years ?? null,
    bio: d.bio_display ?? null,
    imageSrc: doctorPortraitSrc(d, base),
  }))

  return <DoctorsPageClient doctors={doctors} settings={settings} />
}
