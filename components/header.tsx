"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

function BookingCta ({
  bookingUrl,
  className,
  onNavigate,
}: {
  bookingUrl: string
  className: string
  onNavigate?: () => void
}) {
  const href = bookingUrl?.trim() || "/services"
  if (href.startsWith("http://") || href.startsWith("https://")) {
    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onNavigate}
      >
        Запись на приём
      </a>
    )
  }
  return (
    <Link href={href} className={className} onClick={onNavigate}>
      Запись на приём
    </Link>
  )
}

type HeaderProps = {
  clinicName?: string
  bookingUrl?: string
  /** Подписи из Directus (cms_site_settings), по умолчанию русский текст */
  navLabelAbout?: string
  navLabelServices?: string
  navLabelDoctors?: string
}

export function Header ({
  clinicName = "Клиника",
  bookingUrl = "/services",
  navLabelAbout = "О клинике",
  navLabelServices = "Услуги",
  navLabelDoctors = "Врачи",
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { href: "/about", label: navLabelAbout },
    { href: "/services", label: navLabelServices },
    { href: "/doctors", label: navLabelDoctors },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 lg:h-20">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 3v12M3 9h12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">{clinicName}</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-full transition-colors",
                  pathname === link.href
                    ? "bg-accent/10 text-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:block">
            <BookingCta
              bookingUrl={bookingUrl}
              className="inline-flex items-center px-6 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-full hover:bg-primary/90 transition-colors"
            />
          </div>

          <button
            type="button"
            className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-card border-t border-border/60 shadow-lg">
          <div className="px-4 py-5 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2.5 text-sm font-medium rounded-xl transition-colors",
                  pathname === link.href
                    ? "bg-accent/10 text-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 pt-3 border-t border-border/60">
              <BookingCta
                bookingUrl={bookingUrl}
                className="flex items-center justify-center px-6 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-full hover:bg-primary/90 transition-colors"
                onNavigate={() => setMobileMenuOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
