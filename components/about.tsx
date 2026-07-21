"use client"

import { Heart, ShieldCheck, Cpu, ArrowRight } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

const icons = [Heart, ShieldCheck, Cpu]

export function About() {
  const { t, settings } = useLanguage()
  const appUrl = settings.appUrl

  return (
    <section id="about" className="scroll-mt-20 bg-secondary/50 py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-brand/20 bg-brand/5 px-3.5 py-1.5 text-sm font-medium text-brand">
            {t.about.badge}
          </span>
          <p className="mt-4 text-sm font-semibold tracking-wide text-muted-foreground">
            {t.about.company}
          </p>
          <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t.about.title}
          </h2>
          <p className="mt-5 text-pretty leading-relaxed text-muted-foreground sm:text-lg">
            {t.about.desc}
          </p>
          <div className="mt-7 flex justify-center">
            <a
              href={appUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand px-7 text-base font-semibold text-brand-foreground shadow-md transition-colors hover:bg-brand/90"
            >
              {t.about.cta}
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {t.about.values.map((v, i) => {
            const Icon = icons[i]
            return (
              <div
                key={v.t}
                className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-7 shadow-sm"
              >
                <span className="flex size-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <h3 className="text-lg font-bold text-foreground">{v.t}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{v.d}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
