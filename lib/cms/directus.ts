/**
 * Чтение лендинга только через Directus REST.
 * Коллекции: операционные таблицы (doctors, services, reviews, …) и cms_site_settings.
 * Запись в основные таблицы — из админки Directus (права роли на create/update/delete).
 */
import { createDirectus, readItems, rest, staticToken } from "@directus/sdk"
import { unstable_cache } from "next/cache"
import { cache } from "react"
import {
  mapDoctorRow,
  mapReviewRow,
  mergeSiteSettings,
} from "@/lib/cms/merge-settings"
import type {
  CmsSiteSettingsRow,
  MergedSiteSettings,
  VSiteDoctorRow,
  VSiteReviewRow,
  VSiteServiceRow,
} from "@/lib/cms/types"

function directusPublicUrl (): string {
  return (
    process.env.NEXT_PUBLIC_DIRECTUS_URL?.replace(/\/$/, "") ||
    "http://localhost:8055"
  )
}

function directusServerUrl (): string {
  return (
    process.env.DIRECTUS_INTERNAL_URL?.replace(/\/$/, "") ||
    directusPublicUrl()
  )
}

function directusToken (): string {
  return process.env.DIRECTUS_TOKEN?.trim() || ""
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = Record<string, any>

function getClient () {
  const url = directusServerUrl()
  const token = directusToken()
  const base = createDirectus<Any>(url).with(rest())
  return token ? base.with(staticToken(token)) : base
}

function warnDevDirectus (label: string, err: unknown) {
  if (process.env.NODE_ENV !== "development") return
  const e = err as { errors?: { message?: string }[]; message?: string }
  console.warn(
    `[Directus / ${label}]`,
    e?.errors?.[0]?.message || e?.message || String(err),
    "— DIRECTUS_TOKEN, коллекции и права роли в Directus."
  )
}

async function readSiteSettingsRow (): Promise<CmsSiteSettingsRow | null> {
  try {
    const client = getClient()
    const rows = await client.request(
      readItems("cms_site_settings" as never, {
        filter: { id: { _eq: 1 } },
        limit: 1,
      } as Any)
    )
    return ((rows as CmsSiteSettingsRow[]) ?? [])[0] ?? null
  } catch (e) {
    warnDevDirectus("cms_site_settings", e)
    return null
  }
}

export const getMergedSiteSettings = unstable_cache(
  async (): Promise<MergedSiteSettings> =>
    mergeSiteSettings(await readSiteSettingsRow()),
  ["cms-site-settings"],
  { revalidate: 60 }
)

async function loadSpecialtyMap (
  client: ReturnType<typeof getClient>,
  doctorIds: number[]
): Promise<Map<number, string>> {
  const map = new Map<number, string[]>()
  if (doctorIds.length === 0) return new Map()
  try {
    const rows = await client.request(
      readItems("doctor_specializations" as never, {
        filter: { doctor_id: { _in: doctorIds } },
        fields: ["doctor_id", { specialization_id: ["name"] }],
        limit: 500,
      } as Any)
    ) as Any[]
    for (const row of rows ?? []) {
      const did = Number(row.doctor_id)
      const name =
        row.specialization_id?.name ??
        row.specialization_id?.[0]?.name ??
        ""
      if (!Number.isFinite(did) || !name) continue
      const arr = map.get(did) ?? []
      arr.push(String(name))
      map.set(did, arr)
    }
  } catch (e) {
    warnDevDirectus("doctor_specializations", e)
  }
  const joined = new Map<number, string>()
  for (const [id, names] of map) {
    joined.set(id, [...new Set(names)].sort().join(", "))
  }
  return joined
}

async function fetchLandingDoctors (): Promise<VSiteDoctorRow[]> {
  try {
    const client = getClient()
    const raw = (await client.request(
      readItems("doctors" as never, {
        filter: {
          _or: [{ hide: { _eq: false } }, { hide: { _null: true } }],
        },
        fields: [
          "id",
          "bio",
          "hide",
          "experience_years",
          "photo",
          { user_id: ["first_name", "last_name", "middle_name"] },
        ],
        sort: ["id"],
        limit: 80,
      } as Any)
    )) as Any[]

    const ids = (raw ?? []).map((d) => Number(d.id)).filter(Number.isFinite)
    const specMap = await loadSpecialtyMap(client, ids)

    return (raw ?? []).map((d: Any) => mapDoctorRow(d, specMap))
  } catch (e) {
    warnDevDirectus("doctors", e)
    return []
  }
}

type ServiceSpecIndex = {
  labels: Map<number, string>
  specIdsByService: Map<number, number[]>
  chipsByService: Map<number, { id: number; name: string }[]>
}

async function loadServiceSpecializationIndex (
  client: ReturnType<typeof getClient>,
  serviceIds: number[]
): Promise<ServiceSpecIndex> {
  const nameLists = new Map<number, string[]>()
  const idLists = new Map<number, number[]>()
  const chipMaps = new Map<number, Map<number, string>>()
  if (serviceIds.length === 0) {
    return {
      labels: new Map(),
      specIdsByService: new Map(),
      chipsByService: new Map(),
    }
  }
  try {
    const rows = (await client.request(
      readItems("specialization_services" as never, {
        filter: {
          _and: [
            { service_id: { _in: serviceIds } },
            { is_active: { _eq: true } },
          ],
        },
        fields: ["service_id", { specialization_id: ["id", "name"] }],
        limit: 500,
      } as Any)
    )) as Any[]
    for (const row of rows ?? []) {
      const sid = Number(row.service_id)
      if (!Number.isFinite(sid)) continue
      const spec = row.specialization_id
      const cell = Array.isArray(spec) ? spec[0] : spec
      if (!cell || typeof cell !== "object") continue
      const specId = Number((cell as Any).id)
      const name = String((cell as Any).name ?? "").trim()
      if (!Number.isFinite(specId)) continue
      if (name) {
        const arr = nameLists.get(sid) ?? []
        arr.push(name)
        nameLists.set(sid, arr)
      }
      const ids = idLists.get(sid) ?? []
      ids.push(specId)
      idLists.set(sid, ids)

      const label =
        name || (Number.isFinite(specId) ? `Специализация ${specId}` : "")
      if (label) {
        const cmap = chipMaps.get(sid) ?? new Map<number, string>()
        if (!cmap.has(specId)) cmap.set(specId, label)
        chipMaps.set(sid, cmap)
      }
    }
  } catch (e) {
    warnDevDirectus("specialization_services", e)
  }
  const labels = new Map<number, string>()
  for (const [id, names] of nameLists) {
    labels.set(id, [...new Set(names)].sort().join(", "))
  }
  const specIdsByService = new Map<number, number[]>()
  for (const [id, arr] of idLists) {
    specIdsByService.set(id, [...new Set(arr)])
  }
  const chipsByService = new Map<number, { id: number; name: string }[]>()
  for (const [sid, cmap] of chipMaps) {
    const chips = [...cmap.entries()]
      .map(([specId, label]) => ({ id: specId, name: label }))
      .sort((a, b) => a.name.localeCompare(b.name, "ru"))
    chipsByService.set(sid, chips)
  }
  return { labels, specIdsByService, chipsByService }
}

async function fetchLandingServices (): Promise<VSiteServiceRow[]> {
  try {
    const client = getClient()
    const raw = (await client.request(
      readItems("services" as never, {
        fields: [
          "id",
          "name",
          "description",
          "price",
          "duration_minutes",
          "code",
        ],
        sort: ["name"],
        limit: 100,
      } as Any)
    )) as Any[]

    const ids = (raw ?? []).map((s) => Number(s.id)).filter(Number.isFinite)
    const specIdx = await loadServiceSpecializationIndex(client, ids)

    return (raw ?? []).map((s: Any) => {
      const id = Number(s.id)
      return {
        service_id: id,
        title_display: s.name ?? "",
        description_display: s.description ?? null,
        operational_name: s.name ?? "",
        operational_price: s.price ?? null,
        duration_minutes: s.duration_minutes ?? null,
        operational_code: s.code ?? null,
        category_display: specIdx.labels.get(id) ?? "",
        specialization_ids: specIdx.specIdsByService.get(id) ?? [],
        specialization_chips: specIdx.chipsByService.get(id) ?? [],
        show_operational_price: true,
        published_on_site: true,
        sort_order: id,
        hidden_from_landing: false,
      }
    })
  } catch (e) {
    warnDevDirectus("services", e)
    return []
  }
}

export const getLandingDoctors = cache(fetchLandingDoctors)
export const getLandingServices = cache(fetchLandingServices)

export type LandingSpecialization = {
  id: number
  name: string
  code?: string
}

async function fetchLandingSpecializations (): Promise<LandingSpecialization[]> {
  try {
    const client = getClient()
    const raw = (await client.request(
      readItems("specializations" as never, {
        fields: ["id", "name", "code"],
        sort: ["name"],
        limit: 500,
      } as Any)
    )) as Any[]
    return (raw ?? [])
      .map((r: Any) => {
        const id = Number(r.id)
        const name = String(r.name ?? "").trim()
        const code = r.code != null ? String(r.code).trim() : ""
        return {
          id,
          name: name || `Специализация ${id}`,
          code: code || undefined,
        }
      })
      .filter((r) => Number.isFinite(r.id))
  } catch (e) {
    warnDevDirectus("specializations", e)
    return []
  }
}

export const getLandingSpecializations = cache(fetchLandingSpecializations)

export async function getLandingReviews (
  limit = 6
): Promise<VSiteReviewRow[]> {
  try {
    const client = getClient()
    const raw = (await client.request(
      readItems("reviews" as never, {
        sort: ["-created_at"],
        limit,
        fields: [
          "id",
          "rating",
          "review_text",
          "created_at",
          {
            doctor_id: [
              "id",
              { user_id: ["first_name", "last_name", "middle_name"] },
            ],
          },
          {
            patient_id: [
              "id",
              { user_id: ["first_name", "last_name", "middle_name"] },
            ],
          },
        ],
      } as Any)
    )) as Any[]

    return (raw ?? []).map((r: Any) => mapReviewRow(r))
  } catch (e) {
    warnDevDirectus("reviews", e)
    return []
  }
}

export { directusPublicUrl }
