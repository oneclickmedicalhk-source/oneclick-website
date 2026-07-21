"use client"

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react"
import { RotateCcw } from "lucide-react"
import { useEditor } from "@/components/admin/editor-provider"
import { useLanguage } from "@/components/language-provider"
import { bringToFront, resolveCollisions } from "@/components/artboard/collision"
import {
  ARTBOARD_WIDTH,
  clampScale,
  createDefaultArtboards,
  itemBounds,
  snapArtboard,
  type ArtboardItem,
  type ArtboardSectionId,
  type SectionArtboardData,
} from "@/lib/artboard"
import { cn } from "@/lib/utils"

export type ArtboardPart = {
  id: string
  children: ReactNode
}

function useContainerScale(ref: React.RefObject<HTMLDivElement | null>) {
  const [scale, setScale] = useState(1)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => {
      const w = el.clientWidth
      setScale(w > 0 ? Math.min(1, w / ARTBOARD_WIDTH) : 1)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])
  return scale
}

function applyMeasuredHeights(
  board: SectionArtboardData,
  measured: Map<string, number>,
): SectionArtboardData {
  return {
    ...board,
    items: board.items.map((it) => {
      const h = measured.get(it.id)
      if (!h || Math.abs(h - it.h) < 2) return it
      return { ...it, h }
    }),
  }
}

