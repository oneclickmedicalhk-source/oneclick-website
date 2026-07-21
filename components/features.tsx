"use client"

import { Activity, ArrowRight, Check, ShoppingBag, Sparkles, Stethoscope } from "lucide-react"
import { PhoneMockup } from "@/components/phone-mockup"
import { useLanguage } from "@/components/language-provider"
import { EditableText } from "@/components/admin/editable-text"
import { EditableImage } from "@/components/admin/editable-image"
import { useEditor } from "@/components/admin/editor-provider"
import { SectionArtboard } from "@/components/artboard/section-artboard"

const meta = [
  { icon: Sparkles, tint: "text-gold-foreground", bg: "bg-gold/15" },
  { icon: Stethoscope, tint: "text-brand", bg: "bg-brand/10" },
  { icon: Activity, tint: "text-success", bg: "bg-success/10" },
  { icon: ShoppingBag, tint: "text-brand", bg: "bg-brand/10" },
]

export function Features() {
  const { t, settings } = useLanguage()
  const editor = useEditor()
  const appUrl = settings.appUrl
  const screens = settings.images.pillars

  const pillarParts = t.pillars.items.flatMap((item, i) => {
    const M = meta[i]
    const Icon = M.icon
    return [
      {
        id: `pillar.${i}.tag`,
        children: (
          <span
            id={i === 3 ? "shop" : undefined}
            className={`inline-flex h-full items-center gap-2 rounded-full ${M.bg} px-3 text-sm font-semibold ${M.tint}`}
          >
            <Icon className="size-4" aria-hidden="true" />
            <EditableText path={["pillars", "items", i, "tag"]} value={item.tag} />
          </span>
        ),
      },
      {
        id: `pillar.${i}.title`,
        children: (
          <EditableText
            path={["pillars", "items", i, "title"]}
            value={item.title}
            as="h3"
            className="text-2xl font-bold text-foreground sm:text-3xl"
          />
        ),
      },
      {
        id: `pillar.${i}.desc`,
        children: (
          <EditableText
            path={["pillars", "items", i, "desc"]}
            value={item.desc}
            as="p"
            multiline
            className="text-pretty leading-relaxed text-muted-foreground"
          />
        ),
      },
      {
        id: `pillar.${i}.points`,
        children: (
          <ul className="flex h-full flex-col gap-2">
            {item.points.map((p, pi) => (
              <li key={pi} className="flex items-center gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                  <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
                </span>
                <EditableText
                  path={["pillars", "items", i, "points", pi]}
                  value={p}
                  as="span"
                  className="text-sm font-medium text-foreground"
                />
              </li>
            ))}
          </ul>
        ),
      },
      {
        id: `pillar.${i}.cta`,
        children: (
          <a
            href={editor ? undefined : appUrl}
            target={editor ? undefined : "_blank"}
            rel="noopener noreferrer"
            onClick={(e) => {
              if (editor) e.preventDefault()
            }}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand px-6 text-base font-semibold text-brand-foreground shadow-sm"
          >
            <EditableText path={["pillars", "items", i, "cta"]} value={item.cta} />
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        ),
      },
      {
        id: `pillar.${i}.image`,
        children: (
          <EditableImage
            path={["images", "pillars", i]}
            src={screens[i] || "/placeholder.svg"}
            mediaId={`pillar-${i}`}
            className="block h-full w-full"
          >
            <PhoneMockup
              src={screens[i] || "/placeholder.svg"}
              alt={item.title}
              className="!w-full"
            />
          </EditableImage>
        ),
      },
    ]
  })

  return (
    <section id="features" data-page-section="features" className="scroll-mt-20 py-10 lg:py-14">
      <div className="px-4 sm:px-6">
        <SectionArtboard
          sectionId="features"
          parts={[
            {
              id: "features.title",
              children: (
                <EditableText
                  path={["pillars", "title"]}
                  value={t.pillars.title}
                  as="h2"
                  className="text-center text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
                />
              ),
            },
            {
              id: "features.subtitle",
              children: (
                <EditableText
                  path={["pillars", "subtitle"]}
                  value={t.pillars.subtitle}
                  as="p"
                  multiline
                  className="text-center text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
                />
              ),
            },
            ...pillarParts,
          ]}
        />
      </div>
    </section>
  )
}
