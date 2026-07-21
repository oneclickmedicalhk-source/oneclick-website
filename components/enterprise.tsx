"use client"

import { Building2, Check, ArrowRight } from "lucide-react"
import { PhoneMockup } from "@/components/phone-mockup"
import { useLanguage } from "@/components/language-provider"

export function Enterprise() {
  const { t, settings } = useLanguage()
  const appUrl = settings.appUrl

  return (
    <section id="enterprise" className="scroll-mt-20 py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="overflow-hidden rounded-3xl bg-brand text-brand-foreground">
          <div className="grid items-center gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:p-14">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-foreground/15 px-3 py-1 text-sm font-semibold">
                <Building2 className="size-4" aria-hidden="true" />
                {t.enterprise.badge}
              </span>
              <h2 className="mt-4 text-balance text-3xl font-bold sm:text-4xl">
                {t.enterprise.title}
              </h2>
              <p className="mt-4 text-pretty leading-relaxed text-brand-foreground/85">
                {t.enterprise.desc}
              </p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {t.enterprise.points.map((p) => (
                  <li key={p} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-gold text-gold-foreground">
                      <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                    </span>
                    <span className="text-sm font-medium text-brand-foreground/90">{p}</span>
                  </li>
                ))}
              </ul>
              <a
                href={appUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-foreground px-7 text-base font-semibold text-brand transition-transform hover:-translate-y-0.5"
              >
                {t.enterprise.cta}
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
            </div>
            <div className="flex justify-center lg:justify-end">
              <PhoneMockup src={settings.images.enterprise} alt={t.enterprise.title} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
