"use client"

import { useEffect, useState, type ElementType, type ReactNode } from "react"
import { useEditor, type EditorPath } from "@/components/admin/editor-provider"
import { cn } from "@/lib/utils"

export function EditableText({
  path,
  value,
  as: Tag = "span",
  className,
  multiline = false,
  settings = false,
}: {
  path: EditorPath
  value: string
  as?: ElementType
  className?: string
  multiline?: boolean
  settings?: boolean
}) {
  const editor = useEditor()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  useEffect(() => setDraft(value), [value])

  if (!editor) {
    const Comp = Tag
    return <Comp className={className}>{value}</Comp>
  }

  const commit = (next: string) => {
    setEditing(false)
    if (next !== value) {
      if (settings) editor.patchSettings(path, next)
      else editor.patch(path, next)
    }
  }

  const Comp = Tag

  // Editing chrome must win over parent text-white / text-brand-foreground
  // so light copy stays readable on the white input surface.
  const editingChrome =
    "border border-brand bg-background text-foreground caret-foreground outline-none ring-2 ring-brand/25"

  if (editing) {
    if (multiline) {
      return (
        <textarea
          autoFocus
          value={draft}
          rows={Math.min(8, Math.max(3, draft.split("\n").length + 1))}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => commit(draft)}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setDraft(value)
              setEditing(false)
            }
          }}
          className={cn(
            className,
            "w-full resize-y rounded-md px-2 py-1",
            editingChrome,
          )}
        />
      )
    }
    return (
      <input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => commit(draft)}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Enter") (e.target as HTMLInputElement).blur()
          if (e.key === "Escape") {
            setDraft(value)
            setEditing(false)
          }
        }}
        className={cn(
          className,
          "w-full min-w-[4ch] rounded-md px-2 py-0.5",
          editingChrome,
        )}
      />
    )
  }

  return (
    <Comp
      className={cn(
        className,
        "cursor-text rounded-sm outline-offset-2 transition-[outline]",
        "hover:outline hover:outline-2 hover:outline-dashed hover:outline-brand/55",
        // Soft halo so white / near-white copy stays visible on light canvas
        "editor-text-readable",
      )}
      title="點擊編輯"
      onClick={(e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDraft(value)
        setEditing(true)
      }}
    >
      {value}
    </Comp>
  )
}

export function EditableBlock({
  children,
  label,
}: {
  children: ReactNode
  label?: string
}) {
  const editor = useEditor()
  if (!editor) return <>{children}</>
  return (
    <div className="group/edit relative rounded-lg transition-shadow hover:ring-2 hover:ring-brand/35">
      {label ? (
        <span className="pointer-events-none absolute -top-2 left-2 z-20 hidden rounded bg-brand px-1.5 py-0.5 text-[10px] font-semibold text-brand-foreground group-hover/edit:inline-block">
          {label}
        </span>
      ) : null}
      {children}
    </div>
  )
}
