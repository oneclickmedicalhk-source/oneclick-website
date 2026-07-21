"use client"

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react"
import { GripVertical, RotateCcw } from "lucide-react"
import { useEditor } from "@/components/admin/editor-provider"
import { useLanguage } from "@/components/language-provider"
import type { LayoutTransform } from "@/lib/content"
import { cn } from "@/lib/utils"

const GRID = 8
const MIN_SCALE = 0.5
const MAX_SCALE = 1.5
const SCALE_STEP = 0.05

const DEFAULT_TRANSFORM: LayoutTransform = { x: 0, y: 0, scale: 1 }

function snap(n: number) {
  return Math.round(n / GRID) * GRID
}

function clampScale(n: number) {
  const stepped = Math.round(n / SCALE_STEP) * SCALE_STEP
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, Number(stepped.toFixed(2))))
}

function readTransform(
  layout: Record<string, LayoutTransform> | undefined,
  id: string,
): LayoutTransform {
  const t = layout?.[id]
  if (!t) return DEFAULT_TRANSFORM
  return {
    x: typeof t.x === "number" ? t.x : 0,
    y: typeof t.y === "number" ? t.y : 0,
    scale: typeof t.scale === "number" ? t.scale : 1,
  }
}

export function EditableLayout({
  id,
  children,
  className,
}: {
  id: string
  children: ReactNode
  className?: string
}) {
  const editor = useEditor()
  const { settings } = useLanguage()
  const transform = readTransform(settings.layout, id)
  const [dragging, setDragging] = useState<"move" | "scale" | null>(null)
  const startRef = useRef({
    pointerX: 0,
    pointerY: 0,
    x: 0,
    y: 0,
    scale: 1,
  })

  const style: CSSProperties = {
    transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
    transformOrigin: "center center",
  }

  const commit = useCallback(
    (next: LayoutTransform) => {
      if (!editor) return
      if (next.x === 0 && next.y === 0 && next.scale === 1) {
        const layout = { ...(editor.content.settings.layout || {}) }
        delete layout[id]
        editor.patchSettings(["layout"], layout)
        return
      }
      editor.patchSettings(["layout", id], next)
    },
    [editor, id],
  )

  useEffect(() => {
    if (!dragging) return

    const onMove = (e: PointerEvent) => {
      const dx = e.clientX - startRef.current.pointerX
      const dy = e.clientY - startRef.current.pointerY
      if (dragging === "move") {
        commit({
          x: snap(startRef.current.x + dx),
          y: snap(startRef.current.y + dy),
          scale: startRef.current.scale,
        })
      } else {
        const delta = (dx + dy) / 200
        commit({
          x: startRef.current.x,
          y: startRef.current.y,
          scale: clampScale(startRef.current.scale + delta),
        })
      }
    }

    const onUp = () => setDragging(null)
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
    window.addEventListener("pointercancel", onUp)
    return () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
      window.removeEventListener("pointercancel", onUp)
    }
  }, [dragging, commit])

  if (!editor) {
    const idle = transform.x === 0 && transform.y === 0 && transform.scale === 1
    if (idle) return <>{children}</>
    return (
      <div className={cn("inline-block", className)} style={style}>
        {children}
      </div>
    )
  }

  const begin = (mode: "move" | "scale", e: ReactPointerEvent) => {
    e.preventDefault()
    e.stopPropagation()
    startRef.current = {
      pointerX: e.clientX,
      pointerY: e.clientY,
      x: transform.x,
      y: transform.y,
      scale: transform.scale,
    }
    setDragging(mode)
  }

  return (
    <div
      className={cn(
        "group/layout relative inline-block",
        dragging && "z-30",
        className,
      )}
      style={style}
    >
      {children}

      <div
        className={cn(
          "pointer-events-none absolute -inset-2 rounded-xl border-2 border-dashed border-brand/0 transition",
          "group-hover/layout:border-brand/50",
          dragging && "border-brand/70",
        )}
      />

      <button
        type="button"
        title="拖曳移動（8px 格線）"
        onPointerDown={(e) => begin("move", e)}
        className={cn(
          "absolute -left-3 top-1/2 z-40 flex h-10 w-6 -translate-y-1/2 cursor-grab items-center justify-center rounded-md border border-border bg-background text-muted-foreground shadow opacity-0 transition active:cursor-grabbing",
          "group-hover/layout:opacity-100 focus-visible:opacity-100",
          dragging === "move" && "opacity-100",
        )}
      >
        <GripVertical className="size-3.5" />
      </button>

      <button
        type="button"
        title="拖曳縮放"
        onPointerDown={(e) => begin("scale", e)}
        className={cn(
          "absolute -bottom-2 -right-2 z-40 size-4 cursor-nwse-resize rounded-full border-2 border-brand bg-background opacity-0 shadow transition",
          "group-hover/layout:opacity-100 focus-visible:opacity-100",
          dragging === "scale" && "opacity-100",
        )}
        aria-label="縮放"
      />

      <button
        type="button"
        title="還原位置與大小"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          commit(DEFAULT_TRANSFORM)
        }}
        className={cn(
          "absolute -right-2 -top-2 z-40 grid size-6 place-items-center rounded-full border border-border bg-background text-muted-foreground shadow opacity-0 transition hover:text-foreground",
          "group-hover/layout:opacity-100 focus-visible:opacity-100",
          (transform.x !== 0 || transform.y !== 0 || transform.scale !== 1) &&
            "group-hover/layout:opacity-100",
        )}
      >
        <RotateCcw className="size-3" />
      </button>

      {dragging ? (
        <span className="pointer-events-none absolute left-1/2 top-0 z-40 -translate-x-1/2 -translate-y-full rounded bg-foreground px-1.5 py-0.5 text-[10px] font-medium text-background">
          {dragging === "move"
            ? `${transform.x}, ${transform.y}`
            : `${Math.round(transform.scale * 100)}%`}
        </span>
      ) : null}
    </div>
  )
}
