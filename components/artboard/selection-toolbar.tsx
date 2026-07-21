"use client"

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  BringToFront,
  Copy,
  Lock,
  Minus,
  Plus,
  SendToBack,
  Trash2,
  Unlock,
} from "lucide-react"

const COLORS = [
  "",
  "#0f172a",
  "#1e3a5f",
  "#2563eb",
  "#dc2626",
  "#16a34a",
  "#ca8a04",
  "#ffffff",
]

export function SelectionToolbar({
  onDelete,
  onDuplicate,
  onBringForward,
  onSendBackward,
  onAlignLeft,
  onAlignCenter,
  onAlignRight,
  onToggleLock,
  locked = false,
  onFontSmaller,
  onFontLarger,
  showFont = false,
  onColor,
  color,
}: {
  onDelete: () => void
  onDuplicate: () => void
  onBringForward: () => void
  onSendBackward: () => void
  onAlignLeft: () => void
  onAlignCenter: () => void
  onAlignRight: () => void
  onToggleLock: () => void
  locked?: boolean
  onFontSmaller?: () => void
  onFontLarger?: () => void
  showFont?: boolean
  onColor?: (color: string) => void
  color?: string
}) {
  return (
    <div
      className="pointer-events-auto absolute left-1/2 top-0 z-[80] flex -translate-x-1/2 -translate-y-[calc(100%+10px)] flex-wrap items-center justify-center gap-0.5 rounded-lg border border-border bg-background p-1 shadow-lg"
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
        title={locked ? "解鎖" : "鎖定"}
        onClick={onToggleLock}
        className="grid size-7 place-items-center rounded-md text-foreground hover:bg-muted"
      >
        {locked ? <Unlock className="size-3.5" /> : <Lock className="size-3.5" />}
      </button>
      <span className="mx-0.5 h-4 w-px bg-border" />
      <button
        type="button"
        title="對齊畫布左"
        onClick={onAlignLeft}
        className="grid size-7 place-items-center rounded-md text-foreground hover:bg-muted"
      >
        <AlignLeft className="size-3.5" />
      </button>
      <button
        type="button"
        title="對齊畫布中"
        onClick={onAlignCenter}
        className="grid size-7 place-items-center rounded-md text-foreground hover:bg-muted"
      >
        <AlignCenter className="size-3.5" />
      </button>
      <button
        type="button"
        title="對齊畫布右"
        onClick={onAlignRight}
        className="grid size-7 place-items-center rounded-md text-foreground hover:bg-muted"
      >
        <AlignRight className="size-3.5" />
      </button>
      <span className="mx-0.5 h-4 w-px bg-border" />
      <button
        type="button"
        title="移到最前"
        onClick={onBringForward}
        className="grid size-7 place-items-center rounded-md text-foreground hover:bg-muted"
      >
        <BringToFront className="size-3.5" />
      </button>
      <button
        type="button"
        title="移到最後"
        onClick={onSendBackward}
        className="grid size-7 place-items-center rounded-md text-foreground hover:bg-muted"
      >
        <SendToBack className="size-3.5" />
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
      {onColor ? (
        <>
          <span className="mx-0.5 h-4 w-px bg-border" />
          <div className="flex items-center gap-0.5 px-0.5">
            {COLORS.map((c) => (
              <button
                key={c || "reset"}
                type="button"
                title={c ? c : "還原顏色"}
                onClick={() => onColor(c)}
                className={`size-4 rounded-full border ${
                  (color || "") === c ? "ring-2 ring-brand ring-offset-1" : "border-border"
                }`}
                style={{
                  background: c || "conic-gradient(red, yellow, lime, aqua, blue, magenta, red)",
                }}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  )
}
