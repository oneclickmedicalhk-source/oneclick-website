"use client"

import { useEffect, useRef, useState } from "react"
import { ImagePlus, Type } from "lucide-react"
import { useEditor } from "@/components/admin/editor-provider"
import { useLanguage } from "@/components/language-provider"
import { uploadImageFile } from "@/components/admin/primitives"
import {
  ARTBOARD_SELECT_EVENT,
  type ArtboardSelectDetail,
} from "@/components/artboard/section-artboard"
import {
  addItemToArtboard,
  createDefaultArtboards,
  createImageWidget,
  createTextWidget,
  type ArtboardSectionId,
} from "@/lib/artboard"
import { SECTION_LABELS, type PageSectionId } from "@/lib/content"

function selectOnArtboard(sectionId: ArtboardSectionId, id: string) {
  window.dispatchEvent(
    new CustomEvent<ArtboardSelectDetail>(ARTBOARD_SELECT_EVENT, {
      detail: { sectionId, id },
    }),
  )
}

function isTypingTarget(el: EventTarget | null) {
  if (!(el instanceof HTMLElement)) return false
  return Boolean(el.closest("input, textarea, [contenteditable=true], select"))
}

export function InsertToolbar({ activeSection }: { activeSection: PageSectionId }) {
  const editor = useEditor()
  const { settings } = useLanguage()
  const fileRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const sectionId = activeSection as ArtboardSectionId
  const sectionRef = useRef(sectionId)
  sectionRef.current = sectionId

  useEffect(() => {
    if (!editor) return
    const onPaste = async (e: ClipboardEvent) => {
      if (isTypingTarget(e.target)) return
      const file = [...(e.clipboardData?.items || [])]
        .find((i) => i.type.startsWith("image/"))
        ?.getAsFile()
      if (!file) return
      e.preventDefault()
      const sid = sectionRef.current
      const board =
        editor.content.settings.artboards?.[sid] || createDefaultArtboards()[sid]
      setBusy(true)
      setError("")
      try {
        const data = await uploadImageFile(file, { alt: "貼上圖片" })
        if (!data?.url) throw new Error("上傳失敗")
        const widget = createImageWidget({
          x: 64,
          y: 48,
          w: 320,
          h: 220,
          src: data.url,
        })
        editor.patchSettings(
          ["artboards", sid],
          addItemToArtboard(board, widget),
          "mutate",
        )
        selectOnArtboard(sid, widget.id)
      } catch (err) {
        setError(err instanceof Error ? err.message : "貼上失敗")
      } finally {
        setBusy(false)
      }
    }
    window.addEventListener("paste", onPaste)
    return () => window.removeEventListener("paste", onPaste)
  }, [editor])

  if (!editor) return null

  const board = settings.artboards?.[sectionId] || createDefaultArtboards()[sectionId]

  const commit = (next: typeof board) => {
    editor.patchSettings(["artboards", sectionId], next, "mutate")
  }

  const addText = () => {
    const widget = createTextWidget({
      x: 64,
      y: 48,
      w: 360,
      h: 72,
    })
    commit(addItemToArtboard(board, widget))
    selectOnArtboard(sectionId, widget.id)
    setError("")
  }

  const addPhoto = () => {
    setError("")
    fileRef.current?.click()
  }

  const onFile = async (file: File | undefined) => {
    if (!file) return
    setBusy(true)
    setError("")
    try {
      const data = await uploadImageFile(file, { alt: "自訂圖片" })
      if (!data?.url) throw new Error("上傳失敗")
      const widget = createImageWidget({
        x: 64,
        y: 48,
        w: 320,
        h: 220,
        src: data.url,
      })
      commit(addItemToArtboard(board, widget))
      selectOnArtboard(sectionId, widget.id)
    } catch (e) {
      setError(e instanceof Error ? e.message : "上傳失敗")
    } finally {
      setBusy(false)
      if (fileRef.current) fileRef.current.value = ""
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[11px] text-muted-foreground">
        加到「{SECTION_LABELS[activeSection]}」· ⌘V 貼圖
      </span>
      <button
        type="button"
        onClick={addText}
        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-xs font-medium text-foreground shadow-sm hover:bg-muted"
      >
        <Type className="size-3.5" />
        加文字
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={addPhoto}
        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-xs font-medium text-foreground shadow-sm hover:bg-muted disabled:opacity-60"
      >
        <ImagePlus className="size-3.5" />
        {busy ? "上傳中…" : "加圖片"}
      </button>
      {error ? <span className="text-[11px] text-destructive">{error}</span> : null}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0"
        onChange={(e) => onFile(e.target.files?.[0])}
      />
    </div>
  )
}
