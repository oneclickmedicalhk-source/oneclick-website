"use client"

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react"
import { useEditor, type HistoryMode } from "@/components/admin/editor-provider"
import { useLanguage } from "@/components/language-provider"
import {
  bringToFront,
  resolveCollisions,
  sendBackward,
} from "@/components/artboard/collision"
import { FreeformImage, FreeformText } from "@/components/artboard/freeform-widgets"
import { SelectionToolbar } from "@/components/artboard/selection-toolbar"
import {
  ARTBOARD_WIDTH,
  clampScale,
  createDefaultArtboards,
  deleteItemFromArtboard,
  duplicateArtboardItem,
  isFixedSizeItem,
  isFreeformItem,
  isWrapWidthItem,
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

type DragMode = "move" | "scale" | "resize-w"

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
  measured: Map<string, { w: number; h: number }>,
): SectionArtboardData {
  return {
    ...board,
    items: board.items.map((it) => {
      const m = measured.get(it.id)
      if (!m?.h || Math.abs(m.h - it.h) < 2) return it
      return { ...it, h: m.h }
    }),
  }
}

function isTypingTarget(el: EventTarget | null) {
  if (!(el instanceof HTMLElement)) return false
  return Boolean(el.closest("input, textarea, [contenteditable=true], select"))
}

