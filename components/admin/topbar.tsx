"use client"

import { Check, Eye, LogOut, Menu, RotateCcw } from "lucide-react"
import type { Lang } from "@/lib/i18n"
import { Segmented } from "@/components/admin/primitives"

export function Topbar({
  breadcrumb,
  lang,
  onLangChange,
  dirty,
  saved,
  saving,
  onSave,
  onReset,
  onLogout,
  onMenu,
}: {
  breadcrumb: string
  lang: Lang
  onLangChange: (l: Lang) => void
  dirty: boolean
  saved: boolean
  saving?: boolean
  onSave: () => void
  onReset: () => void
  onLogout?: () => void
  onMenu: () => void
}) {
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
          className={`hidden items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium sm:inline-flex ${
            dirty ? "bg-gold/15 text-gold-foreground" : "bg-success/10 text-success"
          }`}
        >
          <span className={`size-1.5 rounded-full ${dirty ? "bg-gold-foreground" : "bg-success"}`} />
          {dirty ? "未儲存變更" : saved ? "已儲存" : "已同步"}
        </span>

        <button
          type="button"
          onClick={onReset}
          className="hidden h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted sm:inline-flex"
        >
          <RotateCcw className="size-3.5" />
          還原
        </button>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          <Eye className="size-3.5" />
          <span className="hidden sm:inline">預覽</span>
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
