"use client"

import {
  BringToFront,
  Copy,
  Minus,
  Plus,
  Trash2,
} from "lucide-react"

export function SelectionToolbar({
  onDelete,
  onDuplicate,
  onBringForward,
  onFontSmaller,
  onFontLarger,
  showFont = false,
}: {
  onDelete: () => void
  onDuplicate: () => void
  onBringForward: () => void
  onFontSmaller?: () => void
  onFontLarger?: () => void
  showFont?: boolean
}) {
  return (
    <div
      className="pointer-events-auto absolute left-1/2 top-0 z-[80] flex -translate-x-1/2 -translate-y-[calc(100%+10px)] items-center gap-0.5 rounded-lg border border-border bg-background p-1 shadow-lg"
      onPointerDown={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        title="刪除 (Delete)"
        onClick={onDelete}
        className="grid size-7 place-items-center rounded-md text-destructive hover:bg-muted"
      >
        <Trash2 className="size-3.5" />
      </button>
      <button
        type="button"
        title="複製 (⌘D)"
        onClick={onDuplicate}
        className="grid size-7 place-items-center rounded-md text-foreground hover:bg-muted"
      >
        <Copy className="size-3.5" />
      </button>
      <button
        type="button"
        title="移到最前"
        onClick={onBringForward}
        className="grid size-7 place-items-center rounded-md text-foreground hover:bg-muted"
      >
        <BringToFront className="size-3.5" />
      </button>
      {showFont ? (
        <>
          <span className="mx-0.5 h-4 w-px bg-border" />
          <button
            type="button"
            title="縮小字"
            onClick={onFontSmaller}
            className="grid size-7 place-items-center rounded-md text-foreground hover:bg-muted"
          >
            <Minus className="size-3.5" />
          </button>
          <button
            type="button"
            title="放大字"
            onClick={onFontLarger}
            className="grid size-7 place-items-center rounded-md text-foreground hover:bg-muted"
          >
            <Plus className="size-3.5" />
          </button>
        </>
      ) : null}
    </div>
  )
}
