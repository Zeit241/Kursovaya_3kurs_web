import type { Metadata } from "next"
import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { TeamSection } from "@/components/team-section"
import type { TeamDoctorVm } from "@/components/team-section"
import { FeaturesSection } from "@/components/features-section"
import { TreatmentSection } from "@/components/treatment-section"
import {
  directusPublicUrl,
  getLandingDoctors,
  getLandingReviews,
  getLandingServices,
  getMergedSiteSettings,
} from "@/lib/cms/directus"
import { cmsFileAssetUrl, doctorPortraitSrc } from "@/lib/cms/images"

export async function generateMetadata (): Promise<Metadata> {
  const s = await getMergedSiteSettings()
  return {
    title: s.clinicName,
    description: `${s.heroSubtitle} ${s.phone}`.slice(0, 200),
  }
}

export default async function Home () {
  const settings = await getMergedSiteSettings()
  const base = directusPublicUrl()

  const [doctorRows, services, reviews] = await Promise.all([
    getLandingDoctors(),
    getLandingServices(),
    getLandingReviews(6),
  ])

  const teamDoctors: TeamDoctorVm[] = doctorRows.map((d) => ({
    id: d.doctor_id,
    name:
      (d.display_name && d.display_name.trim()) ||
      `Врач #${d.doctor_id}`,
    specialty:
      (d.specialties_display && d.specialties_display.trim()) ||
      "Специалист",
    imageSrc: doctorPortraitSrc(d, base),
  }))

  const avatarUrls = teamDoctors
    .map((t) => t.imageSrc)
    .filter((src): src is string => !!src)
    .slice(0, 3)

  const heroImageSrc =
    cmsFileAssetUrl(settings.section1PhotoFileId) ?? "/images/doctor-hero.jpg"
  const servicesImageSrc =
    cmsFileAssetUrl(settings.section2PhotoFileId) ?? "/images/doctor-josh.jpg"
  const doctorCount = doctorRows.length

  return (
    <main>
      <HeroSection
        settings={settings}
        avatarUrls={avatarUrls}
        heroImageSrc={heroImageSrc}
        doctorCount={doctorCount}
      />
      <ServicesSection
        settings={settings}
        services={services}
        sectionImageSrc={servicesImageSrc}
      />
      <TeamSection doctors={teamDoctors} settings={settings} />
      <FeaturesSection
        reviews={reviews}
        featureBlocks={settings.homeFeatureBlocks}
        statBlocks={settings.homeStatBlocks}
      />
      <TreatmentSection />
    </main>
  )
}
