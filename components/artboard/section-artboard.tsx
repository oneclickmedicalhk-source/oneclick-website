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
import { useEditor, type HistoryMode } from "@/components/admin/editor-provider"
import { useLanguage } from "@/components/language-provider"
import { bringToFront, resolveCollisions } from "@/components/artboard/collision"
import { FreeformImage, FreeformText } from "@/components/artboard/freeform-widgets"
import { SelectionToolbar } from "@/components/artboard/selection-toolbar"
import {
  ARTBOARD_WIDTH,
  clampScale,
  createDefaultArtboards,
  deleteItemFromArtboard,
  duplicateArtboardItem,
  isFreeformItem,
  itemBounds,
  snapArtboard,
  snapItemWithGuides,
  type ArtboardItem,
  type ArtboardSectionId,
  type SectionArtboardData,
  type SnapGuide,
} from "@/lib/artboard"
import { cn } from "@/lib/utils"

export type ArtboardPart = {
  id: string
  children: ReactNode
}

export const ARTBOARD_SELECT_EVENT = "artboard:select"

export type ArtboardSelectDetail = { sectionId: string; id: string | null }

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

function applyMeasuredSizes(
  board: SectionArtboardData,
  measured: Map<string, { w: number; h: number }>,
): SectionArtboardData {
  return {
    ...board,
    items: board.items.map((it) => {
      const m = measured.get(it.id)
      if (!m) return it
      // Height hugs content for collision; width stays as wrap/max constraint (CSS w-fit).
      if (m.h && Math.abs(m.h - it.h) >= 2) return { ...it, h: m.h }
      return it
    }),
  }
}

function isFixedSizeItem(it: ArtboardItem) {
  return (isFreeformItem(it) && it.kind === "image") || /\.image$/.test(it.id)
}

