/** @jsxImportSource react */
import { renderToStaticMarkup } from "react-dom/server"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { registerDirectusHandlers } from "@/lib/cms/test-helpers/directus-handlers"

vi.mock("next/cache", () => ({
  unstable_cache: <T extends (...args: never[]) => unknown>(fn: T) => fn,
}))

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react")
  return {
    ...actual,
    cache: <T extends (...args: never[]) => unknown>(fn: T) => fn,
  }
})

vi.mock("next/image", () => ({
  default: function MockImage ({
    alt,
    src,
  }: {
    alt?: string
    src: string
  }) {
    return <img alt={alt ?? ""} src={src} />
  },
}))

vi.mock("next/link", () => ({
  default: function MockLink ({
    href,
    children,
    className,
  }: {
    href: string
    children: React.ReactNode
    className?: string
  }) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    )
  },
}))

describe("Home SSR integration", () => {
  beforeEach(() => {
    vi.resetModules()
    registerDirectusHandlers()
  })

  it("renders clinic name from Directus settings", async () => {
    const Home = (await import("@/app/page")).default
    const html = renderToStaticMarkup(await Home())
    expect(html).toContain("Клиника MSW")
  })

  it("renders hero title from CMS", async () => {
    const Home = (await import("@/app/page")).default
    const html = renderToStaticMarkup(await Home())
    expect(html).toContain("Тестовый заголовок")
  })

  it("renders doctor name from Directus doctors collection", async () => {
    const Home = (await import("@/app/page")).default
    const html = renderToStaticMarkup(await Home())
    expect(html).toContain("Иванова Мария")
  })

  it("renders service name from Directus services collection", async () => {
    const Home = (await import("@/app/page")).default
    const html = renderToStaticMarkup(await Home())
    expect(html).toContain("Приём терапевта")
  })

  it("renders review text from Directus reviews", async () => {
    const Home = (await import("@/app/page")).default
    const html = renderToStaticMarkup(await Home())
    expect(html).toContain("Всё понравилось")
  })

  it("uses proxied hero image URL for CMS section photo", async () => {
    const Home = (await import("@/app/page")).default
    const html = renderToStaticMarkup(await Home())
    expect(html).toContain("/api/directus-asset")
    expect(html).toContain("11111111-2222-3333-4444-555555555555")
    expect(html).toContain("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")
  })

  it("generateMetadata exposes clinic name as page title", async () => {
    const { generateMetadata } = await import("@/app/page")
    const meta = await generateMetadata()
    expect(meta.title).toBe("Клиника MSW")
  })

  it("generateMetadata includes hero subtitle in description", async () => {
    const { generateMetadata } = await import("@/app/page")
    const meta = await generateMetadata()
    expect(String(meta.description)).toContain("Тестовый подзаголовок")
  })
})
