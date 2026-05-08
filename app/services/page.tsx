import type { Metadata } from "next"
import {
  getLandingServices,
  getLandingSpecializations,
  getMergedSiteSettings,
} from "@/lib/cms/directus"
import {
  buildServiceRows,
  specializationsUsedByServices,
} from "@/lib/cms/build-service-rows"
import { ServicesPageClient } from "./services-page-client"

export async function generateMetadata (): Promise<Metadata> {
  const s = await getMergedSiteSettings()
  return {
    title: `Услуги — ${s.clinicName}`,
    description: s.metaDescriptionServices,
  }
}

export default async function ServicesPage () {
  const settings = await getMergedSiteSettings()
  const [raw, allSpecs] = await Promise.all([
    getLandingServices(),
    getLandingSpecializations(),
  ])
  const services = buildServiceRows(raw)
  const serviceFilterGroups = specializationsUsedByServices(allSpecs, services)

  return (
    <ServicesPageClient
      services={services}
      settings={settings}
      serviceFilterGroups={serviceFilterGroups}
    />
  )
}
