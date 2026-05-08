import Image from "next/image"
import { Phone, Smile } from "lucide-react"
import type { HomeFeatureBlock, HomeStatBlock, VSiteReviewRow } from "@/lib/cms/types"

type FeaturesSectionProps = {
  reviews?: VSiteReviewRow[]
  featureBlocks: HomeFeatureBlock[]
  statBlocks: HomeStatBlock[]
}

export function FeaturesSection ({
  reviews = [],
  featureBlocks,
  statBlocks,
}: FeaturesSectionProps) {
  const stat0 = statBlocks[0] ?? { value: "—", label: "" }
  const stat1 = statBlocks[1] ?? { value: "—", label: "" }

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-xl shadow-accent/5">
              <Image
                src="/images/doctor-features.jpg"
                alt="Врач"
                width={560}
                height={640}
                className="w-full h-auto object-cover max-h-[520px]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-10">
            {featureBlocks.map(({ title, desc }, i) => (
              <div key={`${title}-${i}`} className="flex gap-5">
                <div className="w-1 rounded-full shrink-0 bg-accent/20" style={{ background: i === 0 ? "var(--accent)" : undefined }} />
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-bold text-foreground">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}

            <div className="flex items-center gap-10 p-6 bg-card rounded-2xl border border-border shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <span className="text-2xl font-extrabold text-foreground">{stat0.value}</span>
                  <p className="text-xs text-muted-foreground">{stat0.label}</p>
                </div>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                  <Smile className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <span className="text-2xl font-extrabold text-foreground">{stat1.value}</span>
                  <p className="text-xs text-muted-foreground">{stat1.label}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {reviews.length > 0 ? (
          <div className="mt-14 lg:mt-20 pt-10 border-t border-border/60">
            <h3 className="text-xl font-bold text-foreground mb-6">Отзывы пациентов</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((r) => (
                <blockquote
                  key={r.review_id}
                  className="rounded-2xl border border-border/60 bg-card/60 p-5 shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-accent font-semibold">{r.rating ?? "—"}/5</span>
                    <span className="text-sm text-muted-foreground">
                      {r.doctor_display_name ? `— ${r.doctor_display_name}` : ""}
                    </span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    {r.review_text || "—"}
                  </p>
                  <footer className="mt-3 text-xs text-muted-foreground">
                    — {r.patient_display_name || "Пациент"}
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
