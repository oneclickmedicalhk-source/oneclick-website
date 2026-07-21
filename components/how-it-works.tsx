"use client"

import { ClipboardList, Sparkles, CalendarCheck, TrendingUp, ArrowRight } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { EditableText } from "@/components/admin/editable-text"
import { useEditor } from "@/components/admin/editor-provider"
import { SectionArtboard } from "@/components/artboard/section-artboard"

const icons = [ClipboardList, Sparkles, CalendarCheck, TrendingUp]

export function HowItWorks() {
  const { t, settings } = useLanguage()
  const editor = useEditor()
  const appUrl = settings.appUrl

  return (
    <section id="how" className="scroll-mt-20 bg-secondary/50 py-10 lg:py-14">
      <div className="px-4 sm:px-6">
        <SectionArtboard
          sectionId="how"
          parts={[
            {
              id: "how.title",
              children: (
                <EditableText
                  path={["how", "title"]}
                  value={t.how.title}
                  as="h2"
                  className="text-center text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
                />
              ),
            },
            {
              id: "how.subtitle",
              children: (
                <EditableText
                  path={["how", "subtitle"]}
                  value={t.how.subtitle}
                  as="p"
                  className="text-center text-base leading-relaxed text-muted-foreground sm:text-lg"
                />
              ),
            },
            ...t.how.steps.map((step, i) => {
              const Icon = icons[i]
              return {
                id: `how.step.${i}`,
                children: (
                  <div className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="flex size-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <span className="text-3xl font-black text-brand/15">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div>
                      <EditableText
                        path={["how", "steps", i, "t"]}
                        value={step.t}
                        as="h3"
                        className="text-lg font-bold text-foreground"
                      />
                      <EditableText
                        path={["how", "steps", i, "d"]}
                        value={step.d}
                        as="p"
                        multiline
                        className="mt-1.5 text-sm leading-relaxed text-muted-foreground"
                      />
                    </div>
                  </div>
                ),
              }
            }),
            {
              id: "how.cta",
              children: (
                <a
                  href={editor ? undefined : appUrl}
                  target={editor ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (editor) e.preventDefault()
                  }}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand px-7 text-base font-semibold text-brand-foreground shadow-md"
                >
                  <EditableText path={["how", "cta"]} value={t.how.cta} />
                  <ArrowRight className="size-4" aria-hidden="true" />
                </a>
              ),
            },
          ]}
        />
      </div>
    </section>
  )
}
