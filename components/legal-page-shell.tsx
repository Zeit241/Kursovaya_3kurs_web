import Link from "next/link"

type LegalPageShellProps = {
  title: string
  subtitle?: string
  children: React.ReactNode
}

/** Общая обёртка для юридических страниц (SEO, единый вид). */
export function LegalPageShell ({ title, subtitle, children }: LegalPageShellProps) {
  return (
    <main>
      <section
        className="relative pt-28 lg:pt-36 pb-10 lg:pb-14 overflow-hidden border-b border-border/60"
        style={{
          background:
            "linear-gradient(180deg, #F6FAFF 0%, #EBF2FF 60%, #F6FAFF 100%)",
        }}
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-muted-foreground mb-3">
            <Link href="/" className="text-accent hover:underline">
              Главная
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{title}</span>
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground text-balance">
            {title}
          </h1>
          {subtitle ? (
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{subtitle}</p>
          ) : null}
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16 max-w-none">
        <div className="text-foreground text-sm sm:text-base leading-relaxed space-y-8 [&_h2]:text-lg [&_h2]:sm:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:scroll-mt-24 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2 [&_p]:text-muted-foreground [&_strong]:text-foreground">
          {children}
        </div>
      </article>
    </main>
  )
}
