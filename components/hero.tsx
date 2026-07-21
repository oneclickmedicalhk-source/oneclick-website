"use client"

import { ArrowRight, Sparkles } from "lucide-react"
import { PhoneMockup } from "@/components/phone-mockup"
import { useLanguage } from "@/components/language-provider"
import { handleAnchorClick } from "@/lib/scroll"

export function Hero() {
  const { t, lang, settings } = useLanguage()
  const appUrl = settings.appUrl

  const stats = [
    { label: t.hero.stat1, value: t.hero.stat1v },
    { label: t.hero.stat2, value: t.hero.stat2v },
    { label: t.hero.stat3, value: t.hero.stat3v },
  ]

  return (
    <section id="top" className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-secondary/70 via-background to-background"
        aria-hidden="true"
      />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
        <div className="flex flex-col items-start gap-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-3.5 py-1.5 text-sm font-medium text-brand">
            <Sparkles className="size-4" aria-hidden="true" />
            {t.hero.badge}
          </span>
          <h1 className="text-balance text-4xl font-black leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            <span className="text-brand">{t.hero.titleA}</span>
            {lang === "en" ? " " : ""}
            {t.hero.titleB}
          </h1>
          <p className="max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t.hero.desc}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={appUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand px-7 text-base font-semibold text-brand-foreground shadow-md transition-colors hover:bg-brand/90"
            >
              {t.hero.ctaPrimary}
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            <a
              href="#features"
              onClick={(e) => handleAnchorClick(e, "#features")}
              className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-background px-7 text-base font-semibold text-foreground transition-colors hover:border-brand hover:text-brand"
            >
              {t.hero.ctaSecondary}
            </a>
          </div>

          <dl className="mt-4 grid w-full max-w-lg grid-cols-3 gap-4 border-t border-border pt-6">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col gap-1">
                <dt className="text-xs text-muted-foreground">{s.label}</dt>
                <dd className="text-lg font-bold text-foreground">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <div
            className="absolute -inset-6 -z-10 rounded-[3rem] bg-brand/5 blur-2xl"
            aria-hidden="true"
          />
          <div className="relative flex items-end gap-4">
            <PhoneMockup
              src={settings.images.heroPrimary}
              alt={t.hero.badge}
              priority
              className="translate-y-6 scale-90 opacity-95 max-sm:hidden"
            />
            <PhoneMockup
              src={settings.images.heroSecondary}
              alt="AI 健康報告"
              priority
              className="z-10 shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
