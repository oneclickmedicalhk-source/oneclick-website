"use client"

import { Building2, Check, ArrowRight } from "lucide-react"
import { PhoneMockup } from "@/components/phone-mockup"
import { useLanguage } from "@/components/language-provider"
import { EditableText } from "@/components/admin/editable-text"
import { EditableImage } from "@/components/admin/editable-image"
import { useEditor } from "@/components/admin/editor-provider"
import { SectionArtboard } from "@/components/artboard/section-artboard"

export function Enterprise() {
  const { t, settings } = useLanguage()
  const editor = useEditor()
  const appUrl = settings.appUrl

  return (
    <section id="enterprise" data-page-section="enterprise" className="scroll-mt-20 py-10 lg:py-14">
      <div className="px-4 sm:px-6">
        <div className="overflow-hidden rounded-3xl bg-brand text-brand-foreground">
          <SectionArtboard
            sectionId="enterprise"
            surfaceClassName="text-brand-foreground"
            parts={[
              {
                id: "enterprise.badge",
                children: (
                  <span className="inline-flex items-center gap-2 rounded-full bg-brand-foreground/15 px-3 py-1 text-sm font-semibold">
                    <Building2 className="size-4" aria-hidden="true" />
                    <EditableText path={["enterprise", "badge"]} value={t.enterprise.badge} />
                  </span>
                ),
              },
              {
                id: "enterprise.title",
                children: (
                  <EditableText
                    path={["enterprise", "title"]}
                    value={t.enterprise.title}
                    as="h2"
                    className="text-balance text-3xl font-bold sm:text-4xl"
                  />
                ),
              },
              {
                id: "enterprise.desc",
                children: (
                  <EditableText
                    path={["enterprise", "desc"]}
                    value={t.enterprise.desc}
                    as="p"
                    multiline
                    className="text-pretty leading-relaxed text-brand-foreground/85"
                  />
                ),
              },
              ...t.enterprise.points.map((p, i) => ({
                id: `enterprise.point.${i}`,
                children: (
                  <div className="flex h-full items-start gap-2.5">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-gold text-gold-foreground">
                      <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                    </span>
                    <EditableText
                      path={["enterprise", "points", i]}
                      value={p}
                      as="span"
                      className="text-sm font-medium text-brand-foreground/90"
                    />
                  </div>
                ),
              })),
              {
                id: "enterprise.cta",
                children: (
                  <a
                    href={editor ? undefined : appUrl}
                    target={editor ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (editor) e.preventDefault()
                    }}
                    className="inline-flex h-12 w-fit items-center justify-center gap-2 rounded-full bg-brand-foreground px-7 text-base font-semibold text-brand"
                  >
                    <EditableText path={["enterprise", "cta"]} value={t.enterprise.cta} />
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </a>
                ),
              },
              {
                id: "enterprise.image",
                children: (
                  <EditableImage
                    path={["images", "enterprise"]}
                    src={settings.images.enterprise}
                    mediaId="enterprise"
                    className="block h-full w-full"
                  >
                    <PhoneMockup
                      src={settings.images.enterprise}
                      alt={t.enterprise.title}
                      className="!w-full"
                    />
                  </EditableImage>
                ),
              },
            ]}
          />
        </div>
      </div>
    </section>
  )
}