function shellStyle(it: ArtboardItem): CSSProperties {
  if (isFixedSizeItem(it)) {
    return { width: it.w, height: it.h }
  }
  if (isWrapWidthItem(it)) {
    return { width: it.w, height: "auto", maxWidth: it.w }
  }
  // Hug short titles / CTAs — max-content breaks block↔parent width cycle
  return {
    width: "max-content",
    maxWidth: it.w,
    height: "auto",
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
  const [guides, setGuides] = useState<SnapGuide[]>([])
  const dragRef = useRef<null | {
    id: string
    mode: DragMode
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
    return applyMeasuredHeights(boardRef.current, measuredSize.current)
  }, [])

  const selectItem = useCallback(
    (id: string | null) => {
      setSelectedId(id)
      window.dispatchEvent(
        new CustomEvent<ArtboardSelectDetail>(ARTBOARD_SELECT_EVENT, {
          detail: { sectionId, id },
        }),
      )
    },
    [sectionId],
  )

  const patchItem = useCallback(
    (id: string, patch: Partial<ArtboardItem>, history: HistoryMode = "mutate") => {
      const base = boardRef.current
      commitBoard(
        {
          ...base,
          items: base.items.map((row) => (row.id === id ? { ...row, ...patch } : row)),
        },
        history,
      )
    },
    [commitBoard],
  )

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
        if (!prev || Math.abs(prev.w - w) >= 2 || Math.abs(prev.h - h) >= 2) {
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
        if (!drag.raised && drag.mode === "move") {
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
          h: size?.h ?? drag.orig.h,
          x: drag.orig.x + dx,
          y: Math.max(0, drag.orig.y + dy),
        }
        const snapped = snapItemWithGuides(patched, base.items, 8)
        nextGuides = snapped.guides
        nextItems = base.items.map((it) => (it.id === drag.id ? snapped.item : it))
      } else if (drag.mode === "resize-w") {
        const nextW = Math.max(48, snapArtboard(drag.orig.w + dx))
        nextItems = base.items.map((it) =>
          it.id === drag.id ? { ...drag.orig, w: nextW } : it,
        )
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
      if (drag?.active && drag.mode !== "resize-w") {
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

  const sendSelectedBackward = useCallback(() => {
    const id = selectedIdRef.current
    if (!id || !editor) return
    commitBoard(sendBackward(boardForCollision(), id), "mutate")
  }, [boardForCollision, commitBoard, editor])

  const alignSelected = useCallback(
    (mode: "left" | "center" | "right") => {
      const id = selectedIdRef.current
      if (!id || !editor) return
      const base = boardForCollision()
      const it = base.items.find((i) => i.id === id)
      if (!it || it.locked) return
      const live = measuredSize.current.get(id)
      const w = (live?.w ?? it.w) * it.scale
      let x = it.x
      if (mode === "left") x = 48
      else if (mode === "center") x = snapArtboard((ARTBOARD_WIDTH - w) / 2)
      else x = snapArtboard(ARTBOARD_WIDTH - w - 48)
      x = Math.max(0, Math.min(x, ARTBOARD_WIDTH - 24))
      commitBoard(
        resolveCollisions(
          { ...base, items: base.items.map((row) => (row.id === id ? { ...row, x } : row)) },
          id,
        ),
        "mutate",
      )
    },
    [boardForCollision, commitBoard, editor],
  )

  const toggleLock = useCallback(() => {
    const id = selectedIdRef.current
    if (!id || !editor) return
    const it = boardRef.current.items.find((i) => i.id === id)
    if (!it) return
    patchItem(id, { locked: !it.locked })
  }, [editor, patchItem])

  const nudgeFont = useCallback(
    (delta: number) => {
      const id = selectedIdRef.current
      if (!id || !editor) return
      const it = boardRef.current.items.find((i) => i.id === id)
      if (!it || isFixedSizeItem(it)) return
      patchItem(id, { scale: clampScale(it.scale + delta) })
    },
    [editor, patchItem],
  )

  const setColor = useCallback(
    (color: string) => {
      const id = selectedIdRef.current
      if (!id || !editor) return
      patchItem(id, { color: color || undefined })
    },
    [editor, patchItem],
  )

  useEffect(() => {
    if (!editor) return
    const onKey = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return
      const id = selectedIdRef.current
      if (!id) return
      const mod = e.metaKey || e.ctrlKey
      const it = boardRef.current.items.find((i) => i.id === id)

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
      if (it?.locked) return

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
      const cur = base.items.find((i) => i.id === id)
      if (!cur) return
      const patched = {
        ...cur,
        x: snapArtboard(cur.x + dx),
        y: snapArtboard(Math.max(0, cur.y + dy)),
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
  }, [editor, deleteSelected, duplicateSelected, boardForCollision, commitBoard])

  const sorted = useMemo(
    () => [...board.items].sort((a, b) => a.z - b.z),
    [board.items],
  )

  const startDrag = (
    it: ArtboardItem,
    mode: DragMode,
    e: ReactPointerEvent,
    immediate = false,
  ) => {
    if (!editor) return
    if (it.locked && mode === "move") {
      selectItem(it.id)
      return
    }
    e.stopPropagation()
    if (mode !== "move") e.preventDefault()
    selectItem(it.id)
    const measured = measuredSize.current.get(it.id)
    dragRef.current = {
      id: it.id,
      mode,
      startX: e.clientX,
      startY: e.clientY,
      orig: { ...it, h: measured?.h ?? it.h },
      active: immediate || mode !== "move",
      raised: false,
    }
    if (immediate || mode !== "move") {
      dragRef.current.raised = true
    }
    setDragTick((n) => n + 1)
  }

  const selected = selectedId ? board.items.find((i) => i.id === selectedId) : null
  const showFont = Boolean(selected && !isFixedSizeItem(selected))
  const showColor = Boolean(
    selected && (isFreeformItem(selected) ? selected.kind === "text" : !isFixedSizeItem(selected)),
  )

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
                      patchItem(it.id, { textZh, textEn })
                    }}
                  />
                ) : (
                  <FreeformImage
                    item={it}
                    onChangeSrc={(src) => patchItem(it.id, { src })}
                  />
                )
              ) : null
            const child = builtin ?? freeform
            if (!child) return null
            const fixed = isFixedSizeItem(it)
            const wrap = isWrapWidthItem(it)
            const live = measuredSize.current.get(it.id)
            const liveW = live?.w ?? it.w
            const liveH = live?.h ?? it.h
            const bounds = itemBounds({ ...it, w: liveW, h: liveH })
            const isSelected = Boolean(editor && selectedId === it.id)
            return (
              <div
                key={it.id}
                data-artboard-item={it.id}
                data-selected={isSelected ? "true" : undefined}
                ref={(el) => {
                  if (el) itemEls.current.set(it.id, el)
                  else itemEls.current.delete(it.id)
                }}
                className={cn(
                  "absolute",
                  editor && (it.locked ? "cursor-default" : "cursor-move"),
                )}
                style={{
                  left: it.x,
                  top: it.y,
                  ...shellStyle(it),
                  zIndex: isSelected ? 60 : it.z,
                  transform: `scale(${it.scale})`,
                  transformOrigin: "top left",
                  color: it.color || undefined,
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
                <div
                  className={cn(
                    "overflow-visible",
                    fixed
                      ? "h-full w-full"
                      : wrap
                        ? "w-full"
                        : "w-max max-w-full [&>*]:!w-max [&>*]:max-w-full",
                  )}
                >
                  {child}
                </div>

                {isSelected ? (
                  <>
                    <SelectionToolbar
                      onDelete={deleteSelected}
                      onDuplicate={duplicateSelected}
                      onBringForward={bringSelectedForward}
                      onSendBackward={sendSelectedBackward}
                      onAlignLeft={() => alignSelected("left")}
                      onAlignCenter={() => alignSelected("center")}
                      onAlignRight={() => alignSelected("right")}
                      onToggleLock={toggleLock}
                      locked={Boolean(it.locked)}
                      showFont={showFont}
                      onFontSmaller={() => nudgeFont(-0.08)}
                      onFontLarger={() => nudgeFont(0.08)}
                      onColor={showColor ? setColor : undefined}
                      color={it.color}
                    />
                    <div
                      className={cn(
                        "pointer-events-none absolute -inset-1 rounded-lg border-2",
                        it.locked ? "border-muted-foreground/50" : "border-brand",
                      )}
                    />
                    <span className="pointer-events-none absolute -top-6 left-0 whitespace-nowrap rounded bg-brand px-1.5 py-0.5 text-[10px] font-semibold text-brand-foreground">
                      {Math.round(liveW)}×{Math.round(liveH)} · {Math.round(it.scale * 100)}%
                      {it.locked ? " · 鎖" : ""}
                    </span>
                    {!it.locked && !fixed ? (
                      <button
                        type="button"
                        aria-label="改闊度"
                        title="拖曳改換行／欄寬"
                        className="absolute -right-1.5 top-1/2 z-[70] h-8 w-2 -translate-y-1/2 cursor-ew-resize rounded-full border-2 border-brand bg-background shadow"
                        onPointerDown={(e) => startDrag(it, "resize-w", e, true)}
                      />
                    ) : null}
                    {!it.locked ? (
                      <button
                        type="button"
                        aria-label="縮放"
                        title="拖曳縮放"
                        className="absolute -bottom-2 -right-2 z-[70] size-3.5 cursor-nwse-resize rounded-full border-2 border-brand bg-background shadow"
                        onPointerDown={(e) => startDrag(it, "scale", e, true)}
                      />
                    ) : null}
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
