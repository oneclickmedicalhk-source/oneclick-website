"use client"

import { ArrowRight, Sparkles } from "lucide-react"
import { PhoneMockup } from "@/components/phone-mockup"
import { useLanguage } from "@/components/language-provider"
import { handleAnchorClick } from "@/lib/scroll"
import { EditableText } from "@/components/admin/editable-text"
import { EditableImage } from "@/components/admin/editable-image"
import { useEditor } from "@/components/admin/editor-provider"
import { SectionArtboard } from "@/components/artboard/section-artboard"

export function Hero() {
  const { t, lang, settings } = useLanguage()
  const editor = useEditor()
  const appUrl = settings.appUrl

  return (
    <section id="top" data-page-section="hero" className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-secondary/70 via-background to-background"
        aria-hidden="true"
      />
      <div className="px-4 py-10 sm:px-6 lg:py-14">
        <SectionArtboard
          sectionId="hero"
          parts={[
            {
              id: "hero.badge",
              children: (
                <span className="inline-flex h-full items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-3.5 text-sm font-medium text-brand">
                  <Sparkles className="size-4 shrink-0" aria-hidden="true" />
                  <EditableText path={["hero", "badge"]} value={t.hero.badge} />
                </span>
              ),
            },
            {
              id: "hero.title",
              children: (
                <h1 className="text-balance text-5xl font-black leading-[1.1] tracking-tight text-foreground lg:text-6xl">
                  <EditableText
                    path={["hero", "titleA"]}
                    value={t.hero.titleA}
                    as="span"
                    className="text-brand"
                  />
                  {lang === "en" ? " " : ""}
                  <EditableText path={["hero", "titleB"]} value={t.hero.titleB} as="span" />
                </h1>
              ),
            },
            {
              id: "hero.desc",
              children: (
                <EditableText
                  path={["hero", "desc"]}
                  value={t.hero.desc}
                  as="p"
                  multiline
                  className="text-pretty text-lg leading-relaxed text-muted-foreground"
                />
              ),
            },
            {
              id: "hero.ctaPrimary",
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
                  <EditableText path={["hero", "ctaPrimary"]} value={t.hero.ctaPrimary} />
                  <ArrowRight className="size-4" aria-hidden="true" />
                </a>
              ),
            },
            {
              id: "hero.ctaSecondary",
              children: (
                <a
                  href="#features"
                  onClick={(e) => handleAnchorClick(e, "#features")}
                  className="inline-flex h-12 w-full items-center justify-center rounded-full border border-border bg-background px-7 text-base font-semibold text-foreground"
                >
                  <EditableText path={["hero", "ctaSecondary"]} value={t.hero.ctaSecondary} />
                </a>
              ),
            },
            {
              id: "hero.stat.0",
              children: (
                <div className="flex h-full flex-col gap-1 border-t border-border pt-4">
                  <p className="text-xs text-muted-foreground">
                    <EditableText path={["hero", "stat1"]} value={t.hero.stat1} />
                  </p>
                  <p className="text-lg font-bold text-foreground">
                    <EditableText path={["hero", "stat1v"]} value={t.hero.stat1v} />
                  </p>
                </div>
              ),
            },
            {
              id: "hero.stat.1",
              children: (
                <div className="flex h-full flex-col gap-1 border-t border-border pt-4">
                  <p className="text-xs text-muted-foreground">
                    <EditableText path={["hero", "stat2"]} value={t.hero.stat2} />
                  </p>
                  <p className="text-lg font-bold text-foreground">
                    <EditableText path={["hero", "stat2v"]} value={t.hero.stat2v} />
                  </p>
                </div>
              ),
            },
            {
              id: "hero.stat.2",
              children: (
                <div className="flex h-full flex-col gap-1 border-t border-border pt-4">
                  <p className="text-xs text-muted-foreground">
                    <EditableText path={["hero", "stat3"]} value={t.hero.stat3} />
                  </p>
                  <p className="text-lg font-bold text-foreground">
                    <EditableText path={["hero", "stat3v"]} value={t.hero.stat3v} />
                  </p>
                </div>
              ),
            },
            {
              id: "hero.imagePrimary",
              children: (
                <EditableImage
                  path={["images", "heroPrimary"]}
                  src={settings.images.heroPrimary}
                  mediaId="dashboard"
                  className="block h-full w-full"
                >
                  <PhoneMockup
                    src={settings.images.heroPrimary}
                    alt={t.hero.badge}
                    priority
                    className="!w-full scale-90 opacity-95"
                  />
                </EditableImage>
              ),
            },
            {
              id: "hero.imageSecondary",
              children: (
                <EditableImage
                  path={["images", "heroSecondary"]}
                  src={settings.images.heroSecondary}
                  mediaId="ai-report"
                  className="block h-full w-full"
                >
                  <PhoneMockup
                    src={settings.images.heroSecondary}
                    alt="AI 健康報告"
                    priority
                    className="!w-full shadow-2xl"
                  />
                </EditableImage>
              ),
            },
          ]}
        />
      </div>
    </section>
  )
}
