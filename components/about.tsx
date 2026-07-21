"use client"

import { Heart, ShieldCheck, Cpu, ArrowRight } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { EditableText } from "@/components/admin/editable-text"
import { useEditor } from "@/components/admin/editor-provider"
import { SectionArtboard } from "@/components/artboard/section-artboard"

const icons = [Heart, ShieldCheck, Cpu]

export function About() {
  const { t, settings } = useLanguage()
  const editor = useEditor()
  const appUrl = settings.appUrl

  return (
    <section id="about" data-page-section="about" className="scroll-mt-20 bg-secondary/50 py-10 lg:py-14">
      <div className="px-4 sm:px-6">
        <SectionArtboard
          sectionId="about"
          parts={[
            {
              id: "about.badge",
              children: (
                <span className="inline-flex rounded-full border border-brand/20 bg-brand/5 px-3.5 py-1.5 text-sm font-medium text-brand">
                  <EditableText path={["about", "badge"]} value={t.about.badge} />
                </span>
              ),
            },
            {
              id: "about.company",
              children: (
                <EditableText
                  path={["about", "company"]}
                  value={t.about.company}
                  as="p"
                  className="text-center text-sm font-semibold tracking-wide text-muted-foreground"
                />
              ),
            },
            {
              id: "about.title",
              children: (
                <EditableText
                  path={["about", "title"]}
                  value={t.about.title}
                  as="h2"
                  className="text-center text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
                />
              ),
            },
            {
              id: "about.desc",
              children: (
                <EditableText
                  path={["about", "desc"]}
                  value={t.about.desc}
                  as="p"
                  multiline
                  className="text-center text-pretty leading-relaxed text-muted-foreground sm:text-lg"
                />
              ),
            },
            {
              id: "about.cta",
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
                  <EditableText path={["about", "cta"]} value={t.about.cta} />
                  <ArrowRight className="size-4" aria-hidden="true" />
                </a>
              ),
            },
            ...t.about.values.flatMap((v, i) => {
              const Icon = icons[i]
              return [
                {
                  id: `about.value.${i}.icon`,
                  children: (
                    <div className="flex h-full items-center rounded-2xl border border-border bg-card px-5 shadow-sm">
                      <span className="flex size-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                        <Icon className="size-6" aria-hidden="true" />
                      </span>
                    </div>
                  ),
                },
                {
                  id: `about.value.${i}.title`,
                  children: (
                    <EditableText
                      path={["about", "values", i, "t"]}
                      value={v.t}
                      as="h3"
                      className="text-lg font-bold text-foreground"
                    />
                  ),
                },
                {
                  id: `about.value.${i}.desc`,
                  children: (
                    <EditableText
                      path={["about", "values", i, "d"]}
                      value={v.d}
                      as="p"
                      multiline
                      className="text-sm leading-relaxed text-muted-foreground"
                    />
                  ),
                },
              ]
            }),
          ]}
        />
      </div>
    </section>
  )
}
