"use client"

import Image from "next/image"
import Link from "next/link"
import { useMemo, useState } from "react"
import { Search, ChevronDown, ArrowUpDown, CalendarPlus } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MergedSiteSettings } from "@/lib/cms/types"
import { isDirectusProxiedImageSrc } from "@/lib/cms/images"

export type DoctorCardVm = {
  id: number
  name: string
  specialty: string
  experienceYears: number | null
  bio: string | null
  imageSrc: string | null
}

type SortKey = "name" | "experience"
type SortDir = "asc" | "desc"

const sortOptions: { key: SortKey; label: string }[] = [
  { key: "name", label: "По имени" },
  { key: "experience", label: "По стажу" },
]

type DoctorsPageClientProps = {
  doctors: DoctorCardVm[]
  settings: MergedSiteSettings
}

export function DoctorsPageClient ({ doctors, settings }: DoctorsPageClientProps) {
  const [search, setSearch] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("name")
  const [sortDir, setSortDir] = useState<SortDir>("asc")
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false)

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir(key === "experience" ? "desc" : "asc")
    }
    setSortDropdownOpen(false)
  }

  const filteredAndSorted = useMemo(() => {
    let result = doctors

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.specialty.toLowerCase().includes(q)
      )
    }

    result = [...result].sort((a, b) => {
      let cmp = 0
      if (sortKey === "name") cmp = a.name.localeCompare(b.name, "ru")
      else if (sortKey === "experience") {
        const ya = a.experienceYears ?? -1
        const yb = b.experienceYears ?? -1
        cmp = ya - yb
      }
      return sortDir === "asc" ? cmp : -cmp
    })

    return result
  }, [doctors, search, sortKey, sortDir])

  return (
    <main>
      <section
        className="relative pt-28 lg:pt-36 pb-16 lg:pb-20 overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, #F6FAFF 0%, #EBF2FF 60%, #F6FAFF 100%)",
        }}
      >
        <div className="pointer-events-none absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full bg-accent/[0.04]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/10 text-accent text-sm font-medium rounded-full mb-5">
              <span className="w-2 h-2 rounded-full bg-accent" />
              Наши врачи
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground leading-tight text-balance">
              Команда квалифицированных специалистов
            </h1>
            <p className="text-base lg:text-lg text-muted-foreground leading-relaxed mt-5 max-w-xl mx-auto">
              Врачи {settings.clinicName}: опыт, специализации и индивидуальный подход к каждому пациенту.
            </p>
          </div>
        </div>
      </section>

      <section className="py-10 lg:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Поиск по имени или специализации..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-card text-foreground text-sm rounded-full border border-border placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
              />
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                className="inline-flex items-center gap-2 px-5 py-3 bg-card text-sm font-medium text-foreground rounded-full border border-border hover:border-accent/30 transition-colors"
              >
                <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                Сортировка: {sortOptions.find((o) => o.key === sortKey)?.label}
                <span className="text-xs text-muted-foreground">
                  (
                  {sortDir === "asc"
                    ? sortKey === "name"
                      ? "А-Я"
                      : "по возрастанию"
                    : sortKey === "name"
                      ? "Я-А"
                      : "по убыванию"}
                  )
                </span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-muted-foreground transition-transform",
                    sortDropdownOpen && "rotate-180"
                  )}
                />
              </button>
              {sortDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-card rounded-xl border border-border shadow-xl z-10 overflow-hidden">
                  {sortOptions.map((opt) => (
                    <button
                      type="button"
                      key={opt.key}
                      onClick={() => toggleSort(opt.key)}
                      className={cn(
                        "w-full px-4 py-3 text-sm text-left hover:bg-secondary transition-colors flex items-center justify-between",
                        sortKey === opt.key
                          ? "text-accent font-semibold bg-accent/5"
                          : "text-foreground"
                      )}
                    >
                      {opt.label}
                      {sortKey === opt.key && (
                        <span className="text-xs text-accent">
                          {sortDir === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            Показано {filteredAndSorted.length} из {doctors.length} врачей
            {search.trim() && (
              <span>
                {" "}
                по запросу &quot;{search}&quot;
              </span>
            )}
          </p>
        </div>
      </section>

      <section className="pb-20 lg:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {filteredAndSorted.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredAndSorted.map((doctor) => (
                <div
                  key={doctor.id}
                  className="group flex flex-col bg-card rounded-2xl border border-border overflow-hidden hover:border-accent/30 hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
                    {doctor.imageSrc ? (
                      <Image
                        src={doctor.imageSrc}
                        alt={doctor.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized={
                          doctor.imageSrc.startsWith("data:") ||
                          isDirectusProxiedImageSrc(doctor.imageSrc)
                        }
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground text-4xl font-bold">
                        {doctor.name.slice(0, 1)}
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex flex-col gap-3 flex-1">
                    <div>
                      <h3 className="text-base font-bold text-foreground">
                        {doctor.name}
                      </h3>
                      <p className="text-sm text-accent font-medium">
                        {doctor.specialty}
                      </p>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {doctor.bio?.trim() ||
                        "Подробная информация уточняется на приёме."}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {doctor.experienceYears != null && (
                        <>
                          <span>Стаж: {doctor.experienceYears} лет</span>
                        </>
                      )}
                    </div>

                    <div className="pt-3 mt-auto border-t border-border">
                      {settings.bookingUrl?.startsWith("http") ? (
                        <a
                          href={settings.bookingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent/90"
                        >
                          <CalendarPlus className="h-4 w-4 shrink-0" />
                          Записаться
                        </a>
                      ) : (
                        <Link
                          href={settings.bookingUrl?.trim() || "/services"}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent/90"
                        >
                          <CalendarPlus className="h-4 w-4 shrink-0" />
                          Записаться
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                <Search className="w-7 h-7 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                Врачи не найдены
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Измените запрос поиска
              </p>
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-4 px-5 py-2 bg-accent text-accent-foreground text-sm font-semibold rounded-full hover:bg-accent/90 transition-colors"
              >
                Сбросить поиск
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div className="flex flex-col gap-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground leading-tight text-balance">
                Присоединяйтесь к нашей команде
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                Мы открыты для сильных специалистов, ориентированных на пациента и качество медицинской помощи.
              </p>
              <div className="flex flex-wrap gap-3 mt-2">
                {[
                  "Конкурентная оплата",
                  "Медицинское страхование",
                  "Развитие и обучение",
                  "Баланс работы и личной жизни",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 bg-secondary text-sm font-medium text-foreground rounded-full border border-border/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                href="/about#contact"
                className="inline-flex items-center self-start px-7 py-3.5 bg-primary text-primary-foreground text-sm font-semibold rounded-full hover:bg-primary/90 transition-colors mt-2"
              >
                Связаться с нами
              </Link>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-xl shadow-accent/5">
              <Image
                src="/images/about-team.jpg"
                alt="Медицинская команда"
                width={600}
                height={450}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-primary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-primary-foreground text-balance">
            Записаться на приём
          </h2>
          <p className="text-base text-primary-foreground/60 mt-4 max-w-lg mx-auto leading-relaxed">
            Выберите услугу и удобное время. Мы на связи по телефону {settings.phone}.
          </p>
          {settings.bookingUrl?.startsWith("http") ? (
            <a
              href={settings.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-7 py-3.5 bg-accent text-accent-foreground text-sm font-semibold rounded-full hover:bg-accent/90 transition-colors shadow-lg shadow-accent/25 mt-8"
            >
              Услуги и запись
            </a>
          ) : (
            <Link
              href={settings.bookingUrl?.trim() || "/services"}
              className="inline-flex items-center px-7 py-3.5 bg-accent text-accent-foreground text-sm font-semibold rounded-full hover:bg-accent/90 transition-colors shadow-lg shadow-accent/25 mt-8"
            >
              Услуги и запись
            </Link>
          )}
        </div>
      </section>
    </main>
  )
}
