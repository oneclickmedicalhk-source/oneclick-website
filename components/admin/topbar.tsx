"use client"

import { Check, Eye, LogOut, Menu, Monitor, Redo2, Smartphone, Undo2 } from "lucide-react"
import type { Lang } from "@/lib/i18n"
import { Segmented } from "@/components/admin/primitives"

export function Topbar({
  breadcrumb,
  lang,
  onLangChange,
  dirty,
  saved,
  saving,
  dbConnected,
  viewport,
  onViewportChange,
  onSave,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onLogout,
  onMenu,
}: {
  breadcrumb: string
  lang: Lang
  onLangChange: (l: Lang) => void
  dirty: boolean
  saved: boolean
  saving?: boolean
  dbConnected?: boolean
  viewport: "desktop" | "mobile"
  onViewportChange: (v: "desktop" | "mobile") => void
  onSave: () => void
  onUndo?: () => void
  onRedo?: () => void
  canUndo?: boolean
  canRedo?: boolean
  onLogout?: () => void
  onMenu: () => void
}) {
  const status = !dbConnected
    ? { text: "未連接資料庫", className: "bg-destructive/10 text-destructive", dot: "bg-destructive" }
    : dirty
      ? { text: "未儲存變更", className: "bg-gold/15 text-gold-foreground", dot: "bg-gold-foreground" }
      : { text: saved ? "已儲存" : "已儲存", className: "bg-success/10 text-success", dot: "bg-success" }

  const isMac =
    typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || "")

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-border bg-background/90 px-4 py-3 backdrop-blur sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenu}
          aria-label="開啟選單"
          className="grid size-9 place-items-center rounded-lg border border-border text-foreground lg:hidden"
        >
          <Menu className="size-4" />
        </button>
        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-sm">
          <span className="hidden text-muted-foreground sm:inline">內容管理</span>
          <span className="hidden text-muted-foreground sm:inline">/</span>
          <span className="truncate font-medium text-foreground">{breadcrumb}</span>
        </nav>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-0.5 rounded-lg border border-border p-0.5">
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            title={isMac ? "Undo ⌘Z" : "Undo Ctrl+Z"}
            aria-label="上一步"
            className="grid size-8 place-items-center rounded-md text-foreground transition-colors hover:bg-muted disabled:opacity-40"
          >
            <Undo2 className="size-4" />
          </button>
          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo}
            title={isMac ? "Redo ⇧⌘Z" : "Redo Ctrl+Y"}
            aria-label="重做"
            className="grid size-8 place-items-center rounded-md text-foreground transition-colors hover:bg-muted disabled:opacity-40"
          >
            <Redo2 className="size-4" />
          </button>
        </div>

        <div className="hidden items-center gap-1 rounded-lg border border-border p-0.5 sm:flex">
          <button
            type="button"
            onClick={() => onViewportChange("desktop")}
            className={`grid size-8 place-items-center rounded-md ${viewport === "desktop" ? "bg-muted text-foreground" : "text-muted-foreground"}`}
            aria-label="桌面預覽"
          >
            <Monitor className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => onViewportChange("mobile")}
            className={`grid size-8 place-items-center rounded-md ${viewport === "mobile" ? "bg-muted text-foreground" : "text-muted-foreground"}`}
            aria-label="手機預覽"
          >
            <Smartphone className="size-4" />
          </button>
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <span className="text-xs text-muted-foreground">編輯語言</span>
          <Segmented<Lang>
            value={lang}
            onChange={onLangChange}
            options={[
              { label: "繁中", value: "zh" },
              { label: "EN", value: "en" },
            ]}
          />
        </div>

        <span
          className={`hidden items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium sm:inline-flex ${status.className}`}
        >
          <span className={`size-1.5 rounded-full ${status.dot}`} />
          {status.text}
        </span>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          <Eye className="size-3.5" />
          <span className="hidden sm:inline">前台</span>
        </a>

        <button
          type="button"
          onClick={onSave}
          disabled={saving || !dirty}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand px-4 text-sm font-semibold text-brand-foreground shadow-sm transition-colors hover:bg-brand/90 disabled:opacity-60"
        >
          <Check className="size-4" />
          {saving ? "儲存中…" : "儲存"}
        </button>

        {onLogout ? (
          <button
            type="button"
            onClick={onLogout}
            aria-label="登出"
            className="grid size-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut className="size-4" />
          </button>
        ) : null}
      </div>
    </header>
  )
}
