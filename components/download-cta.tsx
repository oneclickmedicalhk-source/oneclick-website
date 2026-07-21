"use client"

import { Apple, Play, ArrowRight } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { EditableText } from "@/components/admin/editable-text"
import { useEditor } from "@/components/admin/editor-provider"
import { SectionArtboard } from "@/components/artboard/section-artboard"

export function DownloadCta() {
  const { t, settings } = useLanguage()
  const editor = useEditor()
  const appUrl = settings.appUrl
  const appStoreUrl = settings.appStoreUrl || appUrl
  const playStoreUrl = settings.playStoreUrl || appUrl

  return (
    <section id="download" className="scroll-mt-20 py-10 lg:py-14">
      <div className="px-4 sm:px-6">
        <div className="rounded-3xl border border-border bg-card shadow-sm">
          <SectionArtboard
            sectionId="download"
            parts={[
              {
                id: "download.title",
                children: (
                  <EditableText
                    path={["download", "title"]}
                    value={t.download.title}
                    as="h2"
                    className="text-center text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
                  />
                ),
              },
              {
                id: "download.desc",
                children: (
                  <EditableText
                    path={["download", "desc"]}
                    value={t.download.desc}
                    as="p"
                    multiline
                    className="text-center text-pretty leading-relaxed text-muted-foreground sm:text-lg"
                  />
                ),
              },
              {
                id: "download.cta",
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
                    <EditableText path={["download", "cta"]} value={t.download.cta} />
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </a>
                ),
              },
              {
                id: "download.stores",
                children: (
                  <div className="flex h-full gap-3">
                    <a
                      href={editor ? undefined : appStoreUrl}
                      target={editor ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        if (editor) e.preventDefault()
                      }}
                      className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-semibold text-foreground"
                      aria-label="App Store"
                    >
                      <Apple className="size-5" aria-hidden="true" />
                      App Store
                    </a>
                    <a
                      href={editor ? undefined : playStoreUrl}
                      target={editor ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        if (editor) e.preventDefault()
                      }}
                      className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-semibold text-foreground"
                      aria-label="Google Play"
                    >
                      <Play className="size-5" aria-hidden="true" />
                      Google Play
                    </a>
                  </div>
                ),
              },
              {
                id: "download.note",
                children: (
                  <EditableText
                    path={["download", "note"]}
                    value={t.download.note}
                    as="p"
                    className="text-center text-sm text-muted-foreground"
                  />
                ),
              },
            ]}
          />
        </div>
      </div>
    </section>
  )
}