export function SectionArtboard({
  sectionId,
  parts,
  className,
  surfaceClassName,
}: {
  sectionId: ArtboardSectionId
  parts: ArtboardPart[]
  className?: string
  surfaceClassName?: string
}) {
  const editor = useEditor()
  const { settings } = useLanguage()
  const wrapRef = useRef<HTMLDivElement>(null)
  const viewScale = useContainerScale(wrapRef)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const dragRef = useRef<null | {
    id: string
    mode: "move" | "scale"
    startX: number
    startY: number
    orig: ArtboardItem
    active: boolean
  }>(null)
  const [, setDragTick] = useState(0)
  const measuredH = useRef(new Map<string, number>())
  const itemEls = useRef(new Map<string, HTMLDivElement>())
  const [, setMeasureTick] = useState(0)

  const defaults = useMemo(() => createDefaultArtboards()[sectionId], [sectionId])
  const board: SectionArtboardData = settings.artboards?.[sectionId] || defaults
  const boardRef = useRef(board)
  boardRef.current = board
  const viewScaleRef = useRef(viewScale)
  viewScaleRef.current = viewScale

  const partMap = useMemo(() => {
    const m = new Map<string, ReactNode>()
    for (const p of parts) m.set(p.id, p.children)
    return m
  }, [parts])

  const commitBoard = useCallback(
    (next: SectionArtboardData) => {
      if (!editor) return
      editor.patchSettings(["artboards", sectionId], next)
    },
    [editor, sectionId],
  )

  const boardForCollision = useCallback(() => {
    return applyMeasuredHeights(boardRef.current, measuredH.current)
  }, [])

  useLayoutEffect(() => {
    const ro = new ResizeObserver((entries) => {
      let changed = false
      for (const entry of entries) {
        const id = (entry.target as HTMLElement).dataset.artboardItem
        if (!id) continue
        const h = Math.ceil((entry.target as HTMLElement).offsetHeight)
        if (!h) continue
        const prev = measuredH.current.get(id)
        if (prev === undefined || Math.abs(prev - h) >= 2) {
          measuredH.current.set(id, h)
          changed = true
        }
      }
      if (changed) setMeasureTick((n) => n + 1)
    })
    itemEls.current.forEach((el) => ro.observe(el))
    return () => ro.disconnect()
  }, [board.items, parts])

  useEffect(() => {
    if (!editor) return

    const onMove = (e: PointerEvent) => {
      const drag = dragRef.current
      if (!drag) return
      const vs = viewScaleRef.current || 1
      const dxScreen = e.clientX - drag.startX
      const dyScreen = e.clientY - drag.startY
      if (!drag.active) {
        if (Math.hypot(dxScreen, dyScreen) < 5) return
        drag.active = true
        setDragTick((n) => n + 1)
      }
      const dx = dxScreen / vs
      const dy = dyScreen / vs
      const base = boardForCollision()
      let nextItems: ArtboardItem[]
      if (drag.mode === "move") {
        const patched = {
          ...drag.orig,
          h: measuredH.current.get(drag.id) ?? drag.orig.h,
          x: snapArtboard(drag.orig.x + dx),
          y: snapArtboard(Math.max(0, drag.orig.y + dy)),
        }
        nextItems = base.items.map((it) => (it.id === drag.id ? patched : it))
      } else {
        const delta = (dx + dy) / 220
        const patched = {
          ...drag.orig,
          h: measuredH.current.get(drag.id) ?? drag.orig.h,
          scale: clampScale(drag.orig.scale + delta),
        }
        nextItems = base.items.map((it) => (it.id === drag.id ? patched : it))
      }
      const next = resolveCollisions({ ...base, items: nextItems }, drag.id)
      commitBoard(next)
    }

    const onUp = () => {
      const drag = dragRef.current
      if (drag?.active) {
        const base = boardRef.current
        const h = measuredH.current.get(drag.id)
        if (h && Math.abs((base.items.find((i) => i.id === drag.id)?.h ?? 0) - h) >= 2) {
          commitBoard({
            ...base,
            items: base.items.map((it) => (it.id === drag.id ? { ...it, h } : it)),
          })
        }
      }
      if (dragRef.current) {
        dragRef.current = null
        setDragTick((n) => n + 1)
      }
    }

    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
    window.addEventListener("pointercancel", onUp)
    return () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
      window.removeEventListener("pointercancel", onUp)
    }
  }, [editor, commitBoard, boardForCollision])

  const sorted = useMemo(
    () => [...board.items].sort((a, b) => a.z - b.z),
    [board.items],
  )

  const startDrag = (
    it: ArtboardItem,
    mode: "move" | "scale",
    e: ReactPointerEvent,
    immediate = false,
  ) => {
    if (!editor) return
    e.stopPropagation()
    if (mode === "scale") e.preventDefault()
    setSelectedId(it.id)
    const raised = bringToFront(boardForCollision(), it.id)
    boardRef.current = raised
    commitBoard(raised)
    const current = raised.items.find((i) => i.id === it.id) || it
    const measured = measuredH.current.get(it.id)
    dragRef.current = {
      id: it.id,
      mode,
      startX: e.clientX,
      startY: e.clientY,
      orig: { ...current, h: measured ?? current.h },
      active: immediate || mode === "scale",
    }
    setDragTick((n) => n + 1)
  }

  return (
    <div ref={wrapRef} className={cn("relative mx-auto w-full max-w-[1152px]", className)}>
      <div
        className="relative w-full overflow-hidden"
        style={{ height: board.height * viewScale }}
      >
        <div
          className={cn("absolute left-0 top-0 origin-top-left", surfaceClassName)}
          style={{
            width: ARTBOARD_WIDTH,
            height: board.height,
            transform: `scale(${viewScale})`,
          }}
          onPointerDown={() => {
            if (editor) setSelectedId(null)
          }}
        >
          {sorted.map((it) => {
            const child = partMap.get(it.id)
            if (!child) return null
            const liveH = measuredH.current.get(it.id) ?? it.h
            const bounds = itemBounds({ ...it, h: liveH })
            const selected = Boolean(editor && selectedId === it.id)
            return (
              <div
                key={it.id}
                data-artboard-item={it.id}
                ref={(el) => {
                  if (el) itemEls.current.set(it.id, el)
                  else itemEls.current.delete(it.id)
                }}
                className={cn("absolute", editor && "cursor-move")}
                style={{
                  left: it.x,
                  top: it.y,
                  width: it.w,
                  height: "auto",
                  zIndex: selected ? 60 : it.z,
                  transform: `scale(${it.scale})`,
                  transformOrigin: "top left",
                }}
                onPointerDown={(e) => {
                  if (!editor) return
                  const target = e.target as HTMLElement
                  if (
                    target.closest(
                      "input, textarea, [contenteditable=true], button[data-upload], a[href]",
                    )
                  ) {
                    e.stopPropagation()
                    setSelectedId(it.id)
                    return
                  }
                  startDrag(it, "move", e)
                }}
              >
                <div className="w-full overflow-visible">{child}</div>

                {selected ? (
                  <>
                    <div className="pointer-events-none absolute -inset-1 rounded-lg border-2 border-brand" />
                    <span className="pointer-events-none absolute -top-6 left-0 whitespace-nowrap rounded bg-brand px-1.5 py-0.5 text-[10px] font-semibold text-brand-foreground">
                      {Math.round(bounds.w)}×{Math.round(bounds.h)} · {Math.round(it.scale * 100)}%
                    </span>
                    <button
                      type="button"
                      title="還原此物件"
                      className="absolute -right-2 -top-2 z-[70] grid size-6 place-items-center rounded-full border border-border bg-background text-muted-foreground shadow hover:text-foreground"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation()
                        const def = defaults.items.find((d) => d.id === it.id)
                        if (!def) return
                        const base = boardRef.current
                        const nextItems = base.items.map((row) =>
                          row.id === it.id ? { ...def } : row,
                        )
                        commitBoard(
                          resolveCollisions(
                            applyMeasuredHeights({ ...base, items: nextItems }, measuredH.current),
                            it.id,
                          ),
                        )
                      }}
                    >
                      <RotateCcw className="size-3" />
                    </button>
                    <button
                      type="button"
                      aria-label="縮放"
                      title="拖曳縮放（連字一齊）"
                      className="absolute -bottom-2 -right-2 z-[70] size-3.5 cursor-nwse-resize rounded-full border-2 border-brand bg-background shadow"
                      onPointerDown={(e) => startDrag(it, "scale", e, true)}
                    />
                  </>
                ) : editor ? (
                  <div className="pointer-events-none absolute inset-0 rounded-md outline outline-1 outline-dashed outline-transparent hover:outline-brand/40" />
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
