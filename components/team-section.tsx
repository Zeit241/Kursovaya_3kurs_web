"use client"

import Image from "next/image"
import Link from "next/link"
import { CalendarPlus, ChevronLeft, ChevronRight } from "lucide-react"
import { useMemo, useState } from "react"
import type { MergedSiteSettings } from "@/lib/cms/types"
import { isDirectusProxiedImageSrc } from "@/lib/cms/images"

export type TeamDoctorVm = {
  id: number
  name: string
  specialty: string
  /** Full URL or static path */
  imageSrc: string | null
}

const STATIC_FALLBACK: TeamDoctorVm[] = [
  { id: -1, name: "Иванова А.", specialty: "Кардиолог", imageSrc: "/images/doctor-sophia.jpg" },
  { id: -2, name: "Петров С.", specialty: "Невролог", imageSrc: "/images/doctor-jana.jpg" },
  { id: -3, name: "Сидоров М.", specialty: "Ортопед", imageSrc: "/images/doctor-mike.jpg" },
]

const PAGE_SIZE = 3
const MAX_TEAM = 9

type TeamSectionProps = {
  doctors: TeamDoctorVm[]
  settings: Pick<MergedSiteSettings, "bookingUrl">
}

export function TeamSection ({ doctors, settings }: TeamSectionProps) {
  const list = useMemo(() => {
    const fromApi = doctors.slice(0, MAX_TEAM)
    return fromApi.length > 0 ? fromApi : STATIC_FALLBACK
  }, [doctors])

  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE))
  const [page, setPage] = useState(0)
  const pageIndex = totalPages > 0 ? page % totalPages : 0
  const visible = list.slice(
    pageIndex * PAGE_SIZE,
    pageIndex * PAGE_SIZE + PAGE_SIZE
  )

  const bookHref = settings.bookingUrl?.trim() || "/services"

  return (
    <section className="py-20 lg:py-28 bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-14">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-foreground text-balance">
              Команда специалистов
            </h2>
            <p className="text-base text-muted-foreground mt-2">
              Опытные врачи рядом с вами
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="w-11 h-11 rounded-full border border-border flex items-center justify-center hover:bg-secondary hover:border-accent/30 transition-colors disabled:opacity-40 disabled:pointer-events-none"
              aria-label="Предыдущая страница"
              disabled={totalPages <= 1}
              onClick={() => {
                setPage((p) => (p - 1 + totalPages) % totalPages)
              }}
            >
              <ChevronLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <button
              type="button"
              className="w-11 h-11 rounded-full border border-border flex items-center justify-center hover:bg-secondary hover:border-accent/30 transition-colors disabled:opacity-40 disabled:pointer-events-none"
              aria-label="Следующая страница"
              disabled={totalPages <= 1}
              onClick={() => {
                setPage((p) => (p + 1) % totalPages)
              }}
            >
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {visible.map((doctor) => (
            <div key={doctor.id} className="group flex flex-col gap-5">
              <div className="relative rounded-3xl overflow-hidden bg-secondary aspect-[3/4] shadow-lg shadow-accent/5">
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
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{doctor.name}</h3>
                    <p className="text-sm text-accent font-medium">{doctor.specialty}</p>
                  </div>
                </div>
                {bookHref.startsWith("http://") || bookHref.startsWith("https://") ? (
                  <a
                    href={bookHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent/90"
                  >
                    <CalendarPlus className="h-4 w-4 shrink-0" />
                    Записаться
                  </a>
                ) : (
                  <Link
                    href={bookHref}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent/90"
                  >
                    <CalendarPlus className="h-4 w-4 shrink-0" />
                    Записаться
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
