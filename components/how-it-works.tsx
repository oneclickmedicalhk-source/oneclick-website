"use client"

import { ClipboardList, Sparkles, CalendarCheck, TrendingUp, ArrowRight } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { EditableText } from "@/components/admin/editable-text"
import { useEditor } from "@/components/admin/editor-provider"

const icons = [ClipboardList, Sparkles, CalendarCheck, TrendingUp]

export function HowItWorks() {
  const { t, settings } = useLanguage()
  const editor = useEditor()
  const appUrl = settings.appUrl

  return (
    <section id="how" className="scroll-mt-20 bg-secondary/50 py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <EditableText
            path={["how", "title"]}
            value={t.how.title}
            as="h2"
            className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          />
          <EditableText
            path={["how", "subtitle"]}
            value={t.how.subtitle}
            as="p"
            className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg"
          />
        </div>

        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {t.how.steps.map((step, i) => {
            const Icon = icons[i]
            return (
              <li
                key={i}
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
              </li>
            )
          })}
        </ol>

        <div className="mt-12 flex justify-center">
          <a
            href={editor ? undefined : appUrl}
            target={editor ? undefined : "_blank"}
            rel="noopener noreferrer"
            onClick={(e) => {
              if (editor) e.preventDefault()
            }}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand px-7 text-base font-semibold text-brand-foreground shadow-md transition-colors hover:bg-brand/90"
          >
            <EditableText path={["how", "cta"]} value={t.how.cta} />
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
