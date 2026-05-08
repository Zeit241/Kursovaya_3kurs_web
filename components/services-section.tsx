import Image from "next/image"
import { Heart, Shield, Clock } from "lucide-react"
import type { MergedSiteSettings, VSiteServiceRow } from "@/lib/cms/types"
import { isDirectusProxiedImageSrc } from "@/lib/cms/images"

type ServicesSectionProps = {
  settings: MergedSiteSettings
  services: VSiteServiceRow[]
  /** Главное фото колонки слева (CMS или статика) */
  sectionImageSrc: string
}

function formatPrice (p: string | number | null | undefined): string {
  if (p === null || p === undefined || p === "") return ""
  const n = typeof p === "string" ? Number.parseFloat(p) : Number(p)
  if (Number.isFinite(n)) {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(n)
  }
  return String(p)
}

export function ServicesSection ({ settings, services, sectionImageSrc }: ServicesSectionProps) {
  const topServices = services.slice(0, 8)
  const imgUnopt = isDirectusProxiedImageSrc(sectionImageSrc)

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-foreground leading-tight max-w-lg text-balance">
            Широкий спектр медицинских услуг
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed max-w-md lg:text-right">
            В {settings.clinicName} — внимательный подход и понятные шаги: от консультации до лечения. Ознакомьтесь с услугами и запишитесь, когда будете готовы.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-xl shadow-accent/5">
              <Image
                src={sectionImageSrc}
                alt="Приём у врача"
                width={560}
                height={640}
                className="w-full h-auto object-cover max-h-[520px]"
                unoptimized={imgUnopt}
              />
            </div>

            <div className="absolute bottom-6 left-6 bg-card rounded-2xl px-5 py-3.5 shadow-xl border border-border/60">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-accent/20">
                  <Image src={sectionImageSrc} alt="" width={44} height={44} className="w-full h-full object-cover" unoptimized={imgUnopt} />
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground">{settings.clinicName}</div>
                  <div className="text-xs text-muted-foreground">Качество услуг</div>
                </div>
                <span className="ml-3 px-3.5 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full">
                  Запись
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <span className="inline-block self-start px-5 py-2 bg-secondary text-foreground text-sm font-medium rounded-full border border-border">
              Забота о здоровье
            </span>

            <div className="flex flex-col gap-4">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground text-balance">
                Ваше здоровье — наш приоритет
              </h3>
              <p className="text-base text-muted-foreground leading-relaxed">
                {settings.heroSubtitle}
              </p>
            </div>

            {topServices.length > 0 ? (
              <ul className="flex flex-col gap-3 border border-border/60 rounded-2xl p-5 bg-card/50">
                {topServices.map((s) => (
                  <li
                    key={s.service_id}
                    className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border/40 last:border-0 pb-3 last:pb-0"
                  >
                    <div>
                      <div className="font-semibold text-foreground">
                        {s.title_display || s.operational_name}
                      </div>
                      {s.category_display ? (
                        <div className="text-xs text-muted-foreground mt-0.5">{s.category_display}</div>
                      ) : null}
                      {s.description_display ? (
                        <p className="text-sm text-muted-foreground mt-1 max-w-prose">{s.description_display}</p>
                      ) : null}
                    </div>
                    {s.show_operational_price !== false && s.operational_price != null ? (
                      <span className="text-sm font-bold text-accent shrink-0">
                        {formatPrice(s.operational_price)}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="grid grid-cols-3 gap-6 mt-4">
              {[
                { icon: Heart, label: "Сердце" },
                { icon: Shield, label: "Надёжность" },
                { icon: Clock, label: "Поддержка" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-3 group">
                  <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                    <Icon className="w-7 h-7 text-foreground group-hover:text-accent transition-colors" />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium text-center">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
