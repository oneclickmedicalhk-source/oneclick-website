"use client"

import { ClipboardList, Sparkles, CalendarCheck, TrendingUp, ArrowRight } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

const icons = [ClipboardList, Sparkles, CalendarCheck, TrendingUp]

export function HowItWorks() {
  const { t, settings } = useLanguage()
  const appUrl = settings.appUrl

  return (
    <section id="how" className="scroll-mt-20 bg-secondary/50 py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t.how.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t.how.subtitle}
          </p>
        </div>

        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {t.how.steps.map((step, i) => {
            const Icon = icons[i]
            return (
              <li
                key={step.t}
                className="relative flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="text-3xl font-black text-brand/15">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">{step.t}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {step.d}
                  </p>
                </div>
              </li>
            )
          })}
        </ol>

        <div className="mt-12 flex justify-center">
          <a
            href={appUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand px-7 text-base font-semibold text-brand-foreground shadow-md transition-colors hover:bg-brand/90"
          >
            {t.how.cta}
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
