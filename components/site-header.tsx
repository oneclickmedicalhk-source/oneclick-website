"use client"

import { useState } from "react"
import { Globe, Menu, X } from "lucide-react"
import { Logo } from "@/components/logo"
import { useLanguage } from "@/components/language-provider"
import { handleAnchorClick } from "@/lib/scroll"

export function SiteHeader() {
  const { t, lang, toggle, settings } = useLanguage()
  const [open, setOpen] = useState(false)
  const appUrl = settings.appUrl

  const links = [
    { href: "#features", label: t.nav.features },
    { href: "#how", label: t.nav.how },
    { href: "#enterprise", label: t.nav.enterprise },
    { href: "#shop", label: t.nav.shop },
    { href: "#about", label: t.nav.about },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a
          href="#top"
          aria-label={`${settings.brandNameZh} ${settings.brandNameEn}`}
          onClick={(e) => handleAnchorClick(e, "#top")}
        >
          <Logo logoUrl={settings.logoUrl} />
        </a>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => handleAnchorClick(e, l.href)}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-brand"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            className="flex h-11 items-center gap-1.5 rounded-full border border-border px-3 text-sm font-medium text-foreground transition-colors hover:border-brand hover:text-brand"
            aria-label="Switch language"
          >
            <Globe className="size-4" aria-hidden="true" />
            {lang === "zh" ? "EN" : "繁"}
          </button>
          <a
            href={appUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-11 items-center justify-center rounded-full bg-brand px-5 text-sm font-semibold text-brand-foreground shadow-sm transition-colors hover:bg-brand/90 sm:inline-flex"
          >
            {t.nav.openApp}
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex size-11 items-center justify-center rounded-lg text-foreground lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3" aria-label="Mobile">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => {
                  handleAnchorClick(e, l.href)
                  setOpen(false)
                }}
                className="rounded-lg px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-secondary"
              >
                {l.label}
              </a>
            ))}
            <a
              href={appUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex h-12 items-center justify-center rounded-full bg-brand px-5 text-base font-semibold text-brand-foreground"
            >
              {t.nav.openApp}
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
