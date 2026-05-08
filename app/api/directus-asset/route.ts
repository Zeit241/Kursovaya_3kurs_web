import { NextRequest, NextResponse } from "next/server"

const FILE_UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function directusBase (): string {
  return (
    process.env.DIRECTUS_INTERNAL_URL?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_DIRECTUS_URL?.replace(/\/$/, "") ||
    ""
  )
}

function directusToken (): string {
  return process.env.DIRECTUS_TOKEN?.trim() || ""
}

/**
 * Прокси файлов Directus: браузер не может передать Authorization на другой origin.
 * GET /api/directus-asset?id=<uuid>&format=webp
 */
export async function GET (req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id")?.trim() ?? ""
  if (!id || !FILE_UUID.test(id)) {
    return new NextResponse("Invalid id", { status: 400 })
  }

  const base = directusBase()
  if (!base) {
    return new NextResponse("Directus URL not configured", { status: 503 })
  }

  const format = req.nextUrl.searchParams.get("format")
  const upstream = new URL(`${base}/assets/${id}`)
  if (format) upstream.searchParams.set("format", format)

  const token = directusToken()
  const headers: HeadersInit = {}
  if (token) headers.Authorization = `Bearer ${token}`

  let res: Response
  try {
    res = await fetch(upstream.toString(), {
      headers,
      next: { revalidate: 300 },
    })
  } catch {
    return new NextResponse("Upstream error", { status: 502 })
  }

  if (!res.ok) {
    return new NextResponse(res.statusText || "Not found", {
      status: res.status === 401 || res.status === 403 ? 502 : res.status,
    })
  }

  const contentType =
    res.headers.get("content-type") || "application/octet-stream"

  if (!res.body) {
    const buf = new Uint8Array(await res.arrayBuffer())
    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=300, s-maxage=300",
      },
    })
  }

  return new NextResponse(res.body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  })
}
