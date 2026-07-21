"use client"

import { Apple, Play, ArrowRight } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

export function DownloadCta() {
  const { t, settings } = useLanguage()
  const appUrl = settings.appUrl
  const appStoreUrl = settings.appStoreUrl || appUrl
  const playStoreUrl = settings.playStoreUrl || appUrl

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-7 rounded-3xl border border-border bg-card px-6 py-14 text-center shadow-sm sm:px-12">
          <h2 className="max-w-2xl text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t.download.title}
          </h2>
          <p className="max-w-xl text-pretty leading-relaxed text-muted-foreground sm:text-lg">
            {t.download.desc}
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <a
              href={appUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand px-7 text-base font-semibold text-brand-foreground shadow-md transition-colors hover:bg-brand/90"
            >
              {t.download.cta}
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            <div className="flex gap-3">
              <a
                href={appStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-semibold text-foreground transition-colors hover:border-brand hover:text-brand"
                aria-label="App Store"
              >
                <Apple className="size-5" aria-hidden="true" />
                App Store
              </a>
              <a
                href={playStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-semibold text-foreground transition-colors hover:border-brand hover:text-brand"
                aria-label="Google Play"
              >
                <Play className="size-5" aria-hidden="true" />
                Google Play
              </a>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{t.download.note}</p>
        </div>
      </div>
    </section>
  )
}
