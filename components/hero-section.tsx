import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"
import { ArrowRight, CheckCircle } from "lucide-react"
import type { MergedSiteSettings } from "@/lib/cms/types"
import { isDirectusProxiedImageSrc } from "@/lib/cms/images"

type HeroSectionProps = {
  settings: MergedSiteSettings
  /** Resolved portrait URLs (Directus assets or data URLs) for social proof chips */
  avatarUrls?: string[]
  heroImageSrc: string
  doctorCount: number
}

function BookingCta ({
  href,
  className,
  children,
}: {
  href: string
  className?: string
  children: ReactNode
}) {
  if (href.startsWith("http://") || href.startsWith("https://")) {
    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  )
}

const FALLBACK_AVATARS = ["/images/doctor-sophia.jpg", "/images/doctor-jana.jpg", "/images/doctor-mike.jpg"]

export function HeroSection ({
  settings,
  avatarUrls,
  heroImageSrc,
  doctorCount,
}: HeroSectionProps) {
  const proofImages =
    avatarUrls && avatarUrls.length > 0 ? avatarUrls : FALLBACK_AVATARS
  const bookHref =
    settings.bookingUrl?.trim() || "/services"
  const specialistsMain = String(Math.max(0, doctorCount))
  const specialistsFloat = String(Math.max(0, doctorCount))

  return (
    <section className="relative pt-28 lg:pt-36 pb-20 lg:pb-28 overflow-hidden" style={{ background: "linear-gradient(180deg, #F6FAFF 0%, #EBF2FF 40%, #DBEAFE 100%)" }}>
      <div className="pointer-events-none absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-accent/[0.04]" />
      <div className="pointer-events-none absolute -bottom-60 -left-40 w-[500px] h-[500px] rounded-full bg-accent/[0.03]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="flex flex-col gap-7">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/10 text-accent text-sm font-medium rounded-full mb-5">
                <span className="w-2 h-2 rounded-full bg-accent" />
                {settings.heroBadge}
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-foreground leading-[1.1] tracking-tight text-balance">
                {settings.heroTitle}
              </h1>
            </div>
            <p className="text-base lg:text-lg text-muted-foreground leading-relaxed max-w-lg">
              {settings.heroSubtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <BookingCta
                href={bookHref}
                className="inline-flex items-center px-7 py-3.5 bg-accent text-accent-foreground text-sm font-semibold rounded-full hover:bg-accent/90 transition-colors shadow-lg shadow-accent/25"
              >
                Запись на приём
              </BookingCta>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-card text-foreground text-sm font-semibold rounded-full border border-border hover:bg-secondary transition-colors"
              >
                Связаться с нами <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="flex items-center gap-4 mt-1">
              <div className="flex -space-x-2.5">
                {proofImages.slice(0, 3).map((src, i) => (
                  <div key={`${src}-${i}`} className="w-9 h-9 rounded-full bg-secondary border-2 border-card overflow-hidden shadow-sm relative">
                    <Image
                      src={src}
                      alt=""
                      width={36}
                      height={36}
                      className="w-full h-full object-cover"
                      unoptimized={src.startsWith("data:") || isDirectusProxiedImageSrc(src)}
                    />
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-semibold text-foreground">Нам доверяют пациенты</span>
              </div>
            </div>

            <div className="flex items-center gap-12 mt-2">
              <div>
                <div className="text-3xl lg:text-4xl font-extrabold text-foreground">{settings.heroExperienceYearsLabel}</div>
                <div className="text-sm text-muted-foreground mt-0.5">Лет опыта</div>
              </div>
              <div className="w-px h-12 bg-border" />
              <div>
                <div className="text-3xl lg:text-4xl font-extrabold text-foreground">{specialistsMain}</div>
                <div className="text-sm text-muted-foreground mt-0.5">Специалистов</div>
              </div>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md lg:max-w-lg">
              <div className="relative rounded-3xl overflow-hidden bg-card shadow-2xl shadow-accent/10">
                <Image
                  src={heroImageSrc}
                  alt="Врач"
                  width={520}
                  height={620}
                  className="w-full h-auto object-cover"
                  priority
                  unoptimized={isDirectusProxiedImageSrc(heroImageSrc)}
                />
              </div>

              <div className="absolute top-8 right-4 lg:-right-4 bg-card rounded-2xl px-4 py-3 shadow-xl border border-border/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <div className="text-xl font-extrabold text-foreground">{specialistsFloat}</div>
                    <div className="text-xs text-muted-foreground">Специалистов</div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-8 -left-4 lg:-left-8 bg-card rounded-2xl px-4 py-3 shadow-xl border border-border/60">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full overflow-hidden">
                    <Image
                      src={proofImages[0] ?? "/images/doctor-josh.jpg"}
                      alt=""
                      width={44}
                      height={44}
                      className="w-full h-full object-cover"
                      unoptimized={isDirectusProxiedImageSrc(proofImages[0] ?? "")}
                    />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground">{settings.clinicName}</div>
                    <div className="text-xs text-accent font-medium">Рядом, когда нужно</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
