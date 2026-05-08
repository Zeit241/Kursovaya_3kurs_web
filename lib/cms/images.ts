import type { VSiteDoctorRow } from "@/lib/cms/types"

const DIRECTUS_FILE_UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function isAbsoluteHttpUrl (value: string): boolean {
  const v = value.trim()
  return v.startsWith("http://") || v.startsWith("https://")
}

/** URL для `<Image />`: тот же origin, токен подставляет /api/directus-asset. */
function proxiedAssetUrl (fileId: string): string {
  return `/api/directus-asset?id=${encodeURIComponent(fileId)}&format=webp`
}

function extractUuidFromAssetsPath (ref: string): string | null {
  const m = ref.match(
    /\/(?:assets|files)\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i
  )
  return m ? m[1] : null
}

/**
 * CMS-файл в приоритете; иначе operational_photo_ref (UUID или URL из БД).
 * UUID файлов отдаём через прокси — иначе браузер запрашивает Directus без токена (403).
 */
export function doctorPortraitSrc (
  doctor: Pick<VSiteDoctorRow, "cms_photo_file_id" | "operational_photo_ref">,
  directusPublicBaseUrl: string
): string | null {
  const base = directusPublicBaseUrl.replace(/\/$/, "")
  const cmsId = doctor.cms_photo_file_id?.trim()
  if (cmsId && DIRECTUS_FILE_UUID.test(cmsId)) {
    return proxiedAssetUrl(cmsId)
  }
  const ref = doctor.operational_photo_ref?.trim()
  if (!ref) return null
  if (isAbsoluteHttpUrl(ref)) return ref
  if (ref.startsWith("/assets/") || ref.startsWith("/files/")) {
    const embedded = extractUuidFromAssetsPath(ref)
    if (embedded) return proxiedAssetUrl(embedded)
    return ref.includes("?") ? `${base}${ref}` : `${base}${ref}?format=webp`
  }
  if (ref.startsWith("/") && !ref.startsWith("//")) {
    return ref
  }
  if (DIRECTUS_FILE_UUID.test(ref)) {
    return proxiedAssetUrl(ref)
  }
  return null
}

/** Для проверки в `<Image unoptimized={...} />` */
export function isDirectusProxiedImageSrc (src: string): boolean {
  return src.includes("/api/directus-asset") || src.includes("/assets/")
}

/** UUID файла из cms_site_settings → URL для `<Image />` через прокси. */
export function cmsFileAssetUrl (fileId: string | null | undefined): string | null {
  const id = fileId?.trim()
  if (!id) return null
  if (isAbsoluteHttpUrl(id)) return id
  if (DIRECTUS_FILE_UUID.test(id)) return proxiedAssetUrl(id)
  return null
}
