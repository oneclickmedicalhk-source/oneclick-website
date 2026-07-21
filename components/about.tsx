"use client"

import { Heart, ShieldCheck, Cpu, ArrowRight } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { EditableText } from "@/components/admin/editable-text"
import { useEditor } from "@/components/admin/editor-provider"

const icons = [Heart, ShieldCheck, Cpu]

export function About() {
  const { t, settings } = useLanguage()
  const editor = useEditor()
  const appUrl = settings.appUrl

  return (
    <section id="about" className="scroll-mt-20 bg-secondary/50 py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-brand/20 bg-brand/5 px-3.5 py-1.5 text-sm font-medium text-brand">
            <EditableText path={["about", "badge"]} value={t.about.badge} />
          </span>
          <EditableText
            path={["about", "company"]}
            value={t.about.company}
            as="p"
            className="mt-4 text-sm font-semibold tracking-wide text-muted-foreground"
          />
          <EditableText
            path={["about", "title"]}
            value={t.about.title}
            as="h2"
            className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          />
          <EditableText
            path={["about", "desc"]}
            value={t.about.desc}
            as="p"
            multiline
            className="mt-5 text-pretty leading-relaxed text-muted-foreground sm:text-lg"
          />
          <div className="mt-7 flex justify-center">
            <a
              href={editor ? undefined : appUrl}
              target={editor ? undefined : "_blank"}
              rel="noopener noreferrer"
              onClick={(e) => {
                if (editor) e.preventDefault()
              }}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand px-7 text-base font-semibold text-brand-foreground shadow-md transition-colors hover:bg-brand/90"
            >
              <EditableText path={["about", "cta"]} value={t.about.cta} />
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {t.about.values.map((v, i) => {
            const Icon = icons[i]
            return (
              <div
                key={i}
                className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-7 shadow-sm"
              >
                <span className="flex size-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <EditableText
                  path={["about", "values", i, "t"]}
                  value={v.t}
                  as="h3"
                  className="text-lg font-bold text-foreground"
                />
                <EditableText
                  path={["about", "values", i, "d"]}
                  value={v.d}
                  as="p"
                  multiline
                  className="text-sm leading-relaxed text-muted-foreground"
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
