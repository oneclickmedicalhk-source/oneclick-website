"use client"

import { useId, useRef, useState, type ReactNode } from "react"
import { ImagePlus, Trash2 } from "lucide-react"
import { useEditor, type EditorPath } from "@/components/admin/editor-provider"
import { uploadImageFile } from "@/components/admin/primitives"
import { cn } from "@/lib/utils"

export function EditableImage({
  path,
  src,
  children,
  className,
  mediaId,
  label = "更換圖片",
}: {
  path: EditorPath
  src: string
  children: ReactNode
  className?: string
  mediaId?: string
  label?: string
}) {
  const editor = useEditor()
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  if (!editor) return <>{children}</>

  const openPicker = () => {
    setError("")
    const input = inputRef.current
    if (!input) return
    // Prefer showPicker when available; fall back to click.
    // Never use display:none on the input — browsers block programmatic open.
    if (typeof input.showPicker === "function") {
      try {
        input.showPicker()
        return
      } catch {
        /* fall through */
      }
    }
    input.click()
  }

  const onFile = async (file: File | undefined) => {
    if (!file) return
    setBusy(true)
    setError("")
    try {
      const data = await uploadImageFile(file, { id: mediaId, alt: label })
      if (!data?.url) throw new Error("上傳成功但未取得圖片網址")
      editor.patchSettings(path, data.url)
      if ((data as { warning?: string }).warning) {
        setError((data as { warning?: string }).warning || "")
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "上傳失敗")
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  return (
    <div
      className={cn(
        "group/img relative inline-block rounded-xl outline-offset-4 transition",
        "hover:outline hover:outline-2 hover:outline-brand/60",
        className,
      )}
    >
      {children}

      {/* Clickable overlay — must receive pointer events (not pointer-events-none) */}
      <button
        type="button"
        data-upload
        disabled={busy}
        aria-label={label}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          openPicker()
        }}
        className={cn(
          "absolute inset-0 z-20 flex cursor-pointer items-center justify-center rounded-[inherit]",
          "bg-foreground/0 opacity-0 transition",
          "hover:bg-foreground/35 hover:opacity-100 focus-visible:bg-foreground/35 focus-visible:opacity-100",
          "group-hover/img:bg-foreground/35 group-hover/img:opacity-100",
          busy && "pointer-events-none opacity-100 bg-foreground/35",
        )}
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1.5 text-xs font-semibold text-foreground shadow">
          <ImagePlus className="size-3.5" />
          {busy ? "上傳中…" : label}
        </span>
      </button>

      {error ? (
        <span
          className={cn(
            "absolute bottom-2 left-2 z-30 max-w-[90%] rounded px-2 py-0.5 text-[10px] text-white",
            error.includes("Blob") || error.includes("暫存") ? "bg-gold-foreground" : "bg-destructive",
          )}
        >
          {error}
        </span>
      ) : null}

      {/* Visually hidden but not display:none — required for reliable file picker */}
      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept="image/*"
        tabIndex={-1}
        aria-hidden
        className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0"
        onChange={(e) => onFile(e.target.files?.[0])}
      />
    </div>
  )
}

export function EditableImageClear({
  path,
  fallback,
  className,
}: {
  path: EditorPath
  fallback: string
  className?: string
}) {
  const editor = useEditor()
  if (!editor) return null
  return (
    <button
      type="button"
      className={cn(
        "absolute right-2 top-2 z-30 rounded-md border border-border bg-background/95 p-1.5 text-muted-foreground shadow opacity-0 transition group-hover/img:opacity-100 hover:text-destructive",
        className,
      )}
      title="還原預設圖"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        editor.patchSettings(path, fallback)
      }}
    >
      <Trash2 className="size-3.5" />
    </button>
  )
}
