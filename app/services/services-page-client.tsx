"use client"

import Image from "next/image"
import Link from "next/link"
import { useMemo, useState } from "react"
import {
  Heart,
  Brain,
  Bone,
  Baby,
  Eye,
  Stethoscope,
  Microscope,
  Activity,
  ArrowRight,
  Clock,
  CheckCircle,
  Phone,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { MergedSiteSettings } from "@/lib/cms/types"
import type { ServiceRowVm } from "@/lib/cms/build-service-rows"

export type { ServiceRowVm } from "@/lib/cms/build-service-rows"

export type ServiceFilterGroupVm = {
  id: number
  name: string
}

function pickIcon (titleLower: string) {
  if (/скор|неотлож|реаним|emergency|травм/i.test(titleLower)) return Activity
  if (/глаз|окулист|офтальм|eye|vision/i.test(titleLower)) return Eye
  if (/кров|лаборатор|анализ|диагност|узи|рентген|мрт|кт/i.test(titleLower))
    return Microscope
  if (/дет|педиатр|baby|child/i.test(titleLower)) return Baby
  if (/кардио|сердц|heart/i.test(titleLower)) return Heart
  if (/невро|brain|мозг/i.test(titleLower)) return Brain
  if (/ортопед|кост|сустав|bone|ortho/i.test(titleLower)) return Bone
  if (/дермат|кож|skin/i.test(titleLower)) return Microscope
  return Stethoscope
}

type ServicesPageClientProps = {
  services: ServiceRowVm[]
  settings: MergedSiteSettings
  /** Специализации из Directus, по которым есть услуги (для фильтра). */
  serviceFilterGroups: ServiceFilterGroupVm[]
}

export function ServicesPageClient ({
  services,
  settings,
  serviceFilterGroups,
}: ServicesPageClientProps) {
  const [activeSpecId, setActiveSpecId] = useState<number | "all">("all")

  const filtered = useMemo(() => {
    if (activeSpecId === "all") return services
    return services.filter((s) => s.specializationIds.includes(activeSpecId))
  }, [services, activeSpecId])

  return (
    <main>
      <section
        className="relative pt-28 lg:pt-36 pb-16 lg:pb-20 overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, #F6FAFF 0%, #EBF2FF 60%, #F6FAFF 100%)",
        }}
      >
        <div className="pointer-events-none absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full bg-accent/[0.04]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/10 text-accent text-sm font-medium rounded-full mb-5">
              <span className="w-2 h-2 rounded-full bg-accent" />
              Услуги
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground leading-tight text-balance">
              Медицинские услуги {settings.clinicName}
            </h1>
            <p className="text-base lg:text-lg text-muted-foreground leading-relaxed mt-5 max-w-xl mx-auto">
              Консультации, диагностика и лечение в одном месте. Актуальный перечень и стоимость — в таблице ниже. Фильтр по специализациям из каталога клиники.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 mb-10">
            <button
              type="button"
              onClick={() => setActiveSpecId("all")}
              className={cn(
                "px-5 py-2.5 text-sm font-medium rounded-full transition-all",
                activeSpecId === "all"
                  ? "bg-accent text-accent-foreground shadow-md shadow-accent/20"
                  : "bg-card text-muted-foreground border border-border hover:border-accent/30 hover:text-foreground"
              )}
            >
              Все услуги
            </button>
            {serviceFilterGroups.map((g) => (
              <button
                type="button"
                key={g.id}
                onClick={() => setActiveSpecId(g.id)}
                className={cn(
                  "px-5 py-2.5 text-sm font-medium rounded-full transition-all max-w-[220px] truncate",
                  activeSpecId === g.id
                    ? "bg-accent text-accent-foreground shadow-md shadow-accent/20"
                    : "bg-card text-muted-foreground border border-border hover:border-accent/30 hover:text-foreground"
                )}
                title={g.name}
              >
                {g.name}
              </button>
            ))}
          </div>

          <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-secondary border-b border-border">
              <div className="col-span-5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Услуга
              </div>
              <div className="col-span-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Специализации
              </div>
              <div className="col-span-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Длительность
              </div>
              <div className="col-span-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Цена
              </div>
              <div className="col-span-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">
                Действие
              </div>
            </div>

            <div className="divide-y divide-border">
              {filtered.map((row) => {
                const Icon = pickIcon(row.title.toLowerCase())
                return (
                  <div
                    key={row.id}
                    className="group grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 md:items-start items-center hover:bg-secondary/50 transition-colors"
                  >
                    <div className="col-span-1 md:col-span-5 flex items-center gap-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-accent transition-colors">
                        <Icon className="w-5 h-5 text-accent group-hover:text-accent-foreground transition-colors" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-foreground">
                          {row.title}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed mt-0.5 line-clamp-2">
                          {row.desc || "—"}
                        </p>
                      </div>
                    </div>

                    <div className="col-span-1 md:col-span-2 min-w-0">
                      <div className="flex flex-wrap content-start gap-1.5">
                        {row.specializationChips.length === 0 ? (
                          <span className="text-xs text-muted-foreground">—</span>
                        ) : (
                          row.specializationChips.map((chip) => (
                            <span
                              key={chip.id}
                              className="inline-flex w-fit max-w-full items-center rounded-full border border-accent/20 bg-accent/10 px-2.5 py-1 text-left text-xs font-medium leading-snug text-accent break-words"
                            >
                              {chip.name}
                            </span>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="col-span-1 md:col-span-2 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <span className="text-sm text-muted-foreground">
                        {row.durationLabel}
                      </span>
                    </div>

                    <div className="col-span-1 md:col-span-1">
                      <span className="text-lg font-extrabold text-foreground">
                        {row.priceLabel || "—"}
                      </span>
                    </div>

                    <div className="col-span-1 md:col-span-2 flex justify-start md:justify-end">
                      {settings.bookingUrl?.startsWith("http") ? (
                        <a
                          href={settings.bookingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent/10 text-accent text-xs font-semibold rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                          Записаться <ArrowRight className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <Link
                          href={settings.bookingUrl?.trim() || "/services"}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent/10 text-accent text-xs font-semibold rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                          Записаться <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              {activeSpecId === "all"
                ? "Услуги пока не загружены или список пуст."
                : "Нет услуг в выбранной специализации."}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div className="flex flex-col gap-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground leading-tight text-balance">
                Почему выбирают {settings.clinicName}
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                Современное оборудование, внимательные врачи и понятный процесс записи.
              </p>
              <div className="flex flex-col gap-4 mt-2">
                {[
                  "Современная диагностика и лечение",
                  "Сертифицированные специалисты",
                  "Индивидуальный план ведения",
                  "Поддержка и консультации",
                  "Удобная запись и прозрачные условия",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle className="w-3.5 h-3.5 text-accent" />
                    </div>
                    <span className="text-sm text-foreground leading-relaxed">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-xl shadow-accent/5">
              <Image
                src="/images/about-mission.jpg"
                alt="Клиника"
                width={600}
                height={450}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground text-balance">
              Как это работает
            </h2>
            <p className="text-base text-muted-foreground mt-3">
              Три простых шага до приёма
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Запись",
                desc: "Выберите услугу и удобное время через сайт или по телефону.",
                icon: Clock,
              },
              {
                step: "02",
                title: "Визит к врачу",
                desc: "Приходите на консультацию: диагностика и рекомендации на месте.",
                icon: Stethoscope,
              },
              {
                step: "03",
                title: "Лечение и наблюдение",
                desc: "План лечения и сопровождение командой клиники.",
                icon: CheckCircle,
              },
            ].map(({ step, title, desc, icon: Icon }) => (
              <div
                key={step}
                className="group flex flex-col items-center text-center gap-5 p-8 bg-card rounded-2xl border border-border hover:border-accent/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="relative">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center group-hover:bg-accent transition-colors">
                    <Icon className="w-7 h-7 text-accent group-hover:text-accent-foreground transition-colors" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center shadow-md">
                    {step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-primary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-primary-foreground text-balance">
            Нужна консультация?
          </h2>
          <p className="text-base text-primary-foreground/60 mt-4 max-w-lg mx-auto leading-relaxed">
            Позвоните нам или запишитесь онлайн — подскажем по услугам и врачам.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <Link
              href="/doctors"
              className="inline-flex items-center px-7 py-3.5 bg-accent text-accent-foreground text-sm font-semibold rounded-full hover:bg-accent/90 transition-colors shadow-lg shadow-accent/25"
            >
              Врачи
            </Link>
            <a
              href={`tel:${settings.phone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary-foreground/10 text-primary-foreground text-sm font-semibold rounded-full border border-primary-foreground/20"
            >
              <Phone className="w-4 h-4" />
              {settings.phone}
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
