import { describe, expect, it } from "vitest"
import {
  cmsFileAssetUrl,
  doctorPortraitSrc,
  isDirectusProxiedImageSrc,
} from "@/lib/cms/images"

const BASE = "http://directus.test"
const UUID = "12345678-1234-1234-1234-123456789abc"

describe("doctorPortraitSrc", () => {
  it("returns proxied URL for cms_photo_file_id UUID", () => {
    const src = doctorPortraitSrc(
      { cms_photo_file_id: UUID, operational_photo_ref: null },
      BASE
    )
    expect(src).toBe(
      `/api/directus-asset?id=${encodeURIComponent(UUID)}&format=webp`
    )
  })

  it("handles absolute, assets and local operational refs", () => {
    const absolute = doctorPortraitSrc(
      { cms_photo_file_id: null, operational_photo_ref: "https://cdn.example/photo.jpg" },
      BASE
    )
    const assets = doctorPortraitSrc(
      {
        cms_photo_file_id: null,
        operational_photo_ref: `/assets/${UUID}`,
      },
      BASE
    )
    const assetsWithoutUuid = doctorPortraitSrc(
      { cms_photo_file_id: null, operational_photo_ref: "/assets/photo.jpg?size=large" },
      BASE
    )
    const local = doctorPortraitSrc(
      { cms_photo_file_id: null, operational_photo_ref: "/images/local.jpg" },
      BASE
    )
    const unknown = doctorPortraitSrc(
      { cms_photo_file_id: null, operational_photo_ref: "not-valid" },
      BASE
    )
    expect(absolute).toBe("https://cdn.example/photo.jpg")
    expect(assets).toContain("/api/directus-asset")
    expect(assetsWithoutUuid).toBe(`${BASE}/assets/photo.jpg?size=large`)
    expect(local).toBe("/images/local.jpg")
    expect(unknown).toBeNull()
  })
})

describe("cmsFileAssetUrl", () => {
  it("resolves UUID, absolute URL and invalid values", () => {
    expect(cmsFileAssetUrl(UUID)).toContain("/api/directus-asset")
    expect(cmsFileAssetUrl("https://cdn.example/hero.webp")).toBe(
      "https://cdn.example/hero.webp"
    )
    expect(cmsFileAssetUrl("not-a-uuid")).toBeNull()
  })
})

describe("isDirectusProxiedImageSrc", () => {
  it("detects proxied asset paths", () => {
    expect(isDirectusProxiedImageSrc("/api/directus-asset?id=x")).toBe(true)
    expect(isDirectusProxiedImageSrc("/assets/file")).toBe(true)
    expect(isDirectusProxiedImageSrc("/images/local.jpg")).toBe(false)
  })
})
