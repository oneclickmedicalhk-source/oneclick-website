"use client"

import { useRef, useState, type ReactNode } from "react"
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
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  if (!editor) return <>{children}</>

  const onFile = async (file: File | undefined) => {
    if (!file) return
    setBusy(true)
    setError("")
    try {
      const data = await uploadImageFile(file, { id: mediaId, alt: label })
      editor.patchSettings(path, data.url)
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
        "group/img relative inline-block cursor-pointer rounded-xl outline-offset-4 transition",
        "hover:outline hover:outline-2 hover:outline-brand/60",
        className,
      )}
      title={label}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        inputRef.current?.click()
      }}
    >
      {children}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-[inherit] bg-foreground/0 opacity-0 transition group-hover/img:bg-foreground/35 group-hover/img:opacity-100">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1.5 text-xs font-semibold text-foreground shadow">
          <ImagePlus className="size-3.5" />
          {busy ? "上傳中…" : label}
        </span>
      </div>
      {error ? (
        <span className="absolute bottom-2 left-2 z-20 rounded bg-destructive px-2 py-0.5 text-[10px] text-white">
          {error}
        </span>
      ) : null}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
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
