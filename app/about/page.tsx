import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Heart, Shield, Users, Award, Target, Eye } from "lucide-react"
import { getMergedSiteSettings } from "@/lib/cms/directus"

export async function generateMetadata (): Promise<Metadata> {
  const s = await getMergedSiteSettings()
  return {
    title: `О клинике — ${s.clinicName}`,
    description: s.metaDescriptionAbout,
  }
}

const DEFAULT_MISSION =
  "Обеспечивать доступную и качественную медицинскую помощь, уважая достоинство каждого пациента и стремясь к клиническому совершенству."

const DEFAULT_VISION =
  "Быть клиникой, которой доверяют: инновации, внимательный уход и предсказуемо высокий результат лечения."

export default async function AboutPage () {
  const settings = await getMergedSiteSettings()
  const missionText =
    settings.aboutMissionRich?.trim() || DEFAULT_MISSION
  const visionText = settings.aboutVisionRich?.trim() || DEFAULT_VISION

  return (
    <main>
      <section
        className="relative pt-28 lg:pt-36 pb-16 lg:pb-20 overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, #F6FAFF 0%, #EBF2FF 60%, #F6FAFF 100%)",
        }}
      >
        <div className="pointer-events-none absolute -top-32 -left-32 w-[400px] h-[400px] rounded-full bg-accent/[0.04]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/10 text-accent text-sm font-medium rounded-full mb-5">
              <span className="w-2 h-2 rounded-full bg-accent" />
              О клинике
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground leading-tight text-balance">
              Здоровье пациентов — наш главный приоритет
            </h1>
            <p className="text-base lg:text-lg text-muted-foreground leading-relaxed mt-5 max-w-xl mx-auto">
              В {settings.clinicName} мы создаём условия для спокойного лечения:
              опытные врачи, современное оборудование и внимание к деталям.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div className="rounded-3xl overflow-hidden shadow-xl shadow-accent/5">
              <Image
                src="/images/about-team.jpg"
                alt="Команда клиники"
                width={600}
                height={450}
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="flex flex-col gap-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground leading-tight text-balance">
                Много лет рядом с пациентами
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                Мы развиваемся вместе с медициной и запросами города: от
                консультаций до сложной диагностики — в рамках одной клиники{" "}
                {settings.clinicName}.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {[
                  { value: "20+", label: "Лет опыта" },
                  { value: "150K", label: "Пациентов" },
                  { value: "200+", label: "Врачей" },
                  { value: "96%", label: "Удовлетворённость" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="p-5 bg-secondary rounded-2xl border border-border/60"
                  >
                    <div className="text-3xl font-extrabold text-foreground">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[
              { icon: Target, title: "Миссия", text: missionText },
              { icon: Eye, title: "Видение", text: visionText },
            ].map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="flex flex-col gap-5 p-8 lg:p-10 bg-secondary rounded-3xl border border-border/60"
              >
                <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center">
                  <Icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-2xl font-extrabold text-foreground">
                  {title}
                </h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground text-balance">
              Ценности
            </h2>
            <p className="text-base text-muted-foreground mt-3">
              Принципы работы {settings.clinicName}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Heart,
                title: "Забота",
                desc: "Эмпатия и уважение в каждом контакте с пациентом.",
              },
              {
                icon: Award,
                title: "Качество",
                desc: "Стандарты лечения и постоянное профессиональное развитие.",
              },
              {
                icon: Shield,
                title: "Честность",
                desc: "Прозрачные рекомендации и открытое общение.",
              },
              {
                icon: Users,
                title: "Командность",
                desc: "Совместная работа врачей ради лучшего результата.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group flex flex-col gap-4 p-6 bg-card rounded-2xl border border-border hover:border-accent/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center group-hover:bg-accent transition-colors">
                  <Icon className="w-6 h-6 text-accent group-hover:text-accent-foreground transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="py-20 lg:py-28 bg-primary"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-primary-foreground text-balance">
            Свяжитесь с нами
          </h2>
          <p className="text-base text-primary-foreground/60 mt-4 max-w-lg mx-auto leading-relaxed">
            {settings.address}
          </p>
          <p className="text-sm text-primary-foreground/70 mt-2">
            <a
              href={`tel:${settings.phone.replace(/\s/g, "")}`}
              className="underline-offset-2 hover:underline"
            >
              {settings.phone}
            </a>
            {" · "}
            <a
              href={`mailto:${settings.email}`}
              className="underline-offset-2 hover:underline"
            >
              {settings.email}
            </a>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            {settings.bookingUrl?.startsWith("http") ? (
              <a
                href={settings.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-7 py-3.5 bg-accent text-accent-foreground text-sm font-semibold rounded-full hover:bg-accent/90 transition-colors shadow-lg shadow-accent/25"
              >
                Запись на приём
              </a>
            ) : (
              <Link
                href={settings.bookingUrl?.trim() || "/services"}
                className="inline-flex items-center px-7 py-3.5 bg-accent text-accent-foreground text-sm font-semibold rounded-full hover:bg-accent/90 transition-colors shadow-lg shadow-accent/25"
              >
                Запись на приём
              </Link>
            )}
            <Link
              href="/doctors"
              className="inline-flex items-center px-7 py-3.5 bg-primary-foreground/10 text-primary-foreground text-sm font-semibold rounded-full border border-primary-foreground/20 hover:bg-primary-foreground/20 transition-colors"
            >
              Наши врачи
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
