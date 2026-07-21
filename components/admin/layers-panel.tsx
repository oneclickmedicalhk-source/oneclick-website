"use client"

import { Eye, EyeOff, Trash2 } from "lucide-react"
import {
  createDefaultArtboards,
  isFreeformItem,
  type ArtboardSectionId,
  type SectionArtboardData,
} from "@/lib/artboard"
import { SECTION_LABELS, type PageSectionId } from "@/lib/content"

function labelForId(id: string) {
  if (id.startsWith("widget.text")) return "自訂文字"
  if (id.startsWith("widget.image")) return "自訂圖片"
  const short = id.replace(/^[^.]+\./, "")
  return short
}

export function LayersPanel({
  sectionId,
  board,
  selectedId,
  onSelect,
  onDelete,
  onRestore,
}: {
  sectionId: PageSectionId
  board: SectionArtboardData
  selectedId: string | null
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  onRestore: (id: string) => void
}) {
  const defaults = createDefaultArtboards()[sectionId as ArtboardSectionId]
  const removed = new Set(board.removedIds || [])
  const visible = [...board.items].sort((a, b) => b.z - a.z)
  const hiddenBuiltins = (defaults?.items || []).filter((i) => removed.has(i.id))

  return (
    <div className="flex w-56 shrink-0 flex-col border-l border-border bg-background">
      <div className="border-b border-border px-3 py-2">
        <p className="text-xs font-semibold text-foreground">圖層</p>
        <p className="text-[11px] text-muted-foreground">{SECTION_LABELS[sectionId]}</p>
      </div>
      <ul className="flex-1 overflow-y-auto p-2">
        {visible.map((it) => {
          const active = selectedId === it.id
          return (
            <li key={it.id}>
              <div
                className={`group flex items-center gap-1 rounded-md px-2 py-1.5 text-xs ${
                  active ? "bg-brand/10 text-brand" : "text-foreground hover:bg-muted"
                }`}
              >
                <button
                  type="button"
                  className="min-w-0 flex-1 truncate text-left font-medium"
                  onClick={() => onSelect(it.id)}
                >
                  {isFreeformItem(it) ? "◆ " : ""}
                  {labelForId(it.id)}
                </button>
                <button
                  type="button"
                  title="刪除"
                  className="grid size-6 place-items-center rounded text-muted-foreground opacity-0 hover:text-destructive group-hover:opacity-100"
                  onClick={() => onDelete(it.id)}
                >
                  <Trash2 className="size-3" />
                </button>
              </div>
            </li>
          )
        })}
        {hiddenBuiltins.length > 0 ? (
          <li className="mt-3 border-t border-border pt-2">
            <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              已刪除
            </p>
            {hiddenBuiltins.map((it) => (
              <div
                key={it.id}
                className="flex items-center gap-1 rounded-md px-2 py-1.5 text-xs text-muted-foreground"
              >
                <EyeOff className="size-3 shrink-0" />
                <span className="min-w-0 flex-1 truncate">{labelForId(it.id)}</span>
                <button
                  type="button"
                  title="還原"
                  className="grid size-6 place-items-center rounded hover:bg-muted hover:text-foreground"
                  onClick={() => onRestore(it.id)}
                >
                  <Eye className="size-3" />
                </button>
              </div>
            ))}
          </li>
        ) : null}
      </ul>
    </div>
  )
}
