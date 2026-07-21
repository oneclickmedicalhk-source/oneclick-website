"use client"

import { Apple, Play, ArrowRight } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { EditableText } from "@/components/admin/editable-text"
import { useEditor } from "@/components/admin/editor-provider"

export function DownloadCta() {
  const { t, settings } = useLanguage()
  const editor = useEditor()
  const appUrl = settings.appUrl
  const appStoreUrl = settings.appStoreUrl || appUrl
  const playStoreUrl = settings.playStoreUrl || appUrl

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-7 rounded-3xl border border-border bg-card px-6 py-14 text-center shadow-sm sm:px-12">
          <EditableText
            path={["download", "title"]}
            value={t.download.title}
            as="h2"
            className="max-w-2xl text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          />
          <EditableText
            path={["download", "desc"]}
            value={t.download.desc}
            as="p"
            multiline
            className="max-w-xl text-pretty leading-relaxed text-muted-foreground sm:text-lg"
          />
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <a
              href={editor ? undefined : appUrl}
              target={editor ? undefined : "_blank"}
              rel="noopener noreferrer"
              onClick={(e) => {
                if (editor) e.preventDefault()
              }}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand px-7 text-base font-semibold text-brand-foreground shadow-md transition-colors hover:bg-brand/90"
            >
              <EditableText path={["download", "cta"]} value={t.download.cta} />
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            <div className="flex gap-3">
              <a
                href={editor ? undefined : appStoreUrl}
                target={editor ? undefined : "_blank"}
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (editor) e.preventDefault()
                }}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-semibold text-foreground transition-colors hover:border-brand hover:text-brand"
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
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-semibold text-foreground transition-colors hover:border-brand hover:text-brand"
                aria-label="Google Play"
              >
                <Play className="size-5" aria-hidden="true" />
                Google Play
              </a>
            </div>
          </div>
          <EditableText
            path={["download", "note"]}
            value={t.download.note}
            as="p"
            className="text-sm text-muted-foreground"
          />
        </div>
      </div>
    </section>
  )
}
