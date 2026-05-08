import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { SiteShell } from "@/components/site-shell"

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: {
    default: "Медицинская клиника — забота о здоровье",
    template: "%s",
  },
  description:
    "Комплексная медицинская помощь: врачи, услуги и запись на приём.",
}

export default async function RootLayout ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className={`${plusJakartaSans.variable} font-sans antialiased`}>
        <SiteShell>{children}</SiteShell>
        <Analytics />
      </body>
    </html>
  )
}
