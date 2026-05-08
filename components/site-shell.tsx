import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getLandingServices, getMergedSiteSettings } from "@/lib/cms/directus"

function footerLabelsFromServices (titles: string[]): string[] {
  return titles.slice(0, 8).filter(Boolean)
}

const STATIC_SERVICES_FOOTER = [
  "Кардиология",
  "Неврология",
  "Ортопедия",
  "Педиатрия",
  "Дерматология",
]

export async function SiteShell ({ children }: { children: React.ReactNode }) {
  const settings = await getMergedSiteSettings()
  const services = await getLandingServices()
  const labels = footerLabelsFromServices(
    services.map((s) =>
      String(s.title_display || s.operational_name || "").trim()
    )
  )

  return (
    <div className="min-h-screen bg-background">
      <Header
        clinicName={settings.clinicName}
        bookingUrl={settings.bookingUrl}
        navLabelAbout={settings.navLabelAbout}
        navLabelServices={settings.navLabelServices}
        navLabelDoctors={settings.navLabelDoctors}
      />
      {children}
      <Footer
        settings={settings}
        footerServiceLabels={
          labels.length ? labels : STATIC_SERVICES_FOOTER
        }
      />
    </div>
  )
}
