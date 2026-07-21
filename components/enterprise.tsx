"use client"

import { Building2, Check, ArrowRight } from "lucide-react"
import { PhoneMockup } from "@/components/phone-mockup"
import { useLanguage } from "@/components/language-provider"
import { EditableText } from "@/components/admin/editable-text"
import { EditableImage } from "@/components/admin/editable-image"
import { EditableLayout } from "@/components/admin/editable-layout"
import { useEditor } from "@/components/admin/editor-provider"

export function Enterprise() {
  const { t, settings } = useLanguage()
  const editor = useEditor()
  const appUrl = settings.appUrl

  return (
    <section id="enterprise" className="scroll-mt-20 py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="overflow-hidden rounded-3xl bg-brand text-brand-foreground">
          <div className="grid items-center gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:p-14">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-foreground/15 px-3 py-1 text-sm font-semibold">
                <Building2 className="size-4" aria-hidden="true" />
                <EditableText path={["enterprise", "badge"]} value={t.enterprise.badge} />
              </span>
              <EditableText
                path={["enterprise", "title"]}
                value={t.enterprise.title}
                as="h2"
                className="mt-4 text-balance text-3xl font-bold sm:text-4xl"
              />
              <EditableText
                path={["enterprise", "desc"]}
                value={t.enterprise.desc}
                as="p"
                multiline
                className="mt-4 text-pretty leading-relaxed text-brand-foreground/85"
              />
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {t.enterprise.points.map((p, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-gold text-gold-foreground">
                      <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                    </span>
                    <EditableText
                      path={["enterprise", "points", i]}
                      value={p}
                      as="span"
                      className="text-sm font-medium text-brand-foreground/90"
                    />
                  </li>
                ))}
              </ul>
              <a
                href={editor ? undefined : appUrl}
                target={editor ? undefined : "_blank"}
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (editor) e.preventDefault()
                }}
                className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-foreground px-7 text-base font-semibold text-brand transition-transform hover:-translate-y-0.5"
              >
                <EditableText path={["enterprise", "cta"]} value={t.enterprise.cta} />
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
            </div>
            <div className="flex justify-center lg:justify-end">
              <EditableLayout id="enterprise">
                <EditableImage
                  path={["images", "enterprise"]}
                  src={settings.images.enterprise}
                  mediaId="enterprise"
                >
                  <PhoneMockup src={settings.images.enterprise} alt={t.enterprise.title} />
                </EditableImage>
              </EditableLayout>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
