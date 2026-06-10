import type { VSiteServiceRow } from "@/lib/cms/types"

export type ServiceSpecializationChipVm = {
  id: number
  name: string
}

export type ServiceRowVm = {
  id: number
  title: string
  desc: string | null
  priceLabel: string
  durationLabel: string
  specializationIds: number[]
  specializationChips: ServiceSpecializationChipVm[]
}

export function buildServiceRows (raw: VSiteServiceRow[]): ServiceRowVm[] {
  return raw.map((s) => {
    const title = String(s.title_display || s.operational_name || "").trim()
    const chips = [...(s.specialization_chips ?? [])]
    return {
      id: s.service_id,
      title: title || `Услуга #${s.service_id}`,
      desc: s.description_display ?? null,
      priceLabel: formatPriceRu(s.operational_price),
      durationLabel: formatDurationRu(s.duration_minutes),
      specializationIds: [...(s.specialization_ids ?? [])],
      specializationChips: chips,
    }
  })
}

/** Специализации, по которым есть хотя бы одна услуга на лендинге — для кнопок фильтра. */
export function specializationsUsedByServices (
  allSpecs: { id: number; name: string }[],
  services: ServiceRowVm[]
): { id: number; name: string }[] {
  const used = new Set(services.flatMap((s) => s.specializationIds))
  if (used.size === 0) return []
  const byId = new Map(allSpecs.map((s) => [s.id, s]))
  return [...used]
    .map((id) => byId.get(id))
    .filter((s): s is { id: number; name: string } => !!s)
    .sort((a, b) => a.name.localeCompare(b.name, "ru"))
}

function formatPriceRu (p: string | number | null | undefined): string {
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

function formatDurationRu (minutes: number | null | undefined): string {
  if (minutes == null || !Number.isFinite(minutes) || minutes <= 0) {
    return "Уточняется"
  }
  return `${minutes} мин`
}
