import { afterAll, afterEach, beforeAll } from "vitest"
import { setupServer } from "msw/node"

export const directusBaseUrl = "http://directus.test"
export const mswServer = setupServer()

beforeAll(() => {
  process.env.NEXT_PUBLIC_DIRECTUS_URL = directusBaseUrl
  process.env.DIRECTUS_INTERNAL_URL = directusBaseUrl
  process.env.DIRECTUS_TOKEN = "test-token"
  mswServer.listen({ onUnhandledRequest: "error" })
})

afterEach(() => mswServer.resetHandlers())
afterAll(() => mswServer.close())
