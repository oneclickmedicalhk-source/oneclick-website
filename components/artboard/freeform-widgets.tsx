"use client"

import { useRef, useState } from "react"
import { ImagePlus } from "lucide-react"
import { useEditor } from "@/components/admin/editor-provider"
import { useLanguage } from "@/components/language-provider"
import { uploadImageFile } from "@/components/admin/primitives"
import type { ArtboardItem } from "@/lib/artboard"
import { cn } from "@/lib/utils"

export function FreeformText({
  item,
  onChangeText,
}: {
  item: ArtboardItem
  onChangeText: (next: { textZh: string; textEn: string }) => void
}) {
  const editor = useEditor()
  const { lang } = useLanguage()
  const value = (lang === "en" ? item.textEn : item.textZh) || ""
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  if (!editor) {
    return (
      <p className="whitespace-pre-wrap text-lg font-semibold leading-snug text-foreground">{value}</p>
    )
  }

  if (editing) {
    return (
      <textarea
        autoFocus
        value={draft}
        rows={Math.min(6, Math.max(2, draft.split("\n").length + 1))}
        className="w-full resize-y rounded-md border border-brand bg-background px-2 py-1 text-lg font-semibold leading-snug outline-none ring-2 ring-brand/25"
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          setEditing(false)
          if (lang === "en") onChangeText({ textZh: item.textZh || "", textEn: draft })
          else onChangeText({ textZh: draft, textEn: item.textEn || draft })
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setDraft(value)
            setEditing(false)
          }
        }}
      />
    )
  }

  return (
    <p
      title="點擊編輯文字"
      className={cn(
        "min-h-[1.5em] whitespace-pre-wrap text-lg font-semibold leading-snug text-foreground",
        "cursor-text rounded-sm outline-offset-2 hover:outline hover:outline-2 hover:outline-dashed hover:outline-brand/55",
      )}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        setDraft(value)
        setEditing(true)
      }}
    >
      {value || "點擊輸入文字"}
    </p>
  )
}

export function FreeformImage({
  item,
  onChangeSrc,
}: {
  item: ArtboardItem
  onChangeSrc: (src: string) => void
}) {
  const editor = useEditor()
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const src = item.src || "/placeholder.svg"

  const onFile = async (file: File | undefined) => {
    if (!file || !editor) return
    setBusy(true)
    setError("")
    try {
      const data = await uploadImageFile(file, { alt: "自訂圖片" })
      if (!data?.url) throw new Error("上傳失敗")
      onChangeSrc(data.url)
    } catch (e) {
      setError(e instanceof Error ? e.message : "上傳失敗")
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  return (
    <div className="relative size-full min-h-[120px] overflow-hidden rounded-xl border border-border bg-muted">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="size-full object-cover" />
      {editor ? (
        <>
          <button
            type="button"
            data-upload
            disabled={busy}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              inputRef.current?.click()
            }}
            className="absolute inset-0 flex items-center justify-center bg-foreground/0 opacity-0 transition hover:bg-foreground/35 hover:opacity-100"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1.5 text-xs font-semibold shadow">
              <ImagePlus className="size-3.5" />
              {busy ? "上傳中…" : "更換圖片"}
            </span>
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
          {error ? (
            <span className="absolute bottom-2 left-2 rounded bg-destructive px-2 py-0.5 text-[10px] text-white">
              {error}
            </span>
          ) : null}
        </>
      ) : null}
    </div>
  )
}
