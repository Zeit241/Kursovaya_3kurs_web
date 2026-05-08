import Link from "next/link"
import { Phone, Mail, MapPin } from "lucide-react"
import type { MergedSiteSettings } from "@/lib/cms/types"

type FooterProps = {
  settings: MergedSiteSettings
  /** If empty, static labels are used. */
  footerServiceLabels: string[]
}

export function Footer ({ settings, footerServiceLabels }: FooterProps) {
  const serviceLine = footerServiceLabels.length
    ? footerServiceLabels
    : [
        "Кардиология",
        "Неврология",
        "Ортопедия",
        "Педиатрия",
        "Дерматология",
      ]
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 3v12M3 9h12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-xl font-bold text-primary-foreground tracking-tight">{settings.clinicName}</span>
            </Link>
            <p className="text-sm text-primary-foreground/60 leading-relaxed max-w-xs">
              Комплексная медицинская помощь и внимательное отношение к каждому пациенту.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-5">
            <h4 className="text-sm font-semibold text-primary-foreground tracking-wide uppercase">Разделы</h4>
            <nav className="flex flex-col gap-3">
              {[
                { href: "/about", label: settings.navLabelAbout },
                { href: "/services", label: settings.navLabelServices },
                { href: "/doctors", label: settings.navLabelDoctors },
                { href: "/services", label: "Запись" },
              ].map((link) => (
                <Link key={link.label} href={link.href} className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Services */}
          <div className="flex flex-col gap-5">
            <h4 className="text-sm font-semibold text-primary-foreground tracking-wide uppercase">Услуги</h4>
            <div className="flex flex-col gap-3">
              {serviceLine.map((service) => (
                <span key={service} className="text-sm text-primary-foreground/60">{service}</span>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-5">
            <h4 className="text-sm font-semibold text-primary-foreground tracking-wide uppercase">Контакты</h4>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary-foreground/10 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-accent" />
                </div>
                <span className="text-sm text-primary-foreground/60">{settings.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary-foreground/10 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-accent" />
                </div>
                <span className="text-sm text-primary-foreground/60">{settings.email}</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary-foreground/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-accent" />
                </div>
                <span className="text-sm text-primary-foreground/60">{settings.address}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-primary-foreground/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-primary-foreground/40">
            © {new Date().getFullYear()} {settings.clinicName}. Все права защищены.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Link
              href="/politika-konfidencialnosti"
              className="text-sm text-primary-foreground/40 hover:text-primary-foreground/80 transition-colors"
            >
              Политика конфиденциальности
            </Link>
            <Link
              href="/usloviya-ispolzovaniya"
              className="text-sm text-primary-foreground/40 hover:text-primary-foreground/80 transition-colors"
            >
              Условия использования
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
