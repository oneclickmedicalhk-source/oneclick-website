"use client"

import { Activity, ArrowRight, Check, ShoppingBag, Sparkles, Stethoscope } from "lucide-react"
import { PhoneMockup } from "@/components/phone-mockup"
import { useLanguage } from "@/components/language-provider"

const meta = [
  { icon: Sparkles, tint: "text-gold-foreground", bg: "bg-gold/15" },
  { icon: Stethoscope, tint: "text-brand", bg: "bg-brand/10" },
  { icon: Activity, tint: "text-success", bg: "bg-success/10" },
  { icon: ShoppingBag, tint: "text-brand", bg: "bg-brand/10" },
]

export function Features() {
  const { t, settings } = useLanguage()
  const appUrl = settings.appUrl
  const screens = settings.images.pillars

  return (
    <section id="features" className="scroll-mt-20 py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t.pillars.title}
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t.pillars.subtitle}
          </p>
        </div>

        <div className="mt-14 flex flex-col gap-16 lg:gap-24">
          {t.pillars.items.map((item, i) => {
            const M = meta[i]
            const Icon = M.icon
            const reverse = i % 2 === 1
            const anchorId = i === 3 ? "shop" : undefined
            return (
              <div
                key={item.title}
                id={anchorId}
                className="grid scroll-mt-20 items-center gap-8 lg:grid-cols-2 lg:gap-14"
              >
                <div className={reverse ? "lg:order-2" : ""}>
                  <span
                    className={`inline-flex items-center gap-2 rounded-full ${M.bg} px-3 py-1 text-sm font-semibold ${M.tint}`}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                    {item.tag}
                  </span>
                  <h3 className="mt-4 text-2xl font-bold text-foreground sm:text-3xl">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
                    {item.desc}
                  </p>
                  <ul className="mt-6 flex flex-col gap-3">
                    {item.points.map((p) => (
                      <li key={p} className="flex items-center gap-3">
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                          <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
                        </span>
                        <span className="text-sm font-medium text-foreground">{p}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href={appUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand px-6 text-base font-semibold text-brand-foreground shadow-sm transition-colors hover:bg-brand/90"
                  >
                    {item.cta}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </a>
                </div>
                <div
                  className={`flex justify-center ${reverse ? "lg:order-1 lg:justify-start" : "lg:justify-end"}`}
                >
                  <div className="relative">
                    <div
                      className={`absolute -inset-5 -z-10 rounded-[3rem] ${M.bg} blur-2xl`}
                      aria-hidden="true"
                    />
                    <PhoneMockup src={screens[i] || "/placeholder.svg"} alt={item.title} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
