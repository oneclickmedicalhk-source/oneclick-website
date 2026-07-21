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
    <section id="how" data-page-section="how" className="scroll-mt-20 bg-secondary/50 py-10 lg:py-14">
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
            ...t.how.steps.flatMap((step, i) => {
              const Icon = icons[i]
              return [
                {
                  id: `how.step.${i}.badge`,
                  children: (
                    <div className="flex h-full items-center justify-between rounded-xl border border-border bg-card px-4 shadow-sm">
                      <span className="flex size-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <span className="text-3xl font-black text-brand/15">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                  ),
                },
                {
                  id: `how.step.${i}.title`,
                  children: (
                    <EditableText
                      path={["how", "steps", i, "t"]}
                      value={step.t}
                      as="h3"
                      className="text-lg font-bold text-foreground"
                    />
                  ),
                },
                {
                  id: `how.step.${i}.desc`,
                  children: (
                    <EditableText
                      path={["how", "steps", i, "d"]}
                      value={step.d}
                      as="p"
                      multiline
                      className="text-sm leading-relaxed text-muted-foreground"
                    />
                  ),
                },
              ]
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
                  className="inline-flex h-12 w-fit items-center justify-center gap-2 rounded-full bg-brand px-7 text-base font-semibold text-brand-foreground shadow-md"
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
