import { describe, expect, it } from "vitest"
import {
  buildServiceRows,
  specializationsUsedByServices,
} from "@/lib/cms/build-service-rows"
import type { VSiteServiceRow } from "@/lib/cms/types"

const sampleService = (
  overrides: Partial<VSiteServiceRow> = {}
): VSiteServiceRow => ({
  service_id: 1,
  title_display: "Консультация терапевта",
  description_display: "Первичный приём",
  operational_name: "Консультация терапевта",
  operational_price: 2500,
  duration_minutes: 45,
  specialization_ids: [10],
  specialization_chips: [{ id: 10, name: "Терапия" }],
  ...overrides,
})

describe("buildServiceRows", () => {
  it("maps title, description and chips from raw row", () => {
    const [row] = buildServiceRows([sampleService()])
    expect(row.title).toBe("Консультация терапевта")
    expect(row.desc).toBe("Первичный приём")
    expect(row.specializationChips).toEqual([{ id: 10, name: "Терапия" }])
  })

  it("falls back to operational_name when title_display is empty", () => {
    const [row] = buildServiceRows([
      sampleService({ title_display: "", operational_name: "УЗИ" }),
    ])
    expect(row.title).toBe("УЗИ")
  })

  it("uses default title when both names are blank", () => {
    const [row] = buildServiceRows([
      sampleService({
        service_id: 42,
        title_display: "  ",
        operational_name: "",
      }),
    ])
    expect(row.title).toBe("Услуга #42")
  })

  it("formats price in RUB", () => {
    const [numeric, text] = buildServiceRows([
      sampleService({ operational_price: 1500 }),
      sampleService({ service_id: 2, operational_price: "договорная" }),
    ])
    expect(numeric.priceLabel).toMatch(/1\s?500/)
    expect(numeric.priceLabel).toContain("₽")
    expect(text.priceLabel).toBe("договорная")
  })

  it("returns empty price label for missing price", () => {
    const [row] = buildServiceRows([
      sampleService({ operational_price: null }),
    ])
    expect(row.priceLabel).toBe("")
  })

  it("formats duration in minutes", () => {
    const [row] = buildServiceRows([sampleService({ duration_minutes: 30 })])
    expect(row.durationLabel).toBe("30 мин")
  })

  it('returns "Уточняется" for invalid duration', () => {
    const [row] = buildServiceRows([
      sampleService({ duration_minutes: 0 }),
    ])
    expect(row.durationLabel).toBe("Уточняется")
  })

  it("copies specialization ids", () => {
    const [row] = buildServiceRows([
      sampleService({ specialization_ids: [3, 7] }),
    ])
    expect(row.specializationIds).toEqual([3, 7])
  })
})

describe("specializationsUsedByServices", () => {
  const allSpecs = [
    { id: 1, name: "Хирургия" },
    { id: 2, name: "Терапия" },
    { id: 3, name: "Кардиология" },
  ]

  it("returns specs referenced by services", () => {
    const services = buildServiceRows([
      sampleService({ specialization_ids: [2] }),
      sampleService({
        service_id: 2,
        specialization_ids: [1, 3],
      }),
    ])
    const used = specializationsUsedByServices(allSpecs, services)
    expect(used.map((s) => s.id).sort()).toEqual([1, 2, 3])
  })

  it("returns empty list when no specialization is used", () => {
    const services = buildServiceRows([
      sampleService({ specialization_ids: [] }),
    ])
    expect(specializationsUsedByServices(allSpecs, services)).toEqual([])
  })
})