function isTypingTarget(el: EventTarget | null) {
  if (!(el instanceof HTMLElement)) return false
  return Boolean(
    el.closest("input, textarea, [contenteditable=true], select"),
  )
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
  const [guides, setGuides] = useState<SnapGuide[]>([])
  const dragRef = useRef<null | {
    id: string
    mode: "move" | "scale"
    startX: number
    startY: number
    orig: ArtboardItem
    active: boolean
    raised: boolean
  }>(null)
  const [, setDragTick] = useState(0)
  const measuredSize = useRef(new Map<string, { w: number; h: number }>())
  const itemEls = useRef(new Map<string, HTMLDivElement>())
  const [, setMeasureTick] = useState(0)

  const defaults = useMemo(() => createDefaultArtboards()[sectionId], [sectionId])
  const board: SectionArtboardData = settings.artboards?.[sectionId] || defaults
  const boardRef = useRef(board)
  boardRef.current = board
  const viewScaleRef = useRef(viewScale)
  viewScaleRef.current = viewScale
  const selectedIdRef = useRef(selectedId)
  selectedIdRef.current = selectedId

  const partMap = useMemo(() => {
    const m = new Map<string, ReactNode>()
    for (const p of parts) m.set(p.id, p.children)
    return m
  }, [parts])

  const commitBoard = useCallback(
    (next: SectionArtboardData, history: HistoryMode = "mutate") => {
      if (!editor) return
      editor.patchSettings(["artboards", sectionId], next, history)
    },
    [editor, sectionId],
  )

  const boardForCollision = useCallback(() => {
    return applyMeasuredSizes(boardRef.current, measuredSize.current)
  }, [])

  const selectItem = useCallback((id: string | null) => {
    setSelectedId(id)
    window.dispatchEvent(
      new CustomEvent<ArtboardSelectDetail>(ARTBOARD_SELECT_EVENT, {
        detail: { sectionId, id },
      }),
    )
  }, [sectionId])

  useLayoutEffect(() => {
    const ro = new ResizeObserver((entries) => {
      let changed = false
      for (const entry of entries) {
        const id = (entry.target as HTMLElement).dataset.artboardItem
        if (!id) continue
        const el = entry.target as HTMLElement
        const w = Math.ceil(el.offsetWidth)
        const h = Math.ceil(el.offsetHeight)
        if (!w || !h) continue
        const prev = measuredSize.current.get(id)
        if (
          !prev ||
          Math.abs(prev.w - w) >= 2 ||
          Math.abs(prev.h - h) >= 2
        ) {
          measuredSize.current.set(id, { w, h })
          changed = true
        }
      }
      if (changed) setMeasureTick((n) => n + 1)
    })
    itemEls.current.forEach((el) => ro.observe(el))
    return () => ro.disconnect()
  }, [board.items, parts])

  useEffect(() => {
    const onSelect = (e: Event) => {
      const detail = (e as CustomEvent<ArtboardSelectDetail>).detail
      if (!detail || detail.sectionId !== sectionId) return
      setSelectedId(detail.id)
    }
    window.addEventListener(ARTBOARD_SELECT_EVENT, onSelect)
    return () => window.removeEventListener(ARTBOARD_SELECT_EVENT, onSelect)
  }, [sectionId])

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
        if (!drag.raised) {
          const raised = bringToFront(boardForCollision(), drag.id)
          boardRef.current = raised
          commitBoard(raised, "drag")
          drag.raised = true
          const current = raised.items.find((i) => i.id === drag.id)
          if (current) {
            drag.orig = {
              ...current,
              h: measuredSize.current.get(drag.id)?.h ?? current.h,
            }
          }
        }
        setDragTick((n) => n + 1)
      }
      const dx = dxScreen / vs
      const dy = dyScreen / vs
      const base = boardForCollision()
      let nextItems: ArtboardItem[]
      let nextGuides: SnapGuide[] = []
      if (drag.mode === "move") {
        const size = measuredSize.current.get(drag.id)
        const patched = {
          ...drag.orig,
          // Keep stored w as wrap max; only hug height into the model.
          h: size?.h ?? drag.orig.h,
          x: drag.orig.x + dx,
          y: Math.max(0, drag.orig.y + dy),
        }
        const snapped = snapItemWithGuides(patched, base.items, 8)
        nextGuides = snapped.guides
        nextItems = base.items.map((it) => (it.id === drag.id ? snapped.item : it))
      } else {
        const size = measuredSize.current.get(drag.id)
        const delta = (dx + dy) / 220
        const patched = {
          ...drag.orig,
          h: size?.h ?? drag.orig.h,
          scale: clampScale(drag.orig.scale + delta),
        }
        nextItems = base.items.map((it) => (it.id === drag.id ? patched : it))
      }
      setGuides(nextGuides)
      const next = resolveCollisions({ ...base, items: nextItems }, drag.id)
      commitBoard(next, "drag")
    }

    const onUp = () => {
      const drag = dragRef.current
      if (drag?.active) {
        const base = boardRef.current
        const size = measuredSize.current.get(drag.id)
        if (size) {
          const cur = base.items.find((i) => i.id === drag.id)
          if (cur && Math.abs(cur.h - size.h) >= 2) {
            commitBoard(
              {
                ...base,
                items: base.items.map((it) =>
                  it.id === drag.id ? { ...it, h: size.h } : it,
                ),
              },
              "drag",
            )
          }
        }
      }
      setGuides([])
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

  const deleteSelected = useCallback(() => {
    const id = selectedIdRef.current
    if (!id || !editor) return
    commitBoard(deleteItemFromArtboard(boardRef.current, id), "mutate")
    selectItem(null)
  }, [commitBoard, editor, selectItem])

  const duplicateSelected = useCallback(() => {
    const id = selectedIdRef.current
    if (!id || !editor) return
    const result = duplicateArtboardItem(boardRef.current, id)
    if (!result) return
    commitBoard(result.board, "mutate")
    selectItem(result.newId)
  }, [commitBoard, editor, selectItem])

  const bringSelectedForward = useCallback(() => {
    const id = selectedIdRef.current
    if (!id || !editor) return
    commitBoard(bringToFront(boardForCollision(), id), "mutate")
  }, [boardForCollision, commitBoard, editor])

  const nudgeFont = useCallback(
    (delta: number) => {
      const id = selectedIdRef.current
      if (!id || !editor) return
      const base = boardRef.current
      const it = base.items.find((i) => i.id === id)
      if (!it || it.kind !== "text") return
      commitBoard(
        {
          ...base,
          items: base.items.map((row) =>
            row.id === id ? { ...row, scale: clampScale(row.scale + delta) } : row,
          ),
        },
        "mutate",
      )
    },
    [commitBoard, editor],
  )

  useEffect(() => {
    if (!editor) return
    const onKey = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return
      const id = selectedIdRef.current
      if (!id) return
      const mod = e.metaKey || e.ctrlKey

      if (mod && e.key.toLowerCase() === "d") {
        e.preventDefault()
        duplicateSelected()
        return
      }
      if (e.key === "Backspace" || e.key === "Delete") {
        e.preventDefault()
        deleteSelected()
        return
      }
      const step = e.shiftKey ? 8 : 1
      let dx = 0
      let dy = 0
      if (e.key === "ArrowLeft") dx = -step
      else if (e.key === "ArrowRight") dx = step
      else if (e.key === "ArrowUp") dy = -step
      else if (e.key === "ArrowDown") dy = step
      else return

      e.preventDefault()
      const base = boardForCollision()
      const it = base.items.find((i) => i.id === id)
      if (!it) return
      const patched = {
        ...it,
        x: snapArtboard(it.x + dx),
        y: snapArtboard(Math.max(0, it.y + dy)),
      }
      commitBoard(
        resolveCollisions(
          { ...base, items: base.items.map((row) => (row.id === id ? patched : row)) },
          id,
        ),
        "mutate",
      )
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [
    editor,
    deleteSelected,
    duplicateSelected,
    boardForCollision,
    commitBoard,
  ])

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
    selectItem(it.id)
    const measured = measuredSize.current.get(it.id)
    dragRef.current = {
      id: it.id,
      mode,
      startX: e.clientX,
      startY: e.clientY,
      orig: {
        ...it,
        h: measured?.h ?? it.h,
      },
      active: immediate || mode === "scale",
      raised: false,
    }
    if (immediate || mode === "scale") {
      const raised = bringToFront(boardForCollision(), it.id)
      boardRef.current = raised
      commitBoard(raised, "drag")
      dragRef.current.raised = true
      const current = raised.items.find((i) => i.id === it.id) || it
      dragRef.current.orig = {
        ...current,
        h: measured?.h ?? current.h,
      }
    }
    setDragTick((n) => n + 1)
  }

  const selected = selectedId ? board.items.find((i) => i.id === selectedId) : null
  const selectedIsText = Boolean(selected && selected.kind === "text")

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
            if (editor) selectItem(null)
          }}
        >
          {guides.map((g, i) =>
            g.orient === "v" ? (
              <div
                key={`v-${i}-${g.pos}`}
                className="pointer-events-none absolute top-0 z-[90] w-px bg-[#ff6b9d]"
                style={{ left: g.pos, height: board.height }}
              />
            ) : (
              <div
                key={`h-${i}-${g.pos}`}
                className="pointer-events-none absolute left-0 z-[90] h-px bg-[#4da3ff]"
                style={{ top: g.pos, width: ARTBOARD_WIDTH }}
              />
            ),
          )}

          {sorted.map((it) => {
            const builtin = partMap.get(it.id)
            const freeform =
              !builtin && isFreeformItem(it) ? (
                it.kind === "text" ? (
                  <FreeformText
                    item={it}
                    onChangeText={({ textZh, textEn }) => {
                      const base = boardRef.current
                      commitBoard(
                        {
                          ...base,
                          items: base.items.map((row) =>
                            row.id === it.id ? { ...row, textZh, textEn } : row,
                          ),
                        },
                        "mutate",
                      )
                    }}
                  />
                ) : (
                  <FreeformImage
                    item={it}
                    onChangeSrc={(src) => {
                      const base = boardRef.current
                      commitBoard(
                        {
                          ...base,
                          items: base.items.map((row) =>
                            row.id === it.id ? { ...row, src } : row,
                          ),
                        },
                        "mutate",
                      )
                    }}
                  />
                )
              ) : null
            const child = builtin ?? freeform
            if (!child) return null
            const fixed = isFixedSizeItem(it)
            const live = measuredSize.current.get(it.id)
            const liveW = live?.w ?? it.w
            const liveH = live?.h ?? it.h
            const bounds = itemBounds({ ...it, w: liveW, h: liveH })
            const isSelected = Boolean(editor && selectedId === it.id)
            return (
              <div
                key={it.id}
                data-artboard-item={it.id}
                ref={(el) => {
                  if (el) itemEls.current.set(it.id, el)
                  else itemEls.current.delete(it.id)
                }}
                className={cn("absolute", editor && "cursor-move", !fixed && "w-fit")}
                style={{
                  left: it.x,
                  top: it.y,
                  width: fixed ? it.w : undefined,
                  maxWidth: fixed ? undefined : it.w,
                  height: fixed ? it.h : "auto",
                  zIndex: isSelected ? 60 : it.z,
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
                    selectItem(it.id)
                    return
                  }
                  startDrag(it, "move", e)
                }}
              >
                <div className={cn("overflow-visible", fixed ? "h-full w-full" : "w-fit max-w-full")}>
                  {child}
                </div>

                {isSelected ? (
                  <>
                    <SelectionToolbar
                      onDelete={deleteSelected}
                      onDuplicate={duplicateSelected}
                      onBringForward={bringSelectedForward}
                      showFont={selectedIsText}
                      onFontSmaller={() => nudgeFont(-0.08)}
                      onFontLarger={() => nudgeFont(0.08)}
                    />
                    <div className="pointer-events-none absolute -inset-1 rounded-lg border-2 border-brand" />
                    <span className="pointer-events-none absolute -top-6 left-0 whitespace-nowrap rounded bg-brand px-1.5 py-0.5 text-[10px] font-semibold text-brand-foreground">
                      {Math.round(bounds.w)}×{Math.round(bounds.h)} · {Math.round(it.scale * 100)}%
                    </span>
                    <button
                      type="button"
                      aria-label="縮放"
                      title="拖曳縮放"
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
